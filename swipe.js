// require('./swipe.css');

function getRangeEvent(rangeInput) {
  return 'oninput' in rangeInput ? 'input' : 'change';
}

AMap.homeControlDiv = function(firstL, SecondL, option) {
  this._firstLayer = firstL;
  this._secondLayer = SecondL;
  this._swipType = 0; //0 左右  1，上下
  this._showBar = true; //是否显示默认滑动条

  this._map = null;

  this.setFirstLayer = function(layer) {
    this._firstLayer = layer;
  };

  this.setSecondLayer = function(layer) {
    this._secondLayer = layer;
  };

  this.updatePos = function(pos) {};
  this.setType = function(type) {
    this._swipType = type;
  };
  this.addTo = function(map, dom) {
    this._map = map;
    if (this._firstLayer) {
      if (this._firstLayer.getMap() !== this._map) {
        this._firstLayer.setMap(this._map);
      }
    }
    if (this._secondLayer) {
      if (this._secondLayer.getMap() !== this._map) {
        this._secondLayer.setMap(this._map);
      }
    }

    if (dom && this._showBar) {
      dom.appendChild(this._getSwipeDom());
    }
    this._updateClip();
    this._addEvents();
  };

  this._getPosition = function() {
    var rangeValue = this._range.value;
    // var offset =
    //   (0.5 - rangeValue) * (2 * this.options.padding + this.options.thumbSize);
    return this._map.getSize().width * rangeValue;
  };

  this._updateClip = function() {
    debugger;
    var map = this._map;
    var mapSize = map.getSize();
    var clipX = this._getPosition();

    var map1Clip = 'rect(0px,' + clipX + 'px,' + mapSize.height + 'px,0px)';
    var map2Clip =
      'rect(0px,' +
      mapSize.width +
      'px,' +
      mapSize.height +
      'px,' +
      clipX +
      'px)';

    if (this._firstLayer) {
      this._firstLayer.getContainer().style.clip = map1Clip;
    }
    if (this._secondLayer) {
      this._secondLayer.getContainer().style.clip = map2Clip;
    }
  };

  this._addEvents = function() {
    var range = this._range;
    var map = this._map;
    if (!map || !range) return;
    // map.on('move', this._updateClip, this)
    // map.on('layeradd layerremove', this._updateLayers, this)
    // on(range, getRangeEvent(range), this._updateClip, this);
    // range.on(getRangeEvent(range), this._updateClip, this)
    map.on('mapmove',this._updateClip.bind(this));
    range.addEventListener(
      getRangeEvent(range),
      this._updateClip.bind(this),
      false
    );
  };

  this._getSwipeDom = function() {
    const swipDiv = document.createElement('div');
    swipDiv.id = 'test001';

    // 创建一个能承载控件的<div>容器
    var controlUI = document.createElement('DIV');
    swipDiv.style.width = '100%'; //设置控件容器的宽度
    swipDiv.style.backgroundColor = 'transparent';
    swipDiv.style.cursor = 'pointer';
    swipDiv.style.textAlign = 'center';

    // 设置控件的位置
    swipDiv.style.position = 'absolute';
    swipDiv.style.margin = '0 20px';
    swipDiv.style.zIndex = '300'; //设置控件在地图上显示

    // 设置控件字体样式
    swipDiv.style.fontFamily = 'Arial,sens-serif';
    swipDiv.style.fontSize = '12px';
    swipDiv.style.paddingLeft = '4px';
    swipDiv.style.paddingRight = '4px';
    // swipDiv.innerHTML = "返回中心";

    var range = (this._range = document.createElement('input'));
    range.type = 'range';
    range.min = 0;
    range.max = 1;
    range.step = 'any';
    range.value = 0.5;
    range.style.width = '100%';
    range.style.top = '50%';

    swipDiv.appendChild(range);

    return swipDiv;
  };
};

// mapObj.plugin(["AMap.MapType"],function(){  //添加地图类型切换插件
//   //地图类型切换
//   mapType= new AMap.MapType({defaultType:2,showRoad:true});
//   mapObj.addControl(mapType);
// });
