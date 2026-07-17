lucide.createIcons();
//  Side bar

// Mobile Sidebar Selectors
const hamburgerBtn = document.getElementById('hamburger-btn');
const closeSidebarBtn = document.getElementById('close-sidebar-btn');
const mobileSidebar = document.getElementById('mobile-sidebar');
const sidebarBackdrop = document.getElementById('sidebar-backdrop');

// Function to Open Sidebar
function openSidebar() {
    mobileSidebar.classList.add('show');
}

// Function to Close Sidebar
function closeSidebar() {
    mobileSidebar.classList.remove('show');
}

// Event Listeners
hamburgerBtn.addEventListener('click', openSidebar);
closeSidebarBtn.addEventListener('click', closeSidebar);
sidebarBackdrop.addEventListener('click', closeSidebar);




// ================= Notification =================

const notificationBtn = document.getElementById("notification");
const notificationArea = document.getElementById("notification-area");
const badge = document.getElementById("notification-count");

// Badge Update
function updateNotificationCount() {

    let notifications = JSON.parse(localStorage.getItem("notifications")) || [];

    let unread = notifications.filter(n => !n.read).length;

    if (badge) {
        if (unread > 0) {
            badge.classList.remove("hidden");
            badge.innerText = unread;
        } else {
            badge.classList.add("hidden");
        }
    }
}

// Notification Show
function showNotifications() {

    let notifications = JSON.parse(localStorage.getItem("notifications")) || [];

    notificationArea.innerHTML = "";

    if (notifications.length === 0) {

        notificationArea.innerHTML = `
            <p class="text-center text-gray-400 py-3">
                No Notifications
            </p>
        `;
        return;
    }

    notifications.forEach(notification => {

        notificationArea.innerHTML += `
            <div class="flex items-start gap-3 py-3">

                <div class="w-10 h-10 rounded-full bg-[#3b82f6] flex items-center justify-center text-white font-bold">
                    ${(notification.name || notification.email).charAt(0).toUpperCase()}
                </div>

                <div class="flex-1">

                    <div class="flex justify-between items-center">

                        <h3 class="text-white text-sm font-semibold">
                            ${notification.name || "Student"}
                        </h3>

                        <span class="text-xs text-gray-500">
                            ${notification.time}
                        </span>

                    </div>

                    <p class="text-xs text-gray-400">
                        ${notification.email}
                    </p>

                    <p class="text-sm text-gray-300">
                        ${notification.message}
                    </p>

                </div>

            </div>
        `;
    });
}

// Bell Click
notificationBtn.addEventListener("click", (e) => {

    e.stopPropagation();

    notificationArea.classList.toggle("hidden");

    showNotifications();

    let notifications = JSON.parse(localStorage.getItem("notifications")) || [];

    notifications.forEach(notification => {
        notification.read = true;
    });

    localStorage.setItem("notifications", JSON.stringify(notifications));

    updateNotificationCount();
});

// Outside Click
document.addEventListener("click", () => {
    notificationArea.classList.add("hidden");
});

// Page Load
updateNotificationCount();