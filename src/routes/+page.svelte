<script>
	import LeafletMap from '$lib/LeafletMap.svelte';
  	import { onMount } from 'svelte';
	import Autocomplete from '@smui-extra/autocomplete';

	import Snackbar, { Actions } from '@smui/snackbar';
	import Textfield from '@smui/textfield';
    import Card, {
    Content,
    PrimaryAction,
    ActionButtons,
    ActionIcons,
  } from '@smui/card';
  import Button, { Label } from '@smui/button';
  import IconButton, { Icon } from '@smui/icon-button';
  import html2canvas from 'html2canvas'; // Import html2canvas library
  import { get } from 'svelte/store';

  async function saveScreenshot() {
    const captureElement = document.getElementById("capture"); // Get the element to capture
    const canvas = await html2canvas(captureElement); // Capture the element as a canvas
    const dataURL = canvas.toDataURL(); // Convert canvas to data URL
    const link = document.createElement('a'); // Create a new anchor tag
    link.download = 'screenshot.png'; // Set the download attribute to specify the filename
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
"Depot Station"
]
  let fromd;
  let routecss = "display:block"
  let routenofoundcss = "display:none"
  let linefrom;
  let ballstationcssto
  let ballstationcssfrom
  let toconnection;
  let fromconnection;
  let lineto;
  let frome;
  let latitude;
  let longitude;
  let tod;
  let toe;
	export let to = ""
	export let from = ""
  let lines = [];
  let linedata;
	let metrod;
  let distancebw;
  let i = -1;
	let textOutlined= ''
	let data = [];
  let distance = "Search to get the distance...";
	let snackbarWithoutClose= Snackbar;
  let route = [];

    // Function to find route
    function listStationsOnRoute(route) {
        const stationList = route.map(station => station.stop_name);
        return stationList;
    }

    // Function to visualize route with all stations
    function visualizeRoute(route) {
        let routeString = "Route:\n";
        route.forEach((station, index) => {
            if (index !== route.length - 1) {
                routeString += station + " -> ";
            } else {
                routeString += station;
            }
        });
        return routeString;
    }



    function getUserLocation() {
            if (navigator.geolocation) {
                navigator.geolocation.getCurrentPosition(showPosition);
            } else {
                alert("Geolocation is not supported by this browser.");
            }
        }

        function haversine(lat1, lon1, lat2, lon2) {
    const toRad = (value) => (value * Math.PI) / 180;
    const R = 6371; // Radius of the Earth in kilometers

    const dLat = toRad(lat2 - lat1);
    const dLon = toRad(lon2 - lon1);

    const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
              Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) *
              Math.sin(dLon / 2) * Math.sin(dLon / 2);

    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const distance = R * c;

    return distance; // Distance in kilometers
  }

  // Function to find the nearest metro station
 
let nearestStation;
let minDistance;

function findNearestMetroStation(userLat, userLon, stationList) {
  nearestStation = null;
  minDistance = Infinity;

  stationList.forEach(station => {
    const stationLat = parseFloat(station.stop_lat);
    const stationLon = parseFloat(station.stop_lon);
    const distance = haversine(userLat, userLon, stationLat, stationLon);
    console.log(`Station: ${station.stop_name}, Distance: ${distance}`);
    if (distance < minDistance) {
      minDistance = distance;
      nearestStation = station;
    }
  });

  console.log("Nearest station:", nearestStation, "distance:", minDistance);
  ifstationfound = true;
  return { nearestStation, minDistance };
}

  let ifstationfound = false;

 

        function showPosition(position) {
            if (navigator.geolocation) {
              navigator.geolocation.getCurrentPosition(showPosition, function(error) {
              switch(error.code) {
              case error.PERMISSION_DENIED:
                alert("User denied the request for Geolocation.");
                break;
              }
              });
              } else {
              alert("Geolocation is not supported by this browser.");
              }
            latitude = position.coords.latitude;
            longitude = position.coords.longitude;
            console.log(latitude,longitude)
            nearestStation, minDistance = findNearestMetroStation(latitude, longitude, data);
            if (nearestStation) {
              // Access properties of nearestStation here
              console.log("Nearest metro station:", nearestStation.stop_id);
            } else {
              console.log("Nearest metro station not found.");
              alert("we are unable to get your location or having some issues...")
            }
            }

        function openuberlink(){
          generateUberDeepLink(nearestStation.stop_lat,nearestStation.stop_lon)
        }

        function googlemapslink(lat,lon){
          window.open(`https://www.google.com/maps?saddr=My+Location&daddr=${nearestStation.stop_name} metro station`);
        }

        function generateUberDeepLink(lat,lon) {
            console.log("Nearest station:", nearestStation.stop_name);
            console.log(`https://m.uber.com/ul/?action=setPickup&pickup[latitude]=${latitude}&pickup[longitude]=${longitude}&dropoff[latitude]=${lat}&dropoff[longitude]=${lon}`)
            window.open(`https://m.uber.com/ul/?action=setPickup&pickup[latitude]=${latitude}&pickup[longitude]=${longitude}&dropoff[latitude]=${lat}&dropoff[longitude]=${lon}`)
      }


	onMount(async () => {

		metrod = await fetch("/stationsdata.json")
		data = await metrod.json()
		console.log(data)

    linedata = await fetch("/lines.json");
    linedata = await linedata.json();
    lines = linedata;
    console.log(linedata);


    console.log(nearestStation)
	})


  
