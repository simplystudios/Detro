<script>
    import { onMount } from "svelte";

    export let route = null;

    const LINE_COLORS = {
        "Red line": "#E53935",
        "Yellow line": "#F5C800",
        "Blue line": "#1565C0",
        "Blue line branch": "#1565C0",
        "Blue line main": "#1565C0",
        "Green line": "#2E7D32",
        "Green line branch": "#2E7D32",
        "Voilet line": "#6A1B9A",
        "Orange line": "#E65100",
        "Magenta line": "#AD1457",
        "Pink line": "#E91E8C",
        "Aqua line": "#00838F",
        "Gray line": "#757575",
        "Rapid Metro": "#283593",
    };

    const TRACK_W = 10;
    const STOP_R = 9;
    const TERM_R = 14;
    const XFER_W = 30;
    const XFER_H = 30;
    const V_SHIFT = 64;
    const PAD_X = 80;
    const PAD_Y = 100;

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

            let d =
                Math.abs(dy) < 2
                    ? `M${a.x} ${a.y} L${b.x} ${b.y}`
                    : `M${a.x} ${a.y} L${a.x + (dx - Math.abs(dy))} ${a.y} L${b.x} ${b.y}`;

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

    // ── INTERACTIVITY & CENTERING LOGIC ──
    let canvasW = 0;
    let canvasH = 0;
    let scale = 1;
    let tx = 0,
        ty = 0;
    let lastCenteredRoute = "";

    let isAnimating = false;
    let currentStationIndex = 0;

    /**
     * Returns the status-bar offset to use when centering a station.
     *
     * - Android WebView: `window.androidStatusBarHeight` is injected by the
     *   native app via JavascriptInterface, so we use that value.
     * - Everything else (browser, desktop, web): use 0 so the station sits
     *   exactly in the vertical centre of the canvas.
     */
    function getStatusBarOffset() {
        // Only trust the Android value when it has actually been set by the
        // native bridge (i.e. it's a positive number, not just the property
        // being undefined/null/0 in a normal browser).
        const androidValue = window.androidStatusBarHeight;
        if (typeof androidValue === "number" && androidValue > 0) {
            return androidValue;
        }
        return 0;
    }

    $: if (layout && canvasW && canvasH) {
        const currentRouteKey =
            route?.route?.[0]?.station +
            "-" +
            route?.route?.[route.route.length - 1]?.station;

        if (lastCenteredRoute !== currentRouteKey) {
            currentStationIndex = 0;
            setTimeout(() => {
                centerOnStation(0);
            }, 50);
            lastCenteredRoute = currentRouteKey;
        }
    }

    function centerOnStation(index) {
        if (!layout || !layout.pts[index] || canvasW === 0 || canvasH === 0)
            return;

        const pt = layout.pts[index];
        scale = 1;
        initialScale = scale;

        const statusBarOffset = getStatusBarOffset();

        tx = canvasW / 2 - pt.x * scale;
        ty = canvasH / 2 + statusBarOffset / 2 - pt.y * scale;

        isAnimating = true;
        setTimeout(() => {
            isAnimating = false;
        }, 400);

        if (window.AndroidBridge && window.AndroidBridge.onStationChanged) {
            window.AndroidBridge.onStationChanged(pt.name);
        }
    }

    onMount(() => {
        window.nextStation = () => {
            if (layout && currentStationIndex < layout.pts.length - 1) {
                currentStationIndex++;
                centerOnStation(currentStationIndex);
            }
        };
        window.prevStation = () => {
            if (layout && currentStationIndex > 0) {
                currentStationIndex--;
                centerOnStation(currentStationIndex);
            }
        };
    });

    let panning = false;
    let sx = 0,
        sy = 0,
        stx = 0,
        sty = 0;
    let initialDist = 0;
    let initialScale = 1;

    function onWheel(e) {
        isAnimating = false;
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
        isAnimating = false;
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
        isAnimating = false;
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
            scale = Math.min(
                6,
                Math.max(0.3, initialScale * (currentDist / initialDist)),
            );
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
            return {
                side: "rotated",
                rotate: (Math.atan2(dy, dx) * 180) / Math.PI - 90,
            };
        }
        return { side: i % 2 === 0 ? "above" : "below", rotate: 0 };
    }
</script>

