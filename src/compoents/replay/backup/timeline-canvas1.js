import store from '../../store'
function TimeSlider(conf) {
    this.canvas = conf.canvas;
    this.ctx = conf.ctx;
    console.log('====================================');
    console.log(this.canvas);
    console.log('====================================');
    this.canvansW = this.canvas.width;
    this.canVansH = this.canvas.height;
    this.timecell = conf.init_cells;
    // console.log(this.timecell)
    console.log(this.canvansW,this.canVansH)
    this.ctx.font="16px Arial";
    this.minutes_per_step = [1, 2, 5, 10, 15, 20, 30, 60, 120, 180, 240, 360, 720, 1440]; // min/格
    this.graduation_step = 15;//刻度间最小宽度，单位px
    this.hours_per_ruler = 3;//时间轴显示24小时
    this.start_timestamp = new Date().getTime() - 12*60*60*1000;
    this.distance_between_gtitle = 80;
    this.zoom = 24;
    this.g_isMousedown = false;//拖动mousedown标记
    this.g_isMousemove = false;//拖动mousemove标记
    this.g_mousedownCursor = null;//拖动mousedown的位置
    this.returnTime = null;//mouseup返回时间

    this.on_before_click_ruler_callback = null;

    this.init(this.start_timestamp,this.timecell,false);
    return this;
};

/**
 * 初始化
 * @param {*} start_timestamp 最左侧时间
 * @param {*} timecell 录像段数组
 * @param {*} redrawFlag 是否重绘标记
 */
