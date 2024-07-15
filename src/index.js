// チャートの指標に関するプロパティをクラスで宣言
class ChartProps {
  name = '';      // チャート上部に表示される指標名
  titleText = ''; // 縦軸の外側に表示する「単位」
  chartData = []; // 実際にチャートに描画されるデータ

  set name(_name) {
    this.name = _name;
  }

  set titleText(txt) {
    this.titleText = txt;
  }

  set chartData(data) {
    this.chartData = data;
  }

  get name() {
    return this.name;
  }

  get titleText() {
    return this.titleText;
  }

  get chartData() {
    return this.chartData;
  }
}

const rainFall = new ChartProps();
rainFall.name = '雨量';
rainFall.titleText = 'mm';
rainFall.chartData = [0, 0, 3, 10, 0, 5, 8];

const temperature = new ChartProps();
temperature.name = '気温';
temperature.titleText = '℃';
temperature.chartData = [20, 22, 18, 16, 20, 18, 17];

const rainyPercent = new ChartProps();
rainyPercent.name = '降水確率';
rainyPercent.titleText = '%';
rainyPercent.chartData = [0, 0, 10, 30, 0, 10, 20];

const humidity = new ChartProps();
humidity.name = '湿度';
humidity.titleText = '%';
humidity.chartData = [40, 45, 70, 90, 50, 70, 80];

// チャート下部
const chartLabel = ['6/1', '6/2', '6/3', '6/4', '6/5', '6/6', '6/7'];

// オプションは指標変更ごとに変わる項目があるので関数化
const option = function chartOption(data1, data2) {
  return {
    scales: {
      'y-axis-1': {
        type: 'linear',
        position: 'left',
        ticks: {
          max: Math.max(...data1.chartData),
          min: 0,
        },
        title: {
          display: true,
          text: data1.titleText,
        }
      },
      'y-axis-2': {
        type: 'linear',
        position: 'right',
        ticks: {
          max: Math.max(...data2.chartData),
          min: 0,
        },
        title: {
          display: true,
          text: data2.titleText,
        },
        grid: {
          drawOnChartArea: false,
        },
      },
    },
    responsive: false,
  }
};

document.addEventListener('DOMContentLoaded', () => {
  // chart初期化のお約束
  const ctx = document.getElementById('mixedChart');

  const myChart = new Chart(ctx, {
    data: {
      datasets: [{
        type: 'bar',
        label: rainFall.name,
        data: rainFall.chartData,
        backgroundColor: 'rgba(66, 133, 244, 1)',
        borderColor: 'rgba(66, 133, 244, 1)',
        order: 2,
        borderWidth: 1,
        yAxisID: 'y-axis-1',
      }, {
        type: 'line',
        label: rainyPercent.name,
        data: rainyPercent.chartData,
        backgroundColor: 'rgba(84, 84, 84, 1)',
        borderColor: 'rgba(84, 84, 84, 1)',
        order: 1,
        borderWidth: 1,
        yAxisID: 'y-axis-2',
      }],
      labels: chartLabel,
    },
    // optionsは都度変更があるので関数でセット
    options: option(rainFall, rainyPercent),
  });

  // セレクトボックスの変更によってチャートを変更する処理
  const select = document.getElementById('selectBoxContainer');

  select.addEventListener('change', () => {
    const barVal = select.children[0].value;
    const lineVal = select.children[1].value;
    const datasets = myChart.data.datasets;

    /* イベント時に選択されているセレクトボックスのvalueで
    データをセットし直すChartPropsを切り替える */
    const data1 = barVal === 'temperature' ? temperature : rainFall;
    const data2 = lineVal === 'humidity' ? humidity : rainyPercent;

    // myChartのオブジェクトを上書き
    datasets[0].data = data1.chartData;
    datasets[0].label = data1.name;
    datasets[0].titleText = data1.titleText;

    datasets[1].data = data2.chartData;
    datasets[1].label = data2.name;
    datasets[1].titleText = data2.titleText;

    myChart.options = option(data1, data2);

    // .update()メソッドによって初めてチャートが更新される
    myChart.update();
  });
})