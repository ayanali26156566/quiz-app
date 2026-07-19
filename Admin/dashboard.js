// ======================================================
// Dashboard JS - Part 1
// Lucide + Mobile Sidebar + Sidebar Navigation
// ======================================================

const isLoggedIn = localStorage.getItem("isLoggedIn") === "true";

if (!isLoggedIn) {
    alert("Please login first");
}

// ======================================================
// Lucide Icons
// ======================================================

lucide.createIcons();


// ======================================================
// Mobile Sidebar Elements
// ======================================================

const hamburgerBtn = document.getElementById("hamburger-btn");
const closeSidebarBtn = document.getElementById("close-sidebar-btn");
const mobileSidebar = document.getElementById("mobile-sidebar");
const sidebarBackdrop = document.getElementById("sidebar-backdrop");


// ======================================================
// Open Mobile Sidebar
// ======================================================

function openSidebar() {

    if (mobileSidebar) {

        mobileSidebar.classList.remove("hidden");
        mobileSidebar.classList.add("flex");
        document.body.classList.add("overflow-hidden");

    }

}


// ======================================================
// Close Mobile Sidebar
// ======================================================

function closeSidebar() {

    if (mobileSidebar) {

        mobileSidebar.classList.add("hidden");
        mobileSidebar.classList.remove("flex");
        document.body.classList.remove("overflow-hidden");

    }

}


// ======================================================
// Sidebar Events
// ======================================================

if (hamburgerBtn) {

    hamburgerBtn.addEventListener("click", openSidebar);

}

if (closeSidebarBtn) {

    closeSidebarBtn.addEventListener("click", closeSidebar);

}

if (sidebarBackdrop) {

    sidebarBackdrop.addEventListener("click", closeSidebar);

}



// ======================================================
// Sidebar Navigation
// ======================================================

// All Sidebar Links

const sidebarLinks =
    document.querySelectorAll(".sidebar-link");

// All Sections

const sections =
    document.querySelectorAll("main section");


// ======================================================
// Show Selected Section
// ======================================================

function showSection(sectionId) {

    // Hide All Sections

    sections.forEach(section => {

        section.classList.add("hidden");

    });

    // Show Current Section

    const currentSection =
        document.getElementById(sectionId);

    if (currentSection) {

        currentSection.classList.remove("hidden");

    }

}



// ======================================================
// Active Sidebar Link
// ======================================================

function setActiveLink(activeLink) {

    if (!activeLink) return;

    const targetSection = activeLink.dataset.section;

    sidebarLinks.forEach(link => {

        const isActive = link.dataset.section === targetSection;

        link.classList.toggle("sidebar-active", isActive);
        link.classList.toggle("bg-blue-600/15", isActive);
        link.classList.toggle("border-l-4", isActive);
        link.classList.toggle("border-blue-500", isActive);
        link.classList.toggle("shadow-lg", isActive);
        link.classList.toggle("shadow-blue-500/20", isActive);
        link.classList.toggle("text-white", isActive);
        link.classList.toggle("text-slate-400", !isActive);

        if (isActive) {

            link.classList.remove("hover:bg-slate-800", "hover:text-white");

        }

        else {

            link.classList.add("hover:bg-slate-800", "hover:text-white");

        }

    });

}



// ======================================================
// Sidebar Click Events
// ======================================================

sidebarLinks.forEach(link => {

    link.addEventListener("click", function (e) {

        e.preventDefault();

        const targetSection =
            this.dataset.section;

        if (!targetSection) return;

        // Show Selected Section

        showSection(targetSection);

        // Active Sidebar

        setActiveLink(this);

        // Close Mobile Sidebar

        if (window.innerWidth < 1024) {

            closeSidebar();

        }

    });

});



// ======================================================
// Default Page
// ======================================================

showSection("dashboard-section");

const defaultLink =
    document.querySelector(
        '[data-section="dashboard-section"]'
    );

if (defaultLink) {

    setActiveLink(defaultLink);

}



// ======================================================
// Close Sidebar On Desktop
// ======================================================

window.addEventListener("resize", () => {

    if (window.innerWidth >= 1024) {

        closeSidebar();

    }

});
// ======================================================
// Dashboard JS - Part 2
// Notification System
// ======================================================


