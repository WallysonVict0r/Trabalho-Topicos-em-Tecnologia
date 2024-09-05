document.addEventListener('DOMContentLoaded', function () {
    let currentPage = 0;
    let allData = []; // Variável para armazenar todos os dados carregados
    let isAllRecordsShown = false; // Flag para verificar se todos os registros estão mostrados

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

        ;
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

    function loadMarcaCount() {
        fetch('http://localhost:8080/api/relatorios/countByMarca')
        .then(response => response.json())
        .then(data => {
            const points = data.map(item => ({ x: item.marca, y: item.qtd }));
            JSC.chart('chartDiv3', {
                type: 'pie',
                series: [{ name: 'Marcas', points }]
            });
        })
        .catch(error => console.error('Erro ao carregar contagem por marca:', error));
    }

    function loadInativoCount() {
        fetch('http://localhost:8080/api/relatorios/count')
            .then(response => response.json())
            .then(data => {
                const points = [
                    { x: 'Ativos', y: data[0].qtd_ativo },
                    { x: 'Inativos', y: data[0].qtd_inativo }
                ];
                JSC.chart('chartDiv4', {
                    type: 'pie',
                    series: [{ name: 'Ativos/Inativos', points }]
                });
            })
            .catch(error => console.error('Erro ao carregar os dados de ativos/inativos:', error));
    }

    function loadModeloCount() {
        fetch('http://localhost:8080/api/relatorios/countByModelo')
        .then(response => response.json())
        .then(data => {
            const points = data.map(item => ({ x: item.modelo, y: item.qtd }));
            JSC.chart('chartDiv1', {
                type: 'line',
                series: [{ name: 'Modelos', points }]
            });
        })
        .catch(error => console.error('Erro ao carregar contagem por modelo:', error));
    }

    function loadVersaoCount() {
        fetch('http://localhost:8080/api/relatorios/countByVersao')
        .then(response => response.json())
        .then(data => {
            const points = data.map(item => ({ x: item.versao, y: item.qtd }));
            JSC.chart('chartDiv2', {
                type: 'line',
                series: [{ name: 'Versões', points }]
            });
        })
        .catch(error => console.error('Erro ao carregar contagem por versão:', error));
    }

    function toggleRecords() {
        const button = document.getElementById('showAllButton');
        const icon = document.getElementById('buttonIcon').innerHTML;

        if (isAllRecordsShown) {
            // Mostrar dados da página atual
            loadSwitches(currentPage);
            button.innerHTML = `
                <span id="buttonIcon">
                    <!-- SVG para "Mostrar todos" -->
                    <svg
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg">
                        <path
                            d="M12 9C12.7956 9 13.5587 9.31607 14.1213 9.87868C14.6839 10.4413 15 11.2044 15 12C15 12.7956 14.6839 13.5587 14.1213 14.1213C13.5587 14.6839 12.7956 15 12 15C11.2044 15 10.4413 14.6839 9.87868 14.1213C9.31607 13.5587 9 12.7956 9 12C9 11.2044 9.31607 10.4413 9.87868 9.87868C10.4413 9.31607 11.2044 9 12 9ZM12 4.5C17 4.5 21.27 7.61 23 12C21.27 16.39 17 19.5 12 19.5C7 19.5 2.73 16.39 1 12C2.73 7.61 7 4.5 12 4.5ZM3.18 12C4.83 15.36 8.24 17.5 12 17.5C15.76 17.5 19.17 15.36 20.82 12C19.17 8.64 15.76 6.5 12 6.5C8.24 6.5 4.83 8.64 3.18 12Z"
                            fill="#F0F0F0" />
                    </svg>
                </span>
                Mostrar todos os registros
            `;
            
            loadSwitches(currentPage);
            isAllRecordsShown = false;
        } else {
            // Mostrar todos os dados
            updateTable(allData);
            updateCharts(allData);
            button.innerHTML = `
                <span id="buttonIcon">
                    <!-- SVG para "Ocultar" -->
                    <svg
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg">
                        <path
                            d="M12 3C6.5 3 2.27 6.5 1 12C2.27 17.5 6.5 21 12 21C17.5 21 21.73 17.5 23 12C21.73 6.5 17.5 3 12 3ZM12 19.5C7.74 19.5 4.07 16.17 3.13 12C4.07 7.83 7.74 4.5 12 4.5C16.26 4.5 19.93 7.83 20.87 12C19.93 16.17 16.26 19.5 12 19.5ZM12 7.5C8.84 7.5 6.5 9.84 6.5 12C6.5 14.16 8.84 16.5 12 16.5C15.16 16.5 17.5 14.16 17.5 12C17.5 9.84 15.16 7.5 12 7.5ZM12 14.5C10.07 14.5 8.5 12.93 8.5 11C8.5 9.07 10.07 7.5 12 7.5C13.93 7.5 15.5 9.07 15.5 11C15.5 12.93 13.93 14.5 12 14.5Z"
                            fill="#F0F0F0" />
                    </svg>
                </span>
                Mostrar registros da página atual
            `;
            
            loadMarcaCount();
            loadModeloCount();
            loadVersaoCount();
            loadInativoCount();

            isAllRecordsShown = true;
        }
    }

    document.getElementById('showAllButton').addEventListener('click', toggleRecords);

    document.getElementById('prevPage').addEventListener('click', function () {
        if (currentPage > 0) {
            currentPage--;
            loadSwitches(currentPage);
        }
    });

    document.getElementById('nextPage').addEventListener('click', function () {
        currentPage++;
        loadSwitches(currentPage);
    });

    document.getElementById('searchInput').addEventListener('input', handleSearch);

    // Inicializa o primeiro carregamento
    loadSwitches(currentPage);
});
