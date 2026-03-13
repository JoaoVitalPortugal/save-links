document.addEventListener('DOMContentLoaded', () => {
    const nameInput = document.getElementById('nameInput');
    const urlInput = document.getElementById('urlInput');
    const submitButton = document.getElementById('submitButton');
    const linksContainer = document.getElementById('linksContainer');
    const copyAllButton = document.getElementById('copyAllButton');

    // 1. Criar o elemento de Toast (Aviso) dinamicamente
    const toast = document.createElement('div');
    toast.id = 'toast';
    document.body.appendChild(toast);

    // Carrega os dados salvos
    let links = JSON.parse(localStorage.getItem('savedLinks')) || [];

    // 2. Função para mostrar a mensagem "bonitona"
    function showToast(message) {
        toast.textContent = message;
        toast.classList.add('show');
        
        // Remove a classe após 3 segundos para esconder
        setTimeout(() => {
            toast.classList.remove('show');
        }, 3000);
    }

    // 3. Função para renderizar os links com o novo layout
    function renderLinks() {
        linksContainer.innerHTML = ''; 
        
        if (links.length === 0) {
            linksContainer.innerHTML = '<p style="opacity:0.5">Nenhum link salvo ainda.</p>';
            copyAllButton.style.display = 'none';
            return;
        }

        copyAllButton.style.display = 'block';

        links.forEach((link, index) => {
            const div = document.createElement('div');
            div.className = 'link-item';
            
            div.innerHTML = `
                <div class="link-info">
                    <strong>${link.name}</strong>
                    <span>${link.url}</span>
                </div>
                <button class="btn-copy" data-index="${index}">Copiar</button>
            `;

            // Evento de cópia individual
            div.querySelector('.btn-copy').addEventListener('click', () => {
                const textToCopy = `${link.name}: ${link.url}`;
                navigator.clipboard.writeText(textToCopy).then(() => {
                    showToast("Link copiado! 🚀");
                });
            });

            linksContainer.appendChild(div);
        });
    }

    // 4. Adicionar novo link
    submitButton.addEventListener('click', () => {
        const name = nameInput.value.trim();
        const url = urlInput.value.trim();

        if (name && url) {
            links.push({ name, url });
            localStorage.setItem('savedLinks', JSON.stringify(links)); // Salva
            renderLinks();
            
            // Limpa os campos e avisa
            nameInput.value = '';
            urlInput.value = '';
            showToast("Salvo com sucesso! ✨");
        } else {
            showToast("Preencha todos os campos! ⚠️");
        }
    });

    // 5. Copiar todos os links
    copyAllButton.addEventListener('click', () => {
        const allLinksText = links.map(link => `${link.name}: ${link.url}`).join('\n');
        navigator.clipboard.writeText(allLinksText).then(() => {
            showToast("Tudo copiado para o clipboard! 📋");
        });
    });

    
    renderLinks();
});