const API = "http://localhost:5000/api/questions";
const SUBJECT_API = "http://localhost:5000/api/subjects";

let questions = [];
let subjects = [];
let deleteId = null;

// ==============================
// Page Load
// ==============================

window.addEventListener("DOMContentLoaded", () => {

    loadSubjects();

    loadQuestions();

    document

        .getElementById("addQuestionBtn")

        .addEventListener("click", openAddModal);

    document

        .getElementById("questionForm")

        .addEventListener("submit", saveQuestion);

    document

        .getElementById("searchQuestion")

        .addEventListener("input", searchQuestions);

    document

        .getElementById("filterSubject")

        .addEventListener("change", filterQuestions);

});

// ==============================
// Load Subjects
// ==============================

async function loadSubjects(){

    try{

        const response = await fetch(SUBJECT_API);

        const data = await response.json();

        if(data.success){

            subjects = data.subjects;

            fillSubjectDropdown();

        }

    }

    catch(error){

        console.log(error);

    }

}

// ==============================
// Fill Dropdown
// ==============================

function fillSubjectDropdown(){

    const subject =
        document.getElementById("subject");

    const filter =
        document.getElementById("filterSubject");

    subject.innerHTML =
        `<option value="">Select Subject</option>`;

    filter.innerHTML =
        `<option value="">All Subjects</option>`;

    subjects.forEach(s=>{

        subject.innerHTML +=

        `<option value="${s._id}">

            ${s.subjectName}

        </option>`;

        filter.innerHTML +=

        `<option value="${s._id}">

            ${s.subjectName}

        </option>`;

    });

}

// ==============================
// Load Questions
// ==============================

async function loadQuestions(){

    try{

        const response = await fetch(API);

        const data = await response.json();

        if(data.success){

            questions = data.questions;

            displayQuestions(questions);

        }

    }

    catch(error){

        console.log(error);

        showToast("Unable to load questions");

    }

}
// ==============================
// Display Questions
// ==============================

function displayQuestions(list){

    const table =
        document.getElementById("questionTable");

    const empty =
        document.getElementById("emptyState");

    const count =
        document.getElementById("questionCount");

    count.innerHTML =
        `Total Questions : ${list.length}`;

    if(list.length===0){

        table.innerHTML="";

        empty.style.display="block";

        return;

    }

    empty.style.display="none";

    table.innerHTML="";

    list.forEach((q,index)=>{

        let badge="easy";

        if(q.difficulty==="Medium") badge="medium";

        if(q.difficulty==="Hard") badge="hard";

        table.innerHTML+=`

<tr>

<td>${index+1}</td>

<td>${q.subject?.subjectName || "-"}</td>

<td>${q.question}</td>

<td>${q.marks}</td>

<td>

<span class="badge ${badge}">

${q.difficulty}

</span>

</td>

<td>

Option ${String.fromCharCode(65 + q.correctAnswer)}

</td>

<td>

<div class="action-buttons">

<button
class="edit-btn"
onclick="editQuestion('${q._id}')">

<i class="fa-solid fa-pen"></i>

</button>

<button
class="delete-btn"
onclick="openDeleteModal('${q._id}')">

<i class="fa-solid fa-trash"></i>

</button>

</div>

</td>

</tr>

`;

    });

}

// ==============================
// Open Add Modal
// ==============================

function openAddModal(){

    document.getElementById("modalTitle").innerHTML =
    "Add Question";

    document.getElementById("questionForm").reset();

    document.getElementById("questionId").value="";

    document
        .getElementById("questionModal")
        .classList.add("active");

}

// ==============================
// Close Modal
// ==============================

function closeModal(){

    document
        .getElementById("questionModal")
        .classList.remove("active");

}

// ==============================
// Save Question
// ==============================

