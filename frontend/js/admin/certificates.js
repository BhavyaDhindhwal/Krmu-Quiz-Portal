const API = "http://localhost:5000/api/certificate";

let certificates = [];
let deleteId = null;

// =====================================
// Page Load
// =====================================

window.addEventListener("DOMContentLoaded", () => {

    loadCertificates();

    loadSubjectFilter();

    document

        .getElementById("searchCertificate")

        .addEventListener("input", searchCertificates);

});

// =====================================
// Load Certificates
// =====================================

async function loadCertificates(){

    try{

        const response = await fetch(API);

        const data = await response.json();

        if(data.success){

            certificates = data.certificates;

            displayCertificates(certificates);

            loadSubjectFilter();

        }

        else{

            showToast(data.message);

        }

    }

    catch(error){

        console.log(error);

        showToast("Unable to load certificates");

    }

}

// =====================================
// Display Certificates
// =====================================

function displayCertificates(list){

    const table =
        document.getElementById("certificateTable");

    const empty =
        document.getElementById("emptyState");

    const count =
        document.getElementById("certificateCountNumber");

    if(count){

    count.innerHTML=`
    ${list.length}
    <br>
    <span>Certificates</span>
    `;

    }

    empty.style.display="none";

    table.innerHTML="";

    list.forEach((certificate,index)=>{

        table.innerHTML += `

<tr>

<td>${index+1}</td>

<td>

<img

src="${
certificate.studentPhoto
?
`http://localhost:5000/uploads/${certificate.studentPhoto}`
:
"user.png"
}"

class="student-avatar">

</td>

<td>

${certificate.certificateId}

</td>

<td>

${certificate.studentName}

</td>

<td>

${certificate.subject?.subjectName || "-"}

</td>

<td>

<span class="grade">

${certificate.grade || "-"}

</span>

</td>

<td>

${certificate.percentage}%

</td>

<td>

<span class="pass-badge">

${certificate.status}

</span>

</td>

<td>

${new Date(

certificate.createdAt

).toLocaleDateString()}

</td>

<td>

<div class="action-buttons">

<button

class="view-btn"

onclick="viewCertificate('${certificate._id}')">

<i class="fa-solid fa-eye"></i>

</button>

<button

class="download-btn"

onclick="downloadCertificate('${certificate._id}')">

<i class="fa-solid fa-download"></i>

</button>

<button

class="delete-btn"

onclick="openDeleteModal('${certificate._id}')">

<i class="fa-solid fa-trash"></i>

</button>

</div>

</td>

</tr>

`;

    });

}
// =====================================
// View Certificate
// =====================================

function viewCertificate(id){

    const certificate = certificates.find(

        c => c._id === id

    );

    if(!certificate) return;

    document.getElementById("certificatePreview").innerHTML = `

<div class="certificate">

<img
src="logo.png"
class="certificate-logo"
alt="KRMU Logo">
<h1 class="certificate-title">

CERTIFICATE

</h1>

<p class="certificate-subtitle">

OF ACHIEVEMENT

</p>

<img
src="${
certificate.studentPhoto
? `http://localhost:5000/uploads/${certificate.studentPhoto}`
: "http://localhost:5000/uploads/user.png"
}"
class="student-photo">

<p class="certificate-text">

This is to certify that

</p>

<h2 class="student-name">

${certificate.studentName}

</h2>

<p class="certificate-text">

has successfully completed the

<strong class="highlight">

${certificate.subject?.subjectName || ""}

</strong>

Quiz Examination with

</p>

<div class="score-box">

<h2>

${certificate.percentage}%

</h2>

<p>

Score :
<b>

${certificate.score}

</b>

</p>

<p>

Grade :
<b>

${certificate.grade}

</b>

</p>

<p>

Performance :
<b>

${certificate.performance}

</b>

</p>

<p>

Status :
<b>

${certificate.status}

</b>

</p>

</div>
<div class="student-details">

<p>

<b>Roll Number :</b>

${certificate.rollNumber || "-"}

</p>

<p>

<b>Course :</b>

${certificate.course || "-"}

</p>

<p>

<b>Semester :</b>

${certificate.semester || "-"}

</p>

<p>

<b>Department :</b>

${certificate.department || "-"}

</p>

</div>

<div class="certificate-footer">

<div class="sign-box">

<div class="sign-line"></div>

<h4>

Authorized Signature

</h4>

<p>

K.R. Mangalam University

</p>

</div>

<div class="gold-seal">

🏆

<br>

KRMU

</div>

<div class="sign-box">

<div class="sign-line"></div>

<h4>

Issue Date

</h4>

<p>

${new Date(
certificate.createdAt
).toLocaleDateString()}

</p>

</div>

</div>

</div>

`;

    document

        .getElementById("viewModal")

        .classList.add("active");

    document.getElementById("downloadBtn").onclick = function(){

    downloadCertificate(id);

};    

}



// =====================================
// Close Modal
// =====================================

function closeViewModal(){

    document

        .getElementById("viewModal")

        .classList.remove("active");

}

// =====================================
// Search Certificate
// =====================================

function searchCertificates() {

    const keyword = document
        .getElementById("searchCertificate")
        .value
        .toLowerCase();

    const subject = document.getElementById("subjectFilter")
        ? document.getElementById("subjectFilter").value
        : "";

    const status = document.getElementById("statusFilter")
        ? document.getElementById("statusFilter").value
        : "";

    const filtered = certificates.filter(c => {

        const matchKeyword =
            c.studentName.toLowerCase().includes(keyword) ||
            c.certificateId.toLowerCase().includes(keyword);

        const matchSubject =
            subject === "" ||
            c.subject?.subjectName === subject;

        const matchStatus =
            status === "" ||
            c.status === status;

        return matchKeyword && matchSubject && matchStatus;

    });

    displayCertificates(filtered);

}
// =====================================
// Delete Modal
// =====================================

function openDeleteModal(id){

    deleteId=id;

    document

    .getElementById("deleteModal")

    .classList.add("active");

}

function closeDeleteModal(){

    deleteId=null;

    document

    .getElementById("deleteModal")

    .classList.remove("active");

}

// =====================================
// Delete Certificate
// =====================================

document

.getElementById("confirmDelete")

.addEventListener("click",deleteCertificate);

async function deleteCertificate(){

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

            loadCertificates();

        }

        else{

            showToast(data.message);

        }

    }

    catch(error){

        console.log(error);

        showToast("Unable to delete certificate");

    }

}

// =====================================
// Print Certificate
// =====================================

function printCertificate(){

    const printContents =

    document.getElementById(

        "certificatePreview"

    ).innerHTML;

    const win =

    window.open("","","width=1200,height=800");

    win.document.write(`

<html>

<head>

<title>

Print Certificate

</title>

<link rel="stylesheet"

href="../css/certificates.css">

</head>

<body>

${printContents}

</body>

</html>

`);

    win.document.close();

    win.focus();

    win.print();

    win.close();

}
// =====================================
// Download Certificate
// =====================================

function downloadCertificate(id){

    const certificateData = certificates.find(

        c => c._id === id

    );

    if(!certificateData){

        showToast("Certificate not found");

        return;

    }

    // Preview Load

    viewCertificate(id);

    setTimeout(()=>{

        const certificate =

        document.getElementById(

            "certificatePreview"

        );

        if(!certificate){

            showToast(

                "Certificate not found"

            );

            return;

        }

        if(typeof html2pdf==="undefined"){

            showToast(

                "html2pdf library not loaded"

            );

            return;

        }

        const options={

            margin:0.25,

            filename:

            `${certificateData.studentName}_Certificate.pdf`,

            image:{

                type:"jpeg",

                quality:1

            },

            html2canvas:{

                scale:3,

                useCORS:true,

                scrollY:0

            },

            jsPDF:{

                unit:"mm",

                format:"a4",

                orientation:"landscape"

            }

        };

        html2pdf()

        .set(options)

        .from(certificate)

        .save();

    },300);

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
// Refresh Certificates
// =====================================

function refreshCertificates(){

    loadCertificates();

}

// =====================================
// Keyboard Shortcuts
// =====================================

document.addEventListener("keydown",function(e){

    if(e.key==="Escape"){

        closeViewModal();

        closeDeleteModal();

    }

    if(e.ctrlKey && e.key==="f"){

        e.preventDefault();

        document
            .getElementById("searchCertificate")
            .focus();

    }

});


function loadSubjectFilter() {

    const subjectFilter = document.getElementById("subjectFilter");

    if (!subjectFilter) return;

    const subjects = [];

    certificates.forEach(c => {

        if (
            c.subject &&
            c.subject.subjectName &&
            !subjects.includes(c.subject.subjectName)
        ) {
            subjects.push(c.subject.subjectName);
        }

    });

    subjects.forEach(subject => {

        subjectFilter.innerHTML +=
            `<option value="${subject}">${subject}</option>`;

    });

    subjectFilter.addEventListener(
        "change",
        searchCertificates
    );

    const statusFilter =
        document.getElementById("statusFilter");

    if (statusFilter) {

        statusFilter.addEventListener(
            "change",
            searchCertificates
        );

    }

}



// =====================================
// End of File
// =====================================