// ======================================================
// Notification Elements
// ======================================================

const notificationBtn =
    document.getElementById("notification");

const notificationArea =
    document.getElementById("notification-area");

const notificationBadge =
    document.getElementById("notification-count");



// ======================================================
// Update Notification Badge
// ======================================================

function updateNotificationCount() {

    const notifications =
        JSON.parse(localStorage.getItem("notifications")) || [];

    const unread =
        notifications.filter(item => !item.read).length;

    if (!notificationBadge) return;

    if (unread > 0) {

        notificationBadge.classList.remove("hidden");

        notificationBadge.innerText = unread;

    }

    else {

        notificationBadge.classList.add("hidden");

    }

}



// ======================================================
// Show Notifications
// ======================================================

function showNotifications() {

    if (!notificationArea) return;

    const notifications =
        JSON.parse(localStorage.getItem("notifications")) || [];

    notificationArea.innerHTML = "";



    // ===========================
    // Empty Notifications
    // ===========================

    if (notifications.length === 0) {

        notificationArea.innerHTML = `

            <div class="py-10 text-center">

                <i data-lucide="bell-off"
                    class="w-10 h-10 mx-auto text-slate-500 mb-3">
                </i>

                <p class="text-slate-400">

                    No Notifications

                </p>

            </div>

        `;

        lucide.createIcons();

        return;

    }



    // ===========================
    // Notification List
    // ===========================

    notifications.forEach(notification => {

        notificationArea.innerHTML += `

        <div
            class="flex gap-3 py-4 border-b border-slate-800 last:border-none">

            <div
                class="w-10 h-10 rounded-full bg-blue-600 flex items-center justify-center text-white font-semibold">

                ${(notification.name || notification.email)
                .charAt(0)
                .toUpperCase()}

            </div>

            <div class="flex-1">

                <div
                    class="flex justify-between items-center">

                    <h3
                        class="text-sm font-semibold">

                        ${notification.name || "Student"}

                    </h3>

                    <span
                        class="text-xs text-slate-500">

                        ${notification.time || ""}

                    </span>

                </div>

                <p
                    class="text-xs text-slate-400">

                    ${notification.email}

                </p>

                <p
                    class="text-sm text-slate-300 mt-1">

                    ${notification.message}

                </p>

                <button onclick="deleteNotification(${notification.id})" class="mt-2 rounded-lg border border-red-500/30 px-3 py-1 text-xs text-red-400 hover:bg-red-500/10">
                    Delete
                </button>

            </div>

        </div>

        `;

    });

}



// ======================================================
// Notification Button
// ======================================================

if (notificationBtn) {

    notificationBtn.addEventListener("click", function (e) {

        e.stopPropagation();

        notificationArea.classList.toggle("hidden");

        showNotifications();



        // Mark All As Read

        const notifications =
            JSON.parse(localStorage.getItem("notifications")) || [];

        notifications.forEach(notification => {

            notification.read = true;

        });

        localStorage.setItem(
            "notifications",
            JSON.stringify(notifications)
        );

        updateNotificationCount();

    });

}



// ======================================================
// Hide Notification On Outside Click
// ======================================================

document.addEventListener("click", function () {

    if (notificationArea) {

        notificationArea.classList.add("hidden");

    }

});



// ======================================================
// Prevent Closing While Clicking Popup
// ======================================================

if (notificationArea) {

    notificationArea.addEventListener("click", function (e) {

        e.stopPropagation();

    });

}



// ======================================================
// Initial Notification Load
// ======================================================

updateNotificationCount();

// ======================================================
// Dashboard JS - Part 3
// Students Management + Quiz + Results
// ======================================================

let quizBuilderQuestionCount = 1;

