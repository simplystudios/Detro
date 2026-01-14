import { json } from "@sveltejs/kit";
import fs from "fs";
import path from "path";

/* ---------- LOAD DATA ---------- */

const dataPath = path.join(process.cwd(), "static", "metrolines.json");
const lines = JSON.parse(fs.readFileSync(dataPath, "utf-8"));

/* ---------- GRAPH ---------- */

function buildGraph(lines) {
  const g = {};
  for (const line in lines) {
    const s = lines[line];
    for (let i = 0; i < s.length - 1; i++) {
      g[s[i]] ??= [];
      g[s[i + 1]] ??= [];
      g[s[i]].push(s[i + 1]);
      g[s[i + 1]].push(s[i]);
    }
  }
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

    for (const n of graph[node] || []) {
      queue.push([...path, n]);
    }
  }
  return [];
}

/* ---------- LINE LOGIC ---------- */

function getConnectingLine(lines, a, b) {
  for (const line in lines) {
    const s = lines[line];
    for (let i = 0; i < s.length - 1; i++) {
      if ((s[i] === a && s[i + 1] === b) || (s[i] === b && s[i + 1] === a)) {
        return line;
      }
    }
  }
  return null;
}

function getRouteLines(route, lines) {
  const used = [];
  for (let i = 0; i < route.length - 1; i++) {
    used.push(getConnectingLine(lines, route[i], route[i + 1]));
  }
  return used;
}

function findTransferStations(route, segmentLines) {
  const transfers = [];
  for (let i = 1; i < segmentLines.length; i++) {
    if (segmentLines[i] !== segmentLines[i - 1]) {
      transfers.push(route[i]);
    }
  }
  return transfers;
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

  return json({
    from,
    to,
    stops: route.length - 1,
    route,
    segmentLines,
    transferStations,
  });
}
