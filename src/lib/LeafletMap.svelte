<script>
    import { onMount, onDestroy } from 'svelte';
    import { browser } from '$app/environment';
    import { writable } from 'svelte/store';

    let mapElement;
    let map;
    let to;
    let from;
    let lat;
    let long;
    let data;
    let props;
    export const jsonTree = {};
    let metrodata;
    let markers = []; // Array to store markers

    onMount(async () => {

         if (browser) {

    //          if (typeof window !== 'undefined') {
    //     const successCallback = (position) => {
    //         console.log(position);
    //         data = position.coords;
    //         lat = data.latitude;
    //         long = data.longitude;
    //         console.log(lat, long);
    //     };

    //     const errorCallback = (error) => {
    //         console.log(error);
    //     };

    //     navigator.geolocation.getCurrentPosition(successCallback, errorCallback);
    // }

            metrodata = await fetch('/stationsdata.json')
            metrodata = await metrodata.json()
            console.log(metrodata);
            const leaflet = await import('leaflet');

            map = leaflet.map(mapElement).setView([22, 23], 13);


             var Stadia_AlidadeSmooth = L.tileLayer('https://tiles-eu.stadiamaps.com/tiles/alidade_smooth/{z}/{x}/{y}{r}.png', {
	minZoom: 0,
	maxZoom: 20,
    token: "07fc4acf-0c71-4dda-aa8a-90fe9fa064b9",
	attribution: '&copy; <a href="https://www.stadiamaps.com/" target="_blank">Stadia Maps</a> &copy; <a href="https://openmaptiles.org/" target="_blank">OpenMapTiles</a>  &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
	ext: 'png'
}).addTo(map)
            
            function style(feature) {
    return {
        color: feature.properties.stroke || 'yellow', // Default color if stroke color not provided
        fillColor: feature.properties.fill || 'yellow', // Default color if fill color not provided
        opacity: feature.properties.strokeOpacity || 1.0, // Default opacity if stroke opacity not provided
        fillOpacity: feature.properties.fillOpacity || 0.5 // Default opacity if fill opacity not provided
    };
}

    
        var greenIcon = L.icon({
    iconUrl: 'station.png',
    iconAnchor:   [22, 94], // point of the icon which will correspond to marker's location
    iconSize:  [38, 95], // size of the icon
    popupAnchor:  [-3, -76] // point from which the popup should open relative to the iconAnchor
    
});
            

 for (let i = 0; i < metrodata.length - 1; i++) {
                function tostationadd() {
                    to = metrodata[i].stop_name;
                    console.log(tr);
                }

                function fromstationadd() {
                    from = metrodata[i].stop_name;
                    console.log(fr);
                }

                leaflet.circle([metrodata[i].stop_lat, metrodata[i].stop_lon], 300, {icon: greenIcon}).addTo(map).bindPopup('<div>' + metrodata[i].stop_name + '</div><button id="tobutton">Add To</button> <button id="frombutton">Add From</button>')
                    .openPopup();

                // Add event listeners after the popup is open
                document.getElementById("tobutton").addEventListener("click", tostationadd);
                document.getElementById("frombutton").addEventListener("click", fromstationadd);

                // leaflet.polyline([startPoint, endPoint], {color: 'blue'}).addTo(map);
            }

            fetch('/map.geojson')
  .then(response => response.json())
  .then(geojsonData => {
    // Add GeoJSON layer to the map

    // Iterate through each feature to access its properties
      // Add properties to the JSON tree with the feature's index or id as key
      
    L.geoJSON(geojsonData,{
    style: style
}).addTo(map);
  })
  .catch(error => console.error('Error fetching GeoJSON:', error));

            
        }
    });


    onDestroy(async () => {
        if (map) {
            console.log('Unloading Leaflet map.');
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
    @import 'leaflet/dist/leaflet.css';
    main div {
        height: 500px;
    }

    @media only screen and (max-width: 600px) {
        main div {
            height: 400px;
        }
    }
</style>
