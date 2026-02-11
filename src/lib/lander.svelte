<script lang="ts">
    import Logo from "./logo.svelte";
    import ExternalLink from "./externalLink.svelte";
    import Workspace from "./workspace.svelte";
</script>

<div id="container">
    <Workspace></Workspace>
    <div id="lander">
        <div class="a">
            <Logo></Logo>
            <div style="display: flex; flex-direction: column; gap: 0.5rem;">
                <h1>Plectrm</h1>
                <p style="width: 11rem; padding: 0 0.3rem">is a Free, Open-source ASCII (Guitar) Tab editor.</p>
                <a style="margin-top: auto;" href="https://github.com/plectrm/plectrm/">
                    <button style="width: 11rem;">
                        <div>Repository</div><div class="icon"><ExternalLink></ExternalLink></div>
                    </button>
                </a>
                <a href="https://github.com/plectrm/plectrm/releases">
                    <button style="width: 11rem;" class="download">
                        <div>Download Latest</div><div class="icon"><ExternalLink></ExternalLink></div>
                    </button>
                </a>
            </div>
        </div>
    </div>
    <div id="fade"></div>
</div>

<style>
    #container{
        width: 100vw;
        height: calc(100vh - 2rem);
        background-color: var(--color-dark-primary);
        display: grid;
        place-items: center;
        grid-template-areas: "inner-div";
        overflow: hidden;
    }

    #lander{
        border: 0;
        width: 100%;
        height: 100%;
        border-radius: 0;
        display: flex;
        align-items: center;
        justify-content: center;
        grid-area: inner-div;
        position: sticky;
        z-index: 2;
        pointer-events: none;
    }

    #fade{
        width: 100%;
        height: 100%;
        grid-area: inner-div;
        background: linear-gradient(transparent 0%, transparent 80%, var(--color-darkest) 100%);
        pointer-events: none;
        position: sticky;
        z-index: 1;
    }

    div .a{
        background-color: color-mix(in srgb, var(--color-dark-primary), transparent 3%);
        backdrop-filter: blur(4px);
        border: 1px solid var(--color-dark-tertiary);
        width: fit-content;
        max-width: 90vw;
        height: fit-content;
        min-height: 20rem;
        border-radius: 1rem;
        padding: 1rem;
        gap: 1rem;
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        text-align: left;
        transition: all 100ms ease-in-out;
    }

    div .a:hover{
        background-color: color-mix(in srgb, var(--color-dark-primary), transparent 0%);
        backdrop-filter: blur(10px);
    }

    :global(#logo){
        width: 8rem;
    }

    button{
        font-family: "Carrois Gothic";
        background-color: var(--color-dark-secondary);
        outline: 1px solid var(--color-dark-tertiary);
        border: 0;
        padding: 0.5rem;
        border-radius: 0.5rem;
        cursor: pointer;
        position: relative;
        transition: all 100ms ease-in-out;
    }

    button.download{
        background-color: var(--color-blue);
    }

    button:hover{
        outline-offset: 3px;
    }

    button div:not(.icon){
        transition: all 100ms ease-in-out;
        font-size: large;
        text-align: left;
        mask-image: linear-gradient(to right, black 60%, transparent 80%);
        -webkit-mask-image: linear-gradient(to right, black 60%, transparent 80%);
        mask-size: 200%;
        color: var(--color-light-primary);
    }

    button:hover div:not(.icon){
        mask-size: 100%;
    }

    button:hover .icon{
        opacity: 100%;
        clip-path: rect(0 100% 100% 0%);
    }

    button:not(.download):active{
        background-color: var(--color-dark-tertiary);
    }

    button.download:active{
        background-color: var(--color-blue-dark);
    }

    button .icon{
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

    p {
        font-size: small;
    }

    @media (min-width: 520px){
        div .a {
            flex-direction: row;
            align-items: stretch;
            padding: 2rem;
            gap: 2rem;
        }

        :global(#logo){
            width: 12rem;
        }
    }
</style>