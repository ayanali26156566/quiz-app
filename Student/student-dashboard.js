lucide.createIcons();

const hamburgerBtn = document.getElementById('hamburger-btn');
const closeSidebarBtn = document.getElementById('close-sidebar-btn');
const mobileSidebar = document.getElementById('mobile-sidebar');
const sidebarBackdrop = document.getElementById('sidebar-backdrop');
const sidebarLinks = document.querySelectorAll('.sidebar-link');
const sections = document.querySelectorAll('main section');
let pendingProfileImage = null;

function openSidebar() {
    if (mobileSidebar) {
        mobileSidebar.classList.remove('hidden');
        mobileSidebar.classList.add('flex');
        document.body.classList.add('overflow-hidden');
    }
}

function closeSidebar() {
    if (mobileSidebar) {
        mobileSidebar.classList.add('hidden');
        mobileSidebar.classList.remove('flex');
        document.body.classList.remove('overflow-hidden');
    }
}

function showSection(sectionId) {
    sections.forEach(section => section.classList.add('hidden'));
    const currentSection = document.getElementById(sectionId);
    if (currentSection) {
        currentSection.classList.remove('hidden');
    }
}

function setActiveLink(activeLink) {
    if (!activeLink) return;
    const targetSection = activeLink.dataset.section;

    sidebarLinks.forEach(link => {
        const isActive = link.dataset.section === targetSection;
        link.classList.toggle('sidebar-active', isActive);
        link.classList.toggle('bg-blue-600/15', isActive);
        link.classList.toggle('border-l-4', isActive);
        link.classList.toggle('border-blue-500', isActive);
        link.classList.toggle('shadow-lg', isActive);
        link.classList.toggle('shadow-blue-500/20', isActive);
        link.classList.toggle('text-white', isActive);
        link.classList.toggle('text-slate-400', !isActive);

        if (isActive) {
            link.classList.remove('hover:bg-slate-800', 'hover:text-white');
        } else {
            link.classList.add('hover:bg-slate-800', 'hover:text-white');
        }
    });
}

hamburgerBtn?.addEventListener('click', openSidebar);
closeSidebarBtn?.addEventListener('click', closeSidebar);
sidebarBackdrop?.addEventListener('click', closeSidebar);

sidebarLinks.forEach(link => {
    link.addEventListener('click', function (event) {
        event.preventDefault();
        const targetSection = this.dataset.section;
        if (!targetSection) return;
        showSection(targetSection);
        setActiveLink(this);
        if (window.innerWidth < 1024) {
            closeSidebar();
        }
    });
});

function getCurrentStudent() {
    const students = JSON.parse(localStorage.getItem('student')) || [];
    const currentEmail = localStorage.getItem('currentStudentEmail');
    return students.find(student => student.email === currentEmail) || null;
}

function getStoredData() {
    return {
        quizzes: JSON.parse(localStorage.getItem('quizzes')) || [],
        results: JSON.parse(localStorage.getItem('results')) || [],
        students: JSON.parse(localStorage.getItem('student')) || []
    };
}

function updateStudentPresence() {
    const student = getCurrentStudent();
    if (!student) return;

    const presence = JSON.parse(localStorage.getItem('studentPresence') || '{}');
    presence[student.email] = Date.now();
    localStorage.setItem('studentPresence', JSON.stringify(presence));
}

function clearStudentPresence() {
    const student = getCurrentStudent();
    if (!student) return;

    const presence = JSON.parse(localStorage.getItem('studentPresence') || '{}');
    delete presence[student.email];
    localStorage.setItem('studentPresence', JSON.stringify(presence));
}

function getStudentScore(email) {
    const { results } = getStoredData();
    const studentResults = results.filter(item => item.studentEmail === email);
    if (!studentResults.length) return 0;
    const total = studentResults.reduce((sum, item) => sum + item.score, 0);
    return Math.round(total / studentResults.length);
}

function getBestScore(email) {
    const { results } = getStoredData();
    const studentResults = results.filter(item => item.studentEmail === email);
    if (!studentResults.length) return 0;
    return Math.max(...studentResults.map(item => item.score));
}

function updateProfileUI() {
    const student = getCurrentStudent();
    if (!student) return;

    const displayName = student.username || student.name || 'Student';
    const image = pendingProfileImage || student.image || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80';

    document.getElementById('sidebar-name').textContent = displayName;
    document.getElementById('header-profile-name').textContent = displayName;
    document.getElementById('sidebar-avatar').src = image;
    document.getElementById('settings-avatar-preview').src = image;
}