{#if route && layout}
    <div
        class="canvas"
        bind:clientWidth={canvasW}
        bind:clientHeight={canvasH}
        style="cursor:{panning
            ? 'grabbing'
            : 'grab'}; background-position: {tx}px {ty}px; background-size: {24 *
            scale}px {24 * scale}px; transition: {isAnimating
            ? 'background-position 0.4s ease-out, background-size 0.4s ease-out'
            : 'none'};"
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
            style="display:block; transform-origin:0 0; transform:translate({tx}px,{ty}px) scale({scale}); transition: {isAnimating
                ? 'transform 0.4s ease-out'
                : 'none'};"
        >
            <defs>
                <mask id="track-cutout">
                    <rect width="100%" height="100%" fill="white" />

                    {#each layout.lineLabels as lbl}
                        <rect
                            x={lbl.x - lbl.width / 2 - 4}
                            y={lbl.y - 16}
                            width={lbl.width + 8}
                            height={32}
                            rx={12}
                            fill="black"
                        />
                    {/each}

                    {#each layout.pts as pt, i}
                        {@const isFirst = i === 0}
                        {@const isLast = i === layout.pts.length - 1}
                        {@const isTerm = isFirst || isLast}

                        {#if isTerm}
                            <circle
                                cx={pt.x}
                                cy={pt.y}
                                r={TERM_R + 4}
                                fill="black"
                            />
                        {:else if pt.isTransfer}
                            <rect
                                x={pt.x - XFER_W / 2 - 4}
                                y={pt.y - XFER_H / 2 - 4}
                                width={XFER_W + 8}
                                height={XFER_H + 8}
                                rx={(XFER_H + 8) / 2}
                                fill="black"
                            />
                        {:else}
                            <circle
                                cx={pt.x}
                                cy={pt.y}
                                r={STOP_R + 4}
                                fill="black"
                            />
                        {/if}
                    {/each}
                </mask>
            </defs>

            <g mask="url(#track-cutout)">
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
            </g>

            {#each layout.lineLabels as lbl}
                <rect
                    x={lbl.x - lbl.width / 2}
                    y={lbl.y - 12}
                    width={lbl.width}
                    height={24}
                    rx={6}
                    fill={lbl.color}
                />
                <text
                    x={lbl.x}
                    y={lbl.y}
                    dominant-baseline="central"
                    text-anchor="middle"
                    font-size="11"
                    font-weight="700"
                    fill="white">{lbl.name}</text
                >
            {/each}

            {#each layout.pts as pt, i}
                {@const isTerm = i === 0 || i === layout.pts.length - 1}
                {@const lbl = labelAngle(i, pt, layout)}

                {#if isTerm}
                    <circle
                        cx={pt.x}
                        cy={pt.y}
                        r={TERM_R}
                        fill="var(--node-highlight)"
                    />
                    <text
                        x={pt.x}
                        y={pt.y}
                        dominant-baseline="central"
                        text-anchor="middle"
                        class="node-num num-terminal"
                        fill="var(--text-inv)">{pt.stopNumber}</text
                    >
                {:else if pt.isTransfer}
                    <rect
                        x={pt.x - XFER_W / 2}
                        y={pt.y - XFER_H / 2}
                        width={XFER_W}
                        height={XFER_H}
                        rx={XFER_H / 2}
                        fill="var(--node-bg)"
                        stroke="var(--node-highlight)"
                        stroke-width="2"
                    />
                    <svg
                        x={pt.x - 8}
                        y={pt.y - 8}
                        width="16"
                        height="16"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="var(--text-main)"
                        stroke-width="2.5"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        class="node-num num-transfer"
                    >
                        <path d="M16 3l4 4-4 4M20 7H4" />
                        <path d="M8 21l-4-4 4-4M4 17h16" />
                    </svg>
                {:else}
                    <circle
                        cx={pt.x}
                        cy={pt.y}
                        r={STOP_R}
                        fill="var(--node-bg)"
                        stroke="var(--border-color)"
                        stroke-width="2"
                    />
                    <text
                        x={pt.x}
                        y={pt.y}
                        dominant-baseline="central"
                        text-anchor="middle"
                        class="node-num num-stop"
                        fill="var(--text-main)">{pt.stopNumber}</text
                    >
                {/if}

                {#if isTerm || pt.isTransfer}
                    <text
                        x={pt.x}
                        y={pt.y}
                        class="node-label"
                        fill="var(--text-sec)"
                        font-size={isTerm ? "14" : "12"}
                        font-weight={isTerm ? "700" : "600"}
                        text-anchor={lbl.side === "rotated"
                            ? "start"
                            : "middle"}
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
        background-color: transparent !important;
    }

    :root {
        --text-main: #f3f4f6;
        --text-sec: #1a1c29;
        --text-inv: #1a1c29;
        --term-text: #1a1c29;
        --border-color: #3b4054;
        --node-base: #161925;
        --node-bg: #1a1c29;
        --node-highlight: #e2e4e9;
        --grid-color: rgba(0, 0, 0, 0.08);
    }

    @media (prefers-color-scheme: dark) {
        :root {
            --text-main: #f3f4f6;
            --text-sec: #f3f4f6;
            --border-color: #3b4054;
            --node-base: #161925;
            --node-bg: #1a1c29;
            --node-highlight: #e2e4e9;
            --grid-color: rgba(255, 255, 255, 0.05);
            --text-inv: black;
        }
    }

    .canvas {
        overflow: hidden;
        width: 100%;
        height: 100%;
        background-color: transparent !important;
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

    .canvas svg {
        will-change: transform;
        user-select: none;
    }

    .node-num {
        font-family: "DM Sans", system-ui, sans-serif;
        font-weight: 800;
        pointer-events: none;
    }

    .num-terminal {
        font-size: 14px;
    }
    .num-transfer {
        padding: 10px;
        margin: 10px;
        font-size: 11px;
    }
    .num-stop {
        font-size: 10px;
    }

    .node-label {
        paint-order: stroke fill;
    }
</style>
