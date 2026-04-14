<script>
    import LeafletMap from "$lib/LeafletMap.svelte";
    import { onMount } from "svelte";

    import SchematicRouteWeb from "$lib/SchematicRouteWeb.svelte";
    import { browser } from "$app/environment";

    if (browser) {
        import("@m3e/web/all");
    }
    import Snackbar, { Actions } from "@smui/snackbar";
    import { Label } from "@smui/button";
    import html2canvas from "html2canvas";

    async function saveScreenshot() {
        const captureElement = document.getElementById("capture");
        const canvas = await html2canvas(captureElement);
        const dataURL = canvas.toDataURL();
        const link = document.createElement("a");
        link.download = "screenshot.png";
        link.href = dataURL;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    }
    let metroLines = {
        "Red line": [
            "Shaheed Sthal (New Bus Adda)",
            "Hindon River",
            "Arthala",
            "Mohan Nagar",
            "Shyam Park",
            "Major Mohit Sharma Rajender Nagar",
            "Raj Bagh",
            "Shaheed Nagar",
            "Dilshad Garden",
            "Jhilmil",
            "Mansrover Park",
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
        ],
        "Yellow line": [
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
        ],
        "Blue line main": [
            "Dwarka Sector - 21",
            "Dwarka Sector - 8",
            "Dwarka Sector - 9",
            "Dwarka Sector - 10",
            "Dwarka Sector - 11",
            "Dwarka Sector - 12",
            "Dwarka Sector - 13",
            "Dwarka Sector - 14",
            "Dwarka",
            "Dwarka Mor",
            "Nawada",
            "Uttam Nagar West",
            "Uttam Nagar East",
            "Janak Puri West",
            "Janak Puri East",
            "Tilak Nagar",
            "Subash Nagar",
            "Tagore Garden",
            "Rajouri Garden",
            "Ramesh Nagar",
            "Moti Nagar",
            "Kirti Nagar",
            "Shadipur",
            "Patel Nagar",
            "Rajendra Place",
            "Karol Bagh",
            "Jhandewalan",
            "RK Ashram Marg",
            "Barakhamba",
            "Mandi House",
            "Supreme Court",
            "Indraprastha",
            "Yamuna Bank",
            "Akshardham",
            "Mayur Vihar-I",
            "Mayur Vihar Ext",
            "New Ashok Nagar",
            "Noida Sec -15",
            "Noida Sec -16",
            "Noida Sec -18",
            "Botanical Garden",
            "Golf Course",
            "Noida City Centre",
            "Noida Sec-34",
            "Noida Sec-52",
            "Noida Sec-61",
            "Noida Sec-59",
            "Noida Sec-62",
            "Noida Electronic City",
        ],
        "Blue line branch": [
            "Laxmi Nagar",
            "Nirman Vihar",
            "Preet Vihar",
            "Karkarduma",
            "Anand Vihar",
            "Kaushambi",
            "Vaishali",
        ],
        "Green line": [
            "Punjabi Bagh",
            "Shivaji Park",
            "Madipur",
            "Paschim Vihar (East)",
            "Paschim Vihar (West)",
            "Peera Garhi",
            "Udyog Nagar",
            "Maharaja Surajmal Stadium",
            "Nangloi",
            "Nangloi Railway Station",
            "Rajdhani Park",
            "Mundka",
            "Mundka Industrial Area (M.I.A)",
            "Ghevra Metro station",
            "Tikri Kalan",
            "Tikri Border",
            "Pandit Shree Ram Sharma",
            "Bahadurgarh City",
            "Brigadier Hoshiyar Singh",
        ],
        "Green line branch": ["Satguru Ram Singh Marg", "Ashok Park Main"],
        "Violet line": [
            "Lal Quila",
            "Jama Masjid",
            "Delhi Gate",
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
            "Sant Surdas (Sihi)",
            "Raja Nahar Singh",
        ],
        "Pink line loop": [
            "Yamuna Vihar",
            "Bhajanpura",
            "Khajuri Khas",
            "Sonia Vihar",
            "Soorghat",
            "Jagatpur Village",
            "Jharoda Majra",
            "Burari Crossing",
            "Majlis Park",
            "Shalimar Bagh",
            "Shakurpur",
            "Punjabi Bagh West",
            "ESI Basai Darapur",
            "Mayapuri",
            "Naraina Vihar",
            "Delhi Cantt",
            "Durgabai Deshmukh South Campus",
            "Sir Vishweshwaraiah Moti Bagh",
            "Bhikaji Cama Place",
            "Sarojini Nagar",
            "South Extension",
            "Vinobapuri",
            "Ashram",
            "Sarai Kale Khan - Nizamuddin",
            "Mayur Vihar Pocket 1",
            "Trilokpuri Sanjay Lake",
            "East Vinod Nagar - Mayur Vihar-II",
            "Mandawali - West Vinod Nagar",
            "IP Extension",
            "Karkarduma Court",
            "Krishna Nagar",
            "East Azad Nagar",
            "Jafrabad",
            "Maujpur - Babarpur",
        ],
        "Pink line branch": ["Gokulpuri", "Johri Enclave", "Shiv Vihar"],
        "Magenta line": [
            "Janak Puri West",
            "Dabri Mor - Janakpuri South",
            "Dashrath Puri",
            "Palam",
            "Sadar Bazar Contonment",
            "Terminal 1- IGI Airport",
            "Shankar Vihar",
            "Vasant Vihar",
            "Munirka",
            "RK Puram",
            "IIT",
            "Panchsheel Park",
            "Chirag Delhi",
            "Greater Kailash",
            "Nehru Enclave",
            "Okhla NSIC",
            "Sukhdev Vihar",
            "Jamia Millia Islamia",
            "Okhla Vihar",
            "Jasola Vihar Shaheen Bagh",
            "Kalindi Kunj",
            "Okhla Bird Sanctuary",
        ],
        "Orange line": [
            "Shivaji Stadium",
            "Dhaula Kuan",
            "Delhi Aerocity",
            "IGI Airport",
        ],
        "Gray line": ["Nangli", "Najafgarh", "Dhansa Bus Stand"],
        "Aqua line": [
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
        ],
        "Rapid Metro": [
            "Sector 55-56 (Rapid Metro)",
            "Sector 54 Chowk (Rapid Metro)",
            "Sector 53-54 (Rapid Metro)",
            "Sector 42-43 (Rapid Metro)",
            "Phase-I (Rapid Metro)",
            "Phase 2 (Rapid Metro)",
            "Belvedere Towers (Rapid Metro)",
            "Cyber City (Rapid Metro)",
            "Moulsari Avenue (Rapid Metro)",
            "Phase 3 (Rapid Metro)",
        ],
    };
    let stations = [
        // Red line
        "Shaheed Sthal (New Bus Adda)",
        "Hindon River",
        "Arthala",
        "Mohan Nagar",
        "Shyam Park",
        "Major Mohit Sharma Rajender Nagar",
        "Raj Bagh",
        "Shaheed Nagar",
        "Dilshad Garden",
        "Jhilmil",
        "Mansrover Park",
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

        // Yellow line
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

        // Blue line main
        "Dwarka Sector - 21",
        "Dwarka Sector - 8",
        "Dwarka Sector - 9",
        "Dwarka Sector - 10",
        "Dwarka Sector - 11",
        "Dwarka Sector - 12",
        "Dwarka Sector - 13",
        "Dwarka Sector - 14",
        "Dwarka",
        "Dwarka Mor",
        "Nawada",
        "Uttam Nagar West",
        "Uttam Nagar East",
        "Janak Puri West",
        "Janak Puri East",
        "Tilak Nagar",
        "Subash Nagar",
        "Tagore Garden",
        "Rajouri Garden",
        "Ramesh Nagar",
        "Moti Nagar",
        "Kirti Nagar",
        "Shadipur",
        "Patel Nagar",
        "Rajendra Place",
        "Karol Bagh",
        "Jhandewalan",
        "RK Ashram Marg",
        "Barakhamba",
        "Mandi House",
        "Supreme Court",
        "Indraprastha",
        "Yamuna Bank",
        "Akshardham",
        "Mayur Vihar-I",
        "Mayur Vihar Ext",
        "New Ashok Nagar",
        "Noida Sec -15",
        "Noida Sec -16",
        "Noida Sec -18",
        "Botanical Garden",
        "Golf Course",
        "Noida City Centre",
        "Noida Sec-34",
        "Noida Sec-52",
        "Noida Sec-61",
        "Noida Sec-59",
        "Noida Sec-62",
        "Noida Electronic City",

        // Blue line branch
        "Laxmi Nagar",
        "Nirman Vihar",
        "Preet Vihar",
        "Karkarduma",
        "Anand Vihar",
        "Kaushambi",
        "Vaishali",

        // Green line
        "Punjabi Bagh",
        "Shivaji Park",
        "Madipur",
        "Paschim Vihar (East)",
        "Paschim Vihar (West)",
        "Peera Garhi",
        "Udyog Nagar",
        "Maharaja Surajmal Stadium",
        "Nangloi",
        "Nangloi Railway Station",
        "Rajdhani Park",
        "Mundka",
        "Mundka Industrial Area (M.I.A)",
        "Ghevra Metro station",
        "Tikri Kalan",
        "Tikri Border",
        "Pandit Shree Ram Sharma",
        "Bahadurgarh City",
        "Brigadier Hoshiyar Singh",

        // Green line branch
        "Satguru Ram Singh Marg",
        "Ashok Park Main",

        // Violet line
        "Lal Quila",
        "Jama Masjid",
        "Delhi Gate",
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
        "Sant Surdas (Sihi)",
        "Raja Nahar Singh",

        // Pink line loop

        "Yamuna Vihar",
        "Bhajanpura",
        "Khajuri Khas",
        "Sonia Vihar",
        "Soorghat",
        "Jagatpur Village",
        "Jharoda Majra",
        "Burari Crossing",
        "Majlis Park",
        "Shalimar Bagh",
        "Shakurpur",
        "Punjabi Bagh West",
        "ESI Basai Darapur",
        "Mayapuri",
        "Naraina Vihar",
        "Delhi Cantt",
        "Durgabai Deshmukh South Campus",
        "Sir Vishweshwaraiah Moti Bagh",
        "Bhikaji Cama Place",
        "Sarojini Nagar",
        "South Extension",
        "Vinobapuri",
        "Ashram",
        "Sarai Kale Khan - Nizamuddin",
        "Mayur Vihar Pocket 1",
        "Trilokpuri Sanjay Lake",
        "East Vinod Nagar - Mayur Vihar-II",
        "Mandawali - West Vinod Nagar",
        "IP Extension",
        "Karkarduma Court",
        "Krishna Nagar",
        "East Azad Nagar",
        "Jafrabad",
        "Maujpur - Babarpur",

        // Pink line branch
        "Gokulpuri",
        "Johri Enclave",
        "Shiv Vihar",

        // Magenta line
        "Janak Puri West",
        "Dabri Mor - Janakpuri South",
        "Dashrath Puri",
        "Palam",
        "Sadar Bazar Contonment",
        "Terminal 1- IGI Airport",
        "Shankar Vihar",
        "Vasant Vihar",
        "Munirka",
        "RK Puram",
        "IIT",
        "Panchsheel Park",
        "Chirag Delhi",
        "Greater Kailash",
        "Nehru Enclave",
        "Okhla NSIC",
        "Sukhdev Vihar",
        "Jamia Millia Islamia",
        "Okhla Vihar",
        "Jasola Vihar Shaheen Bagh",
        "Kalindi Kunj",
        "Okhla Bird Sanctuary",

        // Orange line
        "Shivaji Stadium",
        "Dhaula Kuan",
        "Delhi Aerocity",
        "IGI Airport",

        // Gray line
        "Nangli",
        "Najafgarh",
        "Dhansa Bus Stand",

        // Aqua line
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

        // Rapid Metro
        "Sector 55-56 (Rapid Metro)",
        "Sector 54 Chowk (Rapid Metro)",
        "Sector 53-54 (Rapid Metro)",
        "Sector 42-43 (Rapid Metro)",
        "Phase-I (Rapid Metro)",
        "Phase 2 (Rapid Metro)",
        "Belvedere Towers (Rapid Metro)",
        "Cyber City (Rapid Metro)",
        "Moulsari Avenue (Rapid Metro)",
        "Phase 3 (Rapid Metro)",
    ];

    // Deduplicate (interchange stations appear in multiple lines above)
    stations = [...new Set(stations)];

    $: routeStations = route.map((r) => r.station);
    $: transferCount = route.filter((r) => r.isTransfer).length;

    function hasTransfers() {
        return route.some((r) => r.isTransfer);
    }

    let fromd,
        routecss = "display:block",
        routenofoundcss = "display:none";
    let linefrom,
        ballstationcssto,
        ballstationcssfrom,
        toconnection,
        nearyear,
        fromconnection,
        lineto;
    let rawroute = {},
        frome,
        latitude,
        longitude,
        tod,
        toe;
    export let to = "";
    export let from = "";
    let lines = [],
        linedata,
        metrod,
        distancebw,
        i = -1,
        textOutlined = "";
    let data = [],
        distance = "",
        snackbarWithoutClose;
    let route = [],
        ifstationfound = false,
        nearestStation,
        minDistance;
    let routeFound = false;
    let activeTab = "planner"; // 'planner' | 'lines' | 'map'

    function listStationsOnRoute(routeSteps) {
        return routeSteps.map((step) => step.station);
    }

    function getUserLocation() {
        if (navigator.geolocation)
            navigator.geolocation.getCurrentPosition(showPosition, showError);
    }

    function haversine(lat1, lon1, lat2, lon2) {
        const toRad = (v) => (v * Math.PI) / 180;
        const R = 6371,
            dLat = toRad(lat2 - lat1),
            dLon = toRad(lon2 - lon1);
        const a =
            Math.sin(dLat / 2) ** 2 +
            Math.cos(toRad(lat1)) *
                Math.cos(toRad(lat2)) *
                Math.sin(dLon / 2) ** 2;
        return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    }

    function findNearestMetroStation(userLat, userLon, stationList) {
        nearestStation = null;
        minDistance = Infinity;
        stationList.forEach((station) => {
            const d = haversine(
                userLat,
                userLon,
                parseFloat(station.stop_lat),
                parseFloat(station.stop_lon),
            );
            if (d < minDistance) {
                minDistance = d;
                nearestStation = station;
                nearyear = station.stop_date?.split("-")[0];
            }
        });
        ifstationfound = true;
        return { nearestStation, minDistance };
    }

    function showPosition(position) {
        latitude = position.coords.latitude;
        longitude = position.coords.longitude;
        const result = findNearestMetroStation(latitude, longitude, data);
        nearestStation = result.nearestStation;
        minDistance = result.minDistance;
    }

    function showError(error) {
        console.log("Geolocation error:", error.code);
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
        window.open(
            `https://m.uber.com/ul/?action=setPickup&pickup[latitude]=${latitude}&pickup[longitude]=${longitude}&dropoff[latitude]=${lat}&dropoff[longitude]=${lon}`,
        );
    }

    function swapStations() {
        const tmp = from;
        from = to;
        to = tmp;
    }

    onMount(async () => {
        try {
            metrod = await fetch("/stationsdata.json");
            if (!metrod.ok) throw new Error("Failed to fetch station data");
            data = await metrod.json();
            getUserLocation();
            linedata = await fetch("/lines.json");
            if (!linedata.ok) throw new Error("Failed to fetch line data");
            linedata = await linedata.json();
            lines = linedata;
        } catch (error) {
            console.error("Error fetching data:", error);
        }
    });

    let distancebwstations = async () => {
        // 1. ADD THIS GUARD CLAUSE
        // Prevent the API call if either the 'from' or 'to' fields are empty
        if (!from || !to) {
            console.warn("Please select both a 'from' and 'to' station.");
            routenofoundcss = "display:block"; // Show your 'not found/error' UI
            routecss = "display:none";
            routeFound = false;
            return; // Exit the function early
        }

        let foundFrom = false,
            foundTo = false;

        try {
            const res = await fetch(
                `/api/metroroute?from=${encodeURIComponent(from)}&to=${encodeURIComponent(to)}`,
            );
            const result = await res.json();

            if (!res.ok || !result.route || result.route.length === 0) {
                routenofoundcss = "display:block";
                routecss = "display:none";
                routeFound = false;
                return;
            }

            routenofoundcss = "display:none";
            routecss = "display:block";
            routeFound = true;
            rawroute = result;
            route = result.route;

            for (let station in data) {
                if (data[station].stop_name === from) {
                    fromd = data[station].distance;
                    linefrom = data[station].Line;
                    for (let o = 0; o < lines.length; o++) {
                        if (
                            lines[o].name.toLowerCase() ===
                            linefrom.toLowerCase()
                        ) {
                            ballstationcssfrom = `background-color:${lines[o].stroke};width:8px;height:8px;border-radius:50%;display:inline-block;margin-right:6px;`;
                            break;
                        }
                    }
                    frome = data[station].stop_layout;
                    fromconnection = data[station].connection;
                    foundFrom = true;
                    break;
                }
            }

            for (let p in data) {
                if (data[p].stop_name === to) {
                    tod = data[p].distance;
                    lineto = data[p].Line;
                    for (let i = 0; i < lines.length; i++) {
                        if (
                            lines[i].name.toLowerCase() === lineto.toLowerCase()
                        ) {
                            ballstationcssto = `background-color:${lines[i].stroke};width:8px;height:8px;border-radius:50%;display:inline-block;margin-right:6px;`;
                            break;
                        }
                    }
                    toe = data[p].stop_layout;
                    toconnection = data[p].connection;
                    foundTo = true;
                    break;
                }
            }

            if (!foundFrom || !foundTo) return;
            distance = Math.abs(tod - fromd).toFixed(2) + " km";
        } catch (err) {
            console.error("Route API error:", err);
            routenofoundcss = "display:block";
            routecss = "display:none";
            routeFound = false;
        }
    };
