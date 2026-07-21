const API = "http://localhost:5000/api/results";

let results = [];
let subjects = [];
let deleteId = null;

// =====================================
// Page Load
// =====================================

window.addEventListener("DOMContentLoaded", () => {

    loadResults();
    loadSubjects();

    document
        .getElementById("searchResult")
        .addEventListener("input", searchResults);

    document
        .getElementById("subjectFilter")
        .addEventListener("change", filterResults);

});

// =====================================
// Load Results
// =====================================

async function loadResults(){

    try{

        const response = await fetch(API);

        const data = await response.json();

        if(data.success){

            results = data.results;

            displayResults(results);

        }

        else{

            showToast(data.message);

        }

    }

    catch(error){

        console.log(error);

        showToast("Unable to load results");

    }

}

// =====================================
// Load Subjects
// =====================================

async function loadSubjects(){

    try{

        const response = await fetch(
            "http://localhost:5000/api/subjects"
        );

        const data = await response.json();

        if(data.success){

            subjects = data.subjects;

            const filter =
            document.getElementById("subjectFilter");

            subjects.forEach(subject=>{

                filter.innerHTML += `

<option value="${subject._id}">
${subject.subjectName}
</option>

`;

            });

        }

    }

    catch(error){

        console.log(error);

    }

}

// =====================================
// Display Results
// =====================================

function displayResults(list){

    const table =
    document.getElementById("resultTable");

    const empty =
    document.getElementById("emptyState");

    const count =
    document.getElementById("resultCount");

    count.innerHTML =
    `Total Results : ${list.length}`;

    if(list.length===0){

        table.innerHTML="";

        empty.style.display="block";

        return;

    }

    empty.style.display="none";

    table.innerHTML="";

    list.forEach((result,index)=>{

        table.innerHTML += `

<tr>

<td>${index+1}</td>

<td>${result.studentName}</td>

<td>${result.subject?.subjectName || "-"}</td>

<td>${result.score}</td>

<td>${result.percentage}%</td>

<td>

<span class="${
result.status==="Pass"
?
"pass-badge"
:
"fail-badge"
}">

${result.status}

</span>

</td>

<td>

${new Date(
result.createdAt
).toLocaleDateString()}

</td>

<td>

<div class="action-buttons">

<button
class="view-btn"
title="View Result"
onclick="viewResult('${result._id}')">

<i class="fa-solid fa-eye"></i>

</button>

<button
class="certificate-btn"
title="View Certificate"
onclick="viewCertificate('${result._id}')">

<i class="fa-solid fa-certificate"></i>

</button>

<button
class="delete-btn"
title="Delete Result"
onclick="openDeleteModal('${result._id}')">

<i class="fa-solid fa-trash"></i>

</button>

</div>

</td>

</tr>

`;

    });

}

// =====================================
// View Result
// =====================================
// =====================================
// View Result
// =====================================

function viewResult(id){

    const result = results.find(r => r._id === id);

    if(!result){

        showToast("Result Not Found");

        return;

    }

    document.getElementById("resultDetails").innerHTML = `

<div class="result-card">

<div class="result-box">

<h4>Student Name</h4>

<p>${result.studentName}</p>

</div>

<div class="result-box">

<h4>Roll Number</h4>

<p>${result.rollNumber || "-"}</p>

</div>

<div class="result-box">

<h4>Email</h4>

<p>${result.email || "-"}</p>

</div>

<div class="result-box">

<h4>Course</h4>

<p>${result.course || "-"}</p>

</div>

<div class="result-box">

<h4>Semester</h4>

<p>${result.semester || "-"}</p>

</div>

<div class="result-box">

<h4>Subject</h4>

<p>${result.subject?.subjectName || "-"}</p>

</div>

<div class="result-box">

<h4>Total Questions</h4>

<p>${result.totalQuestions}</p>

</div>

<div class="result-box">

<h4>Correct</h4>

<p>${result.correctAnswers}</p>

</div>

<div class="result-box">

<h4>Wrong</h4>

<p>${result.wrongAnswers}</p>

</div>

<div class="result-box">

<h4>Score</h4>

<p>${result.score}</p>

</div>

<div class="result-box">

<h4>Percentage</h4>

<p>${result.percentage}%</p>

</div>

<div class="result-box">

<h4>Status</h4>

<p>

<span class="${
result.status==="Pass"
?
"pass-badge"
:
"fail-badge"
}">

${result.status}

</span>

</p>

</div>

</div>

`;

    document
    .getElementById("viewModal")
    .classList.add("active");

}

