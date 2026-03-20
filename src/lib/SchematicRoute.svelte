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
    const STOP_R = 12;
    const TERM_R = 14;
    const XFER_W = 30;
    const XFER_H = 30;
    const V_SHIFT = 64;
    const PAD_X = 80;
    const PAD_Y = 120;

    $: layout = (() => {
        if (!route?.route?.length) return null;

        const names = route.route.map((r) => r.station);
        const segLines = route.route.slice(1).map((r) => r.line);
        const transfers = new Set(route.transferStations ?? []);
        const n = names.length;

        const pts = [];
        const segs = [];
        const lineLabels = [];
        const transferCallouts = [];

        let currentX = PAD_X;
        let currentY = PAD_Y;

        for (let i = 0; i < n; i++) {
            let transferTo = null;
            if (i > 0 && i < n - 1) {
                if (segLines[i] !== segLines[i - 1]) {
                    transferTo = segLines[i];
                }
            }

            let isNewLineStart =
                i === 0 || (i > 0 && segLines[i] !== segLines[i - 1]);
            let lineNameForBadge =
                isNewLineStart && i < n - 1 ? segLines[i] : null;

            let stepX = 120;

            if (lineNameForBadge) {
                let badgeW = lineNameForBadge.length * 7 + 24;
                let neededX = badgeW + 80;
                if (i > 0) neededX += V_SHIFT;
                stepX = Math.max(stepX, neededX);
            }

            pts.push({
                x: currentX,
                y: currentY,
                name: names[i],
                stopNumber: i + 1,
                isTerm: i === 0 || i === n - 1,
                isTransfer: transfers.has(names[i]) || transferTo !== null,
                transferTo: transferTo,
            });

            if (i < n - 1) {
                let nextY = currentY;
                if (isNewLineStart && i > 0) {
                    nextY += V_SHIFT;
                }

                if (lineNameForBadge) {
                    let horizontalLength =
                        stepX - (isNewLineStart && i > 0 ? V_SHIFT : 0);
                    lineLabels.push({
                        name: lineNameForBadge,
                        color: LINE_COLORS[lineNameForBadge] ?? "#555",
                        x: currentX + horizontalLength / 2,
                        y: currentY,
                        width: lineNameForBadge.length * 7 + 20,
                    });
                }

                currentX += stepX;
                currentY = nextY;
            }
        }

        for (let i = 0; i < n; i++) {
            let pt = pts[i];

            pt.lblRotate = 0;
            pt.lblSide = i % 2 === 0 ? "above" : "below";

            if (pt.isTerm) {
                pt.lblSide = "above";
            } else if (pt.isTransfer) {
                pt.lblSide = "below";
            } else if (i > 0 && i < n - 1) {
                const prev = pts[i - 1];
                const next = pts[i + 1];
                const dy = next.y - prev.y;
                const dx = next.x - prev.x;
                if (Math.abs(dy) > 8) {
                    pt.lblRotate = (Math.atan2(dy, dx) * 180) / Math.PI - 90;
                    pt.lblSide = "rotated";
                }
            }

            if (pt.transferTo) {
                let calloutW = pt.transferTo.length * 12 + 70;
                let calloutSide = pt.lblSide === "above" ? "below" : "above";
                if (pt.lblSide === "rotated") calloutSide = "above";

                // transferCallouts.push({
                //     x: pt.x,
                //     y: pt.y,
                //     side: calloutSide,
                //     text: "Change to " + pt.transferTo,
                //     color: LINE_COLORS[pt.transferTo] || "#555",
                //     width: calloutW,
                // });
            }
        }

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
            transferCallouts,
        };
    })();

    let canvasW = 0;
    let canvasH = 0;
    let scale = 1;
    let tx = 0,
        ty = 0;
    let isAnimating = false;
    let currentStationIndex = 0;

    let lastW = 0,
        lastH = 0;
    $: if (layout && canvasW > 0 && canvasH > 0) {
        if (Math.abs(canvasW - lastW) > 5 || Math.abs(canvasH - lastH) > 5) {
            lastW = canvasW;
            lastH = canvasH;
            if (!panning) {
                setTimeout(() => centerOnStation(currentStationIndex), 50);
            }
        }
    }

    let lastRouteKey = "";
    $: if (layout) {
        const key =
            route?.route?.[0]?.station +
            "-" +
            route?.route?.[route.route.length - 1]?.station;
        if (key !== lastRouteKey) {
            lastRouteKey = key;
            currentStationIndex = 0;
            setTimeout(() => centerOnStation(0), 50);
        }
    }

    function centerOnStation(index) {
        if (!layout || !layout.pts[index] || canvasW === 0 || canvasH === 0)
            return;

        const pt = layout.pts[index];
        const sbOffset = window.androidStatusBarHeight || 0;
        const manualNudge = 20;

        tx = canvasW / 2 - pt.x * scale;
        ty = canvasH / 2 + sbOffset / 2 - pt.y * scale + manualNudge;

        isAnimating = true;
        setTimeout(() => {
            isAnimating = false;
        }, 400);

        if (window.AndroidBridge?.onStationChanged) {
            window.AndroidBridge.onStationChanged(pt.name);
        }
    }

    function nextStationLocal() {
        if (layout && currentStationIndex < layout.pts.length - 1) {
            currentStationIndex++;
            centerOnStation(currentStationIndex);
        }
    }

    function prevStationLocal() {
        if (layout && currentStationIndex > 0) {
            currentStationIndex--;
            centerOnStation(currentStationIndex);
        }
    }

    onMount(() => {
        window.nextStation = nextStationLocal;
        window.prevStation = prevStationLocal;
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
                    <rect
                        x="-50000"
                        y="-50000"
                        width="100000"
                        height="100000"
                        fill="white"
                    />

                    {#each layout.lineLabels as lbl}
                        <rect
                            x={lbl.x - lbl.width / 2 - 4}
                            y={lbl.y - 14}
                            width={lbl.width + 8}
                            height={28}
                            rx={14}
                            fill="black"
                        />
                    {/each}

                    {#each layout.pts as pt}
                        {#if pt.isTerm}
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
                    y={lbl.y - 10}
                    width={lbl.width}
                    height={20}
                    rx={10}
                    fill={lbl.color}
                />
                <text
                    x={lbl.x}
                    y={lbl.y}
                    dominant-baseline="central"
                    text-anchor="middle"
                    font-size="10"
                    font-weight="700"
                    fill="white">{lbl.name}</text
                >
            {/each}

            {#each layout.transferCallouts as call}
                <g class="transfer-callout">
                    <line
                        x1={call.x}
                        y1={call.y + (call.side === "above" ? -18 : 18)}
                        x2={call.x}
                        y2={call.y + (call.side === "above" ? -40 : 40)}
                        stroke={call.color}
                        stroke-width="2"
                        stroke-dasharray="4 3"
                    />
                    <rect
                        x={call.x - call.width / 2}
                        y={call.y + (call.side === "above" ? -62 : 40)}
                        width={call.width}
                        height={22}
                        rx="11"
                        fill={call.color}
                        stroke="var(--node-bg)"
                        stroke-width="2"
                    />
                    <text
                        x={call.x}
                        y={call.y + (call.side === "above" ? -51 : 51)}
                        dominant-baseline="central"
                        text-anchor="middle"
                        font-size="10"
                        font-weight="700"
                        fill="white"
                    >
                        {call.text}
                    </text>
                </g>
            {/each}

            {#each layout.pts as pt}
                <g transform="translate({pt.x}, {pt.y})">
                    {#if pt.isTerm}
                        <circle
                            cx="0"
                            cy="0"
                            r={TERM_R}
                            fill="var(--node-highlight)"
                        />
                        <text
                            x="0"
                            y="0"
                            dominant-baseline="central"
                            text-anchor="middle"
                            class="node-num num-terminal"
                            fill="var(--text-inv)">{pt.stopNumber}</text
                        >
                    {:else if pt.isTransfer}
                        <rect
                            x={-XFER_W / 2}
                            y={-XFER_H / 2}
                            width={XFER_W}
                            height={XFER_H}
                            rx={XFER_H / 2}
                            fill="var(--node-bg)"
                            stroke="var(--node-highlight)"
                            stroke-width="2"
                        />
                        <svg
                            x="-8"
                            y="-8"
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
                            cx="0"
                            cy="0"
                            r={STOP_R}
                            fill="var(--node-bg)"
                            stroke="var(--border-color)"
                            stroke-width="2"
                        />
                        <text
                            x="0"
                            y="0"
                            dominant-baseline="central"
                            text-anchor="middle"
                            class="node-num num-terminal"
                            fill="var(--text-main)">{pt.stopNumber}</text
                        >
                    {/if}

                    {#if pt.isTransfer}
                        <g
                            transform={pt.lblSide === "above"
                                ? `translate(0, -30)`
                                : `translate(0, 38)`}
                        >
                            <text
                                x="0"
                                y="0"
                                class="node-label"
                                fill="var(--text-pill)"
                                font-size="18"
                                font-weight="700"
                                text-anchor="middle"
                            >
                                {pt.name}
                            </text>

                            {#if pt.transferTo}
                                {@const tw = pt.transferTo.length * 16 + 16}
                                <rect
                                    x={-tw / 2}
                                    y={10}
                                    width={tw}
                                    height={18}
                                    rx="8"
                                    fill="transparent"
                                    stroke="transparent"
                                    stroke-width="1.5"
                                />
                                <text
                                    x="0"
                                    y={18}
                                    dominant-baseline="central"
                                    text-anchor="middle"
                                    font-size="8"
                                    font-weight="500"
                                    fill="var(--text-pill)"
                                >
                                    Change to {pt.transferTo}
                                </text>
                            {/if}
                        </g>
                    {:else if pt.isTerm}
                        <g
                            transform={pt.lblSide === "above"
                                ? `translate(0, -24)`
                                : `translate(0, 30)`}
                        >
                            <text
                                x="0"
                                y="0"
                                class="node-label"
                                fill="var(--text-sec)"
                                font-size="12"
                                font-weight="500"
                                text-anchor="middle"
                            >
                                {pt.name}
                            </text>
                        </g>
                    {/if}
                </g>
            {/each}
        </svg>

        <button
            class="web-nav-btn left"
            disabled={currentStationIndex === 0}
            on:click|stopPropagation={prevStationLocal}
            on:mousedown|stopPropagation
            on:touchstart|stopPropagation
        >
            <svg viewBox="0 0 24 24"><path d="M15 18l-6-6 6-6" /></svg>
        </button>

        <button
            class="web-nav-btn right"
            disabled={currentStationIndex === layout.pts.length - 1}
            on:click|stopPropagation={nextStationLocal}
            on:mousedown|stopPropagation
            on:touchstart|stopPropagation
        >
            <svg viewBox="0 0 24 24"><path d="M9 18l6-6-6-6" /></svg>
        </button>
    </div>
{/if}

<style>
    @import url("https://fonts.googleapis.com/css2?family=DM+Sans:wght@500;600;700;800;900&display=swap");

    :global(html),
    :global(body) {
        width: 100%;
        height: 100%;
        margin: 0;
        padding: 0;
        overflow: hidden;
        background-color: transparent !important;
    }

    :root {
        --text-main: #f3f4f6;
        --text-pill: #1a1c29;
        --text-sec: #9ca3af; /* Dimmed the terminal text to make transfers pop harder */
        --text-inv: #1a1c29;
        --border-color: #3b4054;
        --node-base: #161925;
        --node-bg: #1a1c29;
        --node-highlight: #e2e4e9;
        --grid-color: rgba(0, 0, 0, 0.08);
    }

    @media (prefers-color-scheme: dark) {
        :root {
            --text-main: #ffffff;
            --text-sec: #9ca3af;
            --text-pill: #f3f4f6;
            --border-color: #3b4054;
            --node-base: #161925;
            --node-bg: #1a1c29;
            --node-highlight: #ffffff;
            --grid-color: rgba(255, 255, 255, 0.05);
            --text-inv: black;
        }
    }

    .canvas {
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        width: 100%;
        height: 100%;
        overflow: hidden;
        background-color: transparent !important;
        background-image: radial-gradient(
            var(--grid-color) 1.5px,
            transparent 1.5px
        );
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

    .node-label {
        paint-order: stroke fill;
    }

    .web-nav-btn {
        position: absolute;
        top: 50%;
        transform: translateY(-50%);
        width: 48px;
        height: 48px;
        border-radius: 50%;
        background: var(--node-base);
        border: 2px solid var(--border-color);
        color: var(--text-main);
        display: flex;
        align-items: center;
        justify-content: center;
        cursor: pointer;
        z-index: 100;
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
        transition: all 0.2s ease;
    }

    .web-nav-btn:hover:not(:disabled) {
        background: var(--border-color);
        transform: translateY(-50%) scale(1.05);
    }

    .web-nav-btn:disabled {
        opacity: 0.3;
        cursor: not-allowed;
    }

    .web-nav-btn.left {
        left: 24px;
    }
    .web-nav-btn.right {
        right: 24px;
    }

    .web-nav-btn svg {
        width: 24px;
        height: 24px;
        fill: none;
        stroke: currentColor;
        stroke-width: 2.5;
        stroke-linecap: round;
        stroke-linejoin: round;
    }

    @media (max-width: 600px) {
        .web-nav-btn {
            display: none;
        }
    }
</style>