</script>

<Snackbar bind:this={snackbarWithoutClose}>
    <Label style="color:white;">This feature is under development</Label>
</Snackbar>

<div class="app-shell">
    <!-- ── TOP NAV ── -->
    <header class="top-bar">
        <m3e-segmented-button style="width:100%" hide-selection-indicator>
            <m3e-button-segment
                style="text-align: center;"
                checked
                on:click={() => (activeTab = "planner")}
                >Planner</m3e-button-segment
            >
            <m3e-button-segment
                style="text-align: center;"
                on:click={() => (activeTab = "lines")}>Lines</m3e-button-segment
            >
            <m3e-button-segment
                style="text-align: center;"
                on:click={() => (activeTab = "map")}>Map</m3e-button-segment
            >
            <!-- Additional segments omitted for brevity -->
        </m3e-segmented-button>
        <div class="logo-mark"></div>
    </header>

    <!-- ── MAP TAB ── -->
    {#if activeTab === "map"}
        <div class="map-fullscreen">
            <LeafletMap />
        </div>
    {/if}

    <!-- ── LINES TAB ── -->
    {#if activeTab === "lines"}
        <div class="tab-content">
            <m3e-action-list style="text-align: left;" variant="segmented">
                {#each Object.entries(metroLines) as [lineName, stations]}
                    <m3e-expandable-list-item>
                        {lineName}

                        <div slot="items">
                            {#each stations as station}
                                <m3e-list-action
                                    on:click={() =>
                                        open(`/station?id=${station}`)}
                                >
                                    <m3e-icon-button
                                        variant="tonal"
                                        slot="leading"
                                        opticalSize="48"
                                        name="directions_subway"
                                    >
                                        <m3e-icon
                                            opticalSize="48"
                                            name="directions_subway"
                                        ></m3e-icon>
                                    </m3e-icon-button>

                                    {station}
                                </m3e-list-action>
                            {/each}
                        </div>
                    </m3e-expandable-list-item>
                {/each}
            </m3e-action-list>
        </div>
    {/if}

    <!-- ── PLANNER TAB ── -->
    {#if activeTab === "planner"}
        <div class="tab-content">
            <!-- <m3e-card
                variant="filled"
                style="margin-top:10px; margin-bottom: 10px;"
            >
                <img
                    slot="header"
                    style="object-fit: cover; width: 500px; overflow: hidden; max-width: 450px;"
                    width="450px"
                    src="/noice2.png"
                />
            </m3e-card> -->

            <!-- Search card -->
            <m3e-card variant="filled">
                <div slot="content" class="search-inputs">
                    <m3e-form-field style="width: 100%;">
                        <label slot="label" for="fromfield">Leaving from</label>
                        <input
                            on:input={(e) => (from = e.target.value)}
                            id="fromfield"
                        />
                    </m3e-form-field>
                    <m3e-autocomplete for="fromfield">
                        {#each stations as station}
                            <m3e-option
                                value={station}
                                on:click={() => (from = station)}
                            >
                                {station}
                            </m3e-option>
                        {/each}
                    </m3e-autocomplete>

                    <m3e-form-field style="width: 100%;">
                        <label slot="label" for="tofield">Heading to</label>
                        <input
                            on:input={(e) => (to = e.target.value)}
                            id="tofield"
                        />
                    </m3e-form-field>
                    <m3e-autocomplete for="tofield">
                        {#each stations as station}
                            <m3e-option
                                value={station}
                                on:click={() => (to = station)}
                            >
                                {station}
                            </m3e-option>
                        {/each}
                    </m3e-autocomplete>

                    <m3e-icon-button
                        class="swap-btn"
                        on:click={swapStations}
                        aria-label="Swap stations"
                        variant="elevated"
                    >
                        <m3e-icon name="swap_vertical" />
                    </m3e-icon-button>
                </div>
                <div slot="actions" end>
                    <m3e-button
                        style="width: 100%;"
                        on:click={() => distancebwstations()}
                        variant="filled">Search Route</m3e-button
                    >
                </div>
            </m3e-card>
            <br />
            <div class="quick-chips-row">
                <m3e-assist-chip
                    on:click={() => (to = "Shaheed Sthal (New Bus Adda)")}
                >
                    <m3e-icon slot="icon" name="home"></m3e-icon>
                    Home
                </m3e-assist-chip>

                <m3e-assist-chip on:click={() => (to = "Vishwavidyalaya")}>
                    <m3e-icon slot="icon" name="school"></m3e-icon>
                    School
                </m3e-assist-chip>

                <m3e-assist-chip on:click={() => (to = "Rajiv Chowk")}>
                    <m3e-icon slot="icon" name="history"></m3e-icon>
                    Rajiv Chowk
                </m3e-assist-chip>
                <m3e-assist-chip
                    variant="elevated"
                    on:click={() => (to = "Shaheed Sthal (New Bus Adda)")}
                >
                    <m3e-icon slot="icon" name="edit"></m3e-icon>
                    Edit
                </m3e-assist-chip>
            </div>

            <!-- Nearest station -->
            {#if ifstationfound}
                <div class="section-eyebrow" style="margin-top:28px;">
                    NEAREST STATION
                </div>
                <!-- <div class="nearest-card">

                    </div>
                </div> -->
                <m3e-card variant="outlined">
                    <div class="nearest-body">
                        <div>
                            <m3e-typography variant="subtitle1">
                                {nearestStation.stop_name}
                            </m3e-typography>
                            <div class="nearest-dist">
                                ~ {(minDistance * 1000).toFixed(0)}m away
                            </div>
                        </div>
                        <div class="nearest-actions">
                            <m3e-button
                                variant="tonal"
                                on:click={googlemapslink}
                            >
                                <m3e-icon name="map_marker"></m3e-icon>
                                Directions
                            </m3e-button>
                            <m3e-button
                                variant="outlined"
                                on:click={openuberlink}
                            >
                                <m3e-icon name="local_taxi"></m3e-icon>
                                Uber
                            </m3e-button>
                        </div>
                    </div>
                    <div class="nearest-meta">
                        <div class="meta-chip">
                            <div slot="content">LINE</div>
                            <span class="chip-val">{nearestStation.Line}</span>
                        </div>
                        <div class="meta-chip">
                            <span class="chip-label">LAYOUT</span>
                            <span class="chip-val"
                                >{nearestStation.stop_layout}</span
                            >
                        </div>
                    </div></m3e-card
                >
            {:else}
                <!-- <div class="no-location">
                    <img width="120" height="120" src="/noloc.svg" alt="" />
                    <p>Location access required</p>
                </div> -->
            {/if}

            <!-- Route result -->
            {#if routeFound && frome && toe !== "undefined"}
                <!-- Schematic -->
                <br />
                <m3e-card
                    style="max-width: 100%; height: 200px;"
                    variant="outlined"
                >
                    <SchematicRouteWeb route={rawroute} />
                </m3e-card>

                <!-- Summary stats card -->
                <m3e-card variant="outlined" class="stats-card" id="capture">
                    <div class="stats-endpoints">
                        <div class="endpoint from-ep">
                            <div
                                class="ep-dot"
                                style={ballstationcssfrom}
                            ></div>
                            <div>
                                <div class="ep-name">{from}</div>
                                <div class="ep-line">{linefrom}</div>
                            </div>
                        </div>
                        <div class="endpoint-arrow">
                            <svg
                                width="20"
                                height="20"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                stroke-width="2"
                                ><path d="M5 12h14M12 5l7 7-7 7" /></svg
                            >
                        </div>
                        <div class="endpoint to-ep">
                            <div class="ep-dot" style={ballstationcssto}></div>
                            <div>
                                <div class="ep-name">{to}</div>
                                <div class="ep-line">{lineto}</div>
                            </div>
                        </div>
                    </div>

                    <div class="stats-row">
                        <div class="stat-item">
                            <svg
                                width="22"
                                height="22"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                stroke-width="2"
                                ><circle cx="12" cy="12" r="3" /><line
                                    x1="12"
                                    y1="2"
                                    x2="12"
                                    y2="6"
                                /><line x1="12" y1="18" x2="12" y2="22" /><line
                                    x1="2"
                                    y1="12"
                                    x2="6"
                                    y2="12"
                                /><line x1="18" y1="12" x2="22" y2="12" /></svg
                            >
                            <span class="stat-val">{route.length}</span>
                            <span class="stat-label">Stations</span>
                        </div>
                        <div class="stat-divider"></div>
                        <div class="stat-item">
                            <svg
                                width="22"
                                height="22"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                stroke-width="2"
                                ><path
                                    d="M17 3l4 4-4 4M7 21l-4-4 4-4M21 7H3M3 17h18"
                                /></svg
                            >
                            <span class="stat-val">{transferCount}</span>
                            <span class="stat-label">Transfers</span>
                        </div>
                        <div class="stat-divider"></div>
                        <div class="stat-item">
                            <svg
                                width="22"
                                height="22"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                stroke-width="2"
                                ><circle cx="12" cy="12" r="10" /><path
                                    d="M12 6v6l4 2"
                                /></svg
                            >
                            <span class="stat-val">{distance}</span>
                            <span class="stat-label">Distance</span>
                        </div>
                    </div>
                </m3e-card>

                <!-- Stations list -->
                <div class="section-eyebrow" style="margin-top:28px;">
                    STATIONS LIST
                </div>
                <m3e-card variant="outlined" class="stations-list">
                    {#each route as st, idx}
                        <div
                            class="station-row"
                            class:is-transfer={st.isTransfer}
                        >
                            <div class="station-timeline">
                                <div
                                    class="tl-dot"
                                    class:tl-first={idx === 0}
                                    class:tl-last={idx === route.length - 1}
                                    class:tl-transfer={st.isTransfer}
                                ></div>
                                {#if idx !== route.length - 1}
                                    <div
                                        class="tl-line"
                                        class:tl-line-blue={route[idx + 1]
                                            ?.isTransfer}
                                    ></div>
                                {/if}
                            </div>
                            <div class="station-info">
                                <span class="station-row-name"
                                    >{st.station}</span
                                >
                                {#if st.isTransfer}
                                    <span class="transfer-tag"
                                        >↔ Change to {st.line}</span
                                    >
                                {/if}
                            </div>
                        </div>
                    {/each}
                </m3e-card>

                <button class="screenshot-btn" on:click={saveScreenshot}>
                    <svg
                        width="16"
                        height="16"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        stroke-width="2"
                        ><path
                            d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"
                        /><circle cx="12" cy="13" r="4" /></svg
                    >
                    Save Route Screenshot
                </button>
            {/if}

            {#if routeFound === false && from && to}
                <div class="no-route-msg">
                    <svg
                        width="40"
                        height="40"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="#555"
                        stroke-width="1.5"
                        ><circle cx="12" cy="12" r="10" /><line
                            x1="12"
                            y1="8"
                            x2="12"
                            y2="12"
                        /><line x1="12" y1="16" x2="12.01" y2="16" /></svg
                    >
                    <p>Couldn't find a route between these stations.</p>
                </div>
            {/if}
        </div>
    {/if}

    <!-- Footer -->
    <footer class="app-footer">
        <p>
            Powered by <a href="https://openmaptiles.org/" target="_blank"
                >OpenMapTiles</a
            >
            ·
            <a href="https://otd.delhi.gov.in/data/staticDMRC/" target="_blank"
                >Open Transit Data Delhi</a
            >
        </p>
        <p class="disclaimer">
            * Detro is not affiliated with DMRC or Delhi Government.
        </p>
    </footer>
</div>

<style>
    /* ── RESET & TOKENS ── */
    :global(body) {
        margin: 0;
        color: var(--md-sys-color-on-background, #e8e8ea);
        font-family:
            "DM Sans", "Manrope", "SF Pro Display", system-ui, sans-serif;
        -webkit-font-smoothing: antialiased;
        scrollbar-width: none;
    }

    .app-shell {
        scrollbar-width: none;
        min-height: 100vh;
        background: var(--md-sys-color-background, #131316);
        /* Use surface-variant for the subtle dot pattern */
        background-image: radial-gradient(
            circle,
            var(--md-sys-color-surface-variant, #2a2a2e) 1px,
            transparent 1px
        );
        background-size: 22px 22px;
        margin: 0 auto;
        position: relative;
        padding-bottom: 60px;
    }

    /* ── TOP BAR ── */
    .top-bar {
        display: flex;
        align-items: center;
        justify-content: space-between;
        padding: 16px 20px 12px;

        top: 0;
        /* Using color-mix to get that 88% opacity blur effect on the M3 surface color */
        background: color-mix(
            in srgb,
            var(--md-sys-color-surface, #131316) 88%,
            transparent
        );
        backdrop-filter: blur(12px);
        -webkit-backdrop-filter: blur(12px);
        z-index: 100;
    }

    .logo-mark {
        display: flex;
        align-items: center;
        gap: 8px;
    }
    .logo-icon {
        width: 32px;
        height: 32px;
        border-radius: 9px;
        background: var(
            --md-sys-color-error-container,
            rgba(192, 40, 44, 0.15)
        );
        display: flex;
        align-items: center;
        justify-content: center;
        border: 1px solid var(--md-sys-color-error, rgba(192, 40, 44, 0.3));
    }
    .logo-text {
        font-size: 1.25rem;
        font-weight: 800;
        letter-spacing: -0.03em;
        color: var(--md-sys-color-on-surface, #fff);
    }

    .tab-nav {
        display: flex;
        background: var(
            --md-sys-color-surface-container-highest,
            rgba(255, 255, 255, 0.06)
        );
        border-radius: 10px;
        padding: 3px;
        gap: 2px;
    }
    .tab-btn {
        background: transparent;
        border: none;
        color: var(--md-sys-color-on-surface-variant, #666);
        font-size: 0.78rem;
        font-weight: 600;
        padding: 6px 12px;
        border-radius: 8px;
        cursor: pointer;
        transition: all 0.18s;
        font-family: inherit;
    }
    .tab-btn.active {
        background: var(--md-sys-color-primary, #c0282c);
        color: var(--md-sys-color-on-primary, #fff);
    }

    /* ── TAB CONTENT ── */
    .tab-content {
        padding: 20px 16px 0;
    }

    .section-eyebrow {
        font-size: 0.68rem;
        font-weight: 800;
        letter-spacing: 1.2px;
        color: var(--md-sys-color-on-surface-variant, #555);
        padding: 0 4px 10px;
    }

    /* ── MAP ── */
    .map-fullscreen {
        height: calc(100vh - 65px);
    }

    /* ── SEARCH CARD ── */
    .search-card {
        background: var(--md-sys-color-surface-container, #1e1e22);
        border-radius: 22px;
        padding: 14px;
        border: 1px solid
            var(--md-sys-color-outline-variant, rgba(255, 255, 255, 0.07));
    }

    .search-well {
        background: var(
            --md-sys-color-surface-container-low,
            rgba(255, 255, 255, 0.04)
        );
        border-radius: 16px;
        display: flex;
        align-items: stretch;
        padding: 12px 14px;
        margin-bottom: 12px;
        position: relative;
        border: 1px solid
            var(--md-sys-color-outline-variant, rgba(255, 255, 255, 0.06));
    }

    .journey-track {
        display: flex;
        flex-direction: column;
        align-items: center;
        padding-right: 14px;
        padding-top: 2px;
        gap: 2px;
    }
    .track-circle {
        width: 10px;
        height: 10px;
        border: 2.5px solid var(--md-sys-color-primary, #c0282c);
        border-radius: 50%;
        background: var(--md-sys-color-background, #131316);
        flex-shrink: 0;
        margin-top: 14px;
    }
    .track-dash {
        flex: 1;
        width: 2px;
        border-left: 2px dashed
            var(--md-sys-color-outline-variant, rgba(255, 255, 255, 0.12));
        min-height: 20px;
    }
    .track-square {
        width: 8px;
        height: 8px;
        background: var(--md-sys-color-primary, #c0282c);
        border-radius: 2px;
        flex-shrink: 0;
        margin-bottom: 14px;
    }

    .search-inputs {
        flex: 1;
        display: flex;
        flex-direction: column;
    }
    .search-field {
        height: 44px;
        display: flex;
        align-items: center;
    }

    .search-input {
        width: 100%;
        background: transparent;
        border: none;
        outline: none;
        font-size: 0.95rem;
        font-weight: 500;
        color: var(--md-sys-color-on-surface, #e8e8ea);
        font-family: inherit;
    }
    .search-input::placeholder {
        color: var(--md-sys-color-on-surface-variant, #444);
    }

    .field-divider {
        height: 1px;
        background: var(
            --md-sys-color-outline-variant,
            rgba(255, 255, 255, 0.07)
        );
        width: 100%;
    }

    .swap-btn {
        position: absolute;
        right: 46%;
        top: 35%;
        transform: translateY(-50%);
        background: var(--md-sys-color-surface-container-high, #2a2a2e);
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        color: var(--md-sys-color-on-surface-variant, #888);
        cursor: pointer;
        transition: background 0.15s;
    }
    .swap-btn:hover {
        background: var(--md-sys-color-surface-container-highest, #333);
        color: var(--md-sys-color-on-surface, #fff);
    }

    .search-btn {
        width: 100%;
        background: var(--md-sys-color-primary, #c0282c);
        color: var(--md-sys-color-on-primary, #fff);
        border: none;
        padding: 14px;
        border-radius: 14px;
        font-weight: 700;
        font-size: 0.95rem;
        cursor: pointer;
        font-family: inherit;
        letter-spacing: 0.01em;
        transition:
            opacity 0.15s,
            transform 0.1s;
    }
    .search-btn:active {
        opacity: 0.85;
        transform: scale(0.98);
    }

    /* ── NEAREST STATION ── */
    .nearest-card {
        background: var(--md-sys-color-surface-container, #1e1e22);
        border-radius: 20px;
        border: 1px solid
            var(--md-sys-color-outline-variant, rgba(255, 255, 255, 0.07));
        overflow: hidden;
    }
    .nearest-body {
        display: flex;
        justify-content: space-between;
        align-items: flex-start;
        padding: 16px 16px 12px;
    }
    .nearest-name {
        font-size: 1.2rem;
        font-weight: 800;
        color: var(--md-sys-color-on-surface, #fff);
        letter-spacing: -0.02em;
    }
    .nearest-dist {
        font-size: 0.8rem;
        color: var(--md-sys-color-on-surface-variant, #555);
        margin-top: 3px;
        font-weight: 500;
    }

    .nearest-actions {
        display: flex;
        gap: 8px;
        margin-top: 4px;
    }
    .action-pill {
        display: flex;
        align-items: center;
        gap: 6px;
        padding: 8px 14px;
        border-radius: 30px;
        border: none;
        font-size: 0.78rem;
        font-weight: 700;
        cursor: pointer;
        font-family: inherit;
        background: var(
            --md-sys-color-secondary-container,
            rgba(21, 116, 234, 0.18)
        );
        color: var(--md-sys-color-on-secondary-container, #4a9eff);
        transition: background 0.15s;
    }
    .action-pill:hover {
        filter: brightness(1.1);
    }
    .action-pill.uber {
        background: var(
            --md-sys-color-surface-container-high,
            rgba(255, 255, 255, 0.06)
        );
        color: var(--md-sys-color-on-surface-variant, #aaa);
    }

    .nearest-meta {
        display: flex;
        gap: 0;
        border-top: 1px solid
            var(--md-sys-color-outline-variant, rgba(255, 255, 255, 0.06));
        padding: 0 16px;
    }
    .meta-chip {
        flex: 1;
        padding: 10px 0;
        display: flex;
        flex-direction: column;
        gap: 2px;
    }
    .meta-chip + .meta-chip {
        border-left: 1px solid
            var(--md-sys-color-outline-variant, rgba(255, 255, 255, 0.06));
        padding-left: 16px;
    }
    .chip-label {
        font-size: 0.6rem;
        color: var(--md-sys-color-on-surface-variant, #444);
        font-weight: 700;
        letter-spacing: 0.8px;
    }
    .chip-val {
        font-size: 0.82rem;
        color: var(--md-sys-color-on-surface, #ccc);
        font-weight: 600;
    }

    /* ── NO LOCATION ── */
    .no-location {
        display: flex;
        flex-direction: column;
        align-items: center;
        padding: 32px 16px;
        gap: 12px;
    }
    .no-location p {
        color: var(--md-sys-color-on-surface-variant, #444);
        font-size: 0.9rem;
        font-weight: 500;
    }

    /* ── SCHEMATIC ── */
    .schematic-wrap {
        margin-top: 24px;
        border-radius: 20px;
        overflow: hidden;
        background: var(--md-sys-color-surface-container, #1e1e22);
        border: 1px solid
            var(--md-sys-color-outline-variant, rgba(255, 255, 255, 0.07));
        height: 200px;
    }

    /* ── STATS CARD ── */
    .stats-card {
        background: var(--md-sys-color-surface-container, #1e1e22);
        border-radius: 20px;
        border: 1px solid
            var(--md-sys-color-outline-variant, rgba(255, 255, 255, 0.07));
        overflow: hidden;
        margin-top: 12px;
    }
    .stats-endpoints {
        display: flex;
        align-items: center;
        padding: 16px;
        gap: 10px;
        border-bottom: 1px solid
            var(--md-sys-color-outline-variant, rgba(255, 255, 255, 0.06));
    }
    .endpoint {
        display: flex;
        align-items: center;
        gap: 10px;
        flex: 1;
    }
    .to-ep {
        justify-content: flex-end;
        text-align: right;
    }
    .ep-dot {
        width: 10px;
        height: 10px;
        border-radius: 50%;
        flex-shrink: 0;
    }
    .ep-name {
        font-size: 0.9rem;
        font-weight: 700;
        color: var(--md-sys-color-on-surface, #e8e8ea);
    }
    .ep-line {
        font-size: 0.7rem;
        color: var(--md-sys-color-on-surface-variant, #555);
        font-weight: 500;
        margin-top: 1px;
    }
    .endpoint-arrow {
        color: var(--md-sys-color-on-surface-variant, #333);
        flex-shrink: 0;
    }

    .stats-row {
        display: flex;
        padding: 14px 16px;
        gap: 0;
    }
    .stat-item {
        flex: 1;
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 4px;
        color: var(--md-sys-color-on-surface-variant, #555);
    }
    .stat-val {
        font-size: 1.3rem;
        font-weight: 800;
        color: var(--md-sys-color-on-surface, #fff);
        line-height: 1;
    }
    .stat-label {
        font-size: 0.68rem;
        color: var(--md-sys-color-on-surface-variant, #444);
        font-weight: 600;
        letter-spacing: 0.5px;
    }
    .stat-divider {
        width: 1px;
        background: var(
            --md-sys-color-outline-variant,
            rgba(255, 255, 255, 0.06)
        );
        margin: 4px 0;
    }

    /* ── STATIONS LIST ── */
    .stations-list {
        background: var(--md-sys-color-surface-container, #1e1e22);
        border-radius: 20px;
        border: 1px solid
            var(--md-sys-color-outline-variant, rgba(255, 255, 255, 0.07));
        overflow: hidden;
        padding: 8px 16px;
    }

    .station-row {
        display: flex;
        align-items: flex-start;
        gap: 16px;
    }

    .station-timeline {
        display: flex;
        flex-direction: column;
        align-items: center;
        width: 20px;
        flex-shrink: 0;
    }

    .tl-dot {
        width: 10px;
        height: 10px;
        border-radius: 50%;
        border: 2.5px solid var(--md-sys-color-primary, #c0282c);
        background: var(--md-sys-color-background, #131316);
        flex-shrink: 0;
        margin-top: 14px;
        z-index: 1;
    }
    .tl-first,
    .tl-last {
        background: var(--md-sys-color-primary, #c0282c);
    }
    .tl-transfer {
        border-color: var(--md-sys-color-tertiary, #4a9eff);
        background: var(--md-sys-color-tertiary, #4a9eff);
    }

    .tl-line {
        width: 2px;
        flex: 1;
        min-height: 16px;
        background: var(
            --md-sys-color-outline-variant,
            rgba(255, 255, 255, 0.1)
        );
        margin-top: 3px;
    }
    .tl-line-blue {
        background: var(
            --md-sys-color-tertiary-container,
            rgba(74, 158, 255, 0.3)
        );
    }

    .station-info {
        padding: 10px 0 10px;
        flex: 1;
    }
    .station-row-name {
        font-size: 0.92rem;
        font-weight: 600;
        color: var(--md-sys-color-on-surface, #d0d0d4);
    }
    .transfer-tag {
        display: inline-block;
        margin-top: 4px;
        padding: 3px 10px;
        border-radius: 999px;
        background: var(
            --md-sys-color-tertiary-container,
            rgba(74, 158, 255, 0.12)
        );
        color: var(--md-sys-color-on-tertiary-container, #4a9eff);
        font-size: 0.72rem;
        font-weight: 700;
    }

    /* ── SCREENSHOT BTN ── */
    .screenshot-btn {
        display: flex;
        align-items: center;
        gap: 8px;
        margin: 16px auto 0;
        background: transparent;
        border: 1px solid
            var(--md-sys-color-outline-variant, rgba(255, 255, 255, 0.12));
        color: var(--md-sys-color-on-surface-variant, #666);
        padding: 12px 24px;
        border-radius: 12px;
        font-size: 0.85rem;
        font-weight: 600;
        cursor: pointer;
        font-family: inherit;
        transition: all 0.15s;
        width: 100%;
        justify-content: center;
    }
    .screenshot-btn:hover {
        border-color: var(--md-sys-color-outline, rgba(255, 255, 255, 0.22));
        color: var(--md-sys-color-on-surface, #aaa);
    }

    /* ── NO ROUTE ── */
    .no-route-msg {
        display: flex;
        flex-direction: column;
        align-items: center;
        padding: 40px 16px;
        gap: 12px;
        color: var(--md-sys-color-on-surface-variant, #444);
        text-align: center;
        font-size: 0.9rem;
        font-weight: 500;
    }

    /* ── LINES TAB ── */
    .lines-list {
        display: flex;
        flex-direction: column;
        gap: 12px;
    }

    .line-card {
        display: flex;
        align-items: center;
        background: var(--md-sys-color-surface-container, #1e1e22);
        border-radius: 18px;
        border: 1px solid
            var(--md-sys-color-outline-variant, rgba(255, 255, 255, 0.07));
        padding: 14px 16px;
        gap: 14px;
        cursor: pointer;
        transition: background 0.15s;
    }
    .line-card:active {
        background: var(--md-sys-color-surface-container-highest, #222227);
    }

    .line-stripe {
        width: 5px;
        height: 48px;
        border-radius: 10px;
        flex-shrink: 0;
    }
    .line-info {
        flex: 1;
        display: flex;
        flex-direction: column;
        gap: 3px;
    }
    .line-name-row {
        display: flex;
        align-items: center;
        gap: 10px;
    }
    .line-name {
        font-size: 1.05rem;
        font-weight: 800;
        color: var(--md-sys-color-on-surface, #e8e8ea);
        letter-spacing: -0.02em;
    }
    .station-badge {
        font-size: 0.62rem;
        font-weight: 800;
        color: var(--md-sys-color-on-surface-variant, #444);
        background: var(
            --md-sys-color-surface-container-highest,
            rgba(255, 255, 255, 0.05)
        );
        padding: 3px 8px;
        border-radius: 6px;
        letter-spacing: 0.5px;
    }
    .line-region {
        font-size: 0.72rem;
        color: var(--md-sys-color-on-surface-variant, #444);
        font-weight: 600;
        letter-spacing: 0.5px;
    }
    .line-chevron {
        color: var(--md-sys-color-on-surface-variant, #333);
    }

    .stations-peek {
        display: flex;
        flex-direction: column;
        gap: 7px;
        padding: 4px 0 8px 35px;
    }
    .peek-row {
        display: flex;
        align-items: center;
        gap: 10px;
    }
    .peek-dot {
        width: 6px;
        height: 6px;
        border-radius: 50%;
        flex-shrink: 0;
    }
    .peek-name {
        font-size: 0.82rem;
        color: var(--md-sys-color-on-surface-variant, #444);
        font-weight: 500;
    }

    /* ── FOOTER ── */
    .app-footer {
        text-align: center;
        padding: 32px 20px 20px;
        font-size: 0.72rem;
        color: var(--md-sys-color-on-surface-variant, #333);
        line-height: 1.6;
    }
    .app-footer a {
        color: var(--md-sys-color-on-surface-variant, #444);
        text-decoration: none;
    }
    .app-footer a:hover {
        color: var(--md-sys-color-on-surface, #666);
    }
    .disclaimer {
        font-size: 0.68rem;
        color: var(--md-sys-color-on-background, #2a2a2a);
        margin-top: 4px;
        opacity: 0.7;
    }
</style>
