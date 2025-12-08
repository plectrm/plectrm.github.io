<div id="perspective">
    <div id="workspace">
    
    </div>
</div>

<style>
    #perspective{
        grid-area: inner-div;
        position: sticky;
        z-index: 0;
        overflow: hidden;
    }
    #workspace{
        width: 95vw;
        height: 90vh;
        border-radius: 2rem;
        padding: 1rem;
        background-color: var(--color-light-primary);
        border: 1px solid #555;
        box-shadow: inset 0 0 20px rgba(0,0,0,0.4);
        transition: box-shadow 0.1s ease-in-out,
                    filter 0.2s ease-out;
        filter: drop-shadow(0 0 10px rgba(255,255,255,0.2));
        margin: auto;
        margin-top: 10vh;
        font-size: 1rem;
        display: flex;
        flex-direction: column;
        gap: 1rem;
    }

    @media (min-width: 1150px) {
        #workspace {
            width: 70vw;
        }
    }
</style>