// Function to find route
function organizeStations(stationsData) {
    const stationsByLine = {};

    stationsData.forEach(station => {
        const line = station.Line;
        if (!stationsByLine[line]) {
            stationsByLine[line] = [];
        }
        stationsByLine[line].push(station);
    });

    return stationsByLine;
}

// Function to find route
function findRoute(startStation, endStation, stationsByLine) {
        for (const line in stationsByLine) {
            const stationsOnLine = stationsByLine[line];
            const startIndex = stationsOnLine.findIndex(station => station.stop_name === startStation);
            const endIndex = stationsOnLine.findIndex(station => station.stop_name === endStation);

            if (startIndex !== -1 && endIndex !== -1) {
                // Ensure start station comes before end station
                const route = startIndex < endIndex ? stationsOnLine.slice(startIndex, endIndex + 1) : stationsOnLine.slice(endIndex, startIndex + 1).reverse();
                return route.map(station => station.stop_name);
            }
        }
        return null; // No route found
    }

// Function to visualize route with all stations


// Example usage




let distancebwstations = () =>{
  let found = false;
    const stationsByLine = organizeStations(data);
    console.log(stationsByLine);

    route = findRoute(from, to, stationsByLine);

    if (route) {
        routenofoundcss= "display:none"
        routecss = "display: block"
        console.log("Route found:", route);
        route.map(station => console.log(station));
        listStationsOnRoute(route);
    } else {
        routenofoundcss= "display:block"
        routecss = "display: none"
        route = stations;

    }
for (let station in data) {
    if (data[station].stop_name === from) {
        fromd = data[station].distance;
        linefrom = data[station].Line
        console.log(fromd)
        for (let o = 0; o < lines.length; o++) {
      if (lines[o].name.toLowerCase() === linefrom.toLowerCase()) { // Convert to lowercase for case-insensitive comparison
        console.log(lines[o].stroke);
        ballstationcssfrom = `background-color: ${lines[o].stroke}; border: 1px; width: 10px; height: 10px; border-radius: 90%; margin-top: 22px; margin-right: 10px;`;
        break; // Exit the loop once a match is found
      }
    }
        frome = data[station].stop_layout; // Corrected typo
        fromconnection = data[station].connection
        found = true;
        break; // Exit loop after finding the station
    }
}

if (!found) {
    console.log("Station not found!");
}
   for (let p in data){
    if (data[p].stop_name === to){
      tod = data[p].distance
      lineto = data[p].Line
      for (let i = 0; i < lines.length; i++) {
      if (lines[i].name.toLowerCase() === lineto.toLowerCase()) { // Convert to lowercase for case-insensitive comparison
        console.log(lines[i].stroke);
        ballstationcssto = `background-color: ${lines[i].stroke}; border: 1px; width: 10px; height: 10px; border-radius: 90%; margin-top: 22px; margin-right: 10px;`;
        break; // Exit the loop once a match is found
      }
    }
      toe = data[p].stop_layout
      toconnection = data[p].connection;
      if(tod==null){
        distance = "Cannot be determind as we cant get the station info"
      }
      else{
        console.log(tod)
      }
    }
   }
   let d = fromd - tod;
   distancebw = d.toFixed(0);
   if(Math.sign(d) == -1){
    distancebw = -(distancebw)
   }
   else{
    
   }
   distance = "The Distance Between " + from +" and "+ to + " is " + distancebw ;
   console.log(d);
   console.log(distance);

}

