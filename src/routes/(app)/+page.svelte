<script>
    import LeafletMap from "$lib/LeafletMap.svelte";
    import { onMount } from "svelte";
    import Autocomplete from "@smui-extra/autocomplete";
    import SchematicRoute from "$lib/SchematicRoute.svelte";

    import Snackbar, { Actions } from "@smui/snackbar";
    import Textfield from "@smui/textfield";
    import Card, {
        Content,
        PrimaryAction,
        ActionButtons,
        ActionIcons,
    } from "@smui/card";
    import Button, { Label } from "@smui/button";
    import IconButton, { Icon } from "@smui/icon-button";
    import html2canvas from "html2canvas"; // Import html2canvas library
    import { get } from "svelte/store";

    async function saveScreenshot() {
        const captureElement = document.getElementById("capture"); // Get the element to capture
        const canvas = await html2canvas(captureElement); // Capture the element as a canvas
        const dataURL = canvas.toDataURL(); // Convert canvas to data URL
        const link = document.createElement("a"); // Create a new anchor tag
        link.download = "screenshot.png"; // Set the download attribute to specify the filename
        link.href = dataURL; // Set the href attribute to the data URL
        document.body.appendChild(link); // Append the anchor tag to the document body
        link.click(); // Simulate a click on the anchor tag to trigger the download
        document.body.removeChild(link); // Remove the anchor tag from the document body
    }
    let stations = [
        "Dilshad Garden",
        "Jhilmil",
        "Mansrover park",
        "Shahdara",
        "Welcome",
        "Seelam Pur",
        "Shastri Park",
        "Kashmere Gate",
        "Tis Hazari",
        "Pul Bangash",
        "Pratap Nagar",
        "Shastri Nagar",
        "Inderlok",
        "Kanhaiya Nagar",
        "Keshav Puram",
        "Netaji Subash Place",
        "Kohat Enclave",
        "Pitampura",
        "Rohini East",
        "Rohini West",
        "Rithala",
        "Mundka",
        "Rajdhani Park",
        "Nangloi Railway Station",
        "Nangloi",
        "Maharaja Surajmal Stadium",
        "Udyog Nagar",
        "Peera Garhi",
        "Paschim Vihar (West)",
        "Paschim Vihar (East)",
        "Madipur",
        "Shivaji Park",
        "Punjabi Bagh",
        "Ashok Park Main",
        "Satguru Ram Singh Marg",
        "Samaypur Badli",
        "Rohini Sector 18-19",
        "Haiderpur Badli Mor",
        "Jahangirpuri",
        "Adarsh Nagar",
        "Azadpur",
        "Model Town",
        "Guru Tegh Bahadur Nagar",
        "Vishwavidyalaya",
        "Vidhan Sabha",
        "Civil Lines",
        "Chandni Chowk",
        "Chawri Bazar",
        "New Delhi",
        "Rajiv Chowk",
        "Patel Chowk",
        "Central Secretariat",
        "Udyog Bhawan",
        "Lok Kalyan Marg",
        "Jorbagh",
        "Dilli Haat - INA",
        "AIIMS",
        "Green Park",
        "Hauz Khas",
        "Malviya Nagar",
        "Saket",
        "Qutab Minar",
        "Chhattarpur",
        "Sultanpur",
        "Ghitorni",
        "Arjan Garh",
        "Gurudronacharya",
        "Sikanderpur",
        "MG Road",
        "IFFCO Chowk",
        "Huda City Centre",
        "Vaishali",
        "Kaushambi",
        "Anand Vihar",
        "Karkarduma",
        "Preet Vihar",
        "Nirman Vihar",
        "Laxmi Nagar",
        "Noida City Centre",
        "Golf Course",
        "Botanical Garden",
        "Noida Sec -18",
        "Noida Sec -16",
        "Noida Sec -15",
        "New Ashok Nagar",
        "Mayur Vihar Ext",
        "Mayur Vihar-I",
        "Akshardham",
        "Yamuna Bank",
        "Indraprastha",
        "Supreme Court",
        "Mandi House",
        "Barakhamba",
        "RK Ashram Marg",
        "Jhandewalan",
        "Karol Bagh",
        "Rajendra Place",
        "Patel Nagar",
        "Shadipur",
        "Kirti Nagar",
        "Moti Nagar",
        "Ramesh Nagar",
        "Rajouri Garden",
        "Tagore Garden",
        "Subash Nagar",
        "Tilak Nagar",
        "Janak Puri East",
        "Janak Puri West",
        "Uttam Nagar East",
        "Uttam Nagar West",
        "Nawada",
        "Dwarka Mor",
        "Dwarka",
        "Dwarka Sector - 14",
        "Dwarka Sector - 13",
        "Dwarka Sector - 12",
        "Dwarka Sector - 11",
        "Dwarka Sector - 10",
        "Dwarka Sector - 9",
        "Dwarka Sector - 8",
        "Dwarka Sector - 21",
        "ITO",
        "Janpath",
        "Khan Market",
        "Jawahar Lal Nehru Stadium",
        "Jangpura",
        "Lajpat Nagar",
        "Moolchand",
        "Kailash Colony",
        "Nehru Place",
        "Kalkaji Mandir",
        "Govind Puri",
        "Harkesh Nagar Okhla",
        "Jasola-Apollo",
        "Sarita Vihar",
        "Mohan Estate",
        "Tughlakabad Station",
        "Badarpur Border",
        "Sarai",
        "NHPC Chowk",
        "Mewala Maharajpur",
        "Sector-28",
        "Badkal Mor",
        "Old Faridabad",
        "Neelam Chowk Ajronda",
        "Bata Chowk",
        "Escorts Mujesar",
        "Sikanderpur (Rapid Metro)",
        "Phase 2 (Rapid Metro)",
        "Belvedere Towers (Rapid Metro)",
        "Cyber City (Rapid Metro)",
        "Moulsari Avenue (Rapid Metro)",
        "Phase 3 (Rapid Metro)",
        "IGI Airport",
        "Delhi Aerocity",
        "Dhaula Kuan",
        "Shivaji Stadium",
        "Delhi Gate",
        "Jama Masjid",
        "Lal Quila",
        "Okhla Bird Sanctuary",
        "Kalindi Kunj",
        "Jasola Vihar Shaheen Bagh",
        "Okhla Vihar",
        "Jamia Millia Islamia",
        "Sukhdev Vihar",
        "Okhla NSIC",
        "Phase-I (Rapid Metro)",
        "Sector 42-43 (Rapid Metro)",
        "Sector 53-54 (Rapid Metro)",
        "Sector 54 Chowk (Rapid Metro)",
        "Sector 55-56 (Rapid Metro)",
        "Majlis Park",
        "Shalimar Bagh",
        "Shakurpur",
        "Punjabi Bagh West",
        "ESI Basai Darapur",
        "Mayapuri",
        "Naraina Vihar",
        "Delhi Cantt.",
        "Durgabai Deshmukh South Campus",
        "Nehru Enclave",
        "Greater Kailash",
        "Chirag Delhi",
        "Panchsheel Park",
        "IIT",
        "RK Puram",
        "Munirka",
        "Vasant Vihar",
        "Shankar Vihar",
        "Terminal 1- IGI Airport",
        "Sadar Bazar Contonment",
        "Palam",
        "Dashrath Puri",
        "Dabri Mor - Janakpuri South",
        "Mundka Industrial Area (M.I.A)",
        "Ghevra Metro station",
        "Tikri Kalan",
        "Tikri Border",
        "Pandit Shree Ram Sharma",
        "Bahadurgarh City",
        "Brigadier Hoshiyar Singh",
        "Sir Vishweshwaraiah Moti Bagh",
        "Bhikaji Cama Place",
        "Sarojini Nagar",
        "South Extension",
        "Trilokpuri Sanjay Lake",
        "East Vinod Nagar - Mayur Vihar-II",
        "Mandawali - West Vinod Nagar",
        "IP Extension",
        "Karkarduma Court",
        "Krishna Nagar",
        "East Azad Nagar",
        "Jafrabad",
        "Maujpur - Babarpur",
        "Gokulpuri",
        "Johri Enclave",
        "Shiv Vihar",
        "Sant Surdas (Sihi)",
        "Raja Nahar Singh",
        "Vinobapuri",
        "Ashram",
        "Sarai Kale Khan - Nizamuddin",
        "Mayur Vihar Pocket 1",
        "Shaheed Sthal (New Bus Adda)",
        "Hindon River",
        "Arthala",
        "Mohan Nagar",
        "Shyam Park",
        "Major Mohit Sharma Rajender Nagar",
        "Raj Bagh",
        "Shaheed Nagar",
        "Noida Sec-34",
        "Noida Sec-52",
        "Noida Sec-61",
        "Noida Sec-59",
        "Noida Sec-62",
        "Noida Electronic City",
        "Nangli",
        "Najafgarh",
        "Dhansa Bus Stand",
        "Noida Sector 51",
        "Noida Sector 50",
        "Noida Sector 76",
        "Noida Sector 101",
        "Noida Sector 81",
        "NSEZ",
        "Noida Sector 83",
        "Noida Sector 137",
        "Noida Sector 142",
        "Noida Sector 143",
        "Noida Sector 144",
        "Noida Sector 145",
        "Noida Sector 146",
        "Noida Sector 147",
        "Noida Sector 148",
        "Knowledge Park",
        "Pari Chowk",
        "Alpha 1",
        "Delta 1",
        "GNIDA Office",
        "Depot Station",
    ];

    /* extract only names if needed elsewhere */
    $: routeStations = route.map((r) => r.station);

    function hasTransfers() {
        return route.some((r) => r.isTransfer);
    }
    let fromd;
    let routecss = "display:block";
    let routenofoundcss = "display:none";
    let linefrom;
    let ballstationcssto;
    let ballstationcssfrom;
    let toconnection;
    let nearyear;
    let fromconnection;
    let lineto;
    let rawroute = {};
    let frome;
    let latitude;
    let longitude;
    let tod;
    let toe;
    export let to = "";
    export let from = "";
    let lines = [];
    let linedata;
    let metrod;
    let distancebw;
    let i = -1;
    let textOutlined = "";
    let data = [];
    let distance = "Search to get the distance...";
    let snackbarWithoutClose = Snackbar;
    let route = [];
    let ifstationfound = false;
    let nearestStation;
    let minDistance;

    function listStationsOnRoute(routeSteps) {
        return routeSteps.map((step) => step.station);
    }

    function visualizeRoute(route) {
        let routeString = "Route:\n";
        route.forEach((station, index) => {
            if (index !== route.length - 1) {
                routeString += station.station + " -> ";
            } else {
                routeString += station;
            }
        });
        return routeString;
    }

    function getUserLocation() {
        console.log("Getting user location...");
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(showPosition, showError);
        } else {
            console.log("Geolocation not supported by browser.");
        }
    }

    function haversine(lat1, lon1, lat2, lon2) {
        const toRad = (value) => (value * Math.PI) / 180;
        const R = 6371; // Radius of the Earth in kilometers

        const dLat = toRad(lat2 - lat1);
        const dLon = toRad(lon2 - lon1);

        const a =
            Math.sin(dLat / 2) * Math.sin(dLat / 2) +
            Math.cos(toRad(lat1)) *
                Math.cos(toRad(lat2)) *
                Math.sin(dLon / 2) *
                Math.sin(dLon / 2);

        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        const distance = R * c;

        return distance; // Distance in kilometers
    }

    function findNearestMetroStation(userLat, userLon, stationList) {
        nearestStation = null;
        minDistance = Infinity;

        stationList.forEach((station) => {
            const stationLat = parseFloat(station.stop_lat);
            const stationLon = parseFloat(station.stop_lon);
            const distance = haversine(
                userLat,
                userLon,
                stationLat,
                stationLon,
            );
            console.log(`Station: ${station.stop_name}, Distance: ${distance}`);
            if (distance < minDistance) {
                minDistance = distance;
                nearestStation = station;
                let date = nearestStation.stop_date;
                nearyear = date.split("-")[0];
                console.log(nearyear); // Output: 2002
            }
        });

        console.log(
            "Nearest station:",
            nearestStation,
            "distance:",
            minDistance,
        );
        ifstationfound = true;
        return { nearestStation, minDistance };
    }

    function showPosition(position) {
        latitude = position.coords.latitude;
        longitude = position.coords.longitude;
        console.log("User position:", latitude, longitude);
        const result = findNearestMetroStation(latitude, longitude, data);
        nearestStation = result.nearestStation;
        minDistance = result.minDistance;
        if (nearestStation) {
            console.log("Nearest metro station:", nearestStation.stop_id);
        } else {
            console.log("Nearest metro station not found.");
            alert(
                "We are unable to get your location or having some issues...",
            );
        }
    }

    function showError(error) {
        console.log("Geolocation error code:", error.code);
        switch (error.code) {
            case error.PERMISSION_DENIED:
                console.log("User denied the request for Geolocation.");
                break;
            case error.POSITION_UNAVAILABLE:
                alert("Location information is unavailable.");
                console.log("Location information is unavailable.");
                break;
            case error.TIMEOUT:
                alert("The request to get user location timed out.");
                console.log("The request to get user location timed out.");
                break;
            case error.UNKNOWN_ERROR:
                alert("An unknown error occurred.");
                console.log("An unknown error occurred.");
                break;
        }
    }

    function openuberlink() {
        generateUberDeepLink(nearestStation.stop_lat, nearestStation.stop_lon);
    }

    function googlemapslink() {
        window.open(
            `https://www.google.com/maps?saddr=My+Location&daddr=${nearestStation.stop_name} metro station`,
        );
    }

    function generateUberDeepLink(lat, lon) {
        console.log("Nearest station:", nearestStation.stop_name);
        console.log(
            `https://m.uber.com/ul/?action=setPickup&pickup[latitude]=${latitude}&pickup[longitude]=${longitude}&dropoff[latitude]=${lat}&dropoff[longitude]=${lon}`,
        );
        window.open(
            `https://m.uber.com/ul/?action=setPickup&pickup[latitude]=${latitude}&pickup[longitude]=${longitude}&dropoff[latitude]=${lat}&dropoff[longitude]=${lon}`,
        );
    }

    onMount(async () => {
        try {
            metrod = await fetch("/stationsdata.json");
            if (!metrod.ok) throw new Error("Failed to fetch station data");
            data = await metrod.json();
            console.log("Station data:", data);

            getUserLocation();

            linedata = await fetch("/lines.json");
            if (!linedata.ok) throw new Error("Failed to fetch line data");
            linedata = await linedata.json();
            lines = linedata;
            console.log("Line data:", linedata);
        } catch (error) {
            console.error("Error fetching data:", error);
        }
    });

    function organizeStations(stationsData) {
        const stationsByLine = {};

        stationsData.forEach((station) => {
            const line = station.Line;
            if (!stationsByLine[line]) {
                stationsByLine[line] = [];
            }
            stationsByLine[line].push(station);
        });

        return stationsByLine;
    }

    // function findRoute(startStation, endStation, stationsByLine) {
    //     for (const line in stationsByLine) {
    //         const stationsOnLine = stationsByLine[line];
    //         const startIndex = stationsOnLine.findIndex(
    //             (station) => station.stop_name === startStation,
    //         );
    //         const endIndex = stationsOnLine.findIndex(
    //             (station) => station.stop_name === endStation,
    //         );

    //         if (startIndex !== -1 && endIndex !== -1) {
    //             const route =
    //                 startIndex < endIndex
    //                     ? stationsOnLine.slice(startIndex, endIndex + 1)
    //                     : stationsOnLine
    //                           .slice(endIndex, startIndex + 1)
    //                           .reverse();
    //             return route.map((station) => station.stop_name);
    //         }
    //     }
    //     return null; // No route found
    // }

    function findTransferStations(route, segmentLines) {
        const transfers = [];

        for (let i = 1; i < segmentLines.length; i++) {
            const prev = segmentLines[i - 1];
            const curr = segmentLines[i];

            if (prev && curr && prev !== curr && prev !== "INTERCHANGE") {
                transfers.push(route[i]);
            }
        }

        return transfers;
    }

    let distancebwstations = async () => {
        let foundFrom = false;
        let foundTo = false;

        try {
            const res = await fetch(
                `/api/metroroute?from=${encodeURIComponent(from)}&to=${encodeURIComponent(to)}`,
            );
            const result = await res.json();

            if (!res.ok || !result.route || result.route.length === 0) {
                routenofoundcss = "display:block";
                routecss = "display:none";
                console.log("No route found");
                return;
            }

            // ---- ROUTE FOUND ----
            routenofoundcss = "display:none";
            routecss = "display:block";
            rawroute = result;
            console.log(rawroute);
            route = result.route; // 👈 structured route
            console.log("Route found:", route);

            // 🔁 list stations visually
            listStationsOnRoute(route);

            /* ---------- FROM STATION ---------- */

            for (let station in data) {
                if (data[station].stop_name === from) {
                    fromd = data[station].distance;
                    linefrom = data[station].Line;

                    for (let o = 0; o < lines.length; o++) {
                        if (
                            lines[o].name.toLowerCase() ===
                            linefrom.toLowerCase()
                        ) {
                            ballstationcssfrom = `
                                background-color: ${lines[o].stroke};
                                border: 1px;
                                width: 10px;
                                height: 10px;
                                border-radius: 90%;
                                margin-top: 22px;
                                margin-right: 10px;
                            `;
                            break;
                        }
                    }

                    frome = data[station].stop_layout;
                    fromconnection = data[station].connection;
                    foundFrom = true;
                    break;
                }
            }

            /* ---------- TO STATION ---------- */

            for (let p in data) {
                if (data[p].stop_name === to) {
                    tod = data[p].distance;
                    lineto = data[p].Line;

                    for (let i = 0; i < lines.length; i++) {
                        if (
                            lines[i].name.toLowerCase() === lineto.toLowerCase()
                        ) {
                            ballstationcssto = `
                                background-color: ${lines[i].stroke};
                                border: 1px;
                                width: 10px;
                                height: 10px;
                                border-radius: 90%;
                                margin-top: 22px;
                                margin-right: 10px;
                            `;
                            break;
                        }
                    }

                    toe = data[p].stop_layout;
                    toconnection = data[p].connection;
                    foundTo = true;
                    break;
                }
            }

            if (!foundFrom || !foundTo) {
                console.log("From or To station not found in local data");
                return;
            }

            /* ---------- DISTANCE ---------- */

            distance = Math.abs(tod - fromd).toFixed(2) + " KM";
            console.log("Distance between stations:", distance);
        } catch (err) {
            console.error("Route API error:", err);
            routenofoundcss = "display:block";
            routecss = "display:none";
        }
    };
