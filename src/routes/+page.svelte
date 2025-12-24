<script>
    import { game } from "./game.svelte";

    let guessFest = new game;

    
    // Prevent double tap to zoom globally (even on buttons etc).
    let lastTouch = 0;
    document.addEventListener('touchstart', (e) => {
    const now = Date.now();
    if (now - lastTouch <= 300) {
        e.preventDefault(); // prevents double-tap zoom
    }
    lastTouch = now;
    }, { passive: false });


</script>


<div class="app" class:anim-flash-red={guessFest.anim.isFlashRed} class:anim-flash-green={guessFest.anim.isFlashGreen}>
    <div class="container">

        {#if guessFest.state.isMainMenu && !guessFest.state.isRunning}
            <div class="main-title">
                <h1>GuessFest</h1>
            </div>

            <div class="game-content">

            </div>
            
            <div class="play-button">
                <button onclick={() => guessFest.startGame()}>
                    <p>PLAY</p>
                </button>
            </div>

        {:else if guessFest.state.isRunning && guessFest.timeLeft > 0}
            <div class="main-title">
                <div class="timer">
                    <h1>{guessFest.timeLeft}</h1>
                </div>
            </div>

            <div class="game-content">
                <h1>{guessFest.activeItem}</h1>
            </div>
            
            <div class="controls">
                <button class="pass-btn" onclick={() => guessFest.passBtn()}>
                    <p>PASS</p>
                </button>
                <button class="correct-btn" onclick={() => guessFest.correctBtn()}>
                    <p>CORRECT</p>
                </button>
            </div>

        {:else if guessFest.timeLeft <= 0}
            <div class="main-title">
                <h1>Game Over!</h1>
            </div>


            <div class="game-content">

                <div class="score">
                    <h1>You scored: {guessFest.getScore()}</h1>
                </div>

                <div class="game-overview">
                    {#each Object.entries(guessFest.answers) as [key, val]}
                        {#if val == true}
                        <h2 style="color: green">{key}</h2>
                        {:else if val == false}
                        <h2 style="color: red">{key}</h2>
                        {/if}    
                    {/each}
                </div>

            </div>
            
            <div class="play-button">
                <button onclick={() => guessFest.restart()}>
                    <p>PLAY AGAIN</p>
                </button>
            </div>
        {/if}
    </div>
</div>