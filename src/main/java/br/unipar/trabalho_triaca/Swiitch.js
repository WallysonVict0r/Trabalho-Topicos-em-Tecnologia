let currentPage = 0;

function loadSwitches(page) {
    console.log(`Loading page ${page}`);
    fetch(`http://localhost:8080/api/switches?page=${page}&size=10`)
        .then(response => response.json())
        .then(data => {
            console.log(data);
            const tableBody = document.querySelector('#switchesTable tbody');
            tableBody.innerHTML = '';

            data.content.forEach(switchData => {
                const row = document.createElement('tr');
                row.innerHTML = `
                            <td>${switchData.registro}</td>
                            <td>${switchData.data}</td>
                            <td>${switchData.hora}</td>
                            <td>${switchData.hostname}</td>
                            <td>${switchData.ipAddress}</td>
                            <td>${switchData.macAddress}</td>
                            <td>${switchData.marca}</td>
                            <td>${switchData.modelo}</td>
                            <td>${switchData.numSerie}</td>
                            <td>${switchData.versao}</td>
                            <td>${switchData.imobilizado}</td>
                        `;
                tableBody.appendChild(row);
            });
            console.log('Updated table:', tableBody.innerHTML);
            document.getElementById('prevPage').disabled = data.first;
            document.getElementById('nextPage').disabled = data.last;
        })
        .catch(error => console.error('Erro ao carregar os dados:', error));
}

document.getElementById('prevPage').addEventListener('click', () => {
    if (currentPage > 0) {
        currentPage--;
        loadSwitches(currentPage);
    }
});

document.getElementById('nextPage').addEventListener('click', () => {
    currentPage++;
    loadSwitches(currentPage);
});

// Chame a função loadSwitches quando a página for carregada
window.onload = function() {
    loadSwitches(currentPage);
}