</script>

			<Snackbar bind:this={snackbarWithoutClose}>
                <Label style="color:white;">This feature is under development </Label>
            </Snackbar>

<div>
<div style="display: flex; align-items: center;">
	<img src="/darklight.png" alt="" width="20px" height="20px">
	<div style="display:flex; justify-content: center; text-align: center; align-items: center; width:100%;">
		<img src="/detero.png" alt="" width="30px" height="30px">
		<h1>DETRO </h1>
		<div height="5px" style="padding:2px; border:1; border-radius: 3px;" >
			<p style="color:#c0282c; margin:0px; padding-right:5px">‎ Beta</p>
		</div>
	</div>
	<img src="/abour.png" alt="" width="20px" height="20px">
</div>
<main>
	<div style="">
		<LeafletMap style="z-index: 900;"/>
	</div>
</main>
<div style="z-index: 950;">

	<div style="background-color: #c0282c;">
	<h1 style="color:white; font-weight:400; padding:10px; text-align: center; font-size: large;">Plan Your Journey</h1>
</div>
<br>
<div class="pickers">
	 <div style="margin-right: 10px;">
    <Autocomplete
      options={stations}
      bind:text={from}
    >
      <Textfield label="From" bind:value={from} variant="outlined" />
    </Autocomplete>
	 </div>
	
	<div class="input1" style="">
    <Autocomplete
	  
      options={stations}
      bind:text={to}
    >
      <Textfield label="To" bind:value={to} variant="outlined" />
    </Autocomplete>
	 </div>
</div>
<br>
<div style="display: flex; justify-content: center; margin:10px;">
	<Button
	on:click={() => distancebwstations()}
    variant="unelevated"
    color="secondary"
    style="width:35%; background-color: #c0282c;"
  >
    <Label style="color:white;">Search</Label>
  </Button>
  <br>
  </div>
