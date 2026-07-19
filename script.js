// ===============================
// Password Toggle
// ===============================

function togglePassword(inputId, icon) {
    const input = document.getElementById(inputId);

    if (input.type === "password") {
        input.type = "text";
        icon.classList.replace("fa-eye", "fa-eye-slash");
    } else {
        input.type = "password";
        icon.classList.replace("fa-eye-slash", "fa-eye");
    }
}

// ===============================
// DOM Elements
// ===============================

const signupForm = document.getElementById("signup");
const loginForm = document.getElementById("login");

const name = document.getElementById("name");
const email = document.getElementById("email");
const password = document.getElementById("password");
const confirmPassword = document.getElementById("confirm_password");

const signinEmail = document.getElementById("signin-email");
const signinPassword = document.getElementById("signin-password");

// ===============================
// Default Admin
// ===============================

let admin = JSON.parse(localStorage.getItem("admin"));

if (!admin) {
    admin = {
        email: "gamerayan261@gmail.com",
        password: "123456"
    };

    localStorage.setItem("admin", JSON.stringify(admin));
}

// ===============================
// Logout Helper
// ===============================

let loginGuardHandler = null;

function markLoggedOut() {
    localStorage.removeItem("isLoggedIn");
    localStorage.removeItem("authRole");
}

function setupLoginGuard() {
    if (localStorage.getItem("isLoggedIn") === "true") {
        return;
    }

    history.replaceState({ page: "login" }, "", window.location.href);

    if (loginGuardHandler) {
        window.removeEventListener("popstate", loginGuardHandler);
    }

    loginGuardHandler = () => {
        alert("Please login first");
        history.pushState({ page: "login" }, "", window.location.href);
    };

    window.addEventListener("popstate", loginGuardHandler);
}

function stopLoginGuard() {
    if (loginGuardHandler) {
        window.removeEventListener("popstate", loginGuardHandler);
        loginGuardHandler = null;
    }
}

setupLoginGuard();

// ===============================
// Form Switching
// ===============================

function showForm(form) {
    if (form === "login") {
        signupForm.style.display = "none";
        loginForm.style.display = "flex";
    } else {
        signupForm.style.display = "flex";
        loginForm.style.display = "none";
    }
}

const params = new URLSearchParams(window.location.search);
if (params.get("form") === "login") {
    showForm("login");
} else {
    showForm("signup");
}

document.querySelector(".have-account").addEventListener("click", () => {
    showForm("login");
});

document.querySelector(".dont-have-account").addEventListener("click", () => {
    showForm("signup");
});

// ===============================
// Signup
// ===============================

function form(event) {

    event.preventDefault();

    let students = JSON.parse(localStorage.getItem("student")) || [];

    if (password.value !== confirmPassword.value) {
        alert("Password and Confirm Password do not match");
        return;
    }

    if (students.some(student => student.email === email.value)) {
        alert("Email already exists");
        email.value = "";
        return;
    }

    const student = {
        name: name.value,
        email: email.value,
        password: password.value
    };

    students.push(student);

    // Pehle notifications ko localStorage se lo
    let notifications = JSON.parse(localStorage.getItem("notifications")) || [];

    // Phir new notification add karo
    notifications.unshift({
        id: Date.now(),
        name: student.name,
        email: student.email,
        message: `${student.name} created a new account.`,
        time: new Date().toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit"
        }),
        read: false
    });

    // Save notifications
    localStorage.setItem("notifications", JSON.stringify(notifications));

    // Save students
    localStorage.setItem("student", JSON.stringify(students));

    event.target.reset();

    signupForm.style.display = "none";
    loginForm.style.display = "flex";
}

// ===============================
// Login
// ===============================

function signinForm(event) {

    event.preventDefault();

    const students = JSON.parse(localStorage.getItem("student")) || [];

    // Admin Login
    if (
        admin.email === signinEmail.value &&
        admin.password === signinPassword.value
    ) {
        localStorage.setItem("isLoggedIn", "true");
        localStorage.setItem("authRole", "admin");
        stopLoginGuard();
        alert("Welcome Admin");
        window.location.href = "./Admin/dashboard.html";
        return;
    }
    // Student Login
    const isUser = students.some(student =>
        student.email === signinEmail.value &&
        student.password === signinPassword.value
    );

    if (isUser) {
        localStorage.setItem("isLoggedIn", "true");
        localStorage.setItem("authRole", "student");
        localStorage.setItem("currentStudentEmail", signinEmail.value);
        stopLoginGuard();
        alert("Login Successful");
        window.location.href = "./Student/dashboard.html";
        return;
    } else {
        markLoggedOut();
        alert("Invalid Email or Password");
    }

    event.target.reset();
}