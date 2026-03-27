const API = "http://127.0.0.1:8000";

async function getFire() {
    const age = Number(document.getElementById("age").value);
    const income = Number(document.getElementById("income").value);
    const expenses = Number(document.getElementById("expenses").value);

    const res = await fetch(API + "/fire", {
        method: "POST",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify({ age, income, expenses })
    });

    const data = await res.json();

    if (data.status === "success") {
        document.getElementById("fireResult").innerText = data.data.message;
    } else {
        document.getElementById("fireResult").innerText = data.error;
    }
}

async function getScore() {
    const income = Number(document.getElementById("income").value);
    const savings = Number(document.getElementById("savings").value);

    const res = await fetch(API + "/score", {
        method: "POST",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify({ income, savings })
    });

    const data = await res.json();

    if (data.status === "success") {
        document.getElementById("scoreResult").innerText = data.data.message;
    } else {
        document.getElementById("scoreResult").innerText = data.error;
    }
}

async function askAI() {
    const question = document.getElementById("question").value;

    const res = await fetch(API + "/chat", {
        method: "POST",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify({ question })
    });

    const data = await res.json();

    if (data.status === "success") {
        document.getElementById("chatResult").innerText = data.data.response;
    } else {
        document.getElementById("chatResult").innerText = data.error;
    }
}

function startVoice() {
    const recognition = new webkitSpeechRecognition();

    recognition.onresult = function(event) {
        const text = event.results[0][0].transcript;
        document.getElementById("question").value = text;
        askAI();
    };

    recognition.start();
}