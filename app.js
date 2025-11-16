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
	playing = true;
	score = 0;
	timeLeft = 60;
	resultsPool = [];
	resultsText.innerHTML = "";
	updateHud();
	resetPool();
	nextItem();
	startBtn.disabled = true;
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
	startBtn.disabled = false;
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
const itemText = document.getElementById("item-text");
const resultsText = document.getElementById("results-text");
const timerEl = document.getElementById("timer");
const scoreEl = document.getElementById("score");
const startBtn = document.getElementById("start-btn");
const correctBtn = document.getElementById("correct-btn");
const passBtn = document.getElementById("pass-btn");
const appElement = document.querySelector(".app");



let data = await loadItems();
let activeSet = await flattenFromKeys(data, [
	"celebrities", "politicians", "musicians", "fictionalCharacters", 
	"landmarks", "tvShows", "movies", "sports"
]);

items = await shuffleArray(activeSet);
console.log(items);



startBtn.addEventListener("click", startGame);

correctBtn.addEventListener("click", () => {
	if (!playing) return;
	score += 1;
	updateHud();
	flashScreen("flash-green");
	resultsPool.push(`${activeItem} ✅`);
	nextItem();
});

if (passBtn) {
	passBtn.addEventListener("click", () => {
		if (!playing) return;
		flashScreen("flash-red");
		resultsPool.push(`${activeItem} ❌`);
		nextItem();
	});
}
