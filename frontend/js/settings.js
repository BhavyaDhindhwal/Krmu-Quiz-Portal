// =====================================
// SETTINGS.JS
// =====================================
const API = "http://localhost:5000/api/settings";
// Load Settings
window.addEventListener("DOMContentLoaded", loadSettings);

// =====================================
// Load Settings
// =====================================

// =====================================
// Load Settings From MongoDB
// =====================================

async function loadSettings() {

    try {

        const response = await fetch(API);

        const data = await response.json();

        if (!data.success) return;

        const settings = data.settings;

        document.getElementById("adminName").value =
            settings.adminName;

        document.getElementById("adminEmail").value =
            settings.adminEmail;

        document.getElementById("passMarks").value =
            settings.passMarks;

        document.getElementById("quizTime").value =
            settings.quizTime;

        document.getElementById("certificateTitle").value =
            settings.certificateTitle;

        document.querySelectorAll("input[name='theme']").forEach(radio => {

            if (radio.value === settings.theme) {

                radio.checked = true;

            }

        });

        applyTheme(settings.theme);

    }

    catch (error) {

        console.log(error);

    }

}

// =====================================
// Save Settings
// =====================================
// =====================================
// Save Settings To MongoDB
// =====================================

async function saveSettings() {

    const settings = {

        adminName:
            document.getElementById("adminName").value,

        adminEmail:
            document.getElementById("adminEmail").value,

        passMarks:
            Number(document.getElementById("passMarks").value),

        quizTime:
            Number(document.getElementById("quizTime").value),

        certificateTitle:
            document.getElementById("certificateTitle").value,

        theme:
            document.querySelector(
                "input[name='theme']:checked"
            ).value

    };

    try {

        const response = await fetch(API, {

            method: "PUT",

            headers: {

                "Content-Type": "application/json"

            },

            body: JSON.stringify(settings)

        });

        const data = await response.json();

        if (data.success) {

            applyTheme(settings.theme);

            showToast("Settings Saved Successfully");

        }

        else {

            alert(data.message);

        }

    }

    catch (error) {

        console.log(error);

    }

}

// =====================================
// Reset Settings
// =====================================

async function resetSettings(){

    if(!confirm("Reset Settings?")) return;

    await fetch(API,{

        method:"PUT",

        headers:{

            "Content-Type":"application/json"

        },

        body:JSON.stringify({

            adminName:"Controller of Examination",

            adminEmail:"admin@krmu.edu.in",

            passMarks:40,

            quizTime:2,

            certificateTitle:"Certificate of Achievement",

            theme:"blue"

        })

    });

    loadSettings();

    showToast("Settings Reset Successfully");

}

// =====================================
// Apply Theme
// =====================================

function applyTheme(theme) {

    if (theme === "dark") {

        document.body.style.background = "#111";

        document.body.style.color = "#fff";

    }

    else if (theme === "light") {

        document.body.style.background = "#ffffff";

        document.body.style.color = "#222";

    }

    else {

        // Blue + Gold

        document.body.style.background = "#edf3ff";

        document.body.style.color = "#222";

    }

}

// =====================================
// Dashboard
// =====================================

function goDashboard() {

    window.location.href = "dashboard.html";

}

// =====================================
// Toast
// =====================================

function showToast(message) {

    const toast = document.getElementById("toast");

    toast.innerHTML = message;

    toast.classList.add("show");

    setTimeout(() => {

        toast.classList.remove("show");

    }, 3000);

}

// =====================================
// Keyboard Shortcuts
// =====================================

document.addEventListener("keydown", function (e) {

    if (e.ctrlKey && e.key === "s") {

        e.preventDefault();

        saveSettings();

    }

    if (e.key === "Escape") {

        history.back();

    }

});


// =====================================
// Logout
// =====================================

function logout(){

    if(confirm("Are you sure you want to logout?")){

        // Local Storage Clear
        localStorage.removeItem("user");
        localStorage.removeItem("token");
        localStorage.removeItem("admin");

        // Agar sab data clear karna ho to:
        // localStorage.clear();

        // Redirect to Login Page
        window.location.href = "../index.html";

    }

}