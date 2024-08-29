let currentPage = 0;
function loadSwitches(page) {
    console.log(`Loading page ${page}`);
    fetch(`http://localhost:8080/api/switches?page=${page}&size=15`)
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
            updateCharts(data.content);
        })
        .catch(error => console.error('Erro ao carregar os dados:', error));
}
function createChart(ctx, data, label) {
    if (ctx.chart) {
        ctx.chart.destroy();
    }

    // Crie um novo gráfico e armazene-o no contexto para referência futura
    ctx.chart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: data.map((_, i) => i + 1),
            datasets: [{
                label: label,
                data: data,
                backgroundColor: 'rgba(0, 123, 255, 0.5)',
                borderColor: 'rgba(0, 123, 255, 1)',
                borderWidth: 1
            }]
        },
        options: {
            scales: {
                y: {
                    beginAtZero: true
                }
            }
        }
    });
}

function updateCharts(data) {
    const chart1Ctx = document.getElementById('chart1').getContext('2d');
    const chart2Ctx = document.getElementById('chart2').getContext('2d');
    const chart3Ctx = document.getElementById('chart3').getContext('2d');

    // Contar o número de registros por dia
    const countsByDate = data.reduce((counts, item) => {
        const date = item.data.split('T')[0]; // Extrair a data do campo 'data'
        counts[date] = (counts[date] || 0) + 1;
        return counts;
    }, {});

    // Contar o número de switches por marca
    const countsByBrand = data.reduce((counts, item) => {
        const brand = item.marca;
        counts[brand] = (counts[brand] || 0) + 1;
        return counts;
    }, {});

    // Contar o número de switches por versão de software
    const countsByVersion = data.reduce((counts, item) => {
        const version = item.versao;
        counts[version] = (counts[version] || 0) + 1;
        return counts;
    }, {});

    // Criar os gráficos
    createChart(chart1Ctx, Object.values(countsByDate), 'Registros por dia');
    createChart(chart2Ctx, Object.values(countsByBrand), 'Switches por marca');
    createChart(chart3Ctx, Object.values(countsByVersion), 'Switches por versão de software');
}

// Adicione esta função para filtrar os dados
function filterData(data, query) {
    return data.filter(item => item.field1.includes(query) || item.field2.includes(query) || item.field3.includes(query));
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
document.getElementById('searchInput').addEventListener('input', (event) => {
    const query = event.target.value;
    const filteredData = filterData(data, query);
    updateTable(filteredData);
    updateCharts(filteredData);
});