async function saveQuestion(e){

    e.preventDefault();

    const id =
        document.getElementById("questionId").value;

    const body={

        subject:
        document.getElementById("subject").value,

        question:
        document.getElementById("question").value,

        options:[

            document.getElementById("option1").value,

            document.getElementById("option2").value,

            document.getElementById("option3").value,

            document.getElementById("option4").value

        ],

        correctAnswer:Number(

            document.getElementById("correctAnswer").value

        ),

        difficulty:
        document.getElementById("difficulty").value,

        marks:Number(

            document.getElementById("marks").value

        ),

        explanation:
        document.getElementById("explanation").value

    };

    const url = id ? `${API}/${id}` : API;

    const method = id ? "PUT" : "POST";

    try{

        const response = await fetch(url,{

            method,

            headers:{

                "Content-Type":"application/json"

            },

            body:JSON.stringify(body)

        });

        const data = await response.json();

        if(data.success){

            showToast(data.message);

            closeModal();

            loadQuestions();

        }

        else{

            showToast(data.message);

        }

    }

    catch(error){

        console.log(error);

        showToast("Server Error");

    }

}
// ==============================
// Edit Question
// ==============================

function editQuestion(id){

    const q = questions.find(item => item._id === id);

    if(!q) return;

    document.getElementById("modalTitle").innerHTML =
    "Edit Question";

    document.getElementById("questionId").value = q._id;

    document.getElementById("subject").value = q.subject._id;

    document.getElementById("question").value = q.question;

    document.getElementById("option1").value = q.options[0];

    document.getElementById("option2").value = q.options[1];

    document.getElementById("option3").value = q.options[2];

    document.getElementById("option4").value = q.options[3];

    document.getElementById("correctAnswer").value =
    q.correctAnswer;

    document.getElementById("difficulty").value =
    q.difficulty;

    document.getElementById("marks").value =
    q.marks;

    document.getElementById("explanation").value =
    q.explanation || "";

    document
        .getElementById("questionModal")
        .classList.add("active");

}

// ==============================
// Delete Modal
// ==============================

function openDeleteModal(id){

    deleteId = id;

    document
        .getElementById("deleteModal")
        .classList.add("active");

}

function closeDeleteModal(){

    deleteId = null;

    document
        .getElementById("deleteModal")
        .classList.remove("active");

}

// ==============================
// Delete Question
// ==============================

document
.getElementById("confirmDelete")
.addEventListener("click", deleteQuestion);

async function deleteQuestion(){

    if(!deleteId) return;

    try{

        const response = await fetch(

            `${API}/${deleteId}`,

            {

                method:"DELETE"

            }

        );

        const data = await response.json();

        if(data.success){

            showToast(data.message);

            closeDeleteModal();

            loadQuestions();

        }

        else{

            showToast(data.message);

        }

    }

    catch(error){

        console.log(error);

        showToast("Unable to delete question");

    }

}

// ==============================
// Search Questions
// ==============================

function searchQuestions(){

    const keyword =
    document
    .getElementById("searchQuestion")
    .value
    .toLowerCase();

    const filtered = questions.filter(q=>{

        return q.question
        .toLowerCase()
        .includes(keyword);

    });

    displayQuestions(filtered);

}

// ==============================
// Subject Filter
// ==============================

function filterQuestions(){

    const subjectId =
    document.getElementById("filterSubject").value;

    if(subjectId===""){

        displayQuestions(questions);

        return;

    }

    const filtered = questions.filter(q=>{

        return q.subject &&
        q.subject._id===subjectId;

    });

    displayQuestions(filtered);

}

// ==============================
// Toast
// ==============================

function showToast(message){

    const toast =
    document.getElementById("toast");

    toast.innerHTML = message;

    toast.classList.add("show");

    setTimeout(()=>{

        toast.classList.remove("show");

    },3000);

}

// ==============================
// Outside Click Close
// ==============================

window.onclick = function(e){

    const modal =
    document.getElementById("questionModal");

    const deleteModal =
    document.getElementById("deleteModal");

    if(e.target===modal){

        closeModal();

    }

    if(e.target===deleteModal){

        closeDeleteModal();

    }

}

// ==============================
// Logout
// ==============================

function logout(){

    if(confirm("Logout Admin?")){

        localStorage.clear();

        window.location.href="../index.html";

    }

}