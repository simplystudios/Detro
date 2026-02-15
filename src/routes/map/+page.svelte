<script>
    import { onMount, onDestroy } from "svelte";
    import { browser } from "$app/environment";
    import { toValue, fromValue } from "$lib/store.js";

    let mapElement;
    let map;
    let leaflet;
    let metrodata = [];
    let haloLayer;
    let riverLayer; 
    let markersMap = new Map();
    let toastMessage = "";
    let showToast = false;

    // Theme Configuration
    let currentThemeKey = "light";
    const themes = {
        light: { bg: "#fdfdfd", halo: "#ffffff", ui: "#2c3e50", river: "#D4E6F1" },
        dark: { bg: "#121212", halo: "#121212", ui: "#ffffff", river: "#1B4F72" },
        slate: { bg: "#2c3e50", halo: "#2c3e50", ui: "#ffffff", river: "#243b4a" },
        black: { bg: "#000000", halo: "#000000", ui: "#ffffff", river: "#0a1a26" },
        nord: { bg: "#2E3440", halo: "#2E3440", ui: "#ECEFF4", river: "#3B4252" },
        paper: { bg: "#F4F1EA", halo: "#F4F1EA", ui: "#3B3B3B", river: "#C0D8E0" },
        midnight: { bg: "#0B0E14", halo: "#0B0E14", ui: "#5C6370", river: "#161B22" },
        ghost: { bg: "#E0E0E0", halo: "#E0E0E0", ui: "#1A1A1A", river: "#D0D0D0" },
        dracula: { bg: "#282a36", halo: "#282a36", ui: "#f8f8f2", river: "#44475a" },
        emerald: { bg: "#061712", halo: "#061712", ui: "#D1FAE5", river: "#0D2A22" },
        oceanic: { bg: "#1c2a35", halo: "#1c2a35", ui: "#ecf0f1", river: "#2c3e50" },
        solarized: { bg: "#fdf6e3", halo: "#fdf6e3", ui: "#657b83", river: "#eee8d5" },
        crimson: { bg: "#1a0f0f", halo: "#1a0f0f", ui: "#ffcccb", river: "#2d1a1a" },
        matcha: { bg: "#f0f4f0", halo: "#f0f4f0", ui: "#2d3b2d", river: "#dce6dc" },
        obsidian: { bg: "#16161D", halo: "#16161D", ui: "#949494", river: "#21212B" },
        sand: { bg: "#e6e2d3", halo: "#e6e2d3", ui: "#4b3832", river: "#c5c1b1" },
        nebula: { bg: "#100a1c", halo: "#100a1c", ui: "#e0d7f1", river: "#1a1329" },
    };

    $: theme = themes[currentThemeKey];

    // Reactive UI Updates
    $: if (mapElement && theme) {
        mapElement.style.setProperty('--ui-color', theme.ui);
        mapElement.style.setProperty('--bg-color', theme.bg);
    }

    function triggerToast(msg) {
        toastMessage = msg;
        showToast = true;
        setTimeout(() => { showToast = false; }, 2000);
    }

    function changeTheme() {
        if (!map) return;
        mapElement.style.backgroundColor = theme.bg;
        if (haloLayer) haloLayer.setStyle({ color: theme.halo });
        if (riverLayer) riverLayer.setStyle({ color: theme.river });
    }

    let searchQuery = "";
    let filteredStations = [];
    function handleSearch() {
        filteredStations = searchQuery.length < 2 ? [] : 
            metrodata.filter((s) => s.stop_name.toLowerCase().includes(searchQuery.toLowerCase())).slice(0, 5);
    }

    function zoomToStation(station) {
        map.flyTo([station.stop_lat, station.stop_lon], 15, { duration: 1.5 });
        const marker = markersMap.get(station.stop_name);
        if (marker) {
            document.querySelectorAll(".is-highlighted").forEach((el) => el.classList.remove("is-highlighted"));
            const el = marker.getElement()?.querySelector(".marker-visual");
            if (el) el.classList.add("is-highlighted");
            marker.openPopup();
        }
        searchQuery = "";
        filteredStations = [];
    }

    onMount(async () => {
        if (browser) {
            const [metroRes, geoRes] = await Promise.all([
                fetch("/stationsdata.json"),
                fetch("/map.geojson"),
            ]);
            metrodata = await metroRes.json();
            const geojsonData = await geoRes.json();
            leaflet = await import("leaflet");

            const lineColors = {};
            geojsonData.features.forEach((f) => {
                const name = f.properties.line_name || f.properties.name;
                if (name) lineColors[name] = f.properties.stroke;
            });

            map = leaflet.map(mapElement, {
                zoomControl: false,
                attributionControl: false,
                minZoom: 10
            }).setView([28.6139, 77.209], 11);

            // Zoom Listener to toggle labels
            map.on('zoomend', () => {
                const zoom = map.getZoom();
                const container = map.getContainer();
                zoom >= 13 ? container.classList.add('show-labels') : container.classList.remove('show-labels');
            });

            map.createPane("riverPane").style.zIndex = 300;
            map.createPane("halosPane").style.zIndex = 390;
            map.createPane("linesPane").style.zIndex = 400;
            map.createPane("stationsPane").style.zIndex = 450;

            // Minimalist Yamuna River
            const yamunaPath = [
                [28.87, 77.21], [28.82, 77.23], [28.75, 77.23], [28.70, 77.26], 
                [28.66, 77.28], [28.58, 77.30], [28.52, 77.32], [28.45, 77.33]
            ];
            riverLayer = leaflet.polyline(yamunaPath, {
                pane: "riverPane",
                color: theme.river,
                weight: 45,
                opacity: 0.5,
                lineCap: 'round',
                smoothFactor: 3
            }).addTo(map);

            haloLayer = leaflet.geoJSON(geojsonData, {
                pane: "halosPane",
                style: () => ({ color: theme.halo, weight: 12, opacity: 1, lineCap: "round" }),
            }).addTo(map);

            leaflet.geoJSON(geojsonData, {
                pane: "linesPane",
                style: (f) => ({
                    color: f.properties.stroke,
                    weight: 6,
                    opacity: 1,
                    lineCap: "round",
                    lineJoin: "round",
                }),
            }).addTo(map);

            metrodata.forEach((station, index) => {
                const isHub = station.connection && station.connection !== "null";
                const borderColor = lineColors[station.connection] || "#2c3e50";
                const isOffsetRight = index % 2 === 0;

                const stationIcon = leaflet.divIcon({
                    className: "transit-marker-wrapper",
                    html: `
                        <div class="marker-visual ${isHub ? "hub-pill" : "stop-dot"}" style="border-color: ${borderColor}"></div>
                        <span class="station-label ${isOffsetRight ? 'label-right' : 'label-left'}">
                            ${station.stop_name}
                        </span>
                    `,
                    iconSize: [20, 20],
                    iconAnchor: [10, 10],
                });

                const marker = leaflet.marker([station.stop_lat, station.stop_lon], {
                    icon: stationIcon,
                    pane: "stationsPane",
                }).addTo(map);

                marker.bindPopup(`
                    <div class="popup-container">
                        <strong>${station.stop_name}</strong>
                        <div class="popup-btns">
                            <button class="tobtn" onclick="window.updateto('${station.stop_name}')">To</button>
                            <button class="frombtn" onclick="window.updatefrom('${station.stop_name}')">From</button>
                        </div>
                    </div>
                `, { offset: [0, -5] });
                
                markersMap.set(station.stop_name, marker);
            });

            window.updateto = (val) => { toValue.set(val); triggerToast(`To: ${val}`); };
            window.updatefrom = (val) => { fromValue.set(val); triggerToast(`From: ${val}`); };
        }
    });

    onDestroy(() => { if (map) map.remove(); });
