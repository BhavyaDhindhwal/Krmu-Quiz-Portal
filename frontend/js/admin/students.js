// ==========================================
// KRMU Quiz Portal
// Student Management
// Developed By : Bhavya Dhindhwal
// ==========================================

// ==========================================
// API
// ==========================================

const API = "http://localhost:5000/api/students";

// ==========================================
// Global Variables
// ==========================================

let students = [];
let deleteId = null;

// ==========================================
// Page Load
// ==========================================

window.addEventListener("DOMContentLoaded", () => {

    loadStudents();

    document
        .getElementById("searchStudent")
        .addEventListener("input", searchStudents);

});

// ==========================================
// Load Students
// ==========================================

async function loadStudents() {

    try {

        const response = await fetch(API);

        const data = await response.json();

        if (!data.success) {

            showToast(data.message);

            return;

        }

        students = data.students || [];

        displayStudents(students);

    }

    catch (error) {

        console.log(error);

        showToast("Unable to Load Students");

    }

}

// ==========================================
// Display Students
// ==========================================

function displayStudents(list) {

    const table = document.getElementById("studentTable");

    const count = document.getElementById("studentCount");

    const empty = document.getElementById("emptyState");

    table.innerHTML = "";

    count.innerHTML = `Total Students : ${list.length}`;

    if (list.length === 0) {

        empty.style.display = "block";

        return;

    }

    empty.style.display = "none";

    list.forEach((student, index) => {

        table.innerHTML += `

<tr>

<td>${index + 1}</td>

<td>

<img
class="student-photo"

src="${
student.profilePhoto
?
'http://localhost:5000/uploads/' + student.profilePhoto
:
'../images/user.png'
}">

</td>

<td>

${student.fullName}

</td>

<td>

${student.email}

</td>

<td>

${student.course}

</td>

<td>

Semester ${student.semester}

</td>

<td>

${new Date(student.createdAt).toLocaleDateString()}

</td>

<td>

<div class="action-buttons">

<button

class="view-btn"

onclick="viewStudent('${student._id}')">

<i class="fa-solid fa-eye"></i>

</button>

<button

class="delete-btn"

onclick="openDeleteModal('${student._id}')">

<i class="fa-solid fa-trash"></i>

</button>

</div>

</td>

</tr>

`;

    });

}
// ==========================================
// View Student
// ==========================================

function viewStudent(id){

    const student = students.find(

        s => s._id === id

    );

    if(!student){

        return;

    }

    document.getElementById("studentDetails").innerHTML = `

<div class="student-card">

<img

class="student-photo-large"

src="${
student.profilePhoto
?
'http://localhost:5000/uploads/'+student.profilePhoto
:
'../images/user.png'
}">

<div class="student-info">

<div class="info-box">

<h4>Full Name</h4>

<p>${student.fullName}</p>

</div>

<div class="info-box">

<h4>Email</h4>

<p>${student.email}</p>

</div>

<div class="info-box">

<h4>Roll Number</h4>

<p>${student.rollNumber}</p>

</div>

<div class="info-box">

<h4>Phone</h4>

<p>${student.phone}</p>

</div>

<div class="info-box">

<h4>Course</h4>

<p>${student.course}</p>

</div>

<div class="info-box">

<h4>Semester</h4>

<p>${student.semester}</p>

</div>

<div class="info-box">

<h4>Department</h4>

<p>${student.department}</p>

</div>

<div class="info-box">

<h4>Registered On</h4>

<p>

${new Date(student.createdAt).toLocaleDateString()}

</p>

</div>

</div>

</div>

`;

    document

    .getElementById("viewModal")

    .classList.add("active");

}

// ==========================================
// Close View Modal
// ==========================================

function closeViewModal(){

    document

    .getElementById("viewModal")

    .classList.remove("active");

}

// ==========================================
// Search Students
// ==========================================

function searchStudents(){

    const keyword =

    document

    .getElementById("searchStudent")

    .value

    .toLowerCase()

    .trim();

    const filtered = students.filter(student =>

        student.fullName

        .toLowerCase()

        .includes(keyword)

        ||

        student.email

        .toLowerCase()

        .includes(keyword)

        ||

        student.rollNumber

        .toLowerCase()

        .includes(keyword)

    );

    displayStudents(filtered);

}

// ==========================================
// Add Student Modal
// ==========================================

