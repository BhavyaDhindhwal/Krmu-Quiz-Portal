const API = "http://localhost:5000/api/auth/register";

async function register() {

    const fullName = document.getElementById("fullName").value.trim();
    const rollNumber = document.getElementById("rollNo").value.trim();
    const phone = document.getElementById("phone").value.trim();
    const course = document.getElementById("course").value;
    const semester = document.getElementById("semester").value;
    const department = document.getElementById("department").value;
    const email = document.getElementById("email").value.trim().toLowerCase();
    const password = document.getElementById("password").value;
    const confirmPassword = document.getElementById("confirmPassword").value;
    const photo = document.getElementById("photo").files[0];

    if (
        !fullName ||
        !rollNumber ||
        !phone ||
        !course ||
        !semester ||
        !department ||
        !email ||
        !password ||
        !confirmPassword
    ) {
        alert("Please fill all fields.");
        return;
    }

    if (password !== confirmPassword) {
        alert("Passwords do not match.");
        return;
    }

    if (photo && !photo.type.startsWith("image/")) {
        alert("Please upload a valid image.");
        return;
    }

    const formData = new FormData();

    formData.append("fullName", fullName);
    formData.append("rollNumber", rollNumber);
    formData.append("phone", phone);
    formData.append("course", course);
    formData.append("semester", semester);
    formData.append("department", department);
    formData.append("email", email);
    formData.append("password", password);

    if (photo) {
        formData.append("photo", photo);
    }

    try {

        const response = await fetch(API, {
            method: "POST",
            body: formData
        });

        const data = await response.json();

        if (response.ok && data.success) {

            alert("Registration Successful!");

            window.location.href = "login.html";

        } else {

            alert(data.message || "Registration Failed");

        }

    } catch (error) {

        console.error(error);
        alert("Unable to connect to server.");

    }

}