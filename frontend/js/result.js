const result = JSON.parse(localStorage.getItem("result"));

const user = JSON.parse(localStorage.getItem("user"));

if (!result || !user) {

    window.location.href = "dashboard.html";

}

// =========================
// Student Information
// =========================

document.getElementById("studentName").innerText =
    user.fullName;

document.getElementById("percentage").innerText =
    result.percentage + "%";

document.getElementById("correct").innerText =
    result.correctAnswers;

document.getElementById("wrong").innerText =
    result.wrongAnswers;

document.getElementById("score").innerText =
    result.score;

// =========================
// Grade
// =========================

let grade = "";

let message = "";

if (result.percentage >= 90) {

    grade = "A+";

    message =
        "Outstanding Performance! You have excellent knowledge of this subject.";

}

else if (result.percentage >= 80) {

    grade = "A";

    message =
        "Excellent Work! Keep maintaining this performance.";

}

else if (result.percentage >= 70) {

    grade = "B+";

    message =
        "Very Good! A little more practice will make you even better.";

}

else if (result.percentage >= 60) {

    grade = "B";

    message =
        "Good Job! Keep practicing to improve your score.";

}

else if (result.percentage >= 40) {

    grade = "C";

    message =
        "Average Performance. Practice more to achieve better results.";

}

else {

    grade = "F";

    message =
        "Needs Improvement. Don't give up—practice and try again.";

}

document.getElementById("grade").innerText = grade;

document.getElementById("message").innerText = message;

// =========================
// Pass / Fail
// =========================

const status =
document.getElementById("status");

if(result.percentage>=40){

    status.innerText="PASS";

    status.style.background="#16A34A";

}

else{

    status.innerText="FAIL";

    status.style.background="#DC2626";

}
// =========================
// Animated Score Ring
// =========================

const circle = document.getElementById("progressCircle");

const radius = 90;

const circumference = 2 * Math.PI * radius;

circle.style.strokeDasharray = circumference;

const offset =
    circumference -
    (result.percentage / 100) * circumference;

setTimeout(() => {

    circle.style.strokeDashoffset = offset;

}, 300);

// =========================
// Count Animation
// =========================

let current = 0;

const percentageText =
document.getElementById("percentage");

const counter = setInterval(() => {

    current++;

    percentageText.innerText = current + "%";

    if (current >= result.percentage) {

        clearInterval(counter);

    }

}, 20);

// =========================
// Download Certificate
// =========================

function downloadCertificate() {

    window.location.href =
        "certificate.html";

}

// =========================
// Dashboard
// =========================

function goDashboard() {

    window.location.href =
        "dashboard.html";

}

// =========================
// Prevent Back After Result
// =========================

history.pushState(null, null, location.href);

window.onpopstate = function () {

    history.go(1);

};

// =========================
// Confetti (Pass Only)
// =========================

if (result.percentage >= 40) {

    setTimeout(() => {

        for (let i = 0; i < 80; i++) {

            const confetti =
                document.createElement("div");

            confetti.style.position = "fixed";
            confetti.style.width = "8px";
            confetti.style.height = "8px";
            confetti.style.background =
                i % 2 === 0 ? "#FFD700" : "#0B3D91";
            confetti.style.left =
                Math.random() * window.innerWidth + "px";
            confetti.style.top = "-10px";
            confetti.style.borderRadius = "50%";
            confetti.style.zIndex = "9999";
            confetti.style.transition = "3s linear";

            document.body.appendChild(confetti);

            setTimeout(() => {

                confetti.style.top =
                    window.innerHeight + "px";

                confetti.style.opacity = "0";

            }, 50);

            setTimeout(() => {

                confetti.remove();

            }, 3200);

        }

    }, 500);

}