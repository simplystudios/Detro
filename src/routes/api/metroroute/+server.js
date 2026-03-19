import { json } from "@sveltejs/kit";

/* ---------- LOAD DATA ---------- */

const res = await fetch("https://detroweb.vercel.app/metrolines.json");
const lines = await res.json();

const interchanges = [
  { from: "Noida Sec-52", to: "Noida Sector 51", note: "Walkway transfer" },
  {
    from: "Dilli Haat - INA",
    to: "Dilli Haat - INA",
    note: "Internal transfer",
  },
];

/* ---------- GRAPH ---------- */

function buildGraph(lines) {
  const g = {};

  // Line connections
  for (const line in lines) {
    const stations = lines[line];
    for (let i = 0; i < stations.length - 1; i++) {
      g[stations[i]] ??= [];
      g[stations[i + 1]] ??= [];
      g[stations[i]].push(stations[i + 1]);
      g[stations[i + 1]].push(stations[i]);
    }
  }

  // Interchange bridges
  interchanges.forEach(({ from, to }) => {
    if (g[from] && g[to]) {
      g[from].push(to);
      g[to].push(from);
    }
  });

  return g;
}

const graph = buildGraph(lines);

/* ---------- BFS ---------- */

function findRoute(graph, start, end) {
  const queue = [[start]];
  const seen = new Set();

  while (queue.length) {
    const path = queue.shift();
    const node = path[path.length - 1];

    if (node === end) return path;
    if (seen.has(node)) continue;

    seen.add(node);

    for (const next of graph[node] || []) {
      queue.push([...path, next]);
    }
  }
  return [];
}

/* ---------- LINE HELPERS ---------- */

function getConnectingLine(lines, a, b) {
  for (const line in lines) {
    const s = lines[line];
    for (let i = 0; i < s.length - 1; i++) {
      if ((s[i] === a && s[i + 1] === b) || (s[i] === b && s[i + 1] === a)) {
        return line;
      }
    }
  }
  return null; // interchange or virtual hop
}

function getRouteLines(route, lines) {
  const used = [];
  for (let i = 0; i < route.length - 1; i++) {
    used.push(
      getConnectingLine(lines, route[i], route[i + 1]) ?? "INTERCHANGE",
    );
  }
  return used;
}

function findTransferStations(route, segmentLines) {
  const transfers = [];
  for (let i = 1; i < segmentLines.length; i++) {
    if (
      segmentLines[i] !== segmentLines[i - 1] &&
      segmentLines[i] !== "INTERCHANGE"
    ) {
      transfers.push(route[i]);
    }
  }
  return transfers;
}

/* ---------- STRUCTURED ROUTE ---------- */

function buildRouteSteps(route, segmentLines, transferStations) {
  return route.map((station, i) => ({
    station,
    line: i === 0 ? segmentLines[0] : segmentLines[i - 1],
    isTransfer: transferStations.includes(station),
  }));
}

/* ---------- API ---------- */

export function GET({ url }) {
  const from = url.searchParams.get("from");
  const to = url.searchParams.get("to");

  if (!from || !to) {
    return json({ error: "Missing from or to parameter" }, { status: 400 });
  }

  if (!graph[from] || !graph[to]) {
    return json({ error: "Invalid station name" }, { status: 400 });
  }

  const route = findRoute(graph, from, to);
  const segmentLines = getRouteLines(route, lines);
  const transferStations = findTransferStations(route, segmentLines);
  const steps = buildRouteSteps(route, segmentLines, transferStations);

  return json({
    from,
    to,
    stops: route.length - 1,
    route: steps, // 👈 SAFE, STRUCTURED
    transferStations,
  });
}