TimeSlider.prototype.init = function(start_timestamp,timecell,redrawFlag){
    // console.log('====================================');
    // console.log('初始化',start_timestamp);
    // console.log('====================================');
    this.timecell = timecell;
    this.start_timestamp = start_timestamp;
    this.drawCellBg();
    this.add_cells(timecell);
    this.add_graduations(start_timestamp);
    
    // this.drawLine(0,this.canVansH,this.canvansW,this.canVansH,"rgb(151, 158, 167)",1); //底线
    // this.ctx.fillStyle = 'white';
    // this.ctx.fillRect(0,0,this.canvansW,13);//上边时间 

    
    this.ctx.save();
    this.ctx.translate(this.canvansW/2-100,205);
    this.ctx.rotate(-90*Math.PI/180);
    this.ctx.fillStyle = '#30AFFB';
    this.ctx.fillRect(this.canvansW/2-60,85,110,25); //上面背景块
    this.ctx.restore();
    var time = start_timestamp + (this.hours_per_ruler*3600*1000)/2;

    this.drawLine(this.canvansW/2,150,this.canvansW/2,100,"#979EA7",2); //中间播放点时间线

    //中间画一个三角
    // this.brief(this.canvansW);
    if(!redrawFlag){//只有第一次进入才需要添加事件
        this.add_events();
    }
    this.ctx.save();
    this.ctx.translate(this.canvansW/2-100,200);
    this.ctx.rotate(-90*Math.PI/180);
    this.ctx.fillStyle = "white";
    this.ctx.font="12px Arial";
    console.log(['time'],this.changeTime(time))
    this.ctx.fillText(this.changeTime(time),this.canvansW/2-60,100,100);
    this.ctx.restore();
    // this.timeblue();
}
TimeSlider.prototype.brief = function(s){
    this.ctx.fillStyle = "#2C7BF4 ";
    this.ctx.beginPath() // 新建一条路径
    this.ctx.moveTo(s/2,22) // 画笔移动到（10,10）
    this.ctx.lineTo(s/2-7,12) 
    this.ctx.lineTo(s/2+7,12)
    this.ctx.fill()
}
/**
 * 绘制添加刻度
 * @param {*} start_timestamp 最左侧时间
 */
 TimeSlider.prototype.add_graduations = function(start_timestamp){
    var _this = this;
    var px_per_min = _this.canvansW / (_this.hours_per_ruler * 60); // px/min24  24*60
    console.log('====================================');
    console.log(px_per_min);
    console.log('====================================');
    var px_per_s = _this.canvansW / (_this.hours_per_ruler * 60*60); // px/s
    console.log('====================================');
    console.log(px_per_s);
    console.log('====================================');
    var px_per_ms = _this.canvansW / (_this.hours_per_ruler * 60 * 60 * 1000); // px/ms
    console.log('====================================');
    console.log(px_per_ms);
    console.log('====================================');
    var px_per_step = _this.graduation_step;  // px/格 默认最小值20px
    var min_per_step = px_per_step / px_per_min; // min/格
    var s_per_step = px_per_step / px_per_s; // s/格
    for(var i = 0; i < _this.minutes_per_step.length;i++){ 
        if(min_per_step <= _this.minutes_per_step[i]){ //让每格时间在minutes_per_step规定的范围内
            min_per_step = _this.minutes_per_step[i]; 
            px_per_step = px_per_min * min_per_step;
            break
        }
    }
    var medium_step = 0;
    for (var i = 0; i < _this.minutes_per_step.length; i++) {
        if (_this.distance_between_gtitle / px_per_min <= _this.minutes_per_step[i]) {
            medium_step = _this.minutes_per_step[i];
            break;
        }
    }

    var num_steps = _this.canvansW / px_per_step; //总格数
    var graduation_left;
    var graduation_time;
    var graduation_times;
    var caret_class;
    var lineH;
    var ms_offset = _this.ms_to_next_step(start_timestamp,min_per_step*60*1000);//开始的偏移时间 ms
    var px_offset = ms_offset * px_per_ms; //开始的偏移距离 px
    var ms_per_step = px_per_step / px_per_ms; // ms/step
    for(var i = 0; i < num_steps; i++){
        graduation_left = px_offset + i * px_per_step; // 距离=开始的偏移距离+格数*px/格
        console.log('====================================');
        console.log(['距离'],graduation_left);
        console.log('====================================');
        graduation_time = start_timestamp + ms_offset + i * ms_per_step; //时间=左侧开始时间+偏移时间+格数*ms/格
        graduation_times = start_timestamp + ms_offset + i * ms_per_step/60; //时间=左侧开始时间+偏移时间+格数*ms/格
        var date = new Date(graduation_time);
        var dates = new Date(graduation_times);
        if (date.getUTCHours() == 0 && date.getUTCMinutes() == 0) {
            caret_class = 'big';
            lineH = 37;//刻度位置
            var big_date = _this.graduation_title(date);
            console.log(['时间位置1'],big_date)
            _this.ctx.save();
            _this.ctx.translate(graduation_left,250);
            _this.ctx.rotate(-90*Math.PI/180);
            _this.ctx.fillText(big_date,graduation_left-20,150);//刻度时间位置
            _this.ctx.fillStyle = "black";
            _this.ctx.restore();
        }else if (graduation_time / (60 * 1000) % medium_step == 0) {
            caret_class = 'middle';
            lineH = 37;//刻度位置
            var middle_date = _this.graduation_title(date);
            console.log(['时间位置2'],middle_date)
            if (middle_date.length>9) {
                _this.ctx.save();
                _this.ctx.translate(graduation_left,250);
                _this.ctx.rotate(-90*Math.PI/180);
                _this.ctx.font = '11px Arial'
                _this.ctx.fillStyle = "black";
                _this.ctx.fillText(middle_date,graduation_left-30,150);//刻度时间位置
                _this.ctx.restore();
            }else{
                _this.ctx.save();
                _this.ctx.translate(graduation_left,250);
                _this.ctx.rotate(-90*Math.PI/180);
                _this.ctx.fillStyle = "black";
                _this.ctx.font = '13px Arial'
                console.log(['时间位置3'],middle_date)
                _this.ctx.fillText(middle_date,graduation_left-25,150);//刻度时间位置
                _this.ctx.restore();
            }
        }else{
            lineH = 32;
        }
        // drawLine(graduation_left,0,graduation_left,lineH,"rgba(151,158,167,0.4)",1);
        _this.drawLine(graduation_left,150,graduation_left,135,"rgba(151,158,167,1)",1);
        if (_this.hours_per_ruler == 0.1) {
            for (let j = 1; j <= 30; j++) {
                // if (graduation_left<px_per_step&&graduation_left>=0) {
                //     _this.drawLine(graduation_left-parseInt(px_per_step/20)*j,15,graduation_left-parseInt(px_per_step/20)*j,22,"rgba(151,158,167,1)",1);
                // }else if (graduation_left >=px_per_step) {
                //     _this.drawLine(graduation_left-parseInt(px_per_step/20)*j,15,graduation_left-parseInt(px_per_step/20)*j,22,"rgba(151,158,167,1)",1);
                // }else if (condition) {
                    
                // }
                _this.drawLine(graduation_left-parseInt(px_per_step/30)*j,25,graduation_left-parseInt(px_per_step/30)*j,22,"rgba(151,158,167,1)",1);
                if (i+1==num_steps) {
                    _this.drawLine(graduation_left+parseInt(px_per_step/30)*j,25,graduation_left+parseInt(px_per_step/30)*j,22,"rgba(151,158,167,1)",1);
                }
            }
        }
    }
}

