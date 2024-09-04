document.addEventListener('DOMContentLoaded', function () {
    let currentPage = 0;

    function loadSwitches(page) {
        fetch(`http://localhost:8080/api/switches?page=${page}&size=15`)
            .then(response => response.json())
            .then(data => {
                updateTable(data.content);
                updateCharts(data.content);
                document.getElementById('prevPage').disabled = data.first;
                document.getElementById('nextPage').disabled = data.last;
            })
            .catch(error => console.error('Erro ao carregar os dados:', error));
    }

    function countByField(data, field) {
        return data.reduce((counts, item) => {
            const value = item[field];
            counts[value] = (counts[value] || 0) + 1;
            return counts;
        }, {});
    }


    function updateCharts(data) {
        const countsByVersion = countByField(data, 'versao');
        const countsByBrand = countByField(data, 'marca');

        if (window.chart1) window.chart1.destroy();
        if (window.chart2) window.chart2.destroy();

    }
    var chart; 
var data = [ 
  { 
    country: 'United States', 
    percent: 55.13, 
    population: 332997863 
  }, 
  { 
    country: 'Brazil', 
    percent: 41.35, 
    population: 214112172 
  }, 
  { 
    country: 'Russia', 
    percent: 19.63, 
    population: 145998857 
  }, 
  { 
    country: 'France', 
    percent: 52.62, 
    population: 65422093 
  }, 
  { 
    country: 'Turkey', 
    percent: 44.83, 
    population: 85270920 
  }, 
  { 
    country: 'United Kingdom', 
    percent: 67.65, 
    population: 68252627 
  }, 
  { 
    country: 'Argentina', 
    percent: 43.35, 
    population: 45621774 
  } 
]; 
  
chart = renderChart(makeSeries(data)); 
  
function renderChart(series) { 
  return JSC.chart('chartDiv', { 
    title_label_text: 
      'Share of people who received at least one dose of COVID-19 vaccine by country', 
    debug: true, 
    type: 'column solid', 
    legend_visible: false, 
    palette: ['#cb0303'], 
    defaultPoint: { 
      tooltip: 
        '<b>%xValue</b> <br>Population: <b>%yValue</b><br><b>%complete</b> of people with at least 1 dose</b>', 
      complete: { 
        fill: 'rgba(255,255,255,.3)', 
        hatch_style: 'none'
      }, 
      label: { 
        text: '%complete', 
        align: 'center', 
        verticalAlign: 'bottom', 
        autoHide: false, 
        style_fontSize: '15px'
      } 
    }, 
    series: series 
  }); 
} 
function makeSeries(data) { 
  return [ 
    { 
      points: data.map(function(item) { 
        return { 
          x: item.country, 
          y: item.population, 
          complete: item.percent / 100 
        }; 
      }) 
  }];
}

    function updateTable(data) {
        const tbody = document.getElementById('switchesTable').getElementsByTagName('tbody')[0];
        tbody.innerHTML = '';
        data.forEach(item => {
            const row = tbody.insertRow();
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
        });
    }

    document.getElementById('searchInput').addEventListener('input', (event) => {
        const query = event.target.value.toLowerCase();
        fetch('http://localhost:8080/api/switches')
            .then(response => response.json())
            .then(data => {
                const filteredData = data.filter(item => 
                    item.registro.toLowerCase().includes(query) || 
                    item.hostname.toLowerCase().includes(query) || 
                    item.ipAddress.toLowerCase().includes(query)
                );
                updateTable(filteredData);
                updateCharts(filteredData);
            })
            .catch(error => console.error('Erro ao carregar os dados:', error));
    });

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

    // Inicializar a tabela e os gráficos com todos os dados
    loadSwitches(currentPage);
});
