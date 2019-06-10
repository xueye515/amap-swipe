
require('./swipe.css');

AMap.homeControlDiv = function (firstL, SecondL, option) {

  this._firstLayer = firstL;
  this._secondLayer = SecondL;
  this._swipType = 0;//0 左右  1，上下
  this._map = null;

  this.setFirstLayer = function (layer) {
    this._firstLayer = layer;
  }

  this.setSecondLayer = function (layer) {
    this._secondLayer = layer;
  }

  this.updatePos = function (pos) {

  }
  this.setType = function (type) {
    this._swipType = type;
  }
  this.addTo = function (map, dom) {
    this._map = map;
    if (this._firstLayer) {
      if (this._firstLayer.getMap() !== this._map) {
        this._firstLayer.setMap(this._map)
      }
    }
    if (this._secondLayer) {
      if (this._secondLayer.getMap() !== this._map) {
        this._secondLayer.setMap(this._map)
      }
    }

    if (dom) {
      dom.appendChild(this._getSwipeDom());
    }
  }

  _getSwipeDom = function () {



    const swipDiv = document.createElement('div');
    this._divider = document.createElement('div', 'leaflet-sbs-divider', container)
    var range = this._range = document.createElement('input', 'leaflet-sbs-range', container)
    range.type = 'range'
    range.min = 0
    range.max = 1
    range.step = 'any'
    range.value = 0.5
    // range.style.paddingLeft = range.style.paddingRight = this.options.padding + 'px'

    // 创建一个能承载控件的<div>容器                  
    var controlUI = document.createElement("DIV");
    controlUI.style.width = '80px';     //设置控件容器的宽度  
    controlUI.style.height = '20px';    //设置控件容器的高度                  
    controlUI.style.backgroundColor = 'white';
    controlUI.style.borderStyle = 'solid';
    controlUI.style.borderWidth = '2px';
    controlUI.style.cursor = 'pointer';
    controlUI.style.textAlign = 'center';

    // 设置控件的位置                   
    controlUI.style.position = 'absolute';
    controlUI.style.left = '120px';     //设置控件离地图的左边界的偏移量                  
    controlUI.style.top = '5px';        //设置控件离地图上边界的偏移量                  
    controlUI.style.zIndex = '300';     //设置控件在地图上显示                  

    // 设置控件字体样式                  
    controlUI.style.fontFamily = 'Arial,sens-serif';
    controlUI.style.fontSize = '12px';
    controlUI.style.paddingLeft = '4px';
    controlUI.style.paddingRight = '4px';
    controlUI.innerHTML = "返回中心";

    return controlUI;
  }

}





// mapObj.plugin(["AMap.MapType"],function(){  //添加地图类型切换插件 
//   //地图类型切换  
//   mapType= new AMap.MapType({defaultType:2,showRoad:true});  
//   mapObj.addControl(mapType);  
// });