/**
 * 绘制线
 * @param {*} beginX 
 * @param {*} beginY 
 * @param {*} endX 
 * @param {*} endY 
 * @param {*} color 
 * @param {*} width 
 */
TimeSlider.prototype.drawLine = function(beginX,beginY,endX,endY,color,width){
    // console.log(beginX,beginY,endX,endY,color,width);
    this.ctx.beginPath();
    this.ctx.moveTo(beginX,beginY);
    this.ctx.lineTo(endX,endY);
    this.ctx.strokeStyle = color;
    this.ctx.lineWidth = width;
    this.ctx.stroke();
}

/**
 * 添加录像段
 * @param {*} cells 录像数组
 */
TimeSlider.prototype.add_cells = function(cells){
    var _this = this;
    if(cells){
        
        cells.forEach(cell => {
            _this.draw_cell(cell)
        });
    }
}  

/**
 * 绘制录像块
 * @param {*} cell cell包括beginTime ms;endTime ms;style 
 */
TimeSlider.prototype.draw_cell = function(cell){
    var _this = this;
    var px_per_ms = _this.canvansW / (_this.hours_per_ruler * 60 * 60 * 1000); // px/ms
    var beginX = (cell.beginTime - _this.start_timestamp) * px_per_ms;
    var cell_width = ( cell.endTime - cell.beginTime) * px_per_ms+1;
    _this.ctx.fillStyle = cell.style.background;
    _this.ctx.fillRect(beginX,130,cell_width,20);
}

/**
 * 绘制录像块背景
 */
TimeSlider.prototype.drawCellBg = function(){
    // let color = '';
    // if (store.state.darkMode == 'blue') {
    //     color = '#0B0D1A';
    // }else if(store.state.darkMode == 'c-dark-theme'){
    //     color = '#000000'
    // }else{
    //     color = '#A0A0A0'
    // }
    // // this.ctx.fillStyle = "rgba(150, 150, 150, 1)";
    // this.ctx.fillStyle = color;
    // this.ctx.fillStyle = "rgba(150, 150, 150, 1)";
    // this.ctx.fillRect(0,50,this.canvansW,11); 
}

/**
 * 时间轴事件
 */
TimeSlider.prototype.add_events = function(){
    var _this = this;
    if(_this.canvas.addEventListener){
        _this.canvas.addEventListener('mousewheel',_this.mousewheelFunc.bind(_this));
        _this.canvas.addEventListener('mousedown',_this.mousedownFunc.bind(_this));
        _this.canvas.addEventListener('mousemove',_this.mousemoveFunc.bind(_this));
        _this.canvas.addEventListener('mouseup',_this.mouseupFunc.bind(_this));
        _this.canvas.addEventListener('mouseout',_this.mouseoutFunc.bind(_this));
    }
}

/**
 * 拖动/点击 mousedown事件
 */
TimeSlider.prototype.mousedownFunc = function(e){
    this.g_isMousedown = true;
    this.g_mousedownCursor = this.get_cursor_x_position(e);//记住mousedown的位置
}

/**
 * 拖动/鼠标hover显示 mousemove事件
 */
