<script>
    import { onMount, onDestroy } from "svelte";
    import { browser } from "$app/environment";
    import { toValue, fromValue } from "$lib/store.js";

    let mapElement;
    let map;
    let leaflet;
    let metrodata = [];
    let haloLayer;
    let riverLayer; // New layer for Yamuna
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

    function triggerToast(msg) {
        toastMessage = msg;
        showToast = true;
        setTimeout(() => { showToast = false; }, 2000);
    }

    function changeBackground() {
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
        map.flyTo([station.stop_lat, station.stop_lon], 16, { duration: 1.5 });
        const marker = markersMap.get(station.stop_name);
        if (marker) {
            document.querySelectorAll(".is-highlighted").forEach((el) => el.classList.remove("is-highlighted"));
            marker.getElement().querySelector(".marker-visual").classList.add("is-highlighted");
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
                maxBounds: [[28.2, 76.8], [28.9, 77.6]],
                minZoom: 10
            }).setView([28.6139, 77.209], 11);

            map.createPane("riverPane").style.zIndex = 300;
            map.createPane("halosPane").style.zIndex = 390;
            map.createPane("linesPane").style.zIndex = 400;
            map.createPane("stationsPane").style.zIndex = 450;

            // Simple Yamuna Representation
            const yamunaCoords = [
                [28.85, 77.2], [28.75, 77.23], [28.7, 77.26], [28.65, 77.27], 
                [28.6, 77.28], [28.55, 77.3], [28.45, 77.32], [28.3, 77.35]
            ];
            riverLayer = leaflet.polyline(yamunaCoords, {
                pane: "riverPane",
                color: theme.river,
                weight: 40,
                opacity: 0.6,
                lineCap: 'round',
                smoothFactor: 5
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

            metrodata.forEach((station) => {
                const isHub = station.connection && station.connection !== "null";
                const borderColor = lineColors[station.connection] || "#2c3e50";

                const stationIcon = leaflet.divIcon({
                    className: "transit-marker-wrapper",
                    html: `
                        <div class="marker-visual ${isHub ? "hub-pill" : "stop-dot"}" style="border-color: ${borderColor}"></div>
                        <span class="station-label">${station.stop_name}</span>
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
                `);
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
        <div class="search-bar">
            <input
                type="text"
                placeholder="Search Metro Station..."
                bind:value={searchQuery}
                on:input={handleSearch}
                style="color: {theme.ui}"
            />
            <select bind:value={currentThemeKey} on:change={changeBackground}>
                <option value="light">Light</option>
                <option value="dark">Dark</option>
                <option value="slate">Slate</option>
                <option value="nord">Nord</option>
                <option value="paper">Paper</option>
                <option value="dracula">Dracula</option>
                <option value="matcha">Matcha</option>
            </select>
        </div>

        {#if filteredStations.length > 0}
            <div class="search-results">
                {#each filteredStations as s}
                    <button on:click={() => zoomToStation(s)}>{s.stop_name}</button>
                {/each}
            </div>
        {/if}
    </div>

    <div 
        bind:this={mapElement} 
        class="full-map" 
        style="background-color: {theme.bg}">
    </div>

    {#if showToast}
        <div class="toast">{toastMessage}</div>
    {/if}
</main>

<style>
    :global(body, html) {
        margin: 0;
        padding: 0;
        overflow: hidden;
        font-family: 'Inter', sans-serif;
    }

    .full-map {
        height: 100vh;
        width: 100vw;
        z-index: 1;
    }

    /* Floating UI */
    .ui-overlay {
        position: fixed;
        top: 20px;
        left: 50%;
        transform: translateX(-50%);
        z-index: 1000;
        width: 90%;
        max-width: 500px;
    }

    .search-bar {
        display: flex;
        gap: 10px;
        background: rgba(255, 255, 255, 0.9);
        backdrop-filter: blur(10px);
        padding: 8px;
        border-radius: 14px;
        box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
    }

    input, select {
        border: none;
        background: transparent;
        padding: 10px;
        outline: none;
    }
    input { flex: 1; font-weight: 500; }

    .search-results {
        background: white;
        margin-top: 8px;
        border-radius: 12px;
        overflow: hidden;
        box-shadow: 0 4px 20px rgba(0,0,0,0.15);
    }
    .search-results button {
        width: 100%;
        padding: 12px;
        border: none;
        background: none;
        text-align: left;
        cursor: pointer;
        border-bottom: 1px solid #eee;
    }
    .search-results button:hover { background: #f8f9fa; }

    /* Station Labels */
    :global(.transit-marker-wrapper) {
        display: flex;
        flex-direction: column;
        align-items: center;
        text-align: center;
        pointer-events: none !important;
    }
    :global(.station-label) {
        font-size: 9px;
        font-weight: 600;
        color: #555;
        text-shadow: 0 0 3px white;
        margin-top: 4px;
        white-space: nowrap;
        opacity: 0.8;
    }
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
        transform: scale(1.8);
        animation: pulse 1.5s infinite;
    }

    .toast {
        position: fixed;
        bottom: 30px;
        left: 50%;
        transform: translateX(-50%);
        background: #333;
        color: white;
        padding: 10px 24px;
        border-radius: 30px;
        z-index: 2000;
        font-size: 13px;
    }

    @keyframes pulse {
        0% { box-shadow: 0 0 0 0 rgba(255, 71, 87, 0.7); }
        70% { box-shadow: 0 0 0 10px rgba(255, 71, 87, 0); }
        100% { box-shadow: 0 0 0 0 rgba(255, 71, 87, 0); }
    }
</style>