function createQuizQuestionBlock(index) {
    return `
        <div class="quiz-question-block w-full rounded-2xl border border-slate-700 bg-slate-800/70 p-4">
            <div class="mb-3 flex items-center justify-between">
                <h4 class="text-sm font-semibold text-slate-200">Question ${index + 1}</h4>
            </div>
            <div class="space-y-3">
                <input data-role="question-text"
                    class="w-full rounded-xl border border-blue-500/20 bg-slate-900 px-4 py-3 outline-none focus:border-blue-500"
                    placeholder="Enter question" />
                <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <input data-role="option-a"
                        class="rounded-xl border border-blue-500/20 bg-slate-900 px-4 py-3 outline-none focus:border-blue-500"
                        placeholder="Option A" />
                    <input data-role="option-b"
                        class="rounded-xl border border-blue-500/20 bg-slate-900 px-4 py-3 outline-none focus:border-blue-500"
                        placeholder="Option B" />
                    <input data-role="option-c"
                        class="rounded-xl border border-blue-500/20 bg-slate-900 px-4 py-3 outline-none focus:border-blue-500"
                        placeholder="Option C" />
                    <input data-role="option-d"
                        class="rounded-xl border border-blue-500/20 bg-slate-900 px-4 py-3 outline-none focus:border-blue-500"
                        placeholder="Option D" />
                </div>
                <div>
                    <label class="mb-2 block text-sm text-slate-400">Correct Option</label>
                    <select data-role="answer"
                        class="w-full rounded-xl border border-blue-500/20 bg-slate-900 px-4 py-3 outline-none focus:border-blue-500">
                        <option value="0">A</option>
                        <option value="1">B</option>
                        <option value="2">C</option>
                        <option value="3">D</option>
                    </select>
                </div>
            </div>
        </div>
    `;
}

function renderQuizBuilder() {
    const container = document.getElementById('quiz-questions-container');
    if (!container) return;

    container.className = 'max-h-[420px] overflow-y-auto pr-2 space-y-4';
    container.innerHTML = '';

    for (let index = 0; index < quizBuilderQuestionCount; index += 1) {
        container.innerHTML += createQuizQuestionBlock(index);
    }
}

function addQuizQuestion() {
    quizBuilderQuestionCount += 1;
    renderQuizBuilder();
    renderAdminQuizPanel();
}

function resetQuizBuilder() {
    quizBuilderQuestionCount = 1;

    const titleInput = document.getElementById('quiz-title');
    const descriptionInput = document.getElementById('quiz-description');

    if (titleInput) titleInput.value = '';
    if (descriptionInput) descriptionInput.value = '';

    renderQuizBuilder();
    renderAdminQuizPanel();
}

function getQuizBuilderQuestions() {
    const container = document.getElementById('quiz-questions-container');
    if (!container) return [];

    const blocks = Array.from(container.querySelectorAll('.quiz-question-block'));

    return blocks.map(block => {
        const text = block.querySelector('[data-role="question-text"]')?.value?.trim() || '';
        const options = [
            block.querySelector('[data-role="option-a"]')?.value?.trim() || '',
            block.querySelector('[data-role="option-b"]')?.value?.trim() || '',
            block.querySelector('[data-role="option-c"]')?.value?.trim() || '',
            block.querySelector('[data-role="option-d"]')?.value?.trim() || ''
        ];
        const answer = Number(block.querySelector('[data-role="answer"]')?.value || 0);

        return { text, options, answer };
    }).filter(question => question.text || question.options.some(Boolean));
}

