let questions = {};
let currentQuestions = 0;
let score = 0;
let playerName = ""; // Corregido: playerName en vez de playName
let timer;
let timeLeft = 15;
let selectCategory = "";
let level = 1;

fetch("questions.json")
   .then(response => response.json())
   .then(data => {
        questions = data;
    });

function startGame() {
    playerName = document.getElementById("player-name").value;
    selectCategory = document.getElementById("category").value;
    if (!playerName) { // Corregido: playerName en vez de playName
        alert("Por favor ingresa tu nombre");
        return;
    }
    document.getElementById("start-screen").classList.add("hidden");
    document.getElementById("quiz-screen").classList.remove("hidden");
    currentQuestions = 0;
    score = 0;
    level = 1;
    showQuestion();
}

function showQuestion() {
    let categoryQuestions = questions[selectCategory];
    if (currentQuestions >= categoryQuestions.length) { // Corregido: currentQuestions y >= para la lógica de fin de juego
        endGame();
        return;
    }

    let q = categoryQuestions[currentQuestions]; // Corregido: categoryQuestions y currentQuestions
    document.getElementById("question").innerText = q.pregunta;
    document.getElementById("level").innerText = `Nivel: ${level}`;
    let optionsDiv = document.getElementById("options");
    optionsDiv.innerHTML = "";
    q.opciones.forEach(opcion => {
        let btn = document.createElement("button");
        btn.innerText = opcion;
        btn.onclick = () => checkAnswer(opcion);
        optionsDiv.appendChild(btn);
    });
    timeLeft = 15;
    document.getElementById("timer").innerText = `Tiempo: ${timeLeft}s`;
    clearInterval(timer);
    timer = setInterval(() => {
        timeLeft--;
        document.getElementById("timer").innerText = `Tiempo: ${timeLeft}s`;
        if (timeLeft < 0) {
            clearInterval(timer);
            currentQuestions++;
            // level++; // Decidir si el nivel sube por tiempo agotado o por respuesta correcta
            showQuestion();
        }
    }, 1000);
}

function checkAnswer(opcion) {
    let q = questions[selectCategory][currentQuestions];
    if (opcion === q.respuesta) {
        score++;
        document.getElementById("correct-sound").play();
    } else {
        document.getElementById("wrong-sound").play();
    }
    currentQuestions++; // Corregido: currentQuestions
    level++;
    showQuestion();
}

// Esta línea fue movida dentro de endGame y se eliminó de aquí porque no tiene sentido fuera de una función
// document.getElementById("score").innerText = `${playerName},tu puntaje es:${score}`;

function endGame() {
    clearInterval(timer);
    document.getElementById("quiz-screen").classList.add("hidden");
    document.getElementById("end-screen").classList.remove("hidden");
    document.getElementById("final-score").innerText = `${playerName}, tu puntaje es: ${score}`; // Añadido un elemento para el puntaje final
    
    let ranking = JSON.parse(localStorage.getItem("ranking")) || [];
    ranking.push({ nombre: playerName, puntos: score }); // Corregido: playerName en vez de playName
    ranking.sort((a, b) => b.puntos - a.puntos);
    localStorage.setItem("ranking", JSON.stringify(ranking)); // Corregido: guardando el array ranking

    let rankingList = document.getElementById("ranking");
    rankingList.innerHTML = "";
    ranking.slice(0, 5).forEach(r => {
        let li = document.createElement("li");
        li.innerText = `${r.nombre}: ${r.puntos} puntos`;
        rankingList.appendChild(li);
    });
}

function restarGame() { // Corregido: restartGame
    document.getElementById("end-screen").classList.add("hidden");
    document.getElementById("quiz-screen").classList.remove("hidden"); // Corregido: comillas en "quiz-screen"
    currentQuestions = 0; // Corregido: currentQuestions es variable, no función
    score = 0;
    level = 1;
    showQuestion();
}

function toggleTheme() {
    document.body.classList.toggle("dark-mode");
}