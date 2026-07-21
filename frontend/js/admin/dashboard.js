const API = "http://localhost:5000/api/admin";

// ======================================
// Dashboard Load
// ======================================

window.addEventListener("DOMContentLoaded", () => {

    loadDashboard();

});

// ======================================
// Load Dashboard
// ======================================

async function loadDashboard() {

    try {

        const response = await fetch(`${API}/dashboard`);

        const data = await response.json();

        if (!data.success) {

            alert("Dashboard Load Failed");

            return;

        }

        updateCards(data.dashboard);

        loadRecentResults(data.recentResults);

        loadChart(data.dashboard);

    }

    catch (error) {

        console.log(error);

        alert("Server Error");

    }

}

// ======================================
// Dashboard Cards
// ======================================

function updateCards(dashboard) {

    document.getElementById("totalStudents").innerText =
        dashboard.totalStudents;

    document.getElementById("totalSubjects").innerText =
        dashboard.totalSubjects;

    document.getElementById("totalQuestions").innerText =
        dashboard.totalQuestions;

    document.getElementById("passRate").innerText =
        dashboard.passRate + "%";

}

// ======================================
// Recent Results Table
// ======================================

function loadRecentResults(results) {

    const tbody =
        document.getElementById("recentResults");

    tbody.innerHTML = "";

    if (results.length === 0) {

        tbody.innerHTML = `

<tr>

<td colspan="5">

No Results Found

</td>

</tr>

`;

        return;

    }

    results.forEach(result => {

        tbody.innerHTML += `

<tr>

<td>

${result.studentName}

</td>

<td>

${result.subject.subjectName}

</td>

<td>

${result.percentage}%

</td>

<td>

${result.grade || "-"}

</td>

<td>

<span class="${
result.status==="Pass"
?
"status-pass"
:
"status-fail"
}">

${result.status}

</span>

</td>

</tr>

`;

    });

}

// ======================================
// Chart
// ======================================

function loadChart(dashboard) {

    const ctx =
        document
        .getElementById("performanceChart");

    new Chart(ctx, {

        type: "doughnut",

        data: {

            labels: [

                "Pass",

                "Remaining"

            ],

            datasets: [

                {

                    data: [

                        dashboard.passRate,

                        100-dashboard.passRate

                    ],

                    backgroundColor: [

                        "#0B3D91",

                        "#FFD700"

                    ],

                    borderWidth:0

                }

            ]

        },

        options: {

            responsive:true,

            plugins:{

                legend:{

                    position:"bottom"

                }

            }

        }

    });

}

// ======================================
// Logout
// ======================================

function logout(){

    if(confirm("Logout Admin ?")){

        localStorage.clear();

        window.location.href="../index.html";

    }

}