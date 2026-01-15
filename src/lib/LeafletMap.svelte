<script>
    import { onMount, onDestroy } from "svelte";
    import { browser } from "$app/environment";
    import { toValue, fromValue } from "$lib/store.js";

    let mapElement;
    let map;
    let leaflet;
    let metrodata = [];
    let haloLayer;
    let markersMap = new Map();
    let toastMessage = "";
    let showToast = false;

    // Theme Configuration
    let currentThemeKey = "light";
    const themes = {
        // --- Original & Standard ---
        light: {
            bg: "#fdfdfd",
            halo: "#ffffff",
            ui: "#2c3e50",
            river: "#D4E6F1",
        },
        dark: {
            bg: "#121212",
            halo: "#121212",
            ui: "#ffffff",
            river: "#1B4F72",
        },
        slate: {
            bg: "#2c3e50",
            halo: "#2c3e50",
            ui: "#ffffff",
            river: "#243b4a",
        },
        black: {
            bg: "#000000",
            halo: "#000000",
            ui: "#ffffff",
            river: "#0a1a26",
        },

        // --- Minimalist & Design Focused ---
        nord: {
            bg: "#2E3440",
            halo: "#2E3440",
            ui: "#ECEFF4",
            river: "#3B4252",
        },
        paper: {
            bg: "#F4F1EA",
            halo: "#F4F1EA",
            ui: "#3B3B3B",
            river: "#C0D8E0",
        },
        midnight: {
            bg: "#0B0E14",
            halo: "#0B0E14",
            ui: "#5C6370",
            river: "#161B22",
        },

        // --- New Unique Themes ---
        ghost: {
            bg: "#E0E0E0",
            halo: "#E0E0E0",
            ui: "#1A1A1A",
            river: "#D0D0D0",
        }, // Ultimate minimal: virtually monochrome terrain

        dracula: {
            bg: "#282a36",
            halo: "#282a36",
            ui: "#f8f8f2",
            river: "#44475a",
        }, // Classic code-editor aesthetic

        emerald: {
            bg: "#061712",
            halo: "#061712",
            ui: "#D1FAE5",
            river: "#0D2A22",
        }, // Deep, dark forest green background

        oceanic: {
            bg: "#1c2a35",
            halo: "#1c2a35",
            ui: "#ecf0f1",
            river: "#2c3e50",
        }, // Deep sea blue-grey

        solarized: {
            bg: "#fdf6e3",
            halo: "#fdf6e3",
            ui: "#657b83",
            river: "#eee8d5",
        }, // Warm, eye-friendly cream

        crimson: {
            bg: "#1a0f0f",
            halo: "#1a0f0f",
            ui: "#ffcccb",
            river: "#2d1a1a",
        }, // Intense dark red-black

        matcha: {
            bg: "#f0f4f0",
            halo: "#f0f4f0",
            ui: "#2d3b2d",
            river: "#dce6dc",
        }, // Soft organic green

        obsidian: {
            bg: "#16161D",
            halo: "#16161D",
            ui: "#949494",
            river: "#21212B",
        }, // "Zencaster" style matte black

        sand: {
            bg: "#e6e2d3",
            halo: "#e6e2d3",
            ui: "#4b3832",
            river: "#c5c1b1",
        }, // Desert-inspired neutral

        nebula: {
            bg: "#100a1c",
            halo: "#100a1c",
            ui: "#e0d7f1",
            river: "#1a1329",
        }, // Deep purple space theme
    };

    $: theme = themes[currentThemeKey];

    function triggerToast(msg) {
        toastMessage = msg;
        showToast = true;
        setTimeout(() => {
            showToast = false;
        }, 2000);
    }

    function changeBackground() {
        if (!map) return;
        mapElement.style.backgroundColor = theme.bg;
        if (haloLayer) {
            haloLayer.setStyle({ color: theme.halo });
        }
    }

    let searchQuery = "";
    let filteredStations = [];
    function handleSearch() {
        filteredStations =
            searchQuery.length < 2
                ? []
                : metrodata
                      .filter((s) =>
                          s.stop_name
                              .toLowerCase()
                              .includes(searchQuery.toLowerCase()),
                      )
                      .slice(0, 5);
    }

    function zoomToStation(station) {
        map.flyTo([station.stop_lat, station.stop_lon], 16, { duration: 1.5 });
        const marker = markersMap.get(station.stop_name);
        if (marker) {
            document
                .querySelectorAll(".is-highlighted")
                .forEach((el) => el.classList.remove("is-highlighted"));
            marker
                .getElement()
                .querySelector("div")
                .classList.add("is-highlighted");
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

            map = leaflet
                .map(mapElement, {
                    zoomControl: false,
                    attributionControl: false,
                })
                .setView([28.6139, 77.209], 11);

            map.createPane("halosPane").style.zIndex = 390;
            map.createPane("linesPane").style.zIndex = 400;
            map.createPane("stationsPane").style.zIndex = 450;

            haloLayer = leaflet
                .geoJSON(geojsonData, {
                    pane: "halosPane",
                    style: () => ({
                        color: theme.halo,
                        weight: 12,
                        opacity: 1,
                        lineCap: "round",
                    }),
                })
                .addTo(map);

            leaflet
                .geoJSON(geojsonData, {
                    pane: "linesPane",
                    style: (f) => ({
                        color: f.properties.stroke,
                        weight: 7,
                        opacity: 1,
                        lineCap: "round",
                        lineJoin: "round",
                    }),
                })
                .addTo(map);

            metrodata.forEach((station) => {
                const isHub =
                    station.connection && station.connection !== "null";
                const borderColor = lineColors[station.connection] || "#2c3e50";

                const stationIcon = leaflet.divIcon({
                    className: "transit-marker-container",
                    html: `<div class="${isHub ? "hub-pill" : "stop-dot"}" style="border-color: ${borderColor}"></div>`,
                    iconSize: isHub ? [24, 12] : [10, 10],
                    iconAnchor: isHub ? [12, 6] : [5, 5],
                });

                const marker = leaflet
                    .marker([station.stop_lat, station.stop_lon], {
                        icon: stationIcon,
                        pane: "stationsPane",
                    })
                    .addTo(map);

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

            // Global System Hooks
            window.updateto = (val) => {
                toValue.set(val);
                triggerToast(`Added ${val} as destination`);
            };
            window.updatefrom = (val) => {
                fromValue.set(val);
                triggerToast(`Added ${val} as starting point`);
            };
        }
    });

    onDestroy(() => {
        if (map) map.remove();
    });
</script>

<svelte:head>
    <link
        rel="stylesheet"
        href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css"
    />
</svelte:head>

<main>
    <div class="header-controls">
        <input
            type="text"
            placeholder="Search..."
            bind:value={searchQuery}
            on:input={handleSearch}
        />
        <select bind:value={currentThemeKey} on:change={changeBackground}>
            <optgroup label="Standard">
                <option value="light">Light</option>
                <option value="dark">Dark</option>
                <option value="slate">Slate</option>
                <option value="black">Pure Black</option>
            </optgroup>
            <optgroup label="Designer">
                <option value="nord">Nord</option>
                <option value="paper">Paper</option>
                <option value="ghost">Ghost (Ultra-Min)</option>
                <option value="solarized">Solarized</option>
            </optgroup>
            <optgroup label="Dark Themes">
                <option value="midnight">Midnight</option>
                <option value="dracula">Dracula</option>
                <option value="emerald">Emerald</option>
                <option value="oceanic">Oceanic</option>
                <option value="crimson">Crimson</option>
                <option value="obsidian">Obsidian</option>
                <option value="nebula">Nebula</option>
            </optgroup>
            <optgroup label="Soft Themes">
                <option value="matcha">Matcha</option>
                <option value="sand">Sand</option>
            </optgroup>
        </select>
    </div>

    {#if filteredStations.length > 0}
        <div class="search-results">
            {#each filteredStations as s}
                <button on:click={() => zoomToStation(s)}>{s.stop_name}</button>
            {/each}
        </div>
    {/if}

    <div class="map-wrapper">
        <div
            bind:this={mapElement}
            class="map-container"
            style="background-color: {theme.bg}"
        ></div>

        {#if showToast}
            <div class="toast">{toastMessage}</div>
        {/if}
    </div>
</main>

<style>
    .header-controls {
        display: flex;
        gap: 10px;
        margin: 15px;
        z-index: 1001;
    }
    input,
    select {
        padding: 10px;
        border-radius: 8px;
        border: 1px solid #ddd;
        font-size: 14px;
    }
    input {
        flex-grow: 1;
    }

    .search-results {
        position: absolute;
        left: 15px;
        right: 15px;
        background: white;
        border-radius: 8px;
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
        z-index: 2000;
        margin-top: -10px;
    }
    .search-results button {
        display: block;
        width: 100%;
        padding: 10px;
        text-align: left;
        border: none;
        background: none;
        cursor: pointer;
    }

    .map-wrapper {
        position: relative;
        margin: 15px;
        margin-top: 0;
    }
    .map-container {
        height: 500px;
        border-radius: 12px;
        overflow: hidden;
        transition: background-color 0.4s ease;
    }

    .toast {
        position: absolute;
        bottom: 20px;
        left: 50%;
        transform: translateX(-50%);
        background: #2c3e50;
        color: white;
        padding: 8px 20px;
        border-radius: 20px;
        font-size: 12px;
        z-index: 3000;
        box-shadow: 0 4px 10px rgba(0, 0, 0, 0.3);
    }

    /* Vector Markers */
    :global(.transit-marker-container) {
        display: flex;
        align-items: center;
        justify-content: center;
    }
    :global(.stop-dot) {
        width: 8px;
        height: 8px;
        background: white;
        border: 2.5px solid;
        border-radius: 50%;
    }
    :global(.hub-pill) {
        width: 15px;
        height: 9.5px;
        background: white;
        border: 3px solid;
        border-radius: 12px;
    }

    :global(.is-highlighted) {
        border-color: #ff4757 !important;
        transform: scale(1.6);
        animation: pulse 1.5s infinite;
    }

    @keyframes pulse {
        0% {
            box-shadow: 0 0 0 0 rgba(255, 71, 87, 0.7);
        }
        70% {
            box-shadow: 0 0 0 10px rgba(255, 71, 87, 0);
        }
        100% {
            box-shadow: 0 0 0 0 rgba(255, 71, 87, 0);
        }
    }

    :global(.popup-btns) {
        display: flex;
        gap: 8px;
        margin-top: 10px;
        justify-content: center;
    }
    :global(.tobtn, .frombtn) {
        padding: 5px 12px;
        border: none;
        border-radius: 6px;
        background: #2c3e50;
        color: white;
        cursor: pointer;
        font-size: 11px;
        font-weight: bold;
    }
</style>