function renderAdminQuizPanel() {
    const quizzes = JSON.parse(localStorage.getItem('quizzes')) || [];
    const list = document.getElementById('admin-quiz-list');
    const preview = document.getElementById('quiz-preview');

    if (preview) {
        const title = document.getElementById('quiz-title')?.value?.trim() || 'New Quiz';
        const description = document.getElementById('quiz-description')?.value?.trim() || 'Quiz description';
        const questions = getQuizBuilderQuestions();

        preview.innerHTML = `
            <h3 class="font-semibold mb-2">${title}</h3>
            <p class="text-sm text-slate-400 mb-3">${description}</p>
            <div class="max-h-[320px] space-y-3 overflow-y-auto pr-2">
                ${questions.length ? questions.map((question, index) => `
                    <div class="rounded-xl border border-slate-700 bg-slate-900/70 p-3">
                        <p class="mb-2 font-medium">${question.text || `Question ${index + 1}`}</p>
                        <div class="space-y-2">
                            ${question.options.map((option, optionIndex) => `
                                <div class="rounded-xl border border-slate-700 px-3 py-2 ${optionIndex === question.answer ? 'border-blue-500 bg-blue-500/10' : ''}">${option || `Option ${String.fromCharCode(65 + optionIndex)}`}</div>
                            `).join('')}
                        </div>
                    </div>
                `).join('') : '<p class="text-sm text-slate-400">Add questions to preview your quiz.</p>'}
            </div>
        `;
    }

    if (!list) return;
    if (!quizzes.length) {
        list.innerHTML = '<div class="rounded-2xl border border-dashed border-slate-700 p-6 text-center text-slate-400">No quizzes yet.</div>';
        return;
    }

    list.innerHTML = quizzes.map(quiz => `
        <div class="rounded-2xl border border-slate-800 bg-slate-800/70 p-4">
            <button data-quiz-details-id="${quiz.id}" class="w-full text-left">
                <div class="flex items-center justify-between gap-3">
                    <div>
                        <h4 class="font-semibold">${quiz.title}</h4>
                        <p class="text-sm text-slate-400">${quiz.description || 'Quiz'}</p>
                    </div>
                    <span class="rounded-full bg-blue-500/20 px-3 py-1 text-sm text-blue-400">${quiz.questions?.length || 0} Qs</span>
                </div>
            </button>
            <div class="mt-3 flex items-center justify-end">
                <button data-delete-quiz-id="${quiz.id}" class="rounded-xl border border-red-500/30 px-3 py-2 text-sm text-red-400 transition hover:bg-red-500/10">Delete Quiz</button>
            </div>
            <div id="quiz-details-${quiz.id}" class="mt-4 hidden rounded-2xl border border-slate-700 bg-slate-900/70 p-4"></div>
        </div>
    `).join('');
}

function renderQuizDetails(quizId) {
    const quizzes = JSON.parse(localStorage.getItem('quizzes')) || [];
    const quiz = quizzes.find(item => String(item.id) === String(quizId));
    const detailsEl = document.getElementById(`quiz-details-${quizId}`);

    if (!detailsEl) return;

    if (!quiz) {
        detailsEl.innerHTML = '<p class="text-sm text-slate-400">Quiz not found.</p>';
        detailsEl.classList.remove('hidden');
        return;
    }

    detailsEl.innerHTML = `
        <div class="space-y-3">
            <h5 class="font-semibold">${quiz.title}</h5>
            <p class="text-sm text-slate-400">${quiz.description || 'Quiz'}</p>
            ${quiz.questions?.length ? quiz.questions.map((question, index) => `
                <div class="rounded-xl border border-slate-700 bg-slate-800/70 p-3">
                    <p class="mb-2 font-medium">${index + 1}. ${question.text || `Question ${index + 1}`}</p>
                    <div class="space-y-2">
                        ${question.options.map((option, optionIndex) => `
                            <div class="rounded-xl border border-slate-700 px-3 py-2 ${optionIndex === question.answer ? 'border-blue-500 bg-blue-500/10' : ''}">${option || `Option ${String.fromCharCode(65 + optionIndex)}`}</div>
                        `).join('')}
                    </div>
                </div>
            `).join('') : '<p class="text-sm text-slate-400">No questions added yet.</p>'}
        </div>
    `;
    detailsEl.classList.remove('hidden');
}

function renderAdminResults() {
    const results = JSON.parse(localStorage.getItem('results')) || [];
    const container = document.getElementById('admin-results-list');
    if (!container) return;
    if (!results.length) {
        container.innerHTML = '<div class="rounded-2xl border border-dashed border-slate-700 p-6 text-center text-slate-400">No results yet.</div>';
        return;
    }

    container.innerHTML = results.slice(0, 10).map(result => {
        const totalQuestions = Number(result.totalQuestions || 0);
        const scoreText = totalQuestions ? `${result.score}/${totalQuestions}` : `${result.score}%`;
        const isPassing = typeof result.percentage === 'number' ? result.percentage >= 60 : Number(result.score) >= 60;

        return `
            <div class="rounded-2xl border border-slate-800 bg-slate-800/70 p-4">
                <div class="flex items-center justify-between gap-3">
                    <div>
                        <h4 class="font-semibold">${result.quizTitle}</h4>
                        <p class="text-sm text-slate-400">${result.studentEmail} • ${new Date(result.date).toLocaleString()}</p>
                    </div>
                    <span class="rounded-full ${isPassing ? 'bg-emerald-500/20 text-emerald-400' : 'bg-yellow-500/20 text-yellow-400'} px-3 py-1 text-sm">Score: ${scoreText}</span>
                </div>
            </div>
        `;
    }).join('');
}

