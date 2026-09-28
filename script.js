const defaultVotes = {
    JavaScript: 0,
    Python: 0,
    Java: 0,
    "HTML": 0
};

function loadVotes() {
    try {
        const saved = localStorage.getItem("pollVotes");
        const data = saved ? JSON.parse(saved) : {};

        return Object.fromEntries(
            Object.keys(defaultVotes).map(option => [
                option,
                Number.isInteger(data[option]) && data[option] >= 0
                    ? data[option]
                    : 0
            ])
        );
    } catch {
        return { ...defaultVotes };
    }
}

let votes = loadVotes();

const pollForm = document.getElementById("pollForm");
const resetButton = document.getElementById("resetButton");
const message = document.getElementById("message");
const resultsContainer = document.getElementById("resultsContainer");
const totalVotesElement = document.getElementById("totalVotes");

function saveVotes() {
    localStorage.setItem("pollVotes", JSON.stringify(votes));
}

function renderResults() {
    const total = Object.values(votes).reduce(
        (sum, count) => sum + count, 0
    );

    totalVotesElement.textContent = total;
    resultsContainer.innerHTML = "";

    Object.entries(votes).forEach(([option, count]) => {
        const percentage = total === 0
            ? 0
            : Math.round(count / total * 100);

        const item = document.createElement("div");
        item.className = "result-item";

        const info = document.createElement("div");
        info.className = "result-info";

        const name = document.createElement("span");
        name.className = "result-name";
        name.textContent = option;

        const percent = document.createElement("span");
        percent.className = "result-percentage";
        percent.textContent = percentage + "%";

        info.append(name, percent);

        const background = document.createElement("div");
        background.className = "progress-background";

        const bar = document.createElement("div");
        bar.className = "progress-bar";
        bar.style.width = percentage + "%";
        background.appendChild(bar);

        const countText = document.createElement("div");
        countText.className = "result-votes";
        countText.textContent =
            count + (count === 1 ? " vote" : " votes");

        item.append(info, background, countText);
        resultsContainer.appendChild(item);
    });
}

function showMessage(text, type) {
    message.textContent = text;
    message.className = "message " + type;
}

pollForm.addEventListener("submit", function (event) {
    event.preventDefault();

    const selected = pollForm.querySelector(
        'input[name="vote"]:checked'
    );

    if (!selected) {
        showMessage("Please select an option before voting.", "error");
        return;
    }

    votes[selected.value]++;
    saveVotes();
    renderResults();

    showMessage("Your vote was submitted successfully!", "success");
    pollForm.reset();
});

resetButton.addEventListener("click", function () {
    if (!confirm("Are you sure you want to reset all poll results?")) {
        return;
    }

    votes = { ...defaultVotes };
    localStorage.removeItem("pollVotes");
    renderResults();
    showMessage("Poll results have been reset.", "success");
});

renderResults();