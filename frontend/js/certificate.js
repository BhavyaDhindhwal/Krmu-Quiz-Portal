const SETTINGS_API = "http://localhost:5000/api/settings";

const result = JSON.parse(localStorage.getItem("result"));
const user = JSON.parse(localStorage.getItem("user"));

if (!result || !user) {

    alert("Result not found.");

    window.location.href = "dashboard.html";

}

// =====================================
// Load Settings From MongoDB
// =====================================

async function loadSettings() {

    try {

        const response = await fetch(SETTINGS_API);

        const data = await response.json();

        if (data.success) {

            document.getElementById("certificateTitle").innerText =
                data.settings.certificateTitle;

            document.getElementById("controllerName").innerText =
                data.settings.adminName;

        }

    }

    catch (error) {

        console.log(error);

    }

}

// =====================================
// Student Details
// =====================================

document.getElementById("studentName").innerText =
    user.fullName;

document.getElementById("score").innerText =
    result.score;

// Student Photo

if (user.profilePhoto) {

    document.getElementById("studentPhoto").src =
        "http://localhost:5000/uploads/" + user.profilePhoto;

}

else {

    document.getElementById("studentPhoto").src =
        "../images/default-user.png";

}

// =====================================
// Grade
// =====================================

let grade = "";

if (result.percentage >= 90) grade = "A+";
else if (result.percentage >= 80) grade = "A";
else if (result.percentage >= 70) grade = "B+";
else if (result.percentage >= 60) grade = "B";
else if (result.percentage >= 40) grade = "C";
else grade = "F";

document.getElementById("grade").innerText = grade;

// =====================================
// Subject
// =====================================

document.getElementById("subjectName").innerText =
    localStorage.getItem("subjectName") || "Quiz Subject";

// =====================================
// Issue Date
// =====================================

const today = new Date();

document.getElementById("issueDate").innerText =
    today.toLocaleDateString("en-IN", {

        day: "2-digit",

        month: "long",

        year: "numeric"

    });

// =====================================
// Certificate ID
// =====================================

document.getElementById("certificateId").innerText =
    result.certificateId;

// =====================================
// Buttons
// =====================================

function downloadCertificate() {

    window.print();

}

function goDashboard() {

    window.location.href = "dashboard.html";

}

// =====================================
// Animation
// =====================================

window.onload = function () {

    loadSettings();

    document.querySelector(".certificate").classList.add("fade");

};