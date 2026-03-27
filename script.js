const API = "http://127.0.0.1:8000";

// FIRE
async function getFire() {
    const age = +document.getElementById("age").value;
    const income = +document.getElementById("income").value;
    const expenses = +document.getElementById("expenses").value;

    const res = await fetch(API + "/fire", {
        method: "POST",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify({ age, income, expenses })
    });

    const data = await res.json();
    document.getElementById("fireResult").innerText =
        data.status === "success" ? data.data.message : data.error;
}

// SCORE
async function getScore() {
    const income = +document.getElementById("income2").value;
    const savings = +document.getElementById("savings").value;

    const res = await fetch(API + "/score", {
        method: "POST",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify({ income, savings })
    });

    const data = await res.json();
    document.getElementById("scoreResult").innerText =
        data.status === "success" ? data.data.message : data.error;
}

// CHAT
async function askAI() {
    const question = document.getElementById("question").value;

    const res = await fetch(API + "/chat", {
        method: "POST",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify({ question })
    });

    const data = await res.json();
    document.getElementById("chatResult").innerText =
        data.status === "success" ? data.data.response : data.error;
}

// VOICE 🎙️
function startVoice() {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;

    if (!SpeechRecognition) {
        alert("Voice not supported in this browser");
        return;
    }

    const recognition = new SpeechRecognition();
    recognition.lang = "en-IN";

    recognition.onresult = (event) => {
        const text = event.results[0][0].transcript;
        document.getElementById("question").value = text;
        askAI();
    };

    recognition.start();
}
