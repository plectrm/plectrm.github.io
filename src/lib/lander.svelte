<script lang="ts">
    import Logo from "./logo.svelte";
    import ExternalLink from "./externalLink.svelte";
    import Workspace from "./workspace.svelte";

    const version = "v0.1.0";
</script>

<div id="container">
    <div id="gradient-overlay"></div>
    <div id="lander">
        <div id="content">
            <div id="title">
                <Logo></Logo>
                <h1>Plectrm</h1>
                <p>is a Free, Open-source ASCII (Guitar) Tab editor.</p>
            </div>
            <a id="mobile-repo-link" href="https://github.com/plectrm/plectrm/">
                <button>
                    <div>Repository</div><div class="icon"><ExternalLink></ExternalLink></div>
                </button>
            </a>
            <div id="download-section">
                <div class="platform-list">
                    <div class="platform-row">
                        <span class="platform-name">Windows</span>
                        <div class="download-buttons">
                            <a href={`https://github.com/plectrm/plectrm/releases/download/${version}/plectrm.Setup.${version.slice(1)}.exe`} class="download-btn">
                                <span>Installer (.exe)</span>
                            </a>
                            <!-- <a href={`https://github.com/plectrm/plectrm/releases/download/${version}/plectrm.${version.slice(1)}.exe`} class="download-btn">
                                <span>Standalone (.exe)</span>
                            </a> -->
                        </div>
                    </div>
                    <div class="platform-row">
                        <span class="platform-name">Linux</span>
                        <div class="download-buttons">
                            <a href={`https://github.com/plectrm/plectrm/releases/download/${version}/Plectrm-${version.slice(1)}.AppImage`} class="download-btn">
                                <span>Standalone (.AppImage)</span>
                            </a>
                        </div>
                    </div>
                    <div class="platform-row">
                        <span class="platform-name">macOS</span>
                        <div class="download-buttons">
                            <div class="download-btn disabled">
                                <span>Coming Soon</span>
                            </div>
                        </div>
                    </div>
                    <div class="platform-row">
                        <span class="version-label">{version}</span>
                        <a href="https://github.com/plectrm/plectrm/releases" class="older-releases">
                            Previous releases
                        </a>
                    </div>
                </div>
                
            </div>
        </div>
        <a id="arrow" title="Read more" href="#contents">
            <span>Read more</span>
            <svg fill="currentColor" width="24" height="24" viewBox="0 0 36 36" version="1.1"  preserveAspectRatio="xMidYMid meet" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
                <path class="clr-i-outline clr-i-outline-path-2" d="M29,30.41a1,1,0,0,1-.71-.29L18,19.83,7.71,30.12a1,1,0,0,1-1.41-1.41L18,17,29.71,28.71A1,1,0,0,1,29,30.41Z"></path>
                <rect x="0" y="0" width="36" height="36" fill-opacity="0"/>
            </svg>
        </a>
    </div>
    <Workspace></Workspace>
</div>