</script>

<Snackbar bind:this={snackbarWithoutClose}>
    <Label style="color:white;">This feature is under development</Label>
</Snackbar>

<div>
    <main>
        <div style="">
            <LeafletMap style="z-index: 900;" />
        </div>
    </main>
    <div class="premium-card">
        <div class="planner-well">
            <div class="journey-indicator">
                <div class="circle-hollow"></div>
                <div class="dashed-line"></div>
                <div class="square-solid"></div>
            </div>

            <div class="input-stack">
                <div class="input-container">
                    <Autocomplete options={stations} bind:text={from}>
                        <input
                            class="clean-input"
                            placeholder="Leaving from..."
                            bind:value={from}
                        />
                    </Autocomplete>
                </div>

                <div class="input-divider"></div>

                <div class="input-container">
                    <Autocomplete options={stations} bind:text={to}>
                        <input
                            class="clean-input"
                            placeholder="Heading to..."
                            bind:value={to}
                        />
                    </Autocomplete>
                </div>
            </div>

            <button class="swap-action">
                <svg
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    stroke-width="2"
                >
                    <path
                        d="M7 16V4M7 4L3 8M7 4L11 8M17 8v12m0 0l4-4m-4 4l-4-4"
                    />
                </svg>
            </button>
        </div>

        <button class="search-action" on:click={distancebwstations}>
            Search Route
        </button>
    </div>
    <br />

    {#if ifstationfound == true}
        <div class="premium-card floating-card">
            <div class="card-tag">Nearest Station</div>
            <div class="station-hero">
                <div>
                    <h2>{nearestStation.stop_name}</h2>
                    <p class="distance">~ 500m</p>
                </div>
                <button class="dir-fab" on:click={googlemapslink}>
                    <img src="/dir.png" alt="" width="18" />
                </button>
            </div>

            <div class="meta-row">
                <div class="meta-item">
                    <span class="m-label">Line</span>
                    <span class="m-value">{nearestStation.Line}</span>
                </div>
                <div class="meta-item">
                    <span class="m-label">Layout</span>
                    <span class="m-value">{nearestStation.stop_layout}</span>
                </div>
            </div>
        </div>
    {:else}
        <div
            class="locard"
            style="display:flex; justify-content:center; align-items:center;"
        >
            <img width="200px" height="200px" src="/noloc.svg" alt="" />
            <h1>Cannot Access Your Location</h1>
        </div>
    {/if}

    <br />

    {#if frome && toe !== "undefined"}
        <div style="height: 400px;">
            <SchematicRoute route={rawroute} />
        </div>
        <div id="capture">
            <div class="card-container">
                <Card>
                    <Content
                        style="background-color: #c0282c; color:white; padding:10px; text-align: center;"
                        >{distance} km</Content
                    >
                    <div style="display:flex; width:100%;">
                        <div style=" width: 100%; text-align: center;">
                            <h1>{from}</h1>
                            <p>
                                <img
                                    src="/undergroundicon.png"
                                    alt=""
                                    width="18px"
                                />
                                Station Layout : {frome}
                            </p>
                            {#if fromconnection !== null}
                                <p>Connected To : {fromconnection}</p>
                            {/if}
                            <div
                                style="display: flex; text-align: center; justify-content: center;"
                            >
                                <div style={ballstationcssfrom}></div>
                                <p>{linefrom}</p>
                            </div>
                        </div>
                        <div style=" width:100%; text-align: center; ">
                            <h1>{to}</h1>
                            <p>
                                <img
                                    src="/undergroundicon.png"
                                    alt=""
                                    width="18px"
                                />
                                Station Layout : {toe}
                            </p>
                            {#if toconnection !== null}
                                <p>Connected To : {toconnection}</p>
                            {/if}
                            <div
                                style="display: flex; text-align: center; justify-content: center;"
                            >
                                <div style={ballstationcssto}></div>
                                <p>{lineto}</p>
                            </div>
                        </div>
                    </div>
                    <div style={routecss} class="route-card">
                        <h2 class="route-title">Your Route</h2>

                        <ul class="route-timeline">
                            {#each route as st, i}
                                <li class="route-step">
                                    <!-- timeline rail -->
                                    <div class="rail">
                                        <span
                                            class="dot"
                                            class:transfer-dot={st.isTransfer}
                                        ></span>

                                        {#if i !== route.length - 1}
                                            <span class="rail-line"></span>
                                        {/if}
                                    </div>

                                    <!-- content -->
                                    <div class="route-content">
                                        <div class="station-name">
                                            {st.station}
                                        </div>

                                        {#if st.isTransfer}
                                            <div class="transfer-chip">
                                                Change to {st.line} Line
                                            </div>
                                        {/if}
                                    </div>
                                </li>
                            {/each}
                        </ul>
                    </div>

                    <div style={routenofoundcss}>
                        <h2 style="text-align: center;">
                            We're sorry but we could'nt find the route at this
                            moment.
                        </h2>
                    </div>
                </Card>
            </div>
        </div>
        <br />
        <div
            style="display: flex; justify-content: center; align-items: center;"
        >
            <Button
                on:click={() => saveScreenshot()}
                variant="unelevated"
                color="secondary"
                style="width:35%; background-color: #c0282c;"
            >
                <Label style="color:white;">Screenshot Route</Label>
            </Button>
        </div>
    {/if}

    <br />

    <div></div>
</div>
<!-- <div class="premium-card-flex">
    <h1 style="font-size:x-large;">Lines</h1>
    <img class="linesimg" src="/linesiconred.png" alt="" />
</div> -->

<div class="lines-container" id="lines">
    <div class="section-header">
        <span class="puffin-eyebrow">METRO LINES</span>
    </div>

    {#each lines as ld}
        <div
            class="line-igloo"
            on:click={() => console.log("Zoom to line:", ld.name)}
        >
            <div class="color-pill" style="background-color: {ld.stroke}"></div>

            <div class="line-content">
                <div class="line-header-row">
                    <h2 class="puffin-title">{ld.name}</h2>
                    <span class="station-count-badge">
                        {ld.stations} STATIONS
                    </span>
                </div>
                <p class="region-label">{ld.region.toUpperCase()}</p>
            </div>

            <div class="chevron">
                <svg
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    stroke-width="3"
                >
                    <path d="M9 18l6-6-6-6" />
                </svg>
            </div>
        </div>

        <div class="station-peeks">
            {#each data as d}
                {#if d.Line === ld.name}
                    <div class="mini-station-row">
                        <div
                            class="mini-dot"
                            style="background: {ld.stroke}"
                        ></div>
                        <span>{d.stop_name}</span>
                    </div>
                {/if}
            {/each}
        </div>
    {/each}
</div>
<br />
<br />
<br />

<div style="text-align: center;">
    <h3>Made Possible With</h3>
    <a href="https://openmaptiles.org/" target="_blank">OpenMapTiles</a>
    <a href="https://openmaptiles.org/" target="_blank">Leaflet</a>
    <a href="https://otd.delhi.gov.in/data/staticDMRC/" target="_blank"
        >Open Transit Data Delhi</a
    >
    <a href="https://openmaptiles.org/" target="_blank">DMRC</a>
</div>

<p style="text-align: center;">
    *Detro is not associated with DMRC or Delhi Goverment.
</p>

<style>
    .arrow {
        margin-right: 5px;
    }
    .lines-container {
        padding: 20px;
        display: flex;
        flex-direction: column;
        gap: 16px;
    }

    /* ROUTE CARD */
    .route-card {
        background: #f4f4f6;
        border-radius: 20px;
        padding: 16px;
        margin-top: 12px;
    }

    /* TITLE */
    .route-title {
        font-size: 1.2rem;
        font-weight: 800;
        margin-bottom: 12px;
        color: #1c1c1e;
    }

    /* TIMELINE */
    .route-timeline {
        list-style: none;
        margin: 0;
        padding: 0;
    }

    /* STEP */
    .route-step {
        display: flex;
        gap: 14px;
        position: relative;
    }

    /* LEFT RAIL */
    .rail {
        display: flex;
        flex-direction: column;
        align-items: center;
        width: 24px;
    }

    /* DOT */
    .dot {
        width: 10px;
        height: 10px;
        border-radius: 50%;
        background: white;
        border: 3px solid #c0282c;
        z-index: 2;
    }

    /* TRANSFER DOT */
    .transfer-dot {
        border-color: #1574ea;
    }

    /* LINE */
    .rail-line {
        width: 2px;
        flex: 1;
        background: #d1d1d6;
        margin-top: 4px;
    }

    /* CONTENT */
    .route-content {
        padding-bottom: 20px;
    }

    /* STATION NAME */
    .station-name {
        font-size: 1rem;
        font-weight: 600;
        color: #1c1c1e;
    }

    /* TRANSFER CHIP */
    .transfer-chip {
        display: inline-block;
        margin-top: 4px;
        padding: 4px 10px;
        border-radius: 999px;
        background: rgba(21, 116, 234, 0.12);
        color: #1574ea;
        font-size: 0.75rem;
        font-weight: 700;
    }

    .section-header {
        padding: 0 10px 8px;
    }

    .puffin-eyebrow {
        font-size: 0.7rem;
        font-weight: 800;
        color: #8e8e93;
        letter-spacing: 1px;
    }

    /* THE IGLOO CARD */
    .line-igloo {
        display: flex;
        align-items: center;
        background: #ffffff;
        border: 1px solid #f2f2f7;
        border-radius: 24px;
        padding: 16px;
        gap: 16px;
        box-shadow: 0 8px 20px rgba(0, 0, 0, 0.04);
        cursor: pointer;
        transition: transform 0.2s cubic-bezier(0.2, 0, 0.2, 1);
    }

    .line-igloo:active {
        transform: scale(0.97);
    }

    /* BUBBLY COLOR PILL */
    .color-pill {
        width: 10px;
        height: 48px;
        border-radius: 20px;
        flex-shrink: 0;
    }

    .line-content {
        flex: 1;
        display: flex;
        flex-direction: column;
        gap: 2px;
    }

    .line-header-row {
        display: flex;
        align-items: center;
        gap: 10px;
    }

    .puffin-title {
        margin: 0;
        font-size: 1.25rem;
        font-weight: 900; /* Puffin-style bolder weight */
        color: #1c1c1e;
        letter-spacing: -0.02em;
    }

    .station-count-badge {
        font-size: 0.65rem;
        font-weight: 800;
        color: #8e8e93;
        background: #f2f2f7;
        padding: 3px 8px;
        border-radius: 6px;
        letter-spacing: 0.5px;
    }

    .region-label {
        margin: 0;
        font-size: 0.75rem;
        font-weight: 700;
        color: #aeaeb2;
        letter-spacing: 0.5px;
    }

    .chevron {
        color: #d1d1d6;
        padding-right: 4px;
    }

    /* MINI STATION PEEKS */
    .station-peeks {
        display: flex;
        flex-direction: column;
        gap: 8px;
        padding-left: 42px;
        margin-top: -4px;
        margin-bottom: 12px;
    }

    .timeline {
        list-style: none;
        border-left: 8px solid #c0282c;
        margin-left: 120px;
        padding-left: 30px;
    }

    .timeline li {
        margin: 18px 0;
        position: relative;
    }

    .timeline .circle {
        position: absolute;
        width: 8px;
        height: 8px;
        background-color: white;
        border: 5px solid #c0282c;
        border-radius: 50%;
        left: -43px;
    }

    .timeline .st {
        font-size: 1rem;
        font-weight: 600;
    }

    .transfer-label {
        font-size: 0.75rem;
        font-weight: 700;
        color: #1574ea;
        margin-top: 2px;
    }

    .mini-station-row {
        display: flex;
        align-items: center;
        gap: 10px;
        font-size: 0.85rem;
        font-weight: 600;
        color: #636366;
        opacity: 0.8;
    }

    .mini-dot {
        width: 6px;
        height: 6px;
        border-radius: 50%;
    }

    /* Premium Card Base */
    .premium-card {
        background: white;
        border-radius: 20px;
        padding: 16px;
        margin-left: 12px;
        margin-right: 12px;
        box-shadow: 1px 0px 10px -7px;
    }
    .premium-card-flex {
        background: white;
        margin-top: 10px;
        height: 100px;
        overflow: hidden;
        align-items: center;
        display: flex;
        border-radius: 20px;
        padding: 16px;
        margin-left: 12px;
        margin-right: 12px;
        box-shadow: 1px 0px 10px -7px;
    }

    .card-tag {
        font-size: 0.7rem;
        text-transform: uppercase;
        letter-spacing: 1px;
        color: #999;
        font-weight: 700;
        margin-bottom: 8px;
    }
    .planner-well {
        background: #f4f4f6;
        border-radius: 16px;
        display: flex;
        padding: 12px;
        position: relative;
        margin-bottom: 12px;
    }

    .journey-indicator {
        display: flex;
        flex-direction: column;
        align-items: center;
        padding: 8px 12px 8px 4px;
    }

    .circle-hollow {
        width: 10px;
        height: 10px;
        border: 2.5px solid #c0282c;
        border-radius: 50%;
        background: white;
    }
    .dashed-line {
        flex: 1;
        width: 1.5px;
        border-left: 2px dashed #ccc;
        margin: 4px 0;
    }
    .square-solid {
        width: 10px;
        height: 10px;
        background: #c0282c;
        border-radius: 2px;
    }

    .input-stack {
        flex: 1;
        display: flex;
        flex-direction: column;
    }
    .input-container {
        height: 44px;
        display: flex;
        align-items: center;
    }

    .clean-input {
        width: 100%;
        background: transparent;
        border: none;
        outline: none;
        font-size: 1rem;
        font-weight: 500;
        color: #1a1a1a;
    }

    .input-divider {
        height: 1px;
        background: #e0e0e2;
        width: 100%;
    }

    .swap-action {
        position: absolute;
        right: 12px;
        top: 50%;
        transform: translateY(-50%);
        background: white;
        border: 1px solid #ddd;
        width: 32px;
        height: 32px;
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        color: #666;
        cursor: pointer;
        box-shadow: 0 2px 6px rgba(0, 0, 0, 0.05);
    }

    .search-action {
        width: 100%;
        background: #c0282c;
        color: white;
        border: none;
        padding: 14px;
        border-radius: 14px;
        font-weight: 700;
        font-size: 1rem;
        cursor: pointer;
        transition: transform 0.2s;
    }

    /* Nearest Station Styling */
    .station-hero {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 12px;
    }

    .station-hero h2 {
        margin: 0;
        font-size: 1.4rem;
        font-weight: 800;
        color: #1a1a1a;
    }
    .distance {
        margin: 4px 0 0;
        font-size: 0.85rem;
        color: #666;
    }

    .dir-fab {
        background: #1574ea;
        border: none;
        width: 44px;
        height: 44px;
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        box-shadow: 0 4px 12px rgba(21, 116, 234, 0.3);
        cursor: pointer;
    }

    .meta-row {
        display: flex;
        gap: 24px;
        border-top: 1px solid #f0f0f0;
        padding-top: 12px;
    }
    .m-label {
        display: block;
        font-size: 0.65rem;
        color: #aaa;
        text-transform: uppercase;
        font-weight: 600;
    }
    .m-value {
        font-size: 0.9rem;
        color: #333;
        font-weight: 600;
    }
    .card {
        border: 1;
        border-radius: 4px;
    }
    .pickers {
        display: flex;
        align-items: center;
        justify-content: center;
    }
    .linesimg {
        margin-left: 80%;
        transform: translateY(25px);
    }
    .stationav {
    }
    .lines {
        padding: 10px;
    }
    .timeline {
        list-style: none;
        border-left: 8px solid;
        border-color: #c0282c;
        margin-left: 120px;
        padding-left: 30px;
    }
    .timeline li {
        margin: 15px 0;
        position: relative;
    }
    .timeline .st {
        font-size: 1rem;
    }
    .timeline .circle {
        position: absolute;
        width: 8px;
        height: 8px;
        background-color: #ffffff;
        border: 5px solid #c0282c;
        border-radius: 50%;
        left: -43px;
    }

    @media only screen and (max-width: 600px) {
        .pickers {
            display: list-item;
            text-align: center;
            align-items: center;
        }
        .linesimg {
            margin-left: 50%;
            transform: translateY(25px);
        }

        .input1 {
            margin-top: 15px;
        }
        .arrow {
            display: none;
        }
    }
</style>
