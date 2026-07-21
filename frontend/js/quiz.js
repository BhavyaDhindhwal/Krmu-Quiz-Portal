const API = "http://localhost:5000/api/quiz";
const SETTINGS_API = "http://localhost:5000/api/settings";

const subjectId = localStorage.getItem("subjectId");

let questions = [];
let currentQuestion = 0;
let answers = [];
let timeLeft = 120;
let timerInterval;


// =========================
// Load Quiz
// =========================

async function loadQuiz() {

    try {

        // Load Settings
        const settingsResponse = await fetch(SETTINGS_API);
        const settingsData = await settingsResponse.json();

        if (settingsData.success) {
            timeLeft = Number(settingsData.settings.quizTime) * 60;
        }

        // Load Questions
        const response = await fetch(`${API}/start/${subjectId}`);
        const data = await response.json();

        if (data.success) {

            questions = data.questions;
            console.log("Quiz Time From DB:", settingsData.settings.quizTime);
            console.log("Time Left Before Timer:", timeLeft);

            showQuestion();

            startTimer();

        } else {

            alert("Questions not found");

        }

    } catch (error) {

        console.log(error);

        alert("Unable to load quiz.");

    }

}

loadQuiz();

// =========================
// Show Question
// =========================

function showQuestion() {

    const q = questions[currentQuestion];

    document.getElementById("questionNumber").innerHTML =
        `Question ${currentQuestion + 1} of ${questions.length}`;

    document.getElementById("question").innerHTML =
        q.question;

    const optionBox =
        document.getElementById("options");

    optionBox.innerHTML = "";

    q.options.forEach((option, index) => {

        optionBox.innerHTML += `

<label class="option">

<input
type="radio"
name="answer"
value="${index}"
${answers[currentQuestion] === index ? "checked" : ""}
onchange="saveAnswer(${index})">

${option}

</label>

`;

    });

    updateProgress();

    updateButtons();

}

// =========================
// Save Answer
// =========================

function saveAnswer(index) {

    answers[currentQuestion] = index;

}

// =========================
// Progress
// =========================

function updateProgress() {

    const percent =
        ((currentQuestion + 1) / questions.length) * 100;

    document.getElementById("progress").style.width =
        percent + "%";

    document.getElementById("progressText").innerHTML =
        Math.round(percent) + "%";

}

// =========================
// Timer
// =========================

function startTimer() {

    timerInterval = setInterval(() => {

        const min = Math.floor(timeLeft / 60);

        const sec = timeLeft % 60;

        document.getElementById("timer").innerHTML =
            `${String(min).padStart(2, "0")}:${String(sec).padStart(2, "0")}`;

        if (timeLeft <= 0) {

            clearInterval(timerInterval);

            submitQuiz();

            return;

        }

        timeLeft--;

    }, 1000);

}
// =========================
// Previous Question
// =========================

function previousQuestion() {

    if (currentQuestion > 0) {

        currentQuestion--;

        showQuestion();

    }

}

// =========================
// Next Question
// =========================

function nextQuestion() {

    if (currentQuestion < questions.length - 1) {

        currentQuestion++;

        showQuestion();

    }

}

// =========================
// Buttons
// =========================

function updateButtons() {

    const prevBtn = document.querySelector(".prev");
    const nextBtn = document.querySelector(".next");

    prevBtn.disabled = currentQuestion === 0;

    if (currentQuestion === questions.length - 1) {

        nextBtn.innerHTML = `
            Finish
            <i class="fa-solid fa-paper-plane"></i>
        `;

        nextBtn.onclick = submitQuiz;

    } else {

        nextBtn.innerHTML = `
            Next
            <i class="fa-solid fa-arrow-right"></i>
        `;

        nextBtn.onclick = nextQuestion;

    }

}

// =========================
// Submit Quiz
// =========================

async function submitQuiz() {

    clearInterval(timerInterval);

    if (!confirm("Are you sure you want to submit the quiz?")) {

        startTimer();

        return;

    }

    const user = JSON.parse(localStorage.getItem("user"));

    const finalAnswers = [];

    questions.forEach((q, index) => {

        finalAnswers.push({

            questionId: q._id,

            selectedOption:
                answers[index] !== undefined
                    ? answers[index]
                    : -1

        });

    });

    try {

        const response = await fetch(

            "http://localhost:5000/api/results/submit",

            {

                method: "POST",

                headers: {

                    "Content-Type": "application/json"

                },

                body: JSON.stringify({

                    studentName: user.fullName,

                    email: user.email,

                    subject: subjectId,

                    answers: finalAnswers

                })

            }

        );

        const data = await response.json();

        if (data.success) {

            localStorage.setItem(

                "result",

                JSON.stringify(data.result)

            );

            window.location.href = "result.html";

        } else {

            alert(data.message);

            startTimer();

        }

    }

    catch (error) {

        console.log(error);

        alert("Server Error");

        startTimer();

    }

}

// =========================
// Keyboard Navigation
// =========================

document.addEventListener("keydown", function (e) {

    if (e.key === "ArrowLeft") {

        previousQuestion();

    }

    if (e.key === "ArrowRight") {

        if (currentQuestion === questions.length - 1) {

            submitQuiz();

        } else {

            nextQuestion();

        }

    }

});