<style>
    #container{
        width: 100vw;
        height: fit-content;
        display: grid;
        grid-template-columns: 1fr 2fr;
        grid-template-rows: 100%;
        overflow: hidden;
        position: relative;
    }

    #gradient-overlay {
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: linear-gradient(to bottom, transparent 80%, var(--color-darkest) 100%);
        pointer-events: none;
        z-index: 5;
    }

    #lander{
        position: sticky;
        z-index: 2;
        background-color: var(--color-dark-primary);
        backdrop-filter: blur(4px);
        border: 1px solid var(--color-dark-tertiary);
        width: 100%;
        height: 100%;
        max-width: 90vw;
        min-height: 20rem;
        border-radius: 1rem;
        border-top-left-radius: 0;
        border-bottom-left-radius: 0;
        border-left: 0;
        padding: 1rem;
        display: flex;
        flex-direction: column;
        align-items: center;
        text-align: center;
        transition: all 100ms ease-in-out;
    }

    #content{
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        gap: 2rem;
        flex: 1 1 auto;
        width: 100%;
    }

    #title{
        display: flex;
        flex-direction: column;
        align-items: center;
    }

    #title p {
        width: 100%;
    }

    #mobile-repo-link {
        display: none;
    }

    #mobile-repo-link button {
        font-family: "Carrois Gothic";
        background-color: var(--color-dark-secondary);
        outline: 1px solid var(--color-dark-tertiary);
        border: 0;
        padding: 0.5rem 1.5rem;
        border-radius: 0.5rem;
        cursor: pointer;
        position: relative;
        transition: all 100ms ease-in-out;
    }

    #mobile-repo-link button:hover {
        background-color: var(--color-dark-tertiary);
    }

    #mobile-repo-link button div:not(.icon) {
        transition: all 100ms ease-in-out;
        font-size: x-large;
        text-align: center;
        mask-image: linear-gradient(to right, black 60%, transparent 80%);
        -webkit-mask-image: linear-gradient(to right, black 60%, transparent 80%);
        mask-size: 200%;
        color: var(--color-light-primary);
    }

    #mobile-repo-link button:hover div:not(.icon) {
        mask-size: 100%;
    }

    #mobile-repo-link button:hover .icon {
        opacity: 100%;
        clip-path: rect(0 100% 100% 0%);
    }

    #mobile-repo-link button .icon {
        color: var(--color-light-primary);
        width: 1.5rem;
        position: absolute;
        height: 100%;
        top: calc(0% - 0.5rem);
        right: 0%;
        margin: 0.5rem;
        transition: all 100ms ease-in-out;
        clip-path: rect(0% 100% 100% 100%);
        opacity: 0%;
    }

    #download-section {
        display: flex;
        flex-direction: column;
        align-items: flex-start;
        gap: 1rem;
        padding: 1.5rem;
        background-color: var(--color-dark-primary);
        border: 1px solid var(--color-dark-tertiary);
        border-radius: 1rem;
        min-width: 280px;
    }

    .version-label {
        font-size: 0.875rem;
        color: var(--color-light-tertiary);
        font-family: 'FantasqueSansMono', monospace;
    }

    .platform-list {
        display: flex;
        flex-direction: column;
        gap: 0.75rem;
        width: 100%;
        text-align: left;
    }

    .platform-row {
        display: flex;
        flex-direction: row;
        align-items: center;
        justify-content: space-between;
        gap: 0.75rem;
    }

    .platform-name {
        font-size: 0.875rem;
        font-weight: 600;
        color: var(--color-light-secondary);
        text-transform: uppercase;
        letter-spacing: 0.05em;
        min-width: 70px;
    }

    .download-buttons {
        display: flex;
        flex-direction: row;
        gap: 0.75rem;
        flex-wrap: wrap;
        justify-content: flex-end;
    }

    .download-btn {
        display: inline-block;
        padding: 0.5rem 1rem;
        background-color: var(--color-blue);
        color: var(--color-light-primary);
        text-decoration: none;
        border-radius: 0.5rem;
        font-size: 1rem;
        transition: all 100ms ease-in-out;
        text-align: center;
        text-decoration: underline dotted 0rem transparent;
    }

    .download-btn:is(:not(.disabled)):hover {
        text-decoration: underline dotted 0.15rem currentColor
    }

    .download-btn.disabled{
        display: inline-block;
        padding: 0.5rem 1rem;
        background-color: var(--color-light-tertiary);
        color: var(--color-light-secondary);
        text-decoration: none;
        border-radius: 0.5rem;
        font-size: 1rem;
        text-align: center;
        user-select: none;
    }

    .older-releases {
        font-size: 0.75rem;
        color: var(--color-light-tertiary);
    }

    .older-releases:hover{
        color: var(--color-light-secondary);
    }

    #arrow{
        display: flex;
        flex-direction: column;
        align-items: center;
        width: 100%;
        color: var(--color-light-tertiary);
        padding: 4rem 0;
        flex-shrink: 0;
    }

    #arrow:hover{
        color: var(--color-light-secondary);
    }

    #arrow svg{
        transform: rotate(180deg);
    }

    :global(#logo){
        width: 8rem;
    }

    p {
        font-size: small;
    }

    /* mobile layout: horizontal bar with logo -> h1 -> repo button */
    @media (max-width: 768px) {
        #container {
            grid-template-columns: 1fr;
            grid-template-rows: auto 1fr;
            overflow-y: auto;
        }

        #lander {
            position: relative;
            max-width: 100%;
            height: auto;
            min-height: auto;
            border-radius: 0;
            border: 0;
            border-bottom: 1px solid var(--color-dark-tertiary);
            padding: 0.5rem;
            flex-direction: row;
            align-items: center;
            justify-content: space-between;
            gap: 0.75rem;
        }

        #content {
            display: contents;
        }

        #title {
            display: flex;
            flex-direction: row;
            align-items: center;
            gap: 0.75rem;
            order: 1;
        }

        #title h1 {
            font-size: 1.5rem;
        }

        #title p {
            display: none;
        }

        #download-section {
            display: none;
        }

        #mobile-repo-link {
            display: block;
            order: 2;
        }

        #mobile-repo-link button {
            padding: 0.4rem 1rem;
        }

        #mobile-repo-link button div:not(.icon) {
            font-size: 1rem;
        }

        #mobile-repo-link button .icon {
            width: 1rem;
            top: calc(0% - 0.25rem);
            margin: 0.25rem;
        }

        :global(#logo) {
            width: 2.5rem;
        }

        #arrow {
            display: none;
        }

    }

    @media (min-width: 520px) and (max-width: 768px) {
        :global(#logo) {
            width: 3rem;
        }

        #title {
            gap: 1rem;
        }

        #title h1 {
            font-size: 2rem;
        }

        #mobile-repo-link button {
            padding: 0.5rem 1.25rem;
        }

        #mobile-repo-link button div:not(.icon) {
            font-size: 1.2rem;
        }
    }

    @media (min-width: 769px) {
        :global(#logo){
            width: 16rem;
        }
    }
</style>