function renderProfile() {
    const profileCard = document.getElementById('profile-card');
    const student = getCurrentStudent();
    if (!profileCard || !student) return;

    const image = pendingProfileImage || student.image || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80';
    const score = getStudentScore(student.email);
    const displayName = student.username || student.name || 'Student';
    profileCard.innerHTML = `
        <img src="${image}" class="h-20 w-20 rounded-full border-2 border-blue-500 object-cover" />
        <div class="flex-1">
            <h2 class="text-xl font-semibold">${displayName}</h2>
            <p class="text-sm text-slate-400">${student.email}</p>
            <div class="mt-3 flex flex-wrap gap-2">
                <span class="rounded-full bg-blue-500/20 px-3 py-1 text-sm text-blue-400">Score: ${score}%</span>
                <span class="rounded-full bg-emerald-500/20 px-3 py-1 text-sm text-emerald-400">Active</span>
            </div>
        </div>
    `;
}

function renderOverview() {
    const { quizzes, results } = getStoredData();
    const student = getCurrentStudent();
    const studentResults = results.filter(item => item.studentEmail === (student?.email || ''));

    document.getElementById('active-quizzes').textContent = quizzes.length;
    document.getElementById('completed-quizzes').textContent = studentResults.length;
    document.getElementById('student-score').textContent = `${getStudentScore(student?.email || '')}%`;
    document.getElementById('best-score').textContent = `${getBestScore(student?.email || '')}%`;
}

function getDeletedQuizIdsForStudent(email) {
    if (!email) return [];
    const stored = JSON.parse(localStorage.getItem('studentDeletedQuizzes') || '{}');
    return Array.isArray(stored[email]) ? stored[email] : [];
}

function saveDeletedQuizIdsForStudent(email, ids) {
    if (!email) return;
    const stored = JSON.parse(localStorage.getItem('studentDeletedQuizzes') || '{}');
    stored[email] = ids;
    localStorage.setItem('studentDeletedQuizzes', JSON.stringify(stored));
}

function getGlobalDeletedQuizIds() {
    return JSON.parse(localStorage.getItem('deletedQuizIds') || '[]');
}

function isQuizCompleted(quiz, email) {
    const { results } = getStoredData();
    return results.some(item => item.studentEmail === email && item.quizTitle === quiz.title);
}

function renderQuizCards(container, limit = null) {
    if (!container) return;

    const student = getCurrentStudent();
    const { quizzes } = getStoredData();
    const globalDeletedIds = new Set(getGlobalDeletedQuizIds());
    const deletedIds = new Set(getDeletedQuizIdsForStudent(student?.email));
    const visibleQuizzes = quizzes.filter(quiz => !globalDeletedIds.has(String(quiz.id)) && !deletedIds.has(String(quiz.id)));
    const items = limit ? visibleQuizzes.slice(0, limit) : visibleQuizzes;

    if (!items.length) {
        container.innerHTML = '<div class="rounded-2xl border border-dashed border-slate-700 p-6 text-center text-slate-400">No quizzes available yet.</div>';
        return;
    }

    container.innerHTML = items.map(quiz => {
        const completed = isQuizCompleted(quiz, student?.email);
        return `
            <div class="rounded-2xl border border-slate-800 bg-slate-800/70 p-4">
                <div class="flex items-center justify-between gap-3">
                    <div>
                        <h3 class="font-semibold">${quiz.title}</h3>
                        <p class="text-sm text-slate-400">${quiz.description || 'Practice quiz'}</p>
                        ${completed ? '<p class="mt-2 text-sm text-emerald-400">You have completed this quiz</p>' : ''}
                    </div>
                    ${completed
                ? `<button data-delete-quiz-id="${quiz.id}" class="rounded-xl border border-red-500/30 px-3 py-2 text-sm text-red-400 transition hover:bg-red-500/10">Delete</button>`
                : `<button data-quiz-id="${quiz.id}" class="rounded-xl bg-blue-600 px-4 py-2 text-sm font-medium transition hover:bg-blue-500">Start</button>`}
                </div>
            </div>
        `;
    }).join('');
}

