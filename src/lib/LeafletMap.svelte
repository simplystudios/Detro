<script>
    import { onMount, onDestroy } from "svelte";
    import { browser } from "$app/environment";
    import { toValue, fromValue } from "$lib/store.js";

    let mapElement;
    let map;
  
    let metrodata;
    let markers = []; // Array to store markers
    export const jsonTree = {};

    function updateto(val) {
        toValue.set(val);
    }

    function updatefrom(val) {
        fromValue.set(val);
    }

    onMount(async () => {
        if (browser) {
            // Fetch metrodata
            metrodata = await fetch("/stationsdata.json");
            metrodata = await metrodata.json();
            console.log(metrodata);

            // Dynamically import Leaflet
            const leaflet = await import("leaflet");

            // Initialize the map using the leaflet variable (not L)
            map = leaflet.map(mapElement).setView([28.6139, 77.209], 11);

            // Tile Layer
            // const tileLayer = leaflet
            //     .tileLayer("", {
            //         attribution:
            //             '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>',
            //         minZoom: 0,
            //         maxZoom: 20,
            //         token: "07fc4acf-0c71-4dda-aa8a-90fe9fa064b9",
            //         ext: "png",
            //     })
            //     .addTo(map);

            // Custom Icon
            var greenIcon = leaflet.icon({
                iconUrl: "station.png",
                iconAnchor: [22, 94], // point of the icon which will correspond to marker's location
                iconSize: [38, 95], // size of the icon
                popupAnchor: [-3, -76], // point from which the popup should open relative to the iconAnchor
            });

            // Loop through metrodata to add markers and their event handlers
            metrodata.forEach((station, i) => {
                const marker = leaflet
                    .circle([station.stop_lat, station.stop_lon], 300, {
                        icon: greenIcon,
                    })
                    .addTo(map).bindPopup(`
            <div>${station.stop_name}</div>
            <button class="tobutton">Add To</button>
            <button class="frombutton">Add From</button>
          `);

                // Add event listeners for "Add To" and "Add From" buttons
                marker.on("popupopen", () => {
                    // Event listeners inside popup
                    document
                        .querySelector(".tobutton")
                        .addEventListener("click", () => {
                            updateto(station.stop_name);
                            console.log("To Station:", station.stop_name);
                        });

                    document
                        .querySelector(".frombutton")
                        .addEventListener("click", () => {
                            updatefrom(station.stop_name);
                            console.log("From Station:", station.stop_name);
                        });
                });

                markers.push(marker); // Add marker to the markers array
            });

            // Fetch and display GeoJSON
            fetch("/map.geojson")
                .then((response) => response.json())
                .then((geojsonData) => {
                    leaflet
                        .geoJSON(geojsonData, {
                            style: (feature) => ({
                                color: feature.properties.stroke || "yellow",
                                fillColor: feature.properties.fill || "yellow",
                                opacity:
                                    feature.properties.strokeOpacity || 1.0,
                                fillOpacity:
                                    feature.properties.fillOpacity || 0.5,
                            }),
                        })
                        .addTo(map);
                })
                .catch((error) =>
                    console.error("Error fetching GeoJSON:", error),
                );
        }
    });

    onDestroy(() => {
        if (map) {
            console.log("Unloading Leaflet map.");
            map.remove();
        }
    });
</script>

<svelte:head>
    <script src="/script.js"></script>
</svelte:head>

<main>
    <div bind:this={mapElement}></div>
</main>

<style>
    @import "leaflet/dist/leaflet.css";
    main div {
        height: 500px;
        background-color: #f5f7fa;
        border: 2px black;
    }

    @media only screen and (max-width: 600px) {
        main div {
            height: 400px;
        }
    }
</style>