function saveQuiz() {
    const title = document.getElementById('quiz-title')?.value?.trim();
    const description = document.getElementById('quiz-description')?.value?.trim();
    const questions = getQuizBuilderQuestions();
    const validQuestions = questions.filter(question => question.text && question.options.every(option => option));

    if (!title || !validQuestions.length) {
        return alert('Please enter a quiz title and at least one complete question.');
    }

    const quizzes = JSON.parse(localStorage.getItem('quizzes')) || [];
    quizzes.push({
        id: Date.now(),
        title,
        description,
        questions: validQuestions.map(question => ({
            text: question.text,
            options: question.options,
            answer: Number(question.answer || 0)
        }))
    });
    localStorage.setItem('quizzes', JSON.stringify(quizzes));

    resetQuizBuilder();
    renderAdminQuizPanel();
    renderAdminResults();
    alert('Quiz saved successfully.');
}

function deleteNotification(id) {
    const notifications = JSON.parse(localStorage.getItem('notifications')) || [];
    const updated = notifications.filter(item => item.id !== id);
    localStorage.setItem('notifications', JSON.stringify(updated));
    showNotifications();
    updateNotificationCount();
}

function deleteQuiz(quizId) {
    const quizzes = JSON.parse(localStorage.getItem('quizzes')) || [];
    const updatedQuizzes = quizzes.filter(quiz => String(quiz.id) !== String(quizId));
    localStorage.setItem('quizzes', JSON.stringify(updatedQuizzes));

    const deletedQuizIds = JSON.parse(localStorage.getItem('deletedQuizIds') || '[]');
    if (!deletedQuizIds.includes(String(quizId))) {
        deletedQuizIds.push(String(quizId));
        localStorage.setItem('deletedQuizIds', JSON.stringify(deletedQuizIds));
    }

    renderAdminQuizPanel();
    renderAdminResults();
    window.dispatchEvent(new Event('storage'));
    alert('Quiz deleted successfully.');
}


// ======================================================
// Load Students From LocalStorage
// ======================================================

function displayStudents() {

    // Get Students

    const studentsData = JSON.parse(localStorage.getItem("student")) || [];

    const students = Array.isArray(studentsData)
        ? studentsData.filter(student => student && typeof student === "object")
        : [];



    // Dashboard Table

    const dashboardTable =
        document.getElementById("students-table");



    // Students Page Table

    const studentsPageTable =
        document.getElementById("students-table-page");



    // Dashboard Card

    const totalStudents =
        document.getElementById("total-students");



    // Students Count

    const studentsCount =
        document.getElementById("students-count");



    // Overview

    const activeStudents =
        document.getElementById("active-students");

    const inactiveStudents =
        document.getElementById("inactive-students");

    const registeredStudents =
        document.getElementById("registered-students");



    // ==========================================
    // Update Counts
    // ==========================================

    if (totalStudents)
        totalStudents.innerText = students.length;

    if (studentsCount)
        studentsCount.innerText = students.length;

    if (registeredStudents)
        registeredStudents.innerText = students.length;

    const presence = JSON.parse(localStorage.getItem("studentPresence")) || {};
    const now = Date.now();
    const activeWindow = 45_000; // 45 seconds

    const activeCount = students.filter(student => {
        const lastSeen = presence[student.email];
        return typeof lastSeen === 'number' && now - lastSeen <= activeWindow;
    }).length;

    if (activeStudents)
        activeStudents.innerText = activeCount;

    if (inactiveStudents)
        inactiveStudents.innerText = students.length - activeCount;



    // ==========================================
    // Clear Tables
    // ==========================================

    if (dashboardTable)
        dashboardTable.innerHTML = "";

    if (studentsPageTable)
        studentsPageTable.innerHTML = "";



    // ==========================================
    // No Students
    // ==========================================

    if (students.length === 0) {

        const emptyRow = `

        <tr>

            <td
                colspan="3"
                class="py-8 text-center text-slate-400">

                No Students Found

            </td>

        </tr>

        `;

        if (dashboardTable)
            dashboardTable.innerHTML = emptyRow;

        if (studentsPageTable)
            studentsPageTable.innerHTML = emptyRow;

        return;

    }



    // ==========================================
    // Loop Students
    // ==========================================

    students.forEach(student => {

        const studentName = student.name || student.email || "Student";
        const studentEmail = student.email || "No email";
        const initial = String(studentName).charAt(0).toUpperCase();
        const presence = JSON.parse(localStorage.getItem("studentPresence")) || {};
        const lastSeen = presence[studentEmail];
        const now = Date.now();
        const isActive = typeof lastSeen === 'number' && now - lastSeen <= 45_000;
        const statusClass = isActive ? "bg-green-500/20 text-green-400" : "bg-slate-700/60 text-slate-300";
        const statusText = isActive ? "Active" : "Inactive";

        const row = `

        <tr class="border-b border-slate-800 hover:bg-slate-800/40 transition">

            <td class="py-4">

                <div class="flex items-center gap-3">

                    <div
                        class="w-10 h-10 rounded-full bg-blue-600 flex items-center justify-center text-white font-semibold">

                        ${initial}

                    </div>

                    <span class="font-medium">

                        ${studentName}

                    </span>

                </div>

            </td>

            <td class="py-4 text-slate-400">

                ${studentEmail}

            </td>

            <td class="py-4">

                <span
                    class="px-3 py-1 rounded-full ${statusClass} text-xs">

                    ${statusText}

                </span>

            </td>

        </tr>

        `;

        // Dashboard Table

        if (dashboardTable) {

            dashboardTable.innerHTML += row;

        }

        // Students Page Table

        if (studentsPageTable) {

            studentsPageTable.innerHTML += row;

        }

    });

}



