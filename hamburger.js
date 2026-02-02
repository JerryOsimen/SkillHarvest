
const sidebar = document.getElementById("sidebar");

if (hamburger && sidebar) {
    hamburger.addEventListener("click", () => {
        sidebar.classList.toggle("active");
    });

    const closeBtn = document.getElementById("closeSidebar");
    if (closeBtn) {
        closeBtn.addEventListener("click", () => {
            sidebar.classList.remove("active");
        });
    }
}
