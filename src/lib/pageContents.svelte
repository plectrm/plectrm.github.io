<div id="contents">
    <div class="bento" style="border-radius: 1rem; width: 100%">
        <div class="bento" style="border-bottom-left-radius: 0; border-bottom-right-radius: 0;">
            <p>Plectrm is an <a href="https://en.wikipedia.org/wiki/ASCII_tab">ASCII tablature</a> editor, made to be as easy to use as a text editor. Instead of writing in traditional music notation, you can just write tabs as text - Plectrm will handle all of the formatting for you.</p>
        </div>
        <div class="bento" style="border-radius: 0; width: 100%; height: fit-content;">
            <div class="item">
                <div>
                    <h2>Familiar, user-friendly UX</h2>
                    <p>Designed to be accessible, Plectrm is inspired by design patterns from regular text editing and desktop publishing software.</p>
                </div>
            </div>
            <div class="item">
                <div>
                    <h2>By musicians, for everyone</h2>
                    <p>Made out of frustration for other software being unnecessarily restrictive, Plectrm aims to encourage more people to write tablature and share their work online.</p>
                </div>
            </div>
            <div class="item">
                <div>
                    <h2>Cross-Platform and available offline</h2>
                    <p>Built using <a href="https://www.electronjs.org/">Electron</a>, Plectrm is available as Windows, MacOS, and Linux distributions. It can also be built from source. </p>
                </div>
            </div>
            <div class="item">
                <div>
                    <h2>Free, and open-source, forever</h2>
                    <p>Plectrm is licensed under GPL-3 and very much <a href="https://github.com/plectrm/plectrm">open to contributors!</a></p>
                </div>
            </div>
        </div>
        <div class="bento" style="border-top-left-radius: 0; border-top-right-radius: 0; width: 100%; height: fit-content;">
            <p>Made with <span id="heart">❤</span> by <a href="https://memrye.me/">memrye</a></p>
        </div>
    </div>
</div>

<style>
    #contents{
        margin: 0 auto;
        width: 60vw;
        height: 100vh;
        background-color: var(--color-darkest);
        padding: 10vh 0;
        display: flex;
        flex-direction: column;
        gap: 2rem;
        align-items: center;
    }

    .bento{
        padding: 1rem;
        border-radius: 0.5rem;
        border: 1px solid var(--color-dark-secondary);
        width: fit-content;
        display: flex;
        flex-direction: column;
        gap: 1rem;
        text-align: left;
    }

    .item{
        width: 100%;
        display: flex;
        flex-direction: row;
    }

    .item:hover{
        background-color: var(--color-dark-primary);
    }

    #heart{
        transform: scale(1);
        color: var(--color-red);
        user-select: none;
        margin: 0 0.2rem;
        display: inline-block;
        transition: all 100ms ease-in-out;
    }
    #heart:hover{
        transform: scale(1.2);
        user-select: none;
    }
    #heart:active{
        transform: scale(1.1);
        color: var(--color-red-dark);
    }
</style>