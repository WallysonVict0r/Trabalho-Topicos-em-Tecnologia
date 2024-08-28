let currentPage = 0;

function loadSwitches(page) {
    fetch(`http://localhost:8080/api/switches?page=${page}&size=10`)
        .then(response => response.json())
        .then(data => {
            const tableBody = document.querySelector('#switchesTable tbody');
            tableBody.innerHTML = '';

            data.content.forEach(switchData => {
                const row = document.createElement('tr');
                row.innerHTML = `
                            <td>${switchData.id}</td>
                            <td>${switchData.name}</td>
                            <td>${switchData.status}</td>
                        `;
                tableBody.appendChild(row);
            });

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

loadSwitches(currentPage);