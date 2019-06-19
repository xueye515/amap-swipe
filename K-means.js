import { getDistance } from './mapUtils';
class K_means {
  constructor(data, option) {
    this.data = data || [];
    this.option = {
      ...{
        decimal: 6, //经纬度保留几位小数
        k: 30,
        lngSum: 40,
        latSum: 40
      },
      ...option
    };

    this.blockData = [];
    this.means = [];
  }

  //获取范围
  _getDataRanges(allData) {
    const ranges = { lng: {}, lat: {} };
    ranges.lng.max = Math.max.apply(null, allData.map(item => item.lng));
    ranges.lng.min = Math.min.apply(null, allData.map(item => item.lng));
    ranges.lat.max = Math.max.apply(null, allData.map(item => item.lat));
    ranges.lat.min = Math.min.apply(null, allData.map(item => item.lat));

    ranges.lng.range = ranges.lng.max - ranges.lng.min;
    ranges.lng.dis = ranges.lng.range / this.option.lngSum;
    ranges.lat.range = ranges.lat.max - ranges.lat.min;
    ranges.lat.dis = ranges.lat.range / this.option.latSum;

    return ranges;
  }

  //初始化分块中心点
  _getBlockData(data, ranges) {
    if (data.length > this.option.lngSum * this.option.latSum) {
      let newData = {};
      data.forEach(item => {
        const x = Math.floor((item.lng - ranges.lng.min) / ranges.lng.dis);
        const y = Math.floor((item.lat - ranges.lat.min) / ranges.lat.dis);
        if (!newData[`${x}${y}`]) {
          newData[`${x}${y}`] = [];
        }
        newData[`${x}${y}`].push(item);
      });

      const newArr = Object.keys(newData).map(itemlst => {
        let lstLon = 0;
        let lstLat = 0;
        let lstCount = 0;
        newData[itemlst].forEach(item => {
          lstLon += item.lng * item.count;
          lstLat += item.lat * item.count;
          lstCount += item.count;
        });

        return {
          lng: lstLon / lstCount,
          lat: lstLat / lstCount,
          count: lstCount
        };
      });
      return newArr;
    } else {
      return data;
    }
  }

  initMeans(k) {
    const means = [];
    while (k--) {
      const mean = {};
      for (var dimension in this.dataRange) {
        mean[dimension] = parseFloat(
          (
            this.dataRange[dimension].min +
            Math.random() * this.dataRange[dimension].range
          ).toFixed(this.option.decimal)
        );
      }

      means.push(mean);
    }

    return means;
  }

  //计算各个点距离各中心点距离
  makeAssignments(data, means) {
    const assignments = [];
    for (var i in data) {
      var point = data[i];
      var distances = [];

      for (var j in means) {
        var mean = means[j];
        // var sum = 0;
        // for (var dimension in mean) {
        //   var difference = point[dimension] - mean[dimension];
        //   difference *= difference;
        //   sum += difference;
        // }
        // distances[j] = Math.sqrt(sum);
        distances[j] = getDistance(point, mean); //计算地球空间距离
      }

      assignments[i] = distances.indexOf(Math.min.apply(null, distances));
    }
    return assignments;
  }

  //循环移动中心点
  moveMeans(means, data) {
    const assignments = this.makeAssignments(data, means);

    var sums = Array(means.length);
    var counts = Array(means.length);
    var moved = false;

    for (var j in means) {
      counts[j] = 0;
      sums[j] = {};
      for (var dimension in means[j]) {
        sums[j][dimension] = 0;
      }
    }

    for (var point_index in assignments) {
      var mean_index = assignments[point_index];
      var point = data[point_index];
      var mean = means[mean_index];

      counts[mean_index] += point.count;

      for (var dimension in mean) {
        sums[mean_index][dimension] += point[dimension] * point.count;
      }
    }

    for (var mean_index in sums) {
      if (0 === counts[mean_index]) {
        sums[mean_index] = means[mean_index];
        console.log('空值:', sums[mean_index]);
        for (var dimension in this.dataRange) {
          sums[mean_index][dimension] = parseFloat(
            (
              this.dataRange[dimension].min +
              Math.random() * this.dataRange[dimension].range
            ).toFixed(this.option.decimal)
          );
        }
        continue;
      }

      for (var dimension in sums[mean_index]) {
        sums[mean_index][dimension] /= counts[mean_index];
        sums[mean_index][dimension] = parseFloat(
          sums[mean_index][dimension].toFixed(this.option.decimal)
        );
      }
    }

    if (JSON.stringify(means) !== JSON.stringify(sums)) {
      moved = true;
      this.means = sums;
    } else {
      this.means = sums.map((item, ind) => ({ ...item, count: counts[ind] }));
    }
    return moved;
  }

  //初始化
  setup() {
    // canvas = document.getElementById('canvas');
    // ctx = canvas.getContext('2d');

    this.dataRange = this._getDataRanges(this.data);
    this.blockData = this._getBlockData(this.data, this.dataRange);
  }

  runmeans() {
    const startTime = new Date().getTime();
    this.means = this.initMeans(this.option.k);

    let moved = true,
      ind = 0;
    while (moved) {
      ind++;
      moved = this.moveMeans(this.means, this.blockData);
    }

    const endTime = new Date().getTime();
    console.log(ind, 'time count', endTime - startTime);
  }
}

export default K_means;
