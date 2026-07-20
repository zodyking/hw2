/**
 * TrendsView — ApexCharts time-series chart view.
 */

export class TrendsView {
  constructor({ panel, ws, root }) {
    this._panel = panel;
    this._ws = ws;
    this._root = root;
    this._chart = null;
  }

  async _ensureCharts() {
    if (window.ApexCharts) return;
    // Load ApexCharts from CDN
    await new Promise((resolve, reject) => {
      const script = document.createElement('script');
      script.src = 'https://cdn.jsdelivr.net/npm/apexcharts';
      script.onload = resolve;
      script.onerror = reject;
      document.head.appendChild(script);
    });
  }

  async _loadData() {
    if (!this._ws) return null;
    try {
      const weather = await this._ws.getWeather();
      return weather?.hourly || [];
    } catch (e) {
      console.warn('Failed to load trends data:', e);
      return [];
    }
  }

  async render() {
    const container = document.createElement('div');
    container.className = 'trends-view';

    const header = document.createElement('h2');
    header.style.cssText = 'margin:0 0 var(--space-4)';
    header.textContent = 'Trends';
    container.appendChild(header);

    const chartCard = document.createElement('div');
    chartCard.className = 'card';
    chartCard.innerHTML = '<div id="trends-chart" style="min-height:350px"></div>';
    container.appendChild(chartCard);

    const hourly = await this._loadData();

    try {
      await this._ensureCharts();
      const temps = hourly.slice(0, 24).map((h, i) => ({
        x: i, y: h.temperature != null ? Math.round(h.temperature) : null,
      }));

      const chart = new window.ApexCharts(
        chartCard.querySelector('#trends-chart'),
        {
          series: [{
            name: 'Temperature',
            data: temps,
          }],
          chart: {
            type: 'area',
            height: 350,
            background: 'transparent',
            toolbar: { show: false },
          },
          theme: {
            mode: this._panel._appearance?.mode === 'light' ? 'light' : 'dark',
          },
          colors: ['#03a9f4'],
          fill: { type: 'gradient', gradient: { opacityFrom: 0.4, opacityTo: 0.05 } },
          dataLabels: { enabled: false },
          stroke: { curve: 'smooth', width: 2 },
          xaxis: {
            categories: hourly.slice(0, 24).map((_, i) => `${i}h`),
            labels: { style: { colors: '#9b9b9b' } },
          },
          yaxis: {
            labels: {
              formatter: (v) => v + '°',
              style: { colors: '#9b9b9b' },
            },
          },
        }
      );
      chart.render();
      this._chart = chart;
    } catch (e) {
      chartCard.innerHTML = `<p class="text-muted" style="text-align:center;padding:var(--space-6)">Chart failed to load</p>`;
    }

    return container;
  }
}