// ======================================================
// Refresh Dashboard
// ======================================================

function refreshDashboard() {

    displayStudents();

    updateNotificationCount();

}



// ======================================================
// Initial Load
// ======================================================

refreshDashboard();
renderAdminQuizPanel();
renderAdminResults();

window.addEventListener('storage', () => {
    refreshDashboard();
    renderAdminQuizPanel();
    renderAdminResults();
});

window.addEventListener('focus', () => {
    refreshDashboard();
    renderAdminQuizPanel();
    renderAdminResults();
});

const saveQuizBtn = document.getElementById('save-quiz-btn');
if (saveQuizBtn) {
    saveQuizBtn.addEventListener('click', saveQuiz);
}

const addQuestionBtn = document.getElementById('add-question-btn');
if (addQuestionBtn) {
    addQuestionBtn.addEventListener('click', addQuizQuestion);
}

const createNewQuizBtn = document.getElementById('create-new-quiz-btn');
if (createNewQuizBtn) {
    createNewQuizBtn.addEventListener('click', resetQuizBuilder);
}

['quiz-title', 'quiz-description'].forEach(id => {
    const el = document.getElementById(id);
    if (el) {
        el.addEventListener('input', renderAdminQuizPanel);
        el.addEventListener('change', renderAdminQuizPanel);
    }
});

const quizQuestionsContainer = document.getElementById('quiz-questions-container');
if (quizQuestionsContainer) {
    quizQuestionsContainer.addEventListener('input', renderAdminQuizPanel);
    quizQuestionsContainer.addEventListener('change', renderAdminQuizPanel);
}

document.addEventListener('click', (event) => {
    const deleteButton = event.target.closest('[data-delete-quiz-id]');
    if (deleteButton) {
        event.preventDefault();
        deleteQuiz(deleteButton.getAttribute('data-delete-quiz-id'));
        return;
    }

    const quizButton = event.target.closest('[data-quiz-details-id]');
    if (!quizButton) return;

    const quizId = quizButton.getAttribute('data-quiz-details-id');
    const detailsEl = document.getElementById(`quiz-details-${quizId}`);

    if (!detailsEl) return;

    document.querySelectorAll('[id^="quiz-details-"]').forEach((item) => {
        if (item !== detailsEl) {
            item.classList.add('hidden');
        }
    });

    if (detailsEl.classList.contains('hidden')) {
        renderQuizDetails(quizId);
    } else {
        detailsEl.classList.add('hidden');
    }
});

renderQuizBuilder();



// ======================================================
// Dashboard Ready
// ======================================================

console.log("Students Loaded Successfully");