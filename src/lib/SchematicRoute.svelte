<script>
    export let route = null;

    const LINE_COLORS = {
        "Red line": "#E53935",
        "Yellow line": "#F5C800",
        "Blue line": "#1565C0",
        "Blue line branch": "#1565C0",
        "Blue line main": "#1565C0",
        "Green line": "#2E7D32",
        "Voilet line": "#6A1B9A",
        "Orange line": "#E65100",
        "Magenta line": "#AD1457",
        "Pink line": "#E91E8C",
        "Aqua line": "#00838F",
        "Gray line": "#757575",
        "Rapid Metro": "#283593",
    };

    const TRACK_W = 12;
    const HALO_W = TRACK_W + 8;
    const STOP_R = 10;
    const TERM_R = 15;
    const XFER_W = 32;
    const XFER_H = 20;
    const V_SHIFT = 64;
    const PAD_X = 80;
    const PAD_Y = 100;

    const ICON_HOME = "M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z";
    const ICON_WORK =
        "M4 21h1.5V15.7c1-.7 2.5-1.2 3.5-1.2 3 0 5 3 9 1V5c-4 2-6-.5-9-.5-1.5 0-3 .5-4 1.5V4H4v17z";

    $: layout = (() => {
        if (!route?.route?.length) return null;

        const names = route.route.map((r) => r.station);
        const segLines = route.route.slice(1).map((r) => r.line);
        const transfers = new Set(route.transferStations ?? []);
        const n = names.length;

        let H_STEP = 120;
        if (n > 1) {
            let maxRequiredStep = 100;
            let currentLine = null;
            let lineStartIdx = 0;

            for (let i = 0; i <= segLines.length; i++) {
                const lineName = i < segLines.length ? segLines[i] : null;
                if (lineName !== currentLine) {
                    if (currentLine !== null) {
                        const numSegs = i - lineStartIdx;
                        const badgeWidth = currentLine.length * 7.5 + 24;
                        const neededPerSeg = (badgeWidth + 40) / numSegs;
                        if (neededPerSeg > maxRequiredStep)
                            maxRequiredStep = neededPerSeg;
                    }
                    currentLine = lineName;
                    lineStartIdx = i;
                }
            }
            const dynamicScale = 450 / Math.max(1, Math.sqrt(n));
            H_STEP = Math.min(240, Math.max(maxRequiredStep, dynamicScale));
        }

        const pts = [];
        let x = PAD_X,
            y = PAD_Y;

        for (let i = 0; i < n; i++) {
            pts.push({
                x,
                y,
                name: names[i],
                isTransfer: transfers.has(names[i]),
                stopNumber: i + 1,
            });
            if (i < n - 1) {
                const lineChange = i > 0 && segLines[i] !== segLines[i - 1];
                x += H_STEP;
                if (lineChange) y += V_SHIFT;
            }
        }

        const segs = [];
        for (let i = 0; i < n - 1; i++) {
            const a = pts[i],
                b = pts[i + 1];
            const color = LINE_COLORS[segLines[i]] ?? "#555";
            const dy = b.y - a.y;
            const dx = b.x - a.x;

            let d;
            if (Math.abs(dy) < 2) {
                d = `M${a.x} ${a.y} L${b.x} ${b.y}`;
            } else {
                const hLen = dx - Math.abs(dy);
                const elbowX = a.x + hLen;
                if (hLen > 0) {
                    d = `M${a.x} ${a.y} L${elbowX} ${a.y} L${b.x} ${b.y}`;
                } else {
                    d = `M${a.x} ${a.y} L${b.x} ${b.y}`;
                }
            }
            segs.push({ d, color, fromIdx: i, toIdx: i + 1 });
        }

        const lineLabels = [];
        let currentLine = null;
        let lineStartIdx = 0;

        for (let i = 0; i <= segLines.length; i++) {
            const lineName = i < segLines.length ? segLines[i] : null;

            if (lineName !== currentLine) {
                if (currentLine !== null) {
                    let maxHLen = 0;
                    let bestCenter = { x: 0, y: 0 };

                    for (let j = lineStartIdx; j < i; j++) {
                        const a = pts[j];
                        const b = pts[j + 1];
                        const dx = b.x - a.x;
                        const dy = b.y - a.y;
                        const hLen = Math.abs(dy) < 2 ? dx : dx - Math.abs(dy);

                        if (hLen > maxHLen) {
                            maxHLen = hLen;
                            bestCenter = { x: a.x + hLen / 2, y: a.y };
                        }
                    }

                    lineLabels.push({
                        name: currentLine,
                        color: LINE_COLORS[currentLine] ?? "#555",
                        x: bestCenter.x,
                        y: bestCenter.y,
                        width: currentLine.length * 7.5 + 24,
                    });
                }
                currentLine = lineName;
                lineStartIdx = i;
            }
        }

        const svgW = Math.max(...pts.map((p) => p.x)) + PAD_X + 40;
        const svgH = Math.max(...pts.map((p) => p.y)) + PAD_Y + 40;

        return {
            pts,
            segs,
            svgW,
            svgH,
            names,
            segLines,
            transfers,
            lineLabels,
        };
    })();

    let scale = 1;
    let tx = 0,
        ty = 0;
    let panning = false;
    let sx = 0,
        sy = 0,
        stx = 0,
        sty = 0;

    let initialDist = 0;
    let initialScale = 1;

    function onWheel(e) {
        e.preventDefault();
        const rect = e.currentTarget.getBoundingClientRect();
        const mx = e.clientX - rect.left,
            my = e.clientY - rect.top;
        const f = e.deltaY > 0 ? 0.85 : 1.18;
        const ns = Math.min(6, Math.max(0.3, scale * f));
        tx = mx - ((mx - tx) * ns) / scale;
        ty = my - ((my - ty) * ns) / scale;
        scale = ns;
    }
    function onMD(e) {
        if (e.button !== 0) return;
        panning = true;
        sx = e.clientX;
        sy = e.clientY;
        stx = tx;
        sty = ty;
    }
    function onMM(e) {
        if (!panning) return;
        tx = stx + e.clientX - sx;
        ty = sty + e.clientY - sy;
    }
    function onMU() {
        panning = false;
    }

    function getTouchDist(t1, t2) {
        return Math.hypot(t1.clientX - t2.clientX, t1.clientY - t2.clientY);
    }

    function onTS(e) {
        if (e.touches.length === 2) {
            initialDist = getTouchDist(e.touches[0], e.touches[1]);
            initialScale = scale;
            panning = false;
        } else if (e.touches.length === 1) {
            panning = true;
            sx = e.touches[0].clientX;
            sy = e.touches[0].clientY;
            stx = tx;
            sty = ty;
        }
    }

    function onTM(e) {
        if (e.touches.length === 2) {
            e.preventDefault();
            const currentDist = getTouchDist(e.touches[0], e.touches[1]);
            const zoomFactor = currentDist / initialDist;
            let ns = initialScale * zoomFactor;
            scale = Math.min(6, Math.max(0.3, ns));
        } else if (e.touches.length === 1 && panning) {
            tx = stx + e.touches[0].clientX - sx;
            ty = sty + e.touches[0].clientY - sy;
        }
    }

    function onTE() {
        panning = false;
    }

    function labelAngle(i, pt, layout) {
        const isFirst = i === 0,
            isLast = i === layout.pts.length - 1;
        if (isFirst || isLast) return { side: "above", rotate: 0 };
        const prev = layout.pts[i - 1],
            next = layout.pts[i + 1];
        const dx = (next?.x ?? pt.x) - (prev?.x ?? pt.x);
        const dy = (next?.y ?? pt.y) - (prev?.y ?? pt.y);
        if (Math.abs(dy) > 8) {
            const angle = (Math.atan2(dy, dx) * 180) / Math.PI - 90;
            return { side: "rotated", rotate: angle };
        }
        return { side: i % 2 === 0 ? "above" : "below", rotate: 0 };
    }
