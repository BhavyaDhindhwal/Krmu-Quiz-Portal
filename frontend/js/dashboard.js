// ======================================================
// KRMU QUIZ PORTAL
// Student Dashboard
// Developed By : Bhavya Dhindhwal
// ======================================================

// ============================
// API URL
// ============================

const API = "http://localhost:5000/api/subjects";
const RESULT_API = "http://localhost:5000/api/results";

// ============================
// Logged In User
// ============================

const user = JSON.parse(localStorage.getItem("user"));

if (!user) {

    window.location.href = "login.html";

}

// ============================
// Global Variables
// ============================

let allSubjects = [];
let allResults = [];
let performanceChart = null;

// ============================
// Dashboard Load
// ============================

window.addEventListener("DOMContentLoaded", () => {

    loadProfile();

    loadSubjects();

});

// ============================
// Load Student Profile
// ============================

function loadProfile() {

    document.getElementById("studentName").innerText =
        user.fullName;

    document.getElementById("studentName2").innerText =
        user.fullName;

    document.getElementById("studentCourse").innerText =
        user.course || "B.Tech Full Stack Development";

    const photo =
        document.getElementById("profilePhoto");

    if (user.profilePhoto) {

        photo.src =
            "http://localhost:5000/uploads/" +
            user.profilePhoto;

    }

    else {

        // Free Avatar API

        photo.src =
            "https://ui-avatars.com/api/?name=" +
            encodeURIComponent(user.fullName) +
            "&background=0B3D91&color=fff";

    }

}

// ============================
// Load Subjects
// ============================

async function loadSubjects() {

    try {

        const response =
            await fetch(API);

        const data =
            await response.json();

        if (!data.success) {

            return;

        }

        allSubjects = data.subjects;

        document.getElementById("totalSubjects").innerText =
            allSubjects.length;

        displaySubjects(allSubjects);

        // Load Statistics After Subjects

        loadStatistics();

    }

    catch (error) {

        console.log(error);

    }

}

// ============================
// Display Subjects
// ============================

function displaySubjects(subjects) {

    const subjectList =
        document.getElementById("subjectList");

    subjectList.innerHTML = "";

    if (subjects.length === 0) {

        subjectList.innerHTML = `

        <h3 style="text-align:center;
        width:100%;
        color:#777;">

        No Subject Found

        </h3>

        `;

        return;

    }

    subjects.forEach(subject => {

        subjectList.innerHTML += `

<div class="subject-card">

    <div class="subject-icon">

        <i class="fa-solid fa-book-open"></i>

    </div>

    <h3>

        ${subject.subjectName}

    </h3>

    <p>

        <b>Code :</b>

        ${subject.subjectCode}

    </p>

    <p>

        <b>Semester :</b>

        ${subject.semester}

    </p>

    <p>

        <b>Department :</b>

        ${subject.department}

    </p>

    <div class="info">

        <span class="badge">

            Quiz

        </span>

        <span class="badge">

            MCQ

        </span>

    </div>

    <button
        onclick="startQuiz('${subject._id}')">

        Start Quiz

    </button>

</div>

`;

    });

}

// ============================
// Search Subject
// ============================

function searchSubjects() {

    const keyword =

        document

        .getElementById("searchSubject")

        .value

        .toLowerCase()

        .trim();

    const filtered =

        allSubjects.filter(subject =>

            subject.subjectName

            .toLowerCase()

            .includes(keyword)

            ||

            subject.subjectCode

            .toLowerCase()

            .includes(keyword)

        );

    displaySubjects(filtered);

}
// ======================================================
// LOAD STUDENT STATISTICS
// ======================================================

async function loadStatistics() {

    try {

        const response = await fetch(
            `${RESULT_API}/student/${user._id}`
        );

        const data = await response.json();

        if (!data.success) {

            return;

        }

        // ==========================================
        // Statistics Cards
        // ==========================================

        document.getElementById("attemptQuiz").innerText =
            data.totalQuizAttempted || 0;

        document.getElementById("highestScore").innerText =
            (data.highestScore || 0) + "%";

        document.getElementById("averageScore").innerText =
            Number(data.averageScore || 0).toFixed(2) + "%";

        // ==========================================
        // Store Results
        // ==========================================

        allResults =
            data.recentResults ||
            data.history ||
            [];

        // Last 5 Quiz Only

        const recentResults =
            allResults.slice(-5);

        // ==========================================
        // Render Dashboard
        // ==========================================

        renderHistory(recentResults);

        renderGraph(recentResults);

    }

    catch (error) {

        console.log(error);

    }

}

