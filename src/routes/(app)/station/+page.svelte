<script>
    import { page } from "$app/stores";
    import LeafletMap from "$lib/LeafletMap.svelte";
    import { delhiMetro } from "$lib/delhimetro.js";
    import "@m3e/web/all";

    import { onMount } from "svelte";
    let id = $page.url.searchParams.get("id");
    let result = {};
    let rp = {};
    let facilities = [];
    console.log(delhiMetro["lines"]);

    let data = null;
    onMount(async () => {
        var obj;
        if (id) {
            const response = await fetch(`/stationsdata.json`);
            data = await response.json();
            console.log(data);
            for (var i = 0; i < data.length; i++) {
                if (data[i]["stop_name"] == id) {
                    result = data[i];
                    console.log(result);
                    break;
                }
            }
            for (var k = 0; k < delhiMetro["lines"].length; i++) {
                for (
                    var j = 0;
                    j < delhiMetro["lines"][i]["stations"].length;
                    j++
                ) {
                    if (delhiMetro["lines"][i]["stations"][j]["name"] == id) {
                        rp = delhiMetro["lines"][i]["stations"][j];
                        facilities =
                            delhiMetro["lines"][i]["stations"][j]["facilities"];
                        console.log(rp);
                        break;
                    }
                }
            }
        }
    });
    function googlemapslink() {
        window.open(
            `https://www.google.com/maps?saddr=My+Location&daddr=${result.stop_name} metro station`,
        );
    }

    function generateUberDeepLink(lat, lon) {
        window.open(
            `https://m.uber.com/ul/?action=setPickup&pickup[latitude]=${latitude}&pickup[longitude]=${longitude}&dropoff[latitude]=${lat}&dropoff[longitude]=${lon}`,
        );
    }
    function openuberlink() {
        generateUberDeepLink(result.stop_lat, result.stop_lon);
    }

    console.log(id);
</script>

