<script lang="ts">
    import { onMount } from 'svelte';
    import { initDemoWorkspace, resetDemo, type DemoWorkspace } from '../demo/demoWorkspace.js';

    let workspaceEl: HTMLElement;
    let demoWorkspace: DemoWorkspace;

    onMount(() => {
        if (workspaceEl) {
            demoWorkspace = initDemoWorkspace(workspaceEl);
        }

        return () => {
            // Cleanup if needed
            if (demoWorkspace) {
                demoWorkspace.clear();
            }
        };
    });

    function handleReset() {
        if (demoWorkspace) {
            resetDemo(demoWorkspace);
        }
    }
</script>

<div id="perspective">
    <div id="workspace" bind:this={workspaceEl}>
        <button class="demo-reset-button" on:click={handleReset} title="Reset workspace">
            Reset
        </button>
    </div>
</div>

<style>
    #perspective{
        position: sticky;
        z-index: 0;
        overflow: hidden;
        padding: 2rem;
        padding-bottom: 0;

    }
    #workspace{
        width: 100%;
        height: 100%;
        border-radius: 2rem;
        border-bottom-left-radius: 0;
        border-bottom-right-radius: 0;
        padding: 1rem;
        background-color: var(--color-light-primary);
        border: 1px solid #555;
        box-shadow: inset 0 0 20px rgba(0,0,0,0.4);
        transition: box-shadow 0.1s ease-in-out,
                    filter 0.2s ease-out;
        font-size: 1rem;
        display: flex;
        flex-direction: column;
        gap: 1rem;
        position: relative;
        overflow-y: auto;
        overflow-x: hidden;
    }

    #workspace::-webkit-scrollbar {
        width: 8px;
    }

    #workspace::-webkit-scrollbar-track {
        background: transparent;
    }

    #workspace::-webkit-scrollbar-thumb {
        background-color: var(--color-light-secondary);
        border-radius: 4px;
    }
</style>
