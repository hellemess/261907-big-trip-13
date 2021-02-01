import Chart from 'chart.js';
import ChartDataLabels from 'chartjs-plugin-datalabels';
import dayjs from 'dayjs';
import duration from 'dayjs/plugin/duration';
import SmartView from './smart';

dayjs.extend(duration);

const BAR_HEIGHT = 90;

const renderChart = (ctx, types, values, formatter, chartTitle) => {
  ctx.height = BAR_HEIGHT * 5;

  return new Chart(ctx, {
    plugins: [ChartDataLabels],
    type: `horizontalBar`,
    data: {
      labels: types.map((it) => it.toUpperCase()),
      datasets: [{
        data: values,
        backgroundColor: `#ffffff`,
        hoverBackgroundColor: `#ffffff`,
        anchor: `start`,
        barThickness: 44,
        minBarLength: 50
      }]
    },
    options: {
      plugins: {
        datalabels: {
          font: {
            size: 13
          },
          color: `#000000`,
          anchor: `end`,
          align: `start`,
          formatter
        }
      },
      title: {
        display: true,
        text: chartTitle,
        fontColor: `#000000`,
        fontSize: 23,
        position: `left`
      },
      scales: {
        yAxes: [{
          ticks: {
            fontColor: `#000000`,
            padding: 5,
            fontSize: 13,
          },
          gridLines: {
            display: false,
            drawBorder: false
          }
        }],
        xAxes: [{
          ticks: {
            display: false,
            beginAtZero: true,
          },
          gridLines: {
            display: false,
            drawBorder: false
          }
        }],
      },
      legend: {
        display: false
      },
      tooltips: {
        enabled: false
      }
    }
  });
};

const renderMoneyChart = (moneyCtx, points, types) => {
  const values = Array(types.length).fill(0);

  points.forEach((it) => {
    const index = types.findIndex((type) => type === it.type);

    values[index] += it.cost;
  });

  const formatter = (value) => `€ ${value}`;

  renderChart(moneyCtx, types, values, formatter, `MONEY`);
};

const renderTimeChart = (timeCtx, points, types) => {
  const values = Array(types.length).fill(0);

  points.forEach((it) => {
    const index = types.findIndex((type) => type === it.type);

    values[index] += it.time.finish - it.time.start;
  });

  const formatter = (value) => {
    const typeDuration = dayjs.duration(value).$d;

    return `${typeDuration.days ? `${`${typeDuration.hours}`.padStart(2, `0`)}` : ``}${typeDuration.hours || typeDuration.days ? `${`${typeDuration.hours}`.padStart(2, `0`)}H ` : ``}${typeDuration.minutes ? `${`${typeDuration.minutes}`.padStart(2, `0`)}M` : ``}`;
  };

  renderChart(timeCtx, types, values, formatter, `TIME`);
};

const renderTypeChart = (typeCtx, points, types) => {
  const values = Array(types.length).fill(0);

  points.forEach((it) => {
    const index = types.findIndex((type) => type === it.type);

    values[index] += 1;
  });

  const formatter = (value) => `${value}x`;

  renderChart(typeCtx, types, values, formatter, `TYPE`);
};

const getStatsTemplate = () => {
  return `<section class="statistics  visually-hidden">
      <h2 class="visually-hidden">Trip statistics</h2>
      <div class="statistics__item statistics__item--money">
        <canvas class="statistics__chart  statistics__chart--money" width="900"></canvas>
      </div>
      <div class="statistics__item statistics__item--transport">
        <canvas class="statistics__chart  statistics__chart--transport" width="900"></canvas>
      </div>
      <div class="statistics__item statistics__item--time-spend">
        <canvas class="statistics__chart  statistics__chart--time" width="900"></canvas>
      </div>
    </section>`;
};

export default class StatsView extends SmartView {
  constructor(points) {
    super();
    this._points = points;
    this._types = [...new Set(this._points.map((it) => it.type))];
    this._moneyChart = null;
    this._timeChart = null;
    this._typeChart = null;
    this._setCharts();
  }

  _setCharts() {
    if (this._moneyChart !== null || this._timeChart !== null || this._typeChart !== null) {
      this._moneyChart = null;
      this._timeChart = null;
      this._typeChart = null;
    }

    const moneyCtx = this.element.querySelector(`.statistics__chart--money`);
    const typeCtx = this.element.querySelector(`.statistics__chart--transport`);
    const timeCtx = this.element.querySelector(`.statistics__chart--time`);


    renderMoneyChart(moneyCtx, this._points, this._types);
    renderTypeChart(typeCtx, this._points, this._types);
    renderTimeChart(timeCtx, this._points, this._types);
  }

  get template() {
    return getStatsTemplate(this._points);
  }

  removeElement() {
    super.removeElement();

    if (this._moneyChart !== null || this._timeChart !== null || this._typeChart !== null) {
      this._moneyChart = null;
      this._timeChart = null;
      this._typeChart = null;
    }
  }

  restoreHandlers() {
    this._setCharts();
  }
}
