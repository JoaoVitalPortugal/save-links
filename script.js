document.addEventListener('DOMContentLoaded', () => {
    const nameInput = document.getElementById('nameInput');
    const urlInput = document.getElementById('urlInput');
    const submitButton = document.getElementById('submitButton');
    const linksContainer = document.getElementById('linksContainer');
    const copyAllButton = document.getElementById('copyAllButton');

    const toast = document.createElement('div');
    toast.id = 'toast';
    document.body.appendChild(toast);

    let links = JSON.parse(localStorage.getItem('savedLinks')) || [];

    function showToast(message) {
        toast.textContent = message;
        toast.classList.add('show');
        setTimeout(() => {
            toast.classList.remove('show');
        }, 3000);
    }

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
                <div class="actions">
                    <button class="btn-copy" data-index="${index}">Copiar</button>
                    <button class="btn-delete" data-index="${index}">🗑️</button>
                </div>
            `;

            // Evento de Copiar
            div.querySelector('.btn-copy').addEventListener('click', () => {
                const textToCopy = `${link.name}: ${link.url}`;
                navigator.clipboard.writeText(textToCopy).then(() => {
                    showToast("Link copiado! 🚀");
                });
            });

            // Evento de Deletar
            div.querySelector('.btn-delete').addEventListener('click', () => {
                links.splice(index, 1); // Remove o item do array
                localStorage.setItem('savedLinks', JSON.stringify(links)); // Salva a nova lista
                renderLinks(); // Atualiza a tela
                showToast("Link removido! 🗑️");
            });

            linksContainer.appendChild(div);
        });
    }

    submitButton.addEventListener('click', () => {
        const name = nameInput.value.trim();
        const url = urlInput.value.trim();

        if (name && url) {
            links.push({ name, url });
            localStorage.setItem('savedLinks', JSON.stringify(links));
            renderLinks();
            nameInput.value = '';
            urlInput.value = '';
            showToast("Salvo com sucesso! ✨");
        } else {
            showToast("Preencha todos os campos! ⚠️");
        }
    });

    copyAllButton.addEventListener('click', () => {
        const allLinksText = links.map(link => `${link.name}: ${link.url}`).join('\n');
        navigator.clipboard.writeText(allLinksText).then(() => {
            showToast("Tudo copiado! 📋");
        });
    });

    renderLinks();
});