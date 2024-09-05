document.addEventListener('DOMContentLoaded', function () {
    let currentPage = 0;
    let allData = []; // Variável para armazenar todos os dados carregados

    function loadSwitches(page) {
        fetch(`http://localhost:8080/api/switches?page=${page}&size=15`)
            .then(response => response.json())
            .then(data => {
                if (Array.isArray(data.content)) {
                    allData = data.content; // Armazena os dados carregados
                    updateTable(data.content);
                    updateCharts(data.content);
                    document.getElementById('prevPage').disabled = data.first;
                    document.getElementById('nextPage').disabled = data.last;
                } else {
                    console.error('Formato de dados inesperado:', data);
                }
            })
            .catch(error => console.error('Erro ao carregar os dados:', error));
    }

    function updateTable(data) {
        const tbody = document.querySelector('#switchesTable tbody');
        tbody.innerHTML = '';

        data.forEach(item => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${item.registro}</td>
                <td>${item.data}</td>
                <td>${item.hora}</td>
                <td>${item.hostname}</td>
                <td>${item.ipAddress}</td>
                <td>${item.macAddress}</td>
                <td>${item.marca}</td>
                <td>${item.modelo}</td>
                <td>${item.numSerie}</td>
                <td>${item.versao}</td>
                <td>${item.imobilizado}</td>
            `;
            tbody.appendChild(row);
        });
    }

    function updateCharts(data) {
        // Contar quantos modelos e versões há na página
        const modelCounts = {};
        const versionCounts = {};
        data.forEach(item => {
            modelCounts[item.modelo] = (modelCounts[item.modelo] || 0) + 1;
            versionCounts[item.versao] = (versionCounts[item.versao] || 0) + 1;
        });

        // Preparar dados para os gráficos de linha
        const modelPoints = Object.entries(modelCounts).map(([modelo, count]) => ({ x: modelo, y: count }));
        const versionPoints = Object.entries(versionCounts).map(([versao, count]) => ({ x: versao, y: count }));

        // Atualizar gráfico de modelos
        JSC.chart('chartDiv1', {
            type: 'line',
            series: [{
                name: 'Modelos',
                points: modelPoints
            }]
        });

        // Atualizar gráfico de versões
        JSC.chart('chartDiv2', {
            type: 'line',
            series: [{
                name: 'Versões',
                points: versionPoints
            }]
        });

        // Contar ativos e inativos
        const activeCount = data.filter(item => !item.imobilizado).length;
        const inactiveCount = data.filter(item => item.imobilizado).length;

        // Atualizar gráfico de marcas
        JSC.chart('chartDiv3', {
            type: 'pie',
            series: [{
                name: 'Marcas',
                points: data.reduce((acc, item) => {
                    const found = acc.find(point => point.x === item.marca);
                    if (found) {
                        found.y += 1;
                    } else {
                        acc.push({ x: item.marca, y: 1 });
                    }
                    return acc;
                }, [])
            }]
        });

        // Atualizar gráfico de ativos/inativos
        JSC.chart('chartDiv4', {
            type: 'pie',
            series: [{
                name: 'Ativos/Inativos',
                points: [
                    { x: 'Ativos', y: activeCount },
                    { x: 'Inativos', y: inactiveCount }
                ]
            }]
        });
    }

    function filterData(query) {
        if (!allData.length) return [];
        return allData.filter(item =>
            Object.values(item).some(value =>
                value.toString().toLowerCase().includes(query)
            )
        );
    }

    function handleSearch() {
        const query = document.getElementById('searchInput').value.toLowerCase();
        const filteredData = filterData(query);
        updateTable(filteredData);
        updateCharts(filteredData);
    }

    document.getElementById('searchInput').addEventListener('input', handleSearch);

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
});
