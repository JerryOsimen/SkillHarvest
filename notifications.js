/**
 * Global Notification System
 * Displays a popup at the top right of the screen.
 */

(function () {
    // Ensure container exists
    function createContainer() {
        let container = document.getElementById('notification-container');
        if (!container) {
            container = document.createElement('div');
            container.id = 'notification-container';
            container.className = 'notification-container';
            document.body.appendChild(container);
        }
        return container;
    }

    /**
     * Shows a notification
     * @param {string} message - The message to display
     * @param {string} type - 'success', 'error', or 'info'
     * @param {number} duration - Auto-hide duration in ms (default 3000)
     */
    window.showNotification = function (message, type = 'info', duration = 3000) {
        const container = createContainer();

        const notification = document.createElement('div');
        notification.className = `notification ${type}`;

        notification.innerHTML = `
            <div class="notification-content">${message}</div>
            <button class="notification-close">&times;</button>
        `;

        container.appendChild(notification);

        // Trigger animation
        setTimeout(() => notification.classList.add('show'), 10);

        const closeBtn = notification.querySelector('.notification-close');

        const removeNotification = () => {
            notification.classList.remove('show');
            setTimeout(() => {
                if (notification.parentNode) {
                    notification.parentNode.removeChild(notification);
                }
            }, 400); // Wait for transition
        };

        closeBtn.onclick = removeNotification;

        if (duration > 0) {
            setTimeout(removeNotification, duration);
        }
    };

    // Override alert if necessary? (Maybe better to explicitly call showNotification for now)
    // window.alert = (msg) => window.showNotification(msg, 'info');
})();
