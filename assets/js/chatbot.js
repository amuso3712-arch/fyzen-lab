
function initChatbot() {
    const chatHTML = `
        <div id="fyzenChatbot" class="chatbot-container">
            <div class="chat-header">
                <div style="display:flex; align-items:center; gap:10px;">
                    <div class="ai-avatar">AI</div>
                    <div>
                        <div style="font-weight:700; font-size:0.9rem;">Fyzen Assistant</div>
                        <div style="font-size:0.7rem; color:#4ade80;">● Online</div>
                    </div>
                </div>
                <button onclick="toggleChat()" style="background:none; border:none; color:white; cursor:pointer; font-size:1.2rem;">×</button>
            </div>
            <div id="chatBody" class="chat-body">
                <div class="ai-msg">${t('chat_greet')}</div>
            </div>
            <div class="chat-footer">
                <input type="text" id="chatInput" placeholder="${t('chat_placeholder')}" onkeypress="handleChatKey(event)">
                <button onclick="sendMessage()">➤</button>
            </div>
        </div>
        <button id="chatToggle" class="chat-toggle-btn" onclick="toggleChat()">
            <svg viewBox="0 0 24 24" width="30" height="30" fill="white"><path d="M20 2H4c-1.1 0-2 .9-2 2v18l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2z"/></svg>
        </button>
    `;
    document.body.insertAdjacentHTML('beforeend', chatHTML);
}

function toggleChat() {
    const chat = document.getElementById('fyzenChatbot');
    chat.classList.toggle('active');
}

function handleChatKey(e) {
    if (e.key === 'Enter') sendMessage();
}

function sendMessage() {
    const input = document.getElementById('chatInput');
    const body = document.getElementById('chatBody');
    const text = input.value.trim().toLowerCase();

    if (!text) return;

    // User Message
    body.innerHTML += `<div class="user-msg">${input.value}</div>`;
    input.value = '';
    body.scrollTop = body.scrollHeight;

    // AI Processing
    setTimeout(() => {
        const typingId = 'typing-' + Date.now();
        body.innerHTML += `<div class="ai-msg" id="${typingId}">${t('chat_thinking')}</div>`;
        body.scrollTop = body.scrollHeight;

        setTimeout(() => {
            const typingEl = document.getElementById(typingId);
            if (typingEl) typingEl.remove();
            
            let response = t('chat_unknown');
            const products = getProducts();

            if (text.includes('hello') || text.includes('hi') || text.includes('salom') || text.includes('assalom')) {
                response = t('chat_greet');
            } else if (text.includes('shipping') || text.includes('delivery') || text.includes('yetkazish')) {
                response = t('chat_shipping');
            } else if (text.includes('contact') || text.includes('call') || text.includes('aloqa')) {
                response = t('contact_btn');
            } else {
                // Product Search Logic
                const found = products.filter(p => 
                    text.includes(p.name.toLowerCase()) || 
                    text.includes(p.category.toLowerCase()) ||
                    (text.includes('best') && p.price > 4000)
                );

                if (found.length > 0) {
                    response = `${t('chat_found')} <br><br>`;
                    found.forEach(p => {
                        response += `<b>${p.name}</b><br><a href="product-details.html?id=${p.id}" style="color:#38bdf8; font-size:0.8rem;">${t('chat_view')}</a><br><br>`;
                    });
                }
            }

            body.innerHTML += `<div class="ai-msg">${response}</div>`;
            body.scrollTop = body.scrollHeight;
        }, 1000);
    }, 500);
}

document.addEventListener('DOMContentLoaded', initChatbot);