function openStudentModal(){

    document

    .getElementById("studentModal")

    .classList.add("active");

}

function closeStudentModal(){

    document

    .getElementById("studentModal")

    .classList.remove("active");

    document

    .getElementById("studentForm")

    .reset();

}
// ==========================================
// Create Student
// ==========================================

document

.getElementById("studentForm")

.addEventListener("submit", async function(e){

    e.preventDefault();

    const formData = new FormData();

    formData.append(

        "fullName",

        document.getElementById("fullName").value

    );

    formData.append(

        "rollNumber",

        document.getElementById("rollNumber").value

    );

    formData.append(

        "email",

        document.getElementById("email").value

    );

    formData.append(

        "phone",

        document.getElementById("phone").value

    );

    formData.append(

        "course",

        document.getElementById("course").value

    );

    formData.append(

        "semester",

        document.getElementById("semester").value

    );

    formData.append(

        "department",

        "School of Engineering & Technology"

    );

    formData.append(

        "password",

        document.getElementById("password").value

    );

    const photo =

    document.getElementById("profilePhoto").files[0];

    if(photo){

        formData.append(

            "profilePhoto",

            photo

        );

    }

    try{

        const response = await fetch(API,{

            method:"POST",

            body:formData

        });

        const data = await response.json();

        if(data.success){

            showToast("Student Added Successfully");

            closeStudentModal();

            loadStudents();

        }

        else{

            showToast(data.message);

        }

    }

    catch(error){

        console.log(error);

        showToast("Unable To Add Student");

    }

});

// ==========================================
// Delete Student
// ==========================================

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

document

.getElementById("confirmDelete")

.addEventListener("click",async()=>{

    if(!deleteId) return;

    try{

        const response=

        await fetch(

            `${API}/${deleteId}`,

            {

                method:"DELETE"

            }

        );

        const data=

        await response.json();

        showToast(data.message);

        closeDeleteModal();

        loadStudents();

    }

    catch(error){

        console.log(error);

        showToast("Delete Failed");

    }

});

// ==========================================
// Toast
// ==========================================

function showToast(message){

    const toast=

    document.getElementById("toast");

    toast.innerHTML=message;

    toast.classList.add("show");

    setTimeout(()=>{

        toast.classList.remove("show");

    },3000);

}

// ==========================================
// Outside Click
// ==========================================

window.onclick=function(e){

    if(e.target===document.getElementById("viewModal")){

        closeViewModal();

    }

    if(e.target===document.getElementById("deleteModal")){

        closeDeleteModal();

    }

    if(e.target===document.getElementById("studentModal")){

        closeStudentModal();

    }

}

// ==========================================
// Logout
// ==========================================

function logout(){

    if(confirm("Logout Admin?")){

        localStorage.clear();

        window.location.href="../index.html";

    }

}

// ==========================================
// Keyboard Shortcut
// ==========================================

document.addEventListener("keydown",function(e){

    if(e.key==="Escape"){

        closeViewModal();

        closeDeleteModal();

        closeStudentModal();

    }

});
// =====================================
// Photo Preview
// =====================================

const profilePhoto = document.getElementById("profilePhoto");

if(profilePhoto){

    profilePhoto.addEventListener("change",function(){

        const file = this.files[0];

        if(!file) return;

        const reader = new FileReader();

        reader.onload=function(e){

            document.getElementById("photoPreview").src=e.target.result;

        }

        reader.readAsDataURL(file);

    });

}
// =====================================
// Show Hide Password
// =====================================

const togglePassword=document.getElementById("togglePassword");

if(togglePassword){

togglePassword.addEventListener("click",()=>{

const password=document.getElementById("password");

if(password.type==="password"){

password.type="text";

togglePassword.classList.remove("fa-eye");

togglePassword.classList.add("fa-eye-slash");

}

else{

password.type="password";

togglePassword.classList.remove("fa-eye-slash");

togglePassword.classList.add("fa-eye");

}

});

}
// =====================================
// Close on Outside Click
// =====================================

window.addEventListener("click",function(e){

const modal=document.getElementById("studentModal");

if(e.target===modal){

closeStudentModal();

}

});
// =====================================
// ESC Close
// =====================================

document.addEventListener("keydown",function(e){

if(e.key==="Escape"){

closeStudentModal();

}

});
// ==========================================
// End
// ==========================================