</div>
{#if frome && toe !== "undefined"}
<div id="capture">
  <div class="card-container">
      <Card>
        <Content style="background-color: #c0282c; color:white; padding:10px; text-align: center;">{distance} km</Content>
        <div style="display:flex; width:100%;">
          <div style=" width: 100%; text-align: center;">
            <h1>{from}</h1>
            <p> <img src="/undergroundicon.png" alt="" width="18px"> Station Layout : {frome}</p>
            {#if fromconnection !== null}
              <p>Connected To : {fromconnection}</p>
            {/if}
            <div style="display: flex; text-align: center; justify-content: center;">
              <div style={ballstationcssfrom}></div>
              <p>{linefrom}</p>
            </div>
          </div>
          <div style=" width:100%; text-align: center; ">
            <h1>{to}</h1>
            <p> <img src="/undergroundicon.png" alt="" width="18px"> Station Layout : {toe}</p>
            {#if toconnection !== null}
              <p>Connected To : {toconnection}</p>
            {/if}
            <div style="display: flex; text-align: center; justify-content: center;">
              <div style={ballstationcssto}></div>
              <p>{lineto}</p>
            </div>
          </div>
        </div>
      <div style={routecss}>
        <div style="padding: 10px;">
          <h1>Route:-</h1>
          <nav class="stationav">
            <ul class="timeline">
              {#each route as st}
              <li>
                <div class="te">
                  <span class="circle"></span>
                  <span class="st">{st}</span>
                </div>
                </li>
                {/each}
            </ul>
</nav>
        </div>
      </div>
      <div style={routenofoundcss}>
        <h2 style="text-align: center;">We're sorry but we could'nt find the route at this moment.</h2>
      </div>
      </Card>
    </div>
</div>
<br>
<div style="display: flex; justify-content: center; align-items: center;">
      <Button
	on:click={() => saveScreenshot()}
    variant="unelevated"
    color="secondary"
    style="width:35%; background-color: #c0282c;"
  >
    <Label style="color:white;">Save Route</Label>
  </Button>
    </div>
{/if}

<br>
 <Button
	on:click={() => getUserLocation()}
    variant="unelevated"
    color="secondary"
    style="width:100%; background-color: #c0282c;"
  >
    <Label>Get Nearest Metro Station</Label>
  </Button>

  <div>
    {#if ifstationfound == true}
    <Card style="padding:10px;">
      <h2 style="text-align: center;">Your Nearest Station is {nearestStation.stop_name}</h2>
      <Label>Station Line: {nearestStation.Line}</Label>
      <Label>Opened in : {nearestStation.stop_date}</Label>
      <Label>Station Layout : {nearestStation.stop_layout}</Label>
      <br>

      <Button
	on:click={() => openuberlink()}
    variant="unelevated"
    color="secondary"
    style="width:100%; background-color: #000000;"
  >
    <img src="/uberlogo.png" alt="" width="40px" style="margin-right: 5px;">
    <Label>Book a Uber To {nearestStation.stop_name}</Label>
  </Button>
  <br>
  <Button
	on:click={() => googlemapslink()}
    variant="unelevated"
    color="secondary"
    style="width:100%; background-color: #ebf1f0;padding=10px;"
  >
    <img src="/maps.png" alt="" width="20px">
    <Label style="color:black; margin-left: 5px;">Find Route On Google Maps</Label>
  </Button>

    </Card>
    {/if}
    
  
  </div>

</div>
<div style="display: flex; padding:10px; border:1px; border-radius: 10px; background-color: #F5F7FA; margin-top:10px; height:100px; overflow:hidden; align-items: center;">
  <h1 style="font-size:x-large;">Lines</h1>
  <img class="linesimg" src="/linesiconred.png" alt="">
</div>

<div id="lines">
  {#each lines as ld}
    <div style={`display:flex; border:1px; border-style: solid; border-color:grey; border-radius: 6px; text-align: center; background-color:#F5F7FA; padding-left:0px; margin:10px;`}>
      <div style = {`background-color: ${ld.stroke}; width:3%; margin-right:5px; border:1; border-radius:5px`};></div>
      <div style="display: block;">
        <div style="display: flex;">
          <h2 style="margin-top:10px; margin-left: 10px; margin-right:0px margin-bottom: 5px;">{ld.name} - </h2>
          <p style="margin-bottom: 5px; color:black; margin-left: 5px; font-size: small; text-align: left;">{ld.stations} stations</p>
        </div>
          <p style="margin-bottom: 10px; margin-top: 0px; color:grey; margin-left: 10px; font-size: small; text-align: left;">{ld.region}</p>
      </div>
    </div>
    {#each data as d}
      {#if typeof d.Line !== 'undefined'}
        {#if d.Line == ld.name}
        <div>
          <h1>{d.stop_name}</h1>
          <p>{d.stop_id}</p>
        </div>
        {/if}
      {/if}
    {/each}
    <div>
    </div>
  {/each}
</div>

<br>
<br>
<br>



<div style="text-align: center;">
	<h3>Made Possible With</h3>
	<a href="https://openmaptiles.org/" target="_blank">OpenMapTiles</a>
	<a href="https://openmaptiles.org/" target="_blank">Leaflet</a>
	<a href="https://otd.delhi.gov.in/data/staticDMRC/" target="_blank">Open Transit Data Delhi</a>
	<a href="https://openmaptiles.org/" target="_blank">DMRC</a>
</div>

<p style="text-align: center;">*Detro is not associated with DMRC or Delhi Goverment.</p>

<style>
	.arrow{
		margin-right: 5px;
	}
	.card{
		border: 1;
		border-radius: 4px;
	}
	.pickers{
		display: flex; 
		align-items: center;
		justify-content: center;
	}
  .linesimg{
    margin-left:80%;
    transform:translateY(25px);
  }
  .stationav{

  }
  .timeline{
    list-style: none;
    border-left: 8px solid;
    border-color: #c0282c;
    margin-left: 120px;
    padding-left: 30px;
  }
  .timeline li{
    margin: 15px 0;
    position: relative;
  }
  .timeline .st{
    font-size: 1rem;
  }
  .timeline .circle{
    position: absolute;
    width: 8px;
    height: 8px;
    background-color: #ffffff;
    border: 5px solid #c0282c;
    border-radius: 50%;
    left: -43px;
  }

    @media only screen and (max-width: 600px) {
		.pickers{
			display:list-item;
			text-align: center;
			align-items: center;
		}
    .linesimg{
    margin-left:50%;
    transform:translateY(25px);
  }

		.input1{
			margin-top: 15px;
		}
		.arrow{
			display:none;
		}
	}
</style>