</script>

<svelte:head>
    <link rel="stylesheet" href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css" />
</svelte:head>

<main>
    <div class="ui-overlay">
        <div class="control-box">
            <input
                type="text"
                placeholder="Search station..."
                bind:value={searchQuery}
                on:input={handleSearch}
            />
            <select bind:value={currentThemeKey} on:change={changeTheme}>
                {#each Object.keys(themes) as t}
                    <option value={t}>{t.charAt(0).toUpperCase() + t.slice(1)}</option>
                {/each}
            </select>
        </div>

        {#if filteredStations.length > 0}
            <div class="results-dropdown">
                {#each filteredStations as s}
                    <button on:click={() => zoomToStation(s)}>{s.stop_name}</button>
                {/each}
            </div>
        {/if}
    </div>

    <div 
        bind:this={mapElement} 
        class="map-viewport" 
        style="background-color: {theme.bg}">
    </div>

    {#if showToast}
        <div class="toast-popup">{toastMessage}</div>
    {if}
</main>

<style>
    :global(body, html) {
        margin: 0;
        padding: 0;
        overflow: hidden;
        height: 100%;
        width: 100%;
        font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica;
    }

    .map-viewport {
        height: 100vh;
        width: 100vw;
        transition: background-color 0.5s ease;
    }

    /* Floating UI Controls */
    .ui-overlay {
        position: fixed;
        top: 20px;
        left: 50%;
        transform: translateX(-50%);
        z-index: 1000;
        width: 90%;
        max-width: 450px;
    }

    .control-box {
        display: flex;
        background: rgba(255, 255, 255, 0.85);
        backdrop-filter: blur(12px);
        padding: 6px;
        border-radius: 16px;
        box-shadow: 0 10px 25px rgba(0,0,0,0.1);
        border: 1px solid rgba(0,0,0,0.05);
    }

    input, select {
        border: none;
        background: transparent;
        padding: 10px 15px;
        outline: none;
        font-size: 14px;
        color: #333;
    }
    input { flex: 1; font-weight: 500; }
    select { border-left: 1px solid rgba(0,0,0,0.1); cursor: pointer; }

    .results-dropdown {
        background: white;
        margin-top: 8px;
        border-radius: 12px;
        box-shadow: 0 4px 15px rgba(0,0,0,0.1);
        overflow: hidden;
    }
    .results-dropdown button {
        width: 100%;
        padding: 12px 20px;
        border: none;
        background: none;
        text-align: left;
        cursor: pointer;
        font-size: 14px;
    }
    .results-dropdown button:hover { background: #f0f0f0; }

    /* Smart Labels System */
    :global(.transit-marker-wrapper) {
        display: flex;
        align-items: center;
        justify-content: center;
        pointer-events: none !important;
    }

    :global(.station-label) {
        position: absolute;
        font-size: 10px;
        font-weight: 700;
        color: var(--ui-color);
        text-shadow: 0 0 4px var(--bg-color), 0 0 2px var(--bg-color);
        white-space: nowrap;
        display: none; /* Hidden by default */
        letter-spacing: -0.2px;
    }

    /* Show labels only when map has 'show-labels' class (Zoom 13+) */
    :global(.show-labels .station-label) {
        display: block;
    }

    :global(.label-right) { left: 15px; text-align: left; }
    :global(.label-left) { right: 15px; text-align: right; }

    :global(.stop-dot) {
        width: 7px; height: 7px;
        background: white; border: 2px solid; border-radius: 50%;
    }
    :global(.hub-pill) {
        width: 14px; height: 8px;
        background: white; border: 2.5px solid; border-radius: 10px;
    }

    :global(.is-highlighted) {
        border-color: #ff4757 !important;
        transform: scale(2);
        animation: pulse 1.5s infinite;
        z-index: 999;
    }

    .toast-popup {
        position: fixed;
        bottom: 40px;
        left: 50%;
        transform: translateX(-50%);
        background: #2c3e50;
        color: white;
        padding: 10px 25px;
        border-radius: 50px;
        font-size: 13px;
        z-index: 10000;
        box-shadow: 0 5px 15px rgba(0,0,0,0.2);
    }

    @keyframes pulse {
        0% { box-shadow: 0 0 0 0 rgba(255, 71, 87, 0.7); }
        70% { box-shadow: 0 0 0 12px rgba(255, 71, 87, 0); }
        100% { box-shadow: 0 0 0 0 rgba(255, 71, 87, 0); }
    }
</style>
