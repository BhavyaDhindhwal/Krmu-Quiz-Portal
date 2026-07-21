const API = "http://localhost:5000/api/subjects";

let subjects = [];

let deleteId = null;

// ===============================
// Page Load
// ===============================

window.addEventListener("DOMContentLoaded", () => {

    loadSubjects();

    document

        .getElementById("addSubjectBtn")

        .addEventListener("click", openAddModal);

    document

        .getElementById("subjectForm")

        .addEventListener("submit", saveSubject);

    document

        .getElementById("searchSubject")

        .addEventListener("input", searchSubjects);

});

// ===============================
// Load Subjects
// ===============================

async function loadSubjects() {

    try {

        const response = await fetch(API);

        const data = await response.json();

        if (data.success) {

            subjects = data.subjects;

            displaySubjects(subjects);

        }

    }

    catch (error) {

        console.log(error);

        showToast("Unable to load subjects");

    }

}

// ===============================
// Display Subjects
// ===============================

function displaySubjects(list) {

    const table = document.getElementById("subjectTable");

    const empty = document.getElementById("emptyState");

    const count = document.getElementById("subjectCount");

    count.innerHTML = `Total Subjects : ${list.length}`;

    if (list.length === 0) {

        table.innerHTML = "";

        empty.style.display = "block";

        return;

    }

    empty.style.display = "none";

    table.innerHTML = "";

    list.forEach((subject, index) => {

        table.innerHTML += `

<tr>

<td>${index + 1}</td>

<td>${subject.subjectName}</td>

<td>${subject.subjectCode}</td>

<td>${subject.description || "-"}</td>

<td>${subject.totalQuestions || 0}</td>

<td>${new Date(subject.createdAt).toLocaleDateString()}</td>

<td>

<div class="action-buttons">

<button

class="edit-btn"

onclick="editSubject('${subject._id}')">

<i class="fa-solid fa-pen"></i>

</button>

<button

class="delete-btn"

onclick="openDeleteModal('${subject._id}')">

<i class="fa-solid fa-trash"></i>

</button>

</div>

</td>

</tr>

`;

    });

}
// ===============================
// Add Subject
// ===============================

function openAddModal(){

    document.getElementById("modalTitle").innerHTML =
    "Add Subject";

    document.getElementById("subjectForm").reset();

    document.getElementById("subjectId").value = "";

    document
        .getElementById("subjectModal")
        .classList.add("active");

}

// ===============================
// Close Modal
// ===============================

function closeModal(){

    document
        .getElementById("subjectModal")
        .classList.remove("active");

}

// ===============================
// Save Subject
// ===============================

async function saveSubject(e){

    e.preventDefault();

    const id =
        document.getElementById("subjectId").value;

    const body={

        subjectName:
        document.getElementById("subjectName").value,

        subjectCode:
        document.getElementById("subjectCode").value,

        semester:2,

        department:"School of Engineering & Technology",

        description:
        document.getElementById("description").value

    };

    const url = id
        ? `${API}/${id}`
        : API;

    const method = id
        ? "PUT"
        : "POST";

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

            loadSubjects();

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

// ===============================
// Edit Subject
// ===============================

function editSubject(id){

    const subject =
        subjects.find(s=>s._id===id);

    if(!subject) return;

    document.getElementById("modalTitle").innerHTML =
    "Edit Subject";

    document.getElementById("subjectId").value =
    subject._id;

    document.getElementById("subjectName").value =
    subject.subjectName;

    document.getElementById("subjectCode").value =
    subject.subjectCode;

    document.getElementById("description").value =
    subject.description || "";

    document
        .getElementById("subjectModal")
        .classList.add("active");

}

// ===============================
// Search
// ===============================

function searchSubjects(){

    const keyword =
        document
        .getElementById("searchSubject")
        .value
        .toLowerCase();

    const filtered = subjects.filter(subject=>{

        return (

            subject.subjectName
            .toLowerCase()
            .includes(keyword)

            ||

            subject.subjectCode
            .toLowerCase()
            .includes(keyword)

        );

    });

    displaySubjects(filtered);

}
// ===============================
// Delete Modal
// ===============================

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

// ===============================
// Confirm Delete
// ===============================

document
    .getElementById("confirmDelete")
    .addEventListener("click", deleteSubject);

async function deleteSubject(){

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

            loadSubjects();

        }

        else{

            showToast(data.message);

        }

    }

    catch(error){

        console.log(error);

        showToast("Unable to delete subject");

    }

    closeDeleteModal();

}

// ===============================
// Toast
// ===============================

function showToast(message){

    const toast =
        document.getElementById("toast");

    toast.innerHTML = message;

    toast.classList.add("show");

    setTimeout(()=>{

        toast.classList.remove("show");

    },3000);

}

// ===============================
// Close Modal on Outside Click
// ===============================

window.onclick = function(e){

    const subjectModal =
        document.getElementById("subjectModal");

    const deleteModal =
        document.getElementById("deleteModal");

    if(e.target === subjectModal){

        closeModal();

    }

    if(e.target === deleteModal){

        closeDeleteModal();

    }

}

// ===============================
// Logout
// ===============================

function logout(){

    if(confirm("Logout Admin?")){

        localStorage.clear();

        window.location.href="../index.html";

    }

}
