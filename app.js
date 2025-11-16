const loadItems = async () => {
	let data;
	try {
		const res = await fetch('./items.json');
		data = await res.json();
	} catch (err) {
		console.error('Failed to load items.json', err);
	}

	console.log(data);
	return data;
};

const shuffleArray = async (array) => {
	// Fisher-Yates shuffle:
	for (let i = array.length - 1; i >= 1; i--) {
		const j = Math.floor(Math.random() * (i + 1));
		[array[i], array[j]] = [array[j], array[i]];
	}

	return array;

};

const flattenFromKeys = async (data, keys) => {
	return keys.reduce((acc, key) => {
		if (Array.isArray(data[key])) {
			acc.push(...data[key]);
		}
		return acc;
	}, []);
}

const resetPool = async () => {
	pool = items.slice();
}

const nextItem = async () => {
	if (pool.length === 0) resetPool();
	const idx = Math.floor(Math.random() * pool.length);
	const [choice] = pool.splice(idx, 1);
	activeItem = choice;
	itemText.textContent = choice;
}

const updateHud = async () => {
	timerEl.textContent = String(timeLeft);
	scoreEl.textContent = String(score);
}

const startGame = async () => {
	if (playing) return;

	// Show/hide elements:
	titleElement.style.display = 'none';
	correctBtn.style.display = 'block';
	passBtn.style.display = 'block';

	playing = true;
	score = 0;
	timeLeft = 7;
	resultsPool = [];
	resultsText.innerHTML = "";
	updateHud();
	resetPool();
	nextItem();
	if (typeof correctBtn !== 'undefined') correctBtn.disabled = false;
	if (typeof passBtn !== 'undefined') passBtn.disabled = false;

	timerId = setInterval(() => {
		timeLeft -= 1;
		updateHud();
		if (timeLeft <= 0) {
			stopGame();
		}
	}, 1000);
}

const stopGame = async () => {
	playing = false;
	clearInterval(timerId);
	timerId = null;
	correctBtn.disabled = true;
	passBtn.disabled = true;
	itemText.textContent = `Final score: ${score}`;
	resultsText.innerHTML = `
		<ul class="results-list">
			${resultsPool.map(item => `<li>${item}</li>`).join("")}
		</ul>
	`;
}

const flashScreen = async (colorClass) => {
	if (!appElement) {
		// something went really badly wrong...
		return;
	}
	appElement.classList.add(colorClass);
	setTimeout(() => appElement.classList.remove(colorClass), 220);
}

const handleButtonPress = async (type) => {
	if (!playing) return;

	// Correct answer
	if (type === "correct" || type === 1) {
		score += 1;
		flashScreen("flash-green");
		resultsPool.push(`${activeItem} ✅`);
	}
	// Pass answer
	else if (type === "pass" || type === 0) {
		flashScreen("flash-red");
		resultsPool.push(`${activeItem} ❌`);
	}
	else {
		return;
	}
	

	updateHud();
	nextItem();
}

// Game state
let score = 0;
let timeLeft;
let timerId = null;
let playing = false;
let pool = [];
let items = [];
let activeItem;

let resultsPool = [];

// Elements
const titleElement = document.getElementById("title");
const itemText = document.getElementById("item-text");
const resultsText = document.getElementById("results-text");
const timerEl = document.getElementById("timer");
const scoreEl = document.getElementById("score");
const correctBtn = document.getElementById("correct-btn");
const passBtn = document.getElementById("pass-btn");
const appElement = document.querySelector(".app");

// On page load, hide control buttons:
correctBtn.style.display = 'none';
passBtn.style.display = 'none';

let data = await loadItems();
let activeSet = await flattenFromKeys(data, [
	"celebrities", "politicians", "musicians", "fictionalCharacters", 
	"landmarks", "tvShows", "movies", "sports"
]);

items = await shuffleArray(activeSet);
console.log(items);


// App element events:
appElement.addEventListener("pointerdown", startGame);


// Correct button interactions:
correctBtn.addEventListener("pointerdown", () => {
	handleButtonPress("correct");
});

// Pass button interactions:
passBtn.addEventListener("pointerdown", () => {
	handleButtonPress("pass");
});