function renderResultsCards(container, limit = null) {
    if (!container) return;

    const { results } = getStoredData();
    const student = getCurrentStudent();
    const studentResults = results.filter(item => item.studentEmail === (student?.email || ''));
    const items = limit ? studentResults.slice(0, limit) : studentResults;

    if (!items.length) {
        container.innerHTML = '<div class="rounded-2xl border border-dashed border-slate-700 p-6 text-center text-slate-400">No results yet.</div>';
        return;
    }

    container.innerHTML = items.map(result => {
        const totalQuestions = Number(result.totalQuestions || 0);
        const scoreText = totalQuestions ? `${result.score}/${totalQuestions}` : `${result.score}%`;
        return `
            <div class="rounded-2xl border border-slate-800 bg-slate-800/70 p-4">
                <div class="flex items-center justify-between gap-3">
                    <div>
                        <h3 class="font-semibold">${result.quizTitle}</h3>
                        <p class="text-sm text-slate-400">${new Date(result.date).toLocaleString()}</p>
                    </div>
                    <span class="rounded-full ${result.percentage >= 60 ? 'bg-emerald-500/20 text-emerald-400' : 'bg-yellow-500/20 text-yellow-400'} px-3 py-1 text-sm">${scoreText}</span>
                </div>
            </div>
        `;
    }).join('');
}

function deleteCompletedQuiz(quizId) {
    const student = getCurrentStudent();
    if (!student) return;

    const existing = getDeletedQuizIdsForStudent(student.email);
    if (!existing.includes(String(quizId))) {
        saveDeletedQuizIdsForStudent(student.email, [...existing, String(quizId)]);
    }

    renderAll();
}

function startQuiz(quizId) {
    const { quizzes } = getStoredData();
    const quiz = quizzes.find(item => item.id === Number(quizId));
    if (!quiz) return;
    const student = getCurrentStudent();
    if (!student) return;

    if (isQuizCompleted(quiz, student.email)) {
        alert('You have completed this quiz');
        return;
    }

    const questions = quiz.questions || [];
    if (!questions.length) return alert('This quiz has no questions yet.');

    let currentIndex = 0;
    let score = 0;
    let selectedOption = null;

    const overlay = document.createElement('div');
    overlay.className = 'fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4';
    overlay.innerHTML = `
        <div class="w-full max-w-2xl rounded-3xl border border-blue-500/20 bg-slate-900 p-6 shadow-2xl">
            <div class="mb-5 flex items-center justify-between">
                <div>
                    <h3 class="text-xl font-semibold">${quiz.title}</h3>
                    <p class="text-sm text-slate-400">Question <span id="question-counter">1</span> of ${questions.length}</p>
                </div>
                <button id="close-quiz" class="rounded-full border border-slate-700 px-3 py-2 text-sm">Close</button>
            </div>
            <div id="quiz-body"></div>
        </div>
    `;
    document.body.appendChild(overlay);

    function finishQuiz() {
        const totalQuestions = questions.length;
        const percent = Math.round((score / totalQuestions) * 100);
        const results = JSON.parse(localStorage.getItem('results')) || [];
        results.unshift({
            id: Date.now(),
            studentEmail: student.email,
            quizTitle: quiz.title,
            score,
            totalQuestions,
            percentage: percent,
            date: new Date().toISOString()
        });
        localStorage.setItem('results', JSON.stringify(results));
        overlay.remove();
        renderAll();
        alert(`Quiz finished! Your score: ${score}/${totalQuestions}`);
    }

    function renderQuestion() {
        const body = document.getElementById('quiz-body');
        if (!body) return;
        const question = questions[currentIndex];
        if (!question) {
            finishQuiz();
            return;
        }

        selectedOption = null;
        document.getElementById('question-counter').textContent = currentIndex + 1;
        body.innerHTML = `
            <div class="space-y-4">
                <p class="text-lg font-medium">${question.text}</p>
                <div class="grid gap-3">
                    ${question.options.map((option, index) => `
                        <button data-option="${index}" class="option-btn w-full rounded-2xl border border-slate-700 bg-slate-800 px-4 py-3 text-left transition hover:border-blue-500">
                            ${option}
                        </button>
                    `).join('')}
                </div>
                <button id="next-question-btn" class="rounded-xl bg-blue-600 px-4 py-2 text-sm font-medium transition hover:bg-blue-500">
                    ${currentIndex === questions.length - 1 ? 'Finish Quiz' : 'Next Question'}
                </button>
            </div>
        `;

        body.querySelectorAll('.option-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                selectedOption = Number(btn.dataset.option);
                body.querySelectorAll('.option-btn').forEach(item => item.classList.remove('border-blue-500', 'bg-blue-500/20'));
                btn.classList.add('border-blue-500', 'bg-blue-500/20');
            });
        });

        const nextButton = document.getElementById('next-question-btn');
        nextButton?.addEventListener('click', () => {
            if (selectedOption === null) {
                alert('Please select an answer first.');
                return;
            }

            if (selectedOption === question.answer) {
                score += 1;
            }

            if (currentIndex === questions.length - 1) {
                finishQuiz();
                return;
            }

            currentIndex += 1;
            renderQuestion();
        });
    }

    document.getElementById('close-quiz').addEventListener('click', () => overlay.remove());
    renderQuestion();
}

