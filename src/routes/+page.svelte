<script>
    import LeafletMap from "$lib/LeafletMap.svelte";
    import { onMount } from "svelte";
    import Autocomplete from "@smui-extra/autocomplete";
    import Snackbar from "@smui/snackbar";
    import Textfield from "@smui/textfield";
    import Card, { Content } from "@smui/card";
    import Button, { Label } from "@smui/button";
    import html2canvas from "html2canvas";

    /* ---------- UI STATE (DO NOT BREAK) ---------- */

    let stationslist = [
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

    let stations = [];

    let route = [];

    export let to = "";
    export let from = "";

    let routecss = "display:none";
    let routenofoundcss = "display:none";

    let frome;
    let toe;
    let linefrom;
    let lineto;
    let fromconnection;
    let toconnection;
    const lineColors = {
        "Red line": "#d32f2f",
        "Yellow line": "#FFF176",
        "Blue line": "#1976d2",
        "Blue line branch": "#1976d2",
        "Pink line": "#FFC0CB",
        "Green line": "#008000",
        "Violet line": "#9B88D6",
        "Magenta line": "#E1BEE7",
        "Orange line": "#fb8c00",
        "Gray line": "#757575",
        "Aqua line": "#00acc1",
    };

    let ballstationcssfrom;
    let ballstationcssto;

    /* ---------- DATA ---------- */

    let stationData = [];
    let metrolines = {};
    let segmentLines = [];
    let transferStations = new Set();

    let lines = [];

    /* ---------- GEO / NEAREST ---------- */

    let nearestStation;
    let ifstationfound = false;
    let latitude;
    let distance;
    let longitude;
    let nearyear;

    /* ---------- HELPERS ---------- */

    function haversine(lat1, lon1, lat2, lon2) {
        const R = 6371;
        const dLat = ((lat2 - lat1) * Math.PI) / 180;
        const dLon = ((lon2 - lon1) * Math.PI) / 180;
        const a =
            Math.sin(dLat / 2) ** 2 +
            Math.cos((lat1 * Math.PI) / 180) *
                Math.cos((lat2 * Math.PI) / 180) *
                Math.sin(dLon / 2) ** 2;
        return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    }

    function getUserLocation() {
        if (!navigator.geolocation) return;
        navigator.geolocation.getCurrentPosition(
            (pos) => {
                latitude = pos.coords.latitude;
                longitude = pos.coords.longitude;

                let min = Infinity;
                stationData.forEach((s) => {
                    const d = haversine(
                        latitude,
                        longitude,
                        parseFloat(s.stop_lat),
                        parseFloat(s.stop_lon),
                    );
                    if (d < min) {
                        min = d;
                        nearestStation = s;
                        nearyear = s.stop_date?.split("-")[0];
                    }
                });

                ifstationfound = !!nearestStation;
            },
            () => (ifstationfound = false),
        );
    }

    function googlemapslink() {
        if (!nearestStation) return;
        window.open(
            `https://www.google.com/maps?saddr=My+Location&daddr=${nearestStation.stop_name} Metro Gate No.1`,
        );
    }

    /* ---------- RESTORE OLD METADATA ---------- */

    function applyStationMeta(name, type) {
        const st = stationData.find((s) => s.stop_name === name);
        if (!st) return;

        const lineObj = lines.find(
            (l) => l.name.toLowerCase() === st.Line?.toLowerCase(),
        );

        const css = lineObj
            ? `background-color:${lineObj.stroke};
               width:10px;height:10px;border-radius:50%;
               margin-top:22px;margin-right:10px;`
            : "";

        if (type === "from") {
            frome = st.stop_layout;
            linefrom = st.Line;
            fromconnection = st.connection ?? null;
            ballstationcssfrom = css;
        }

        if (type === "to") {
            toe = st.stop_layout;
            lineto = st.Line;
            toconnection = st.connection ?? null;
            ballstationcssto = css;
        }
    }

    /* ---------- ROUTE (API ONLY) ---------- */

    async function distancebwstations() {
        routecss = "display:none";
        routenofoundcss = "display:none";
        route = [];

        if (!from || !to) return;

        try {
            const res = await fetch(
                `/api/metroroute?from=${encodeURIComponent(from)}&to=${encodeURIComponent(to)}`,
            );

            if (!res.ok) throw new Error("route failed");

            const data = await res.json();

            route = data.route;
            segmentLines = data.segmentLines;
            transferStations = new Set(data.transferStations);

            applyStationMeta(from, "from");
            applyStationMeta(to, "to");

            routecss = "display:block";
        } catch (err) {
            console.error(err);
            routenofoundcss = "display:flex; justify-content:center;";
        }
    }

    /* ---------- INIT ---------- */

    onMount(async () => {
        stationData = await (await fetch("/stationsdata.json")).json();
        metrolines = await (await fetch("/metrolines.json")).json();
        lines = await (await fetch("/lines.json")).json();
        console.log(lines);

        stations = Array.from(new Set(Object.values(metrolines).flat())).sort();

        getUserLocation();
    });
</script>

<!--
<Snackbar bind:this={snackbarWithoutClose}>
    <Label style="color:white;">This feature is under development</Label>
</Snackbar> -->

<div>
    <main>
        <div style="">
            <LeafletMap style="z-index: 900;" />
        </div>
    </main>
    <div class="popl">
        <div>
            <div
                style="background-color: black; box-shadow: 0px 3px 2px #727272;"
            >
                <h1
                    style="color:white; font-weight:400; text-align: center; padding:10px; font-size: large;"
                >
                    Nearest Station
                </h1>
            </div>
            {#if ifstationfound == true}
                <Card style="padding:10px;">
                    <h2 style="text-align: center;">
                        {nearestStation.stop_name}
                    </h2>
                    <div
                        style="display: flex; justify-content:center; align-items:center;"
                    >
                        <div>
                            <div style="display: flex; padding:5px;">
                                <img
                                    src="/linesiconred.png"
                                    alt=""
                                    width="25px"
                                    height="25px"
                                />
                                <Label
                                    >Station Line: {nearestStation.Line}</Label
                                >
                            </div>
                            <div style="display: flex; padding:5px;">
                                <img
                                    src="/undergroundicon.png"
                                    alt=""
                                    width="25px"
                                    height="25px"
                                />
                                <Label
                                    >Station Layout : {nearestStation.stop_layout}</Label
                                >
                            </div>
                        </div>
                        <div>
                            <div style="display: flex; padding:5px;">
                                <Label>Opened In : {nearyear}</Label>
                            </div>
                        </div>
                    </div>
                    <br />
                    <div
                        style="display: flex; justify-content:center; align-items:center"
                    >
                        <Button
                            on:click={() => googlemapslink()}
                            variant="unelevated"
                            color="secondary"
                            style="width:100%; background-color: #1574EA;padding=10px;"
                        >
                            <img src="/dir.png" alt="" width="20px" />
                            <h2
                                style="color:white; margin-left: 5px; font-weight: 400;"
                            >
                                Get Directions
                            </h2>
                        </Button>
                    </div>
                </Card>
            {:else}
                <Card
                    style="display:flex; justify-content:center; align-items:center;"
                >
                    <img width="200px" height="155px" src="/noloc.svg" alt="" />
                    <h1>Cannot Access Your Location</h1>
                </Card>
            {/if}
        </div>
        <div class="followbut">
            <div
                style="background-color: #c0282c; box-shadow: 0px 2px 2px #727272;"
            >
                <h1
                    style="color:white; font-weight:400; padding:10px; text-align: center; font-size: large;"
                >
                    Plan Your Journey
                </h1>
            </div>
            <Card>
                <div
                    class="dres"
                    style="z-index: 950; padding:20px; border:1px; border-radius:5px; "
                >
                    <br />
                    <div class="pickers">
                        <div style="margin-right: 10px;">
                            <Autocomplete
                                options={stationslist}
                                bind:text={from}
                            >
                                <Textfield
                                    label="From"
                                    bind:value={from}
                                    variant="outlined"
                                />
                            </Autocomplete>
                        </div>

                        <div class="input1" style="">
                            <Autocomplete options={stationslist} bind:text={to}>
                                <Textfield
                                    label="To"
                                    bind:value={to}
                                    variant="outlined"
                                />
                            </Autocomplete>
                        </div>
                    </div>
                    <br />
                    <div
                        style="display: flex; justify-content: center;  margin:10px;"
                    >
                        <Button
                            on:click={() => distancebwstations()}
                            variant="unelevated"
                            color="secondary"
                            style="width:70%; background-color: #c0282c;"
                        >
                            <Label style="color:white;">New Ride</Label>
                        </Button>
                        <br />
                    </div>
                </div>
            </Card>
        </div>
    </div>

    <br />

    {#if frome && toe !== "undefined"}
        <div id="capture">
            <Card class="modern-card route-card">
                <div class="route-header">
                    <div class="route-title">
                        {from} → {to}
                    </div>
                    <div class="route-sub">
                        {route.length - 1} stops
                        {#if transferStations.size}
                            • {transferStations.size} change
                        {/if}
                    </div>
                </div>

                <!-- Start / End cards -->
                <div class="station-cards">
                    <div class="station-card">
                        <div class="station-name">{from}</div>
                        <div class="station-meta">
                            <span
                                class="dot"
                                style="background:{lineColors[linefrom]}"
                            ></span>
                            {linefrom}
                        </div>
                        <div class="station-layout">{frome}</div>
                    </div>

                    <div class="station-card">
                        <div class="station-name">{to}</div>
                        <div class="station-meta">
                            <span
                                class="dot"
                                style="background:{lineColors[lineto]}"
                            ></span>
                            {lineto}
                        </div>
                        <div class="station-layout">{toe}</div>
                    </div>
                </div>

                <!-- Timeline stays here -->
                <div class="timeline-modern">
                    {#each route as station, i}
                        <div class="stop">
                            {#if i < segmentLines.length}
                                <div
                                    class="line"
                                    style="background:{lineColors[
                                        segmentLines[i]
                                    ]}"
                                ></div>
                            {/if}

                            <div
                                class="dot {transferStations.has(station)
                                    ? 'transfer'
                                    : ''}"
                                style="border-color:{lineColors[
                                    segmentLines[i - 1]
                                ] || lineColors[segmentLines[i]]}"
                            ></div>

                            <div class="content">
                                <div class="station-name">{station}</div>

                                {#if i === 0}
                                    <div class="hint">Board here</div>
                                {/if}

                                {#if transferStations.has(station)}
                                    <div class="change">
                                        Change to
                                        <span
                                            class="pill"
                                            style="background:{lineColors[
                                                segmentLines[i]
                                            ]}"
                                        >
                                            {segmentLines[i]}
                                        </span>
                                    </div>
                                {/if}

                                {#if i === route.length - 1}
                                    <div class="hint">Alight here</div>
                                {/if}
                            </div>
                        </div>
                    {/each}
                </div>
                <!-- (use the timeline-modern you already added) -->
            </Card>
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
                <Label style="color:white;">Screenshot</Label>
            </Button>
        </div>
    {/if}

    <br />

    <div></div>
</div>
<div
    style="display: flex; padding:10px; border:1px; border-radius: 10px; background-color: #ffffff;box-shadow: 0px 2px 2px #727272; margin-top:10px; height:100px; overflow:hidden; align-items: center;"
>
    <h1 style="font-size:x-large;">Lines</h1>
    <img class="linesimg" src="/linesiconred.png" alt="" />
</div>

<div class="lines" id="lines">
    {#each lines as ld}
        <div
            style={`display:flex; text-align: center; background-color:#ffffff; border:1; border-radius:5px; padding-left:0px; margin:10px;`}
            on:click={window.open(`/lines?id=${ld.id}`)}
        >
            <div
                style="{`background-color: ${ld.stroke}; width:3%; margin-right:5px; border:1; border-radius:5px`};"
            ></div>
            <div style="display: block;">
                <div style="display: flex;">
                    <h2
                        style="margin-top:10px; margin-left: 10px; margin-right:0px margin-bottom: 5px;"
                    >
                        {ld.name} -
                    </h2>
                    <p
                        style="margin-bottom: 5px; color:black; margin-left: 5px; font-size: small; text-align: left;"
                    >
                        {ld.stations} stations
                    </p>
                </div>
                <p
                    style="margin-bottom: 10px; margin-top: 0px; color:grey; margin-left: 10px; font-size: small; text-align: left;"
                >
                    {ld.region}
                </p>
            </div>
        </div>
        {#each lines as d}
            {#if typeof d.Line !== "undefined"}
                {#if d.Line == ld.name}
                    <div>
                        <h1>{d.stop_name}</h1>
                        <p>{d.stop_id}</p>
                    </div>
                {/if}
            {/if}
        {/each}
        <div></div>
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
    .card {
        border: 1;
        border-radius: 4px;
    }
    .popl {
        padding: 10px;
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
    .roundimg {
        border: 1;
        border-radius: 6px;
        margin-right: 5px;
    }
    .timeline {
        list-style: none;
        border-left: 8px solid;
        border-color: #c0282c;
        margin-left: 120px;
        padding-left: 30px;
    }
    .route-header {
        background: #c0282c;
        color: white;
        padding: 14px;
        border-radius: 6px 6px 0 0;
    }

    .route-title {
        font-size: 1.1rem;
        font-weight: 600;
    }

    .route-sub {
        font-size: 0.8rem;
        opacity: 0.9;
    }

    .station-cards {
        display: flex;
        gap: 16px;
        padding: 16px;
    }

    .station-card {
        flex: 1;
        background: #f8f8f8;
        border-radius: 10px;
        padding: 12px;
        text-align: center;
    }

    .station-name {
        font-weight: 600;
    }

    .station-meta {
        margin-top: 6px;
        font-size: 0.85rem;
        display: flex;
        justify-content: center;
        align-items: center;
        gap: 6px;
    }

    .station-layout {
        font-size: 0.75rem;
        color: #666;
        margin-top: 4px;
    }

    /* Timeline */
    .timeline-modern {
        padding: 10px 24px 24px;
    }

    .stop {
        position: relative;
        display: flex;
        gap: 16px;
        padding-bottom: 26px;
    }

    .line {
        position: absolute;
        left: 9px;
        top: 20px;
        width: 4px;
        height: 100%;
        border-radius: 2px;
    }

    .dot {
        width: 18px;
        height: 18px;
        background: white;
        border: 4px solid;
        border-radius: 50%;
        z-index: 2;
    }

    .dot.transfer {
        transform: scale(1.25);
    }

    .content {
        padding-top: 2px;
    }

    .hint {
        font-size: 0.75rem;
        color: #777;
    }

    .change {
        margin-top: 6px;
        font-size: 0.8rem;
        font-weight: 600;
    }

    .pill {
        padding: 2px 8px;
        border-radius: 999px;
        color: white;
        font-size: 0.7rem;
    }

    .timeline li {
        margin: 15px 0;
        position: relative;
    }
    .timeline-modern {
        position: relative;

        margin: 20px 40px;
    }

    .stop {
        position: relative;
        display: flex;
        align-items: flex-start;
        gap: 16px;
        padding-bottom: 28px;
    }

    .line {
        position: absolute;
        left: 9px;
        top: 20px;
        width: 4px;
        height: 100%;
        border-radius: 2px;
    }

    .dot {
        width: 18px;
        height: 18px;
        background: white;
        border: 4px solid #c0282c;
        border-radius: 50%;
        z-index: 2;
        transition: transform 0.2s ease;
    }

    .dot.transfer {
        transform: scale(1.2);
        border-width: 5px;
    }

    .content {
        padding-top: 2px;
    }

    .station-name {
        font-size: 1rem;
        font-weight: 500;
        color: #111;
    }

    .hint {
        font-size: 0.75rem;
        color: #777;
        margin-top: 2px;
    }

    .change {
        margin-top: 6px;
        font-size: 0.8rem;
        font-weight: 600;
        display: flex;
        align-items: center;
        gap: 6px;
    }

    .pill {
        padding: 2px 8px;
        border-radius: 999px;
        color: white;
        font-size: 0.7rem;
        font-weight: 600;
    }

    .gistbb {
        display: flex;
        width: auto;
    }
    .ppl {
        margin-left: 10px;
        padding: 5px;
        width: 100%;
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
    @media only screen and (min-width: 800px) {
        .popl {
            display: flex;
            width: 100%;
        }
        .dres {
            height: 190px;
        }
        .gistbb {
            padding: 10px;
            align-items: center;
            display: flex;
            width: 300px;
        }
        .followbut {
            margin-left: 20px;
        }
    }

    @media only screen and (max-width: 600px) {
        .popl {
            display: block;
        }
        .followbut {
            margin-top: 20px;
        }
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