</script>

{#if route && layout}
    <div
        class="canvas"
        style="cursor:{panning
            ? 'grabbing'
            : 'grab'}; background-position: {tx}px {ty}px; background-size: {24 *
            scale}px {24 * scale}px;"
        on:wheel={onWheel}
        on:mousedown={onMD}
        on:mousemove={onMM}
        on:mouseup={onMU}
        on:mouseleave={onMU}
        on:touchstart={onTS}
        on:touchmove={onTM}
        on:touchend={onTE}
        on:touchcancel={onTE}
        role="img"
    >
        <svg
            width={layout.svgW}
            height={layout.svgH}
            viewBox="0 0 {layout.svgW} {layout.svgH}"
            style="display:block; transform-origin:0 0; transform:translate({tx}px,{ty}px) scale({scale}); transition: none;"
        >
            {#each layout.segs as seg}
                <path
                    d={seg.d}
                    stroke="var(--bg-color)"
                    stroke-width={HALO_W}
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    fill="none"
                />
            {/each}

            {#each layout.segs as seg}
                <path
                    d={seg.d}
                    stroke={seg.color}
                    stroke-width={TRACK_W}
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    fill="none"
                />
            {/each}

            {#each layout.lineLabels as lbl}
                <rect
                    x={lbl.x - lbl.width / 2}
                    y={lbl.y - 12}
                    width={lbl.width}
                    height={24}
                    rx={6}
                    fill={lbl.color}
                    stroke="var(--bg-color)"
                    stroke-width="3"
                />
                <text
                    x={lbl.x}
                    y={lbl.y}
                    dominant-baseline="central"
                    text-anchor="middle"
                    font-size="11"
                    font-weight="700"
                    fill="white"
                >
                    {lbl.name}
                </text>
            {/each}

            {#each layout.pts as pt, i}
                {@const isFirst = i === 0}
                {@const isLast = i === layout.pts.length - 1}
                {@const isTerm = isFirst || isLast}
                {@const lbl = labelAngle(i, pt, layout)}

                {#if isTerm}
                    <circle
                        cx={pt.x}
                        cy={pt.y}
                        r={TERM_R + 3}
                        fill="var(--bg-color)"
                    />
                    <circle
                        cx={pt.x}
                        cy={pt.y}
                        r={TERM_R}
                        fill="var(--text-main)"
                    />
                    <text
                        x={pt.x}
                        y={pt.y}
                        dominant-baseline="central"
                        text-anchor="middle"
                        font-size="13"
                        font-weight="800"
                        fill="var(--bg-color)"
                        style="pointer-events: none;">{pt.stopNumber}</text
                    >
                {:else if pt.isTransfer}
                    <rect
                        x={pt.x - XFER_W / 2}
                        y={pt.y - XFER_H / 2}
                        width={XFER_W}
                        height={XFER_H}
                        rx={XFER_H / 2}
                        fill="var(--bg-color)"
                        stroke="var(--text-main)"
                        stroke-width="3"
                    />
                    <text
                        x={pt.x}
                        y={pt.y}
                        dominant-baseline="central"
                        text-anchor="middle"
                        font-size="11"
                        font-weight="800"
                        fill="var(--text-main)"
                        style="pointer-events: none;">{pt.stopNumber}</text
                    >
                {:else}
                    <circle
                        cx={pt.x}
                        cy={pt.y}
                        r={STOP_R + 3}
                        fill="var(--bg-color)"
                    />
                    <circle
                        cx={pt.x}
                        cy={pt.y}
                        r={STOP_R}
                        fill="var(--bg-color)"
                        stroke="var(--border-color)"
                        stroke-width="1.5"
                    />
                    <text
                        x={pt.x}
                        y={pt.y}
                        dominant-baseline="central"
                        text-anchor="middle"
                        font-size="10"
                        font-weight="800"
                        fill="var(--text-main)"
                        style="pointer-events: none;">{pt.stopNumber}</text
                    >
                {/if}

                {#if isTerm || pt.isTransfer}
                    <text
                        x={pt.x}
                        y={pt.y}
                        text-anchor={lbl.side === "rotated"
                            ? "start"
                            : "middle"}
                        font-size={isTerm ? "14" : "12"}
                        font-weight={isTerm ? "700" : "600"}
                        fill="var(--text-main)"
                        stroke="var(--bg-color)"
                        stroke-width="4"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        style="paint-order: stroke fill;"
                        transform={lbl.side === "above"
                            ? `translate(0, -${isTerm ? TERM_R + 10 : pt.isTransfer ? XFER_H / 2 + 10 : STOP_R + 12})`
                            : lbl.side === "below"
                              ? `translate(0, ${isTerm ? TERM_R + 20 : pt.isTransfer ? XFER_H / 2 + 20 : STOP_R + 20})`
                              : `translate(${pt.x},${pt.y}) rotate(${lbl.rotate}) translate(${STOP_R + 8}, 4) rotate(${-lbl.rotate}) translate(-${pt.x},-${pt.y})`}
                    >
                        {pt.name}
                    </text>
                {/if}
            {/each}
        </svg>
    </div>
{/if}

<style>
    @import url("https://fonts.googleapis.com/css2?family=DM+Sans:wght@500;600;700;800&display=swap");

    :global(body) {
        margin: 0;
        padding: 0;
        overflow: hidden;
        background-color: transparent; /* 👈 1. Changed to transparent */
    }

    :root {
        --bg-color: #f4f5f8; /* Light mode cutout color */
        --border-color: #e2e4e9;
        --text-main: #1a1c29;
        --grid-color: rgba(0, 0, 0, 0.06);
        --halo-color: var(--bg-color);
    }

    @media (prefers-color-scheme: dark) {
        :root {
            /* 👇 2. Change this to the EXACT hex code of your Sketchware app's background! */
            --bg-color: #171413;

            --border-color: #262a3d;
            --text-main: #f3f4f6;
            --grid-color: rgba(255, 255, 255, 0.05);
        }
    }

    .canvas {
        overflow: hidden;
        width: 100vw;
        height: 100vh;
        background-color: transparent; /* 👈 3. Changed to transparent */
        background-image: radial-gradient(
            var(--grid-color) 1.5px,
            transparent 1.5px
        );
        position: relative;
        touch-action: none;
        -webkit-user-select: none;
        user-select: none;
        font-family: "DM Sans", system-ui, sans-serif;
    }
</style>