function handleProfileImageSelection(file) {
    if (!file || !file.type.startsWith('image/')) {
        alert('Please choose a valid image file.');
        return;
    }

    const reader = new FileReader();
    reader.onload = () => {
        pendingProfileImage = reader.result;
        updateProfileUI();
    };
    reader.readAsDataURL(file);
}

function saveProfile(event) {
    event.preventDefault();

    const student = getCurrentStudent();
    if (!student) return;

    const nameInput = document.getElementById('settings-name');
    const usernameInput = document.getElementById('settings-username');
    const imageInput = document.getElementById('settings-image');
    const students = JSON.parse(localStorage.getItem('student')) || [];
    const index = students.findIndex(item => item.email === student.email);

    if (index === -1) return;

    const nextName = nameInput.value.trim() || student.name || 'Student';
    const nextUsername = usernameInput.value.trim() || student.username || nextName.toLowerCase().replace(/\s+/g, '');
    const nextImage = pendingProfileImage || student.image || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80';

    students[index] = {
        ...students[index],
        name: nextName,
        username: nextUsername,
        image: nextImage
    };

    localStorage.setItem('student', JSON.stringify(students));
    pendingProfileImage = null;
    imageInput.value = '';
    renderAll();
    alert('Profile updated successfully');
}

function renderAll() {
    renderProfile();
    renderOverview();
    renderQuizCards(document.getElementById('quiz-list'), 4);
    renderResultsCards(document.getElementById('results-list'), 4);
    renderQuizCards(document.getElementById('all-quiz-list'));
    renderResultsCards(document.getElementById('all-results-list'));
    updateProfileUI();
    lucide.createIcons();
}

window.addEventListener('DOMContentLoaded', () => {
    const student = getCurrentStudent();
    if (!student) {
        alert('Please login first');
        window.location.href = '../index.html?form=login';
        return;
    }

    localStorage.setItem('currentStudentEmail', student.email);
    showSection('dashboard-section');
    const defaultLink = document.querySelector('[data-section="dashboard-section"]');
    if (defaultLink) {
        setActiveLink(defaultLink);
    }

    renderAll();

    updateStudentPresence();
    const presenceTimer = setInterval(updateStudentPresence, 15000);

    const imageInput = document.getElementById('settings-image');
    const dropZone = document.getElementById('image-dropzone');

    imageInput?.addEventListener('change', (event) => {
        const file = event.target.files?.[0];
        if (file) {
            handleProfileImageSelection(file);
        }
    });

    ['dragenter', 'dragover'].forEach(eventName => {
        dropZone?.addEventListener(eventName, (event) => {
            event.preventDefault();
            dropZone.classList.add('border-blue-500', 'bg-blue-500/10');
        });
    });

    ['dragleave', 'dragend', 'drop'].forEach(eventName => {
        dropZone?.addEventListener(eventName, (event) => {
            event.preventDefault();
            dropZone.classList.remove('border-blue-500', 'bg-blue-500/10');
        });
    });

    dropZone?.addEventListener('drop', (event) => {
        const file = event.dataTransfer?.files?.[0];
        if (file) {
            handleProfileImageSelection(file);
        }
    });

    document.addEventListener('click', (event) => {
        const deleteButton = event.target.closest('[data-delete-quiz-id]');
        if (deleteButton) {
            deleteCompletedQuiz(deleteButton.getAttribute('data-delete-quiz-id'));
            return;
        }

        const button = event.target.closest('[data-quiz-id]');
        if (!button) return;
        startQuiz(button.getAttribute('data-quiz-id'));
    });

    document.getElementById('settings-form')?.addEventListener('submit', saveProfile);

    document.addEventListener('visibilitychange', () => {
        if (document.visibilityState === 'visible') {
            updateStudentPresence();
            renderAll();
        }
    });

    window.addEventListener('storage', () => {
        renderAll();
    });

    window.addEventListener('focus', () => {
        renderAll();
    });

    window.addEventListener('beforeunload', () => {
        clearStudentPresence();
        clearInterval(presenceTimer);
    });
});
