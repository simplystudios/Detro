<script>
    import SchematicRoute from "$lib/SchematicRoute.svelte";
    import { onMount } from "svelte";
    import { page } from "$app/stores"; // 👈 Import the SvelteKit page store

    let routed = null; // 👈 Start as null to prevent premature rendering

    onMount(async () => {
        // Grab the params from the $page store
        const from = $page.url.searchParams.get("from");
        const to = $page.url.searchParams.get("to");

        console.log("Fetching route for:", from, "to", to);

        if (from && to) {
            const res = await fetch(
                `/api/metroroute?from=${encodeURIComponent(from)}&to=${encodeURIComponent(to)}`,
            );
            const d = await res.json();
            routed = d;
        } else {
            console.error("Missing from/to parameters in URL");
        }
    });
</script>

{#if routed}
    <SchematicRoute route={routed} />
{:else}
    <div
        class="g"
        style="display: flex; justify-content: center; align-items: center; height: 100vh; color: white; font-family: sans-serif;"
    >
        Loading route...
    </div>
{/if}

<style>
    .g {
        overflow: hidden;
        width: 100vw;
        height: 100vh;
        background-color: transparent; /* 👈 3. Changed to transparent */
        background-image: radial-gradient(
            var(--grid-color) 1.5px,
            transparent 1.5px
        );
        position: relative;
        touch-action: none;
        -webkit-user-select: none;
        user-select: none;
        font-family: "DM Sans", system-ui, sans-serif;
    }
</style>