// ======================================================
// RENDER HISTORY TABLE
// ======================================================

function renderHistory(results) {

    const table =
        document.getElementById("historyTable");

    table.innerHTML = "";

    if (results.length === 0) {

        table.innerHTML = `

<tr>

<td colspan="4"

style="text-align:center;
padding:20px;">

No Quiz Attempted

</td>

</tr>

`;

        return;

    }

    results.reverse().forEach(result => {

        table.innerHTML += `

<tr>

<td>

${result.subject?.subjectName || "Subject"}

</td>

<td>

${result.percentage}%

</td>

<td>

${result.grade}

</td>

<td class="${
result.status === "Pass"
?
"pass"
:
"fail"
}">

${result.status}

</td>

</tr>

`;

    });

}

// ======================================================
// PERFORMANCE GRAPH
// ======================================================

function renderGraph(results) {

    const labels = [];

    const marks = [];

    results.forEach((quiz,index)=>{

        labels.push(

            "Quiz " + (index+1)

        );

        marks.push(

            Number(quiz.percentage)

        );

    });

    const canvas =
        document.getElementById("performanceChart");

    if(!canvas) return;

    const ctx =
        canvas.getContext("2d");

    if(performanceChart){

        performanceChart.destroy();

    }

    performanceChart = new Chart(ctx,{

        type:"bar",

        data:{

            labels:labels,

            datasets:[{

                label:"Quiz Performance",

                data:marks,

                backgroundColor:"#FFD700",

                borderColor:"#0B3D91",

                borderWidth:2,

                borderRadius:10,

                barThickness:45,

                maxBarThickness:55

            }]

        },

        options:{

            responsive:true,

            maintainAspectRatio:false,

            animation:true,

            plugins:{

                legend:{

                    display:false

                },

                tooltip:{

                    enabled:true

                }

            },

            scales:{

                x:{

                    grid:{

                        display:false

                    }

                },

                y:{

                    beginAtZero:true,

                    max:100,

                    ticks:{

                        stepSize:20

                    }

                }

            }

        }

    });

}
// ======================================================
// START QUIZ
// ======================================================

function startQuiz(subjectId) {

    const subject = allSubjects.find(
        item => item._id === subjectId
    );

    if (!subject) {

        alert("Subject not found.");

        return;

    }

    localStorage.setItem(
        "subjectId",
        subject._id
    );

    localStorage.setItem(
        "subjectName",
        subject.subjectName
    );

    localStorage.setItem(
        "subjectCode",
        subject.subjectCode
    );

    window.location.href = "quiz.html";

}

// ======================================================
// NAVIGATION
// ======================================================

function goDashboard() {

    location.href = "dashboard.html";

}

function goSubjects() {

    document
        .querySelector(".section-title")
        .scrollIntoView({

            behavior: "smooth"

        });

}

function goResults() {

    if(localStorage.getItem("result")){

        location.href="result.html";

    }

    else{

        alert("Please complete a quiz first.");

    }

}

function goCertificate(){

    if(localStorage.getItem("result")){

        location.href="certificate.html";

    }

    else{

        alert("Please complete a quiz first.");

    }

}

// ======================================================
// LOGOUT
// ======================================================

function logout(){

    const ok = confirm(

        "Do you really want to logout?"

    );

    if(!ok) return;

    localStorage.clear();

    location.href="login.html";

}

// ======================================================
// AUTO REFRESH DASHBOARD
// ======================================================

window.addEventListener("pageshow",()=>{

    loadStatistics();

});

// ======================================================
// SHORTCUTS
// ======================================================

document.addEventListener("keydown",(e)=>{

    if(e.key==="Escape"){

        document
        .getElementById("searchSubject")
        .value="";

        displaySubjects(allSubjects);

    }

});

// ======================================================
// SMALL UTILITIES
// ======================================================

function showToast(message){

    console.log(message);

}

// ======================================================
// IMAGE FALLBACK
// ======================================================

const img = document.getElementById("profilePhoto");

if(img){

    img.onerror=function(){

        this.src="https://ui-avatars.com/api/?name="+

        encodeURIComponent(user.fullName)+

        "&background=0B3D91&color=ffffff";

    }

}