TimeSlider.prototype.mousemoveFunc = function(e){
    var _this = this;
    var pos_x = _this.get_cursor_x_position(e);
    var px_per_ms = _this.canvansW / (_this.hours_per_ruler * 60 * 60 * 1000); // px/ms
    // console.log(_this.canvansW,px_per_ms )

    _this.clearCanvas();
    if(_this.g_isMousedown){
        var diff_x = pos_x - _this.g_mousedownCursor;
        _this.start_timestamp = _this.start_timestamp - Math.round(diff_x / px_per_ms);
        _this.init(_this.start_timestamp,_this.timecell,true);
        _this.g_isMousemove = true;
        _this.g_mousedownCursor = pos_x;
    }else{
        // var time = (_this.start_timestamp-390) + pos_x/px_per_ms-22430000;
        _this.init(_this.start_timestamp,_this.timecell,true);
        // _this.drawLine(pos_x-342,0,pos_x-342,50,"rgb(194, 202, 215)",1);
        // _this.ctx.fillStyle = "rgb(194, 202, 215)";
        // _this.ctx.fillText(_this.changeTime(time),pos_x-420,75);//黑色竖线的位置和时间位置
    }
}

/**
 * 拖动/点击 mouseup事件
 */
TimeSlider.prototype.mouseupFunc = function(e){
    var _this = this;
    if(_this.g_isMousemove){ //拖动 事件
        _this.g_isMousemove = false;
        _this.g_isMousedown = false;
        _this.returnTime = _this.start_timestamp + (_this.hours_per_ruler*3600*1000)/2;
    }else{ // click 事件
        _this.g_isMousedown = false;
        var posx = _this.get_cursor_x_position(e); //鼠标距离 px
        var ms_per_px = (_this.zoom * 3600 * 1000) / _this.canvansW; // ms/px
        _this.returnTime = _this.start_timestamp + (posx-390) * ms_per_px;
        _this.set_time_to_middle(_this.returnTime);
    }
}

/**
 * 鼠标移出隐藏时间 mouseout事件
 * @param {*} e 
 */
TimeSlider.prototype.mouseoutFunc = function(){
    var _this = this;
    _this.clearCanvas();
    _this.init(_this.start_timestamp,_this.timecell,true);
}

/**
 * 滚轮放大缩小，以时间轴中心为准 mousewheel事件
 */
TimeSlider.prototype.mousewhs = function(delta){
    console.log(delta);
    var _this = this;
    var middle_time = _this.start_timestamp + (_this.hours_per_ruler*3600*1000)/2; //ms 记住当前中间的时间
    let zoom = {24:24,20:16,16:8,12:4,8:1,4:0.5,1:0.1}
    if (delta < 0) {
        if ( _this.zoom == 1) {
            _this.zoom =4
        }else{
            _this.zoom = _this.zoom + 4;
        }
        if (_this.zoom >= 24) {
            _this.zoom = 24;//放大最大24小时
        }
        _this.hours_per_ruler = _this.zoom;
    } else if (delta > 0) {// 放大
        _this.zoom = _this.zoom - 4;
        if (_this.zoom <= 1) {
            _this.zoom = 1;//缩小最小1小时
        }
        _this.hours_per_ruler =zoom[_this.zoom];
    }	
    _this.clearCanvas();
    _this.start_timestamp = middle_time - (_this.hours_per_ruler*3600*1000)/2; //start_timestamp = 当前中间的时间 - zoom/2
    _this.init(_this.start_timestamp,_this.timecell,true)
}
TimeSlider.prototype.mousewheelFunc = function(event){
    var _this = this;
    if(event && event.preventDefault){
        event.preventDefault()
    }else{
        window.event.returnValue = false;
        return false;
    }	

    var e = window.event || event;
    var delta = Math.max(-1,Math.min(1,(e.wheelDelta || -e.detail)));
    var middle_time = _this.start_timestamp + (_this.hours_per_ruler*3600*1000)/2; //ms 记住当前中间的时间
    let zoom = {24:24,20:16,16:8,12:4,8:1,4:0.5,1:0.1}
    if (delta < 0) {
        if ( _this.zoom == 1) {
            _this.zoom =4
        }else{
            _this.zoom = _this.zoom + 4;
        }
        if (_this.zoom >= 24) {
            _this.zoom = 24;//放大最大24小时
        }
        _this.hours_per_ruler = _this.zoom;
    } else if (delta > 0) {// 放大
        _this.zoom = _this.zoom - 4;
        if (_this.zoom <= 1) {
            _this.zoom = 1;//缩小最小1小时
        }
        _this.hours_per_ruler =zoom[_this.zoom];
    }
    _this.clearCanvas();
    _this.start_timestamp = middle_time - (_this.hours_per_ruler*3600*1000)/2; //start_timestamp = 当前中间的时间 - zoom/2
    _this.init(_this.start_timestamp,_this.timecell,true)
}

