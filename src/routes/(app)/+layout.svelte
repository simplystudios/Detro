<script>
    import { browser } from "$app/environment";

    if (browser) {
        import("@m3e/web/all");
    }
    import { page } from "$app/stores";

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

    let iconml = "arrow_back";
    let iconmt = "settings";
    let goback = () => {
        window.location.href = "/";
    };
    const ishome = $page.url.pathname === "/";
    if (ishome) {
        iconml = "information";
        iconmt = "settings";
        goback = () => {
            window.location.href = "settings";
        };
    }
</script>

<m3e-theme color="#bf2c30" theme="dark">
    <div class="app-container">
        <m3e-app-bar>
            <m3e-icon-button
                slot="leading"
                aria-label="Information"
                variant="outlined"
                style="margin: 5px;"
                on:click={goback()}
            >
                <m3e-icon name={iconml} filled></m3e-icon>
            </m3e-icon-button>

            <span
                slot="title"
                style="display: flex; flex: 1; width: 100%; padding: 0 8px;"
            >
                <m3e-search-view
                    style="width: 100%; flex: 1;"
                    mode="fullscreen"
                >
                    <input slot="input" placeholder="Search..." />
                    <m3e-action-list
                        style="text-align: left;"
                        variant="segmented"
                    >
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
                </m3e-search-view>
            </span>

            <m3e-icon-button
                slot="trailing"
                aria-label="Settings"
                variant="outlined"
                style="margin: 5px;"
            >
                <m3e-icon name={iconmt} filled></m3e-icon>
            </m3e-icon-button>
        </m3e-app-bar>

        <main class="content-area">
            <slot />
        </main>
    </div>
</m3e-theme>

<style>
    /* 1. Force EVERYTHING to respect width boundaries, including padding/borders */
    :global(*),
    :global(*::before),
    :global(*::after) {
        box-sizing: border-box;
    }

    /* 2. Remove flexbox from the body to stop left-side cropping */
    :global(body, html) {
        margin: 0;
        padding: 0;
        height: 100%;
        width: 100vw;
        background-color: black;
        font-family:
            "Inter",
            -apple-system,
            BlinkMacSystemFont,
            sans-serif;
        overflow-x: hidden; /* Stop horizontal scroll */
    }

    /* 3. Center the container safely using margin */
    .app-container {
        display: flex;
        flex-direction: column;
        width: 100%;
        max-width: 800px;
        margin: 0 auto; /* Centers on desktop without breaking mobile */
        height: 100vh;

        background-color: var(--md-sys-color-background, #131316);
        color: var(--md-sys-color-on-background, #e8e8ea);
        padding-top: 25px;
        overflow-x: hidden;
    }

    .content-area {
        flex: 1;
        position: relative;
        overflow-y: auto;
        overflow-x: hidden;
        width: 100%; /* Force it to stay inside the container */
    }

    /* Force long text to truncate with '...' instead of stretching the screen */
    m3e-list-action {
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
        max-width: 100%;
    }

    /* Hide scrollbars visually */
    .content-area::-webkit-scrollbar,
    .app-container::-webkit-scrollbar {
        display: none;
    }
    .content-area,
    .app-container {
        -ms-overflow-style: none;
        scrollbar-width: none;
    }
</style>
