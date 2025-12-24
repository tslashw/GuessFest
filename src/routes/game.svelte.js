import items from "./items.json";

export class game {

    state = $state({
        isMainMenu: true,
        isRunning: false,
        isGameOver: false
    });

    anim = $state({
        isFlashRed : false,
        isFlashGreen : false
    })


    timeTotal = 60;
    timeLeft = $state(0);
    activeTimer = null;
    
    gameItems = $state([]);
    activeItem = $state("");


    answers = $state({});



    sleep = async (ms) => {
	    return new Promise((resolve) => setTimeout(resolve, ms));
    }

    flattenDictByKeys = (obj, keysToFlatten) => {
        return keysToFlatten.flatMap(key => {
            if (!Array.isArray(obj[key])) {
                throw new Error(`Expected array at key "${key}"`);
            }
            return obj[key];
        });
    }


    shuffle = (array) => {
        for (let i = array.length - 1; i > 0; i--) {
            // Pick a random index from 0 to i (inclusive)
            const j = Math.floor(Math.random() * (i + 1));

            // Swap elements i and j
            [array[i], array[j]] = [array[j], array[i]];
        }
        return array;
    }


	startTimer() {
		// Reset time values and clear timers:
		this.timeLeft = this.timeTotal;

		if (this.activeTimer !== null) {
			clearInterval(this.activeTimer);
		}

		// start new countdown
		this.activeTimer = setInterval(() => {
			if (this.timeLeft > 0) {
				this.timeLeft -= 1;
			} else {
				clearInterval(this.activeTimer);
				this.activeTimer = null;
                this.isGameOver = true;
			}
		}, 1000);
	
    }

    correctBtn = async () => {
        // Play flash animation
        this.anim.isFlashGreen = true;
        await this.sleep(100);
        this.anim.isFlashGreen = false;

        //
        this.answers[this.activeItem] = true;
        this.activeItem = this.gameItems.shift();
    }

    passBtn = async () => {
        // Play flash animation
        this.anim.isFlashRed = true;
        await this.sleep(100);
        this.anim.isFlashRed = false;

        // 
        this.answers[this.activeItem] = false;
        this.activeItem = this.gameItems.shift();
    }

    getScore = () => {
        let score = 0;
        
        for (const [key, val] of Object.entries(this.answers)) {
            if (val === true) {
                score += 1;
            }
        }

        return score;
    }


    startGame = () => {

        this.answers = [];

        this.state.isMainMenu = false;

        this.state.isRunning = true;


        this.gameItems = this.flattenDictByKeys(items, [
            "celebrities", "politicians", "musicians", "sports", 
            "fictionalCharacters", "landmarks", "tvShows", "movies"
        ]);

        this.gameItems = this.shuffle(this.gameItems);

        this.activeItem = this.gameItems.shift();


        this.startTimer();

    }


    restart = () => {
        this.state.isMainMenu = true;
        this.state.isRunning = false;
        this.state.isGameOver = false;

        this.answers = [];
    }


}