<div class="container">
    <br />

    <m3e-card variant="none">
        <LeafletMap focusStation={id} />
    </m3e-card>

    <m3e-card
        style="width: 100%; translate: 0px -18px; z-index: 50;"
        variant="elevated"
    >
        <div class="nearest-body">
            <div>
                <m3e-typography variant="subtitle1">
                    {result.stop_name}
                </m3e-typography>
            </div>
            <div class="nearest-actions">
                <m3e-button variant="tonal" on:click={googlemapslink}>
                    <m3e-icon name="map_marker"></m3e-icon>
                    Directions
                </m3e-button>
                <m3e-button variant="outlined" on:click={openuberlink}>
                    <m3e-icon name="local_taxi"></m3e-icon>
                    Uber
                </m3e-button>
            </div>
        </div>
        <div class="nearest-meta">
            <div class="meta-chip">
                <div class="chip-label">LINE</div>
                <span class="chip-val">{result.Line}</span>
            </div>
            <div class="meta-chip">
                <span class="chip-label">LAYOUT</span>
                <span class="chip-val">{result.stop_layout}</span>
            </div>
        </div>
        <div class="nearest-meta">
            <div class="meta-chip">
                <span class="chip-label">NEAREST LANDMARK</span>
                <span class="chip-val">{rp.landmark}</span>
            </div>
        </div>
    </m3e-card>
    <div class="fac">
        <h1>Facalities</h1>
        <div class="iconb">
            {#if rp.parking == true}
                <div>
                    <m3e-icon-button variant="outlined">
                        <m3e-icon name="local_parking"></m3e-icon>
                    </m3e-icon-button>
                    <p>Parking</p>
                </div>
            {/if}
            {#if facilities}
                <div>
                    <m3e-icon-button variant="outlined">
                        <m3e-icon name="elevator"></m3e-icon>
                    </m3e-icon-button>
                    <p>Elevators</p>
                </div>
                <div>
                    <m3e-icon-button variant="outlined">
                        <m3e-icon name="wc"></m3e-icon>
                    </m3e-icon-button>
                    <p>Toilets</p>
                </div>
                <div>
                    <m3e-icon-button variant="outlined">
                        <m3e-icon name="escalator"></m3e-icon>
                    </m3e-icon-button>
                    <p>Escalators</p>
                </div>
                <div>
                    <m3e-icon-button variant="outlined">
                        <m3e-icon name="nest_cam_iq_outdoor"></m3e-icon>
                    </m3e-icon-button>
                    <p>CCTV</p>
                </div>
            {/if}
        </div>
    </div>
</div>
{#if rp.platforms && rp.platforms.length > 0}
    <div class="info-section">
        <h3>Platforms</h3>
        <m3e-list>
            {#each rp.platforms as p}
                <m3e-list-item>
                    <m3e-icon slot="leading" name="train"></m3e-icon>

                    Platform {p.no}: Towards {p.towards}

                    <span slot="supporting-text">{p.type} Platform</span>
                </m3e-list-item>
            {/each}
        </m3e-list>
    </div>
{/if}

{#if rp.gates && rp.gates.length > 0}
    <div class="info-section">
        <h3>Entry / Exit Gates</h3>
        <m3e-list>
            {#each rp.gates as g}
                <m3e-list-item>
                    <m3e-icon slot="leading" name="meeting_room"></m3e-icon>

                    Gate {g.gate}

                    <span slot="supporting-text">
                        Opens towards: {g.landmarks.join(" • ")}
                    </span>
                </m3e-list-item>
            {/each}
        </m3e-list>
    </div>
{/if}

<!-- <m3e-list style="display:flex" variant="segmented">
            <h1>Facilities</h1>
            <m3e-list-item>
                <m3e-icon-button variant="outlined" slot="leading">
                    <m3e-icon name="local_parking"></m3e-icon>
                </m3e-icon-button>

                Parking
                <span slot="supporting-text">Available</span>
            </m3e-list-item>
            {#if facilities}
                <m3e-list-item>
                    <m3e-icon-button variant="outlined" slot="leading">
                        <m3e-icon name="nest_cam_iq_outdoor"></m3e-icon>
                    </m3e-icon-button>

                    {facilities[0]}
                    <span slot="supporting-text">Available</span>
                </m3e-list-item>
                <m3e-list-item>
                    <m3e-icon-button variant="outlined" slot="leading">
                        <m3e-icon name="wc"></m3e-icon>
                    </m3e-icon-button>

                    {facilities[1]}
                    <span slot="supporting-text">Available</span>
                </m3e-list-item>

                <m3e-list-item>
                    <m3e-icon-button variant="outlined" slot="leading">
                        <m3e-icon name="elevator"></m3e-icon>
                    </m3e-icon-button>

                    {facilities[2]}
                    <span slot="supporting-text">Available</span>
                </m3e-list-item>
                <m3e-list-item>
                    <m3e-icon-button variant="outlined" slot="leading">
                        <m3e-icon name="escalator"></m3e-icon>
                    </m3e-icon-button>

                    {facilities[3]}
                    <span slot="supporting-text">Available</span>
                </m3e-list-item>
            {/if}
        </m3e-list> -->

<style>
    .container {
        padding: 11px;
    }
    /* ── NEAREST STATION ── */
    .nearest-card {
        background: var(--md-sys-color-surface-container, #1e1e22);
        border-radius: 20px;
        border: 1px solid
            var(--md-sys-color-outline-variant, rgba(255, 255, 255, 0.07));
        overflow: hidden;
    }
    .iconb {
        display: flex;
        justify-content: center;
        align-items: center;
        text-align: center;
        gap: 16px;
    }
    .nearest-body {
        display: flex;
        justify-content: space-between;
        align-items: flex-start;
        padding: 16px 16px 12px;
    }
    .fac {
        margin-top: 5px;
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
</style>