/**
 * 获取鼠标posx
 * @param {*} e 
 */
TimeSlider.prototype.get_cursor_x_position =function(e) {
    var posx = 0;

    if (! e) {
        e = window.event;
    }
    
    if (e.pageX || e.pageY) {
        posx = e.pageX;
    }else if (e.clientX || e.clientY) {
        posx = e.clientX + document.body.scrollLeft + document.documentElement.scrollLeft;
    }
    
    return posx;
}

/**
 * 返回时间轴上刻度的时间
 * @param {*} datetime new Date 格式
 */
TimeSlider.prototype.graduation_title = function(datetime) {
    if (datetime.getHours() == 0 && datetime.getMinutes() == 0 && datetime.getMilliseconds() == 0) {
        return ('0' + datetime.getDate().toString()).substr(-2) + '.' +
            ('0' + (datetime.getMonth() + 1).toString()).substr(-2) + '.' +
            datetime.getFullYear();
    }
    return datetime.getHours() + ':' + ('0' + datetime.getMinutes().toString()).substr(-2)+':'+ ('0' + datetime.getSeconds().toString()).substr(-2);
};

/**
 * 返回 2018-01-01 10:00:00 格式时间
 * @param {*} time 
 */
TimeSlider.prototype.changeTime = function(time) {
    console.log(time);
    var newTime = new Date(time);
    var year = newTime.getFullYear();
    var month = newTime.getMonth() + 1;
    if(month < 10){
        var month = "0" + month;
    }
    var date = newTime.getDate();
   if (date < 10) {
        var date = "0" + date;
    } 
    var hour = newTime.getHours();
    if (hour < 10) {
        var hour = "0" + hour;
    }
    var minute = newTime.getMinutes();
    if (minute < 10) {
        var minute = "0" + minute;
    }
    var second = newTime.getSeconds();
    if (second < 10) {
        var second = "0" + second;
    }
    return year + "-" + month + "-" + date + " " + hour + ":" + minute + ":" + second;
}

/**
 * 左侧开始时间的偏移，返回单位ms
 * @param {*} timestamp 
 * @param {*} step 
 */
TimeSlider.prototype.ms_to_next_step = function(timestamp, step) {
    var remainder = timestamp % step;
    return remainder ? step - remainder : 0;
}

/**
 * 设置时间，让这个时间点跳到中间红线处
 *  @param {*} time 单位ms
 */
TimeSlider.prototype.set_time_to_middle = function(time){
    this.clearCanvas();
    this.start_timestamp = time - (this.hours_per_ruler * 60 * 60 * 1000)/2;
    this.init(this.start_timestamp,this.timecell,true)
}

/**
 * 返回点击或者拖动的时间点
 */
TimeSlider.prototype.returnMouseupTime = function(callback){
    var _this = this;
    if(_this.returnTime != null){
        if(callback){
            callback(_this.returnTime);
        }
    }
}

/**
 * 清除canvas 每次重新绘制需要先清除
 */
TimeSlider.prototype.clearCanvas = function(){
    this.ctx.clearRect(0,0,1500,150);
}

/**
 * 插件设置
 * @param {*} options 
 */
function Plugin(options,time,cell,callback) {
    return this.each(function() {
        var _this = $(this);
        var _thisId = this.id;
        var data = _this.data('timeslider');
        if (! data) {
            _this.data('timeslider', new TimeSlider(_thisId, options));
        }
        else {
            if (typeof options == 'string') {
                switch (options) {
                    case 'set_time_to_middle':
                        data.set_time_to_middle(time);
                        break;
                    case 'returnMouseupTime':
                        data.returnMouseupTime(callback);
                        break;
                    case 'init':
                        data.clearCanvas();
                        data.init(time,cell,true);  
                        break;  
                    case 'mousewhs':
                        data.mousewhs(time);  
                        break;  
                }
            }
            else {
                // data.set_options(options);
            }
        }
    });
}

// var old = $.fn.TimeSlider;

// $.fn.TimeSlider = Plugin;

// $.fn.TimeSlider.noConflict = function() {
//     $.fn.TimeSlider = old;
//     return this;
// };
export default TimeSlider