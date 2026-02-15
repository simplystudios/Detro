<script>
    import { Info, SunMoon } from "lucide-svelte";

    // Props for icons
    let iconSize = 20;
    let iconColor = "#1a1a1a";
</script>

<div class="app-container">
    <header class="header-container">
        <div class="nav-wrapper">
            <button class="icon-btn" aria-label="Toggle Theme">
                <SunMoon color={iconColor} size={iconSize} />
            </button>

            <div class="logo-group">
                <div class="logo-wrapper">
                    <img src="/detero.png" alt="Detro Logo" class="brand-img" />
                    <h1 class="brand-name">DETRO</h1>
                </div>
                <span class="beta-badge">BETA</span>
            </div>

            <button class="icon-btn" aria-label="Information">
                <Info color={iconColor} size={iconSize} />
            </button>
        </div>
    </header>

    <main class="content-area">
        <slot />
    </main>
</div>

<style>
    /* Ensure the app takes up the full screen height */
    :global(body, html) {
        margin: 0;
        padding: 0;
        height: 100%;
        font-family:
            "Inter",
            -apple-system,
            BlinkMacSystemFont,
            sans-serif;
        background-color: #f5f5f5;
        overflow: hidden; /* Prevents double scrollbars if your map has its own scroll */
    }

    .app-container {
        display: flex;
        flex-direction: column;
        height: 100vh;
    }

    .header-container {
        /* Glassmorphism Effect */
        background-color: rgba(255, 255, 255, 0.8);
        backdrop-filter: blur(10px);
        -webkit-backdrop-filter: blur(10px);
        padding: 100px;
        border-bottom: 1px solid rgba(0, 0, 0, 0.08);
        padding: 0.75rem 1.25rem;
        z-index: 100;
        box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
    }

    .nav-wrapper {
        max-width: 1400px; /* Wider for map layouts */
        margin: 0 auto;
        display: flex;
        justify-content: space-between;
        align-items: center;
    }

    .logo-group {
        display: flex;
        align-items: center;
        gap: 10px;
    }

    .logo-wrapper {
        display: flex;
        align-items: center;
        gap: 8px;
    }

    .brand-img {
        height: 26px;
        width: auto;
    }

    .brand-name {
        font-weight: 800;
        font-size: 1.3rem;
        letter-spacing: -0.04em;
        color: #000;
        margin: 0;
        line-height: 1;
    }

    /* Professional Transit-style Beta Badge */
    .beta-badge {
        background-color: #c0282c; /* The red from your logo */
        color: white;
        font-size: 0.65rem;
        font-weight: 400;
        padding-top: 10px;
        padding: 6px 6px 6px;
        border-radius: 4px;
        letter-spacing: 0.08em;
        line-height: 1;
        display: inline-flex;
        align-items: center;
    }

    .icon-btn {
        background: none;
        border: none;
        cursor: pointer;
        padding: 8px;
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        transition: background-color 0.2s;
    }

    .icon-btn:hover {
        background-color: rgba(0, 0, 0, 0.05);
    }

    .content-area {
        flex: 1;
        position: relative; /* Useful for absolute positioned maps */
        overflow: auto;
    }

    /* Mobile adjustments */
    @media (max-width: 480px) {
        .brand-name {
            font-size: 1.1rem;
        }
        .header-container {
            padding: 0.5rem 0.75rem;
        }
    }
</style>
