document.addEventListener('DOMContentLoaded', () => {
    const nameInput = document.getElementById('nameInput');
    const urlInput = document.getElementById('urlInput');
    const submitButton = document.getElementById('submitButton');
    const linksContainer = document.getElementById('linksContainer');
    const copyAllButton = document.getElementById('copyAllButton');

    // Criando o elemento de toast
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
            const emptyMsg = document.createElement('p');
            emptyMsg.style.opacity = '0.5';
            emptyMsg.textContent = 'Nenhum link salvo ainda.';
            linksContainer.appendChild(emptyMsg);
            copyAllButton.style.display = 'none';
            return;
        }

        copyAllButton.style.display = 'block';

        links.forEach((link, index) => {
            const div = document.createElement('div');
            div.className = 'link-item';

            // 1. Criar info container (Seguro: usa textContent)
            const infoDiv = document.createElement('div');
            infoDiv.className = 'link-info';

            const strong = document.createElement('strong');
            strong.textContent = link.name; // Injeção de script falha aqui

            const span = document.createElement('span');
            span.textContent = link.url; // Injeção de script falha aqui

            infoDiv.appendChild(strong);
            infoDiv.appendChild(span);

            // 2. Criar botões de ação
            const actionsDiv = document.createElement('div');
            actionsDiv.className = 'actions';

            const btnCopy = document.createElement('button');
            btnCopy.className = 'btn-copy';
            btnCopy.textContent = 'Copiar';
            btnCopy.onclick = () => {
                const textToCopy = `${link.name}: ${link.url}`;
                navigator.clipboard.writeText(textToCopy).then(() => {
                    showToast("Link copiado! 🚀");
                });
            };

            const btnDelete = document.createElement('button');
            btnDelete.className = 'btn-delete';
            btnDelete.textContent = '🗑️';
            btnDelete.onclick = () => {
                links.splice(index, 1);
                localStorage.setItem('savedLinks', JSON.stringify(links));
                renderLinks();
                showToast("Link removido! 🗑️");
            };

            actionsDiv.appendChild(btnCopy);
            actionsDiv.appendChild(btnDelete);

            // Montar o item final
            div.appendChild(infoDiv);
            div.appendChild(actionsDiv);
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