// =====================================
// View Certificate
// =====================================

function viewCertificate(id){

    const result = results.find(r=>r._id===id);

    if(!result){

        showToast("Result Not Found");

        return;

    }

    // Student Data

    const student={

        fullName:result.studentName,

        profilePhoto:result.profilePhoto,

        rollNumber:result.rollNumber,

        email:result.email,

        course:result.course,

        semester:result.semester

    };

    // Save Data

    localStorage.setItem(

        "certificateUser",

        JSON.stringify(student)

    );

    localStorage.setItem(

        "certificateResult",

        JSON.stringify(result)

    );

    localStorage.setItem(

        "subjectName",

        result.subject?.subjectName || ""

    );

    // Open Student Certificate

    window.location.href="../student/certificate.html";

}
// =====================================
// Close View Modal
// =====================================

function closeViewModal(){

    document

        .getElementById("viewModal")

        .classList.remove("active");

}

// =====================================
// Search Results
// =====================================

function searchResults(){

    const keyword =

        document

        .getElementById("searchResult")

        .value

        .toLowerCase();

    const subjectId =

        document

        .getElementById("subjectFilter")

        .value;

    let filtered = results.filter(result=>{

        return (

            result.studentName

            .toLowerCase()

            .includes(keyword)

        );

    });

    if(subjectId){

        filtered = filtered.filter(result=>{

            return result.subject?._id === subjectId;

        });

    }

    displayResults(filtered);

}

// =====================================
// Filter Subject
// =====================================

function filterResults(){

    searchResults();

}

// =====================================
// Delete Modal
// =====================================

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

// =====================================
// Delete Result
// =====================================

document

.getElementById("confirmDelete")

.addEventListener("click", deleteResult);

async function deleteResult(){

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

            loadResults();

        }

        else{

            showToast(data.message);

        }

    }

    catch(error){

        console.log(error);

        showToast("Unable to delete result");

    }

}
// =====================================
// Toast
// =====================================

function showToast(message){

    const toast = document.getElementById("toast");

    toast.innerHTML = message;

    toast.classList.add("show");

    setTimeout(()=>{

        toast.classList.remove("show");

    },3000);

}

// =====================================
// Outside Click Close
// =====================================

window.onclick = function(e){

    const viewModal =
        document.getElementById("viewModal");

    const deleteModal =
        document.getElementById("deleteModal");

    if(e.target===viewModal){

        closeViewModal();

    }

    if(e.target===deleteModal){

        closeDeleteModal();

    }

}

// =====================================
// Logout
// =====================================

function logout(){

    if(confirm("Logout Admin ?")){

        localStorage.clear();

        window.location.href="../index.html";

    }

}

// =====================================
// Refresh Results
// =====================================

function refreshResults(){

    loadResults();

}

// =====================================
// Export Results (Placeholder)
// =====================================

function exportResults(){

    showToast("Export Feature Coming Soon");

}

// =====================================
// Print Results
// =====================================

function printResults(){

    window.print();

}

// =====================================
// Keyboard Shortcuts
// =====================================

document.addEventListener("keydown",function(e){

    // ESC Close Modal

    if(e.key==="Escape"){

        closeViewModal();

        closeDeleteModal();

    }

    // Ctrl + F Search

    if(e.ctrlKey && e.key==="f"){

        e.preventDefault();

        document

        .getElementById("searchResult")

        .focus();

    }

});

// =====================================
// End of File
// =====================================