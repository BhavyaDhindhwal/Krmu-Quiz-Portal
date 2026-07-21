const API = "http://localhost:5000/api/auth";

async function login() {

    const email = document.getElementById("email").value;

    const password = document.getElementById("password").value;

    try {

        const response = await fetch(API + "/login", {

            method: "POST",

            headers: {

                "Content-Type": "application/json"

            },

            body: JSON.stringify({

                email,
                password

            })

        });

        const data = await response.json();

        if (data.success) {

            localStorage.setItem("token", data.token);

            localStorage.setItem("user", JSON.stringify(data.user));

            alert("Login Successful");

            if (data.user.role === "admin") {

                window.location.href = "../admin/dashboard.html";

            }

            else {

                window.location.href = "dashboard.html";

            }

        }

        else {

            alert(data.message);

        }

    }

    catch (error) {

        alert(error.message);

    }

}