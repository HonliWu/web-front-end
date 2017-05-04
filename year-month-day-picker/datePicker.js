/**
 * Created by Administrator on 2016/5/31.
 */
; (function($, window, document) {
    window.DatePicker = function() {
        DatePicker.target = null;
        DatePicker.isOut = false;
        DatePicker.curYear = "";  // 静态成员变量
        DatePicker.curMonth = "";
        DatePicker.curDay = "",
        DatePicker.isOnYearClicked = false;
        DatePicker.isOnMonthClicked = false;
        DatePicker.isOnDayClicked = false;
        DatePicker.monthPickerEventHandler = new DatePickerEvent();

        /**
         * @param obj: 点击obj弹出该月份选择菜单
         * @param align: "left" 和 obj左对齐， "center" 和 obj水平中间右对齐， "right" 和 obj右对齐
         */
        this.createMonthPicker = function(obj, align, marginTop, marginLeft, callback) {
            DatePicker.onCloseClick();

            var top = obj.getBoundingClientRect().bottom; // obj的底部为弹窗的顶部
            var left = obj.getBoundingClientRect().left;  // 默认是左对齐

            if ("right" == align.toLowerCase()) {
                left = obj.getBoundingClientRect().right - 360;  // 宽度固定是360px
            } else if ("center" == align.toLowerCase()) {
                var objCenter = (obj.getBoundingClientRect().left + obj.getBoundingClientRect().right) / 2;
                left = objCenter - 180;
            }

            if (typeof marginTop != "undefined") {
                top = top + marginTop;
            }
            if (typeof  marginLeft != "undefined") {
                left = left + marginLeft;
            }

            var datePickerDiv = document.createElement("div");
            datePickerDiv.setAttribute("id", "datePicker_div");
            datePickerDiv.style.position = "absolute";
            datePickerDiv.style.top = top + "px";
            datePickerDiv.style.left = left + "px";
            datePickerDiv.style.width = "360px";
            datePickerDiv.style.height = "auto";
            datePickerDiv.style.zIndex = "1000";

            var curDate = (obj.value != '' && isNaN(obj.value) == false) ? DateUtils.toDateObj(obj.value + '000000000') : (new Date());

            datePickerDiv.innerHTML = DatePicker.createMonthPickerHtml(curDate);

            document.body.appendChild(datePickerDiv);

            DatePicker.createSpreadLayout();

            DatePicker.target = obj;
            DatePicker.target.onkeydown = function () {
                var keyCode = event.keyCode ? event.keyCode : event.which ? event.which : event.charCode;
                if (keyCode == 13) {
                    DatePicker.onCloseClick();
                }
            };

            datePickerDiv.onclick = function() {
                DatePicker.isOut = false;  // 属于控件的一部分
            };

            window.document.onclick = function(){
                if(DatePicker.isOut){  // 点击了控件外面的区域
                    DatePicker.onConfirmClick();
                }
                DatePicker.isOut = true;
            };

            DatePicker.onConfirmEvent = callback;
            DatePicker.monthPickerEventHandler.addHandler("confirm", callback);
        }

        DatePicker.createMonthPickerHtml = function(curDate) {
            var curYear = curDate.getFullYear();    // 默认显示当前年
            var curMonth = curDate.getMonth() + 1;  // 月份的数字加1
            var curDay = curDate.getDate();         // 今天的

            curMonth = (curMonth < 10) ? ('0' + curMonth) : curMonth;
            curDay = (curDay < 10) ? ('0' + curDay) : curDay;

            DatePicker.curYear = curYear;
            DatePicker.curMonth = curMonth;
            DatePicker.curDay = curDay;

            return '<div class="root">' +
                '<div id="datePicker_menu_div">' +
                '<div id="datePicker_year_div" class="column">' +
                '<div id="datePicker_year_left" class="left-btn" onclick="DatePicker.onYearLeftClick();"></div>' +
                '<div id="datePicker_year_center" class="center" onclick="DatePicker.onYearClick();">' +
                '<div id="datePicker_year_center_text" class="text">' + curYear + '年</div>' +
                '<div id="datePicker_year_center_down" class="down"></div>' +
                '</div>' +
                '<div id="datePicker_year_right" class="right-btn" onclick="DatePicker.onYearRightClick();"></div>' +
                '</div>' +
                '<div id="datePicker_month_div" class="column">' +
                '<div id="datePicker_month_left" class="left-btn" onclick="DatePicker.onMonthLeftClick();"></div>' +
                '<div id="datePicker_month_center" class="center" onclick="DatePicker.onMonthClick();">' +
                '<div id="datePicker_month_center_text" class="text">' + curMonth + '月</div>' +
                '<div id="datePicker_month_center_down" class="down"></div>' +
                '</div>' +
                '<div id="datePicker_month_right" class="right-btn" onclick="DatePicker.onMonthRightClick();"></div>' +
                '</div>' +
                '<div id="datePicker_day_div" class="column">' +
                '<div id="datePicker_day_left" class="left-btn" onclick="DatePicker.onDayLeftClick();"></div>' +
                '<div id="datePicker_day_center" class="center" onclick="DatePicker.onDayClick();">' +
                '<div id="datePicker_day_center_text" class="text">' + curDay + '日</div>' +
                '<div id="datePicker_day_center_down" class="down"></div>' +
                '</div>' +
                '<div id="datePicker_day_right" class="right-btn" onclick="DatePicker.onDayRightClick();"></div>' +
                '</div>' +
                '<div style="clear: both;"></div>' +
                '<div onclick="DatePicker.onBottomLayerClick();">' +
                '<div id="datePicker_menu_display_div">' + curYear + '年' + curMonth + '月' + curDay + '日' + '</div>' +
                '<div id="datePicker_menu_confirm_div" onclick="DatePicker.onConfirmClick();">确定</div>' +
                '<div id="datePicker_menu_close_div" onclick="DatePicker.onCloseClick();">关闭</div>' +
                '</div>' +
                '</div>' +
                '</div>';
        }

        DatePicker.onYearClick = function() {
            if (false == DatePicker.isOnYearClicked) {
                DatePicker.isOnYearClicked = true;
                $('#datePicker_year_select_div').slideDown(200);

                DatePicker.isOnMonthClicked = false;
                DatePicker.isOnDayClicked = false;
                document.getElementById("datePicker_month_select_div").style.display = "none";
                document.getElementById("datePicker_day_select_div").style.display = "none";
            } else {
                DatePicker.isOnYearClicked = false;
                document.getElementById("datePicker_year_select_div").style.display = "none";
            }
        }

        DatePicker.onMonthClick = function() {
            if (false == DatePicker.isOnMonthClicked) {
                DatePicker.isOnMonthClicked = true;
                $('#datePicker_month_select_div').slideDown(200);

                DatePicker.isOnYearClicked = false;
                DatePicker.isOnDayClicked = false;
                document.getElementById("datePicker_year_select_div").style.display = "none";
                document.getElementById("datePicker_day_select_div").style.display = "none";
            } else {
                DatePicker.isOnMonthClicked = false;
                document.getElementById("datePicker_month_select_div").style.display = "none";
            }
        }

        DatePicker.onDayClick = function() {
            if (false == DatePicker.isOnDayClicked) {
                DatePicker.isOnDayClicked = true;
                $('#datePicker_day_select_div').slideDown(200);

                DatePicker.isOnYearClicked = false;
                DatePicker.isOnMonthClicked = false;
                document.getElementById("datePicker_year_select_div").style.display = "none";
                document.getElementById("datePicker_month_select_div").style.display = "none";
            } else {
                DatePicker.isOnDayClicked = false;
                document.getElementById("datePicker_day_select_div").style.display = "none";
            }
        }

        DatePicker.onYearLeftClick = function() {
            var year = parseInt(DatePicker.curYear);
            DatePicker.curYear = (year > 2000) ? (year - 1) : year;
            document.getElementById("datePicker_year_center_text").innerText = DatePicker.curYear + "年";
            document.getElementById("datePicker_menu_display_div").innerText = DatePicker.curYear + "年" + DatePicker.curMonth + "月" + DatePicker.curDay + "日";

            DatePicker.isOnYearClicked = false;
            DatePicker.isOnMonthClicked = false;
            DatePicker.isOnDayClicked = false;
            document.getElementById("datePicker_year_select_div").style.display = "none";
            document.getElementById("datePicker_month_select_div").style.display = "none";
            document.getElementById("datePicker_day_select_div").style.display = "none";

            DatePicker.updateDay();
        }

        DatePicker.onYearRightClick = function() {
            var year = parseInt(DatePicker.curYear);
            DatePicker.curYear = (year < 2020) ? (year + 1) : year;
            document.getElementById("datePicker_year_center_text").innerText = DatePicker.curYear + "年";
            document.getElementById("datePicker_menu_display_div").innerText = DatePicker.curYear + "年" + DatePicker.curMonth + "月" + DatePicker.curDay + "日";

            DatePicker.isOnYearClicked = false;
            DatePicker.isOnMonthClicked = false;
            DatePicker.isOnDayClicked = false;
            document.getElementById("datePicker_year_select_div").style.display = "none";
            document.getElementById("datePicker_month_select_div").style.display = "none";
            document.getElementById("datePicker_day_select_div").style.display = "none";

            DatePicker.updateDay();
        }

        DatePicker.onMonthLeftClick = function() {
            var month = parseInt(DatePicker.curMonth);
            if (month > 1) month = month - 1;
            DatePicker.curMonth = (month < 10) ? ("0" + month) : (month);

            document.getElementById("datePicker_month_center_text").innerText = DatePicker.curMonth + "月";
            document.getElementById("datePicker_menu_display_div").innerText = DatePicker.curYear + "年" + DatePicker.curMonth + "月" + DatePicker.curDay + "日";

            DatePicker.isOnYearClicked = false;
            DatePicker.isOnMonthClicked = false;
            DatePicker.isOnDayClicked = false;
            document.getElementById("datePicker_year_select_div").style.display = "none";
            document.getElementById("datePicker_month_select_div").style.display = "none";
            document.getElementById("datePicker_day_select_div").style.display = "none";

            DatePicker.updateDay();
        }

        DatePicker.onMonthRightClick = function() {
            var month = parseInt(DatePicker.curMonth);
            if (month < 12) month = month + 1;
            DatePicker.curMonth = (month < 10) ? ("0" + month) : (month);

            document.getElementById("datePicker_month_center_text").innerText = DatePicker.curMonth + "月";
            document.getElementById("datePicker_menu_display_div").innerText = DatePicker.curYear + "年" + DatePicker.curMonth + "月" + DatePicker.curDay + "日";

            DatePicker.isOnYearClicked = false;
            DatePicker.isOnMonthClicked = false;
            DatePicker.isOnDayClicked = false;
            document.getElementById("datePicker_year_select_div").style.display = "none";
            document.getElementById("datePicker_month_select_div").style.display = "none";
            document.getElementById("datePicker_day_select_div").style.display = "none";

            DatePicker.updateDay();
        }

        DatePicker.onDayLeftClick = function() {
            var day = parseInt(DatePicker.curDay);
            if (day > 1) day = day - 1;
            DatePicker.curDay = (day < 10) ? ("0" + day) : (day);

            document.getElementById("datePicker_day_center_text").innerText = DatePicker.curDay + "日";
            document.getElementById("datePicker_menu_display_div").innerText = DatePicker.curYear + "年" + DatePicker.curMonth + "月" + DatePicker.curDay + "日";

            DatePicker.isOnYearClicked = false;
            DatePicker.isOnMonthClicked = false;
            DatePicker.isOnDayClicked = false;
            document.getElementById("datePicker_year_select_div").style.display = "none";
            document.getElementById("datePicker_month_select_div").style.display = "none";
            document.getElementById("datePicker_day_select_div").style.display = "none";
        }

        DatePicker.onDayRightClick = function() {
            var day = parseInt(DatePicker.curDay);
            var date = new Date(parseInt(DatePicker.curYear), parseInt(DatePicker.curMonth), 0);
            if (day < date.getDate()) day = day + 1;
            DatePicker.curDay = (day < 10) ? ("0" + day) : (day);

            document.getElementById("datePicker_day_center_text").innerText = DatePicker.curDay + "日";
            document.getElementById("datePicker_menu_display_div").innerText = DatePicker.curYear + "年" + DatePicker.curMonth + "月" + DatePicker.curDay + "日";

            DatePicker.isOnYearClicked = false;
            DatePicker.isOnMonthClicked = false;
            DatePicker.isOnDayClicked = false;
            document.getElementById("datePicker_year_select_div").style.display = "none";
            document.getElementById("datePicker_month_select_div").style.display = "none";
            document.getElementById("datePicker_day_select_div").style.display = "none";
        }

        DatePicker.onConfirmClick = function() {
            var dateStr = DatePicker.curYear + '' + DatePicker.curMonth + '' + DatePicker.curDay;
            DatePicker.monthPickerEventHandler.fire({type: "confirm", data: {target: DatePicker.target, date: dateStr}}); // 触发确定事件

            DatePicker.onCloseClick();  // 关闭弹窗
        }

        DatePicker.onCloseClick = function() {
            var rootDiv = document.getElementById("datePicker_div");
            var yearSelectDiv = document.getElementById("datePicker_year_select_div");
            var monthSelectDiv = document.getElementById("datePicker_month_select_div");
            var daySelectDiv = document.getElementById("datePicker_day_select_div");
            if (rootDiv) {
                document.body.removeChild(rootDiv);
            }
            if (yearSelectDiv) {
                document.body.removeChild(yearSelectDiv);
            }
            if (monthSelectDiv) {
                document.body.removeChild(monthSelectDiv);
            }
            if (daySelectDiv) {
                document.body.removeChild(daySelectDiv);
            }
            DatePicker.isOnYearClicked = false;
            DatePicker.isOnMonthClicked = false;
            DatePicker.isOnDayClicked = false;
            DatePicker.monthPickerEventHandler.removeHandler("confirm", DatePicker.onConfirmEvent);
        }

        DatePicker.createSpreadLayout = function() {
            var yearDiv = document.getElementById("datePicker_year_center");
            var monthDiv = document.getElementById("datePicker_month_center");
            var dayDiv = document.getElementById("datePicker_day_center");

            var yearSelectDiv = document.createElement("div");
            var monthSelectDiv = document.createElement("div");
            var daySelectDiv = document.createElement("div");

            var date = new Date(parseInt(DatePicker.curYear), parseInt(DatePicker.curMonth), 0);

            yearSelectDiv.setAttribute("id", "datePicker_year_select_div");
            yearSelectDiv.style.position = "absolute";
            yearSelectDiv.style.display = "none";
            yearSelectDiv.style.left = yearDiv.getBoundingClientRect().left + "px";
            yearSelectDiv.style.top = yearDiv.getBoundingClientRect().bottom + "px";
            yearSelectDiv.style.width = yearDiv.getBoundingClientRect().width + "px";
            yearSelectDiv.style.height = "auto";
            yearSelectDiv.style.minHeight = "10px";
            yearSelectDiv.style.backgroundColor = "#D0EEFF";
            yearSelectDiv.style.zIndex = "1001";
            yearSelectDiv.style.opacity = "0.9";
            yearSelectDiv.style.filter = "alpha(opacity=150)";

            monthSelectDiv.setAttribute("id", "datePicker_month_select_div");
            monthSelectDiv.style.position = "absolute";
            monthSelectDiv.style.display = "none";
            monthSelectDiv.style.left = monthDiv.getBoundingClientRect().left + "px";
            monthSelectDiv.style.top = monthDiv.getBoundingClientRect().bottom + "px";
            monthSelectDiv.style.width = monthDiv.getBoundingClientRect().width + "px";
            monthSelectDiv.style.height = "auto";
            monthSelectDiv.style.minHeight = "10px";
            monthSelectDiv.style.backgroundColor = "#D0EEFF";
            monthSelectDiv.style.zIndex = "1001";
            monthSelectDiv.style.opacity = "0.9";
            monthSelectDiv.style.filter = "alpha(opacity=150)";

            daySelectDiv.setAttribute("id", "datePicker_day_select_div");
            daySelectDiv.style.position = "absolute";
            daySelectDiv.style.display = "none";
            daySelectDiv.style.left = dayDiv.getBoundingClientRect().left + "px";
            daySelectDiv.style.top = dayDiv.getBoundingClientRect().bottom + "px";
            daySelectDiv.style.width = dayDiv.getBoundingClientRect().width + "px";
            daySelectDiv.style.height = "auto";
            daySelectDiv.style.minHeight = "10px";
            daySelectDiv.style.backgroundColor = "#D0EEFF";
            daySelectDiv.style.zIndex = "1001";
            daySelectDiv.style.opacity = "0.9";
            daySelectDiv.style.filter = "alpha(opacity=150)";

            yearSelectDiv.innerHTML = DatePicker.createYearSpreadInnerHtml();
            monthSelectDiv.innerHTML = DatePicker.createMonthSpreadInnerHtml();
            daySelectDiv.innerHTML = DatePicker.createDaySpreadInnerHtml(date.getDate());

            document.body.appendChild(yearSelectDiv);
            document.body.appendChild(monthSelectDiv);
            document.body.appendChild(daySelectDiv);
        }

        DatePicker.createYearSpreadInnerHtml = function() {
            var innerHtml = '<div class="spread">';
            for (var i = 2010; i <= 2020; i++) {
                innerHtml += '<div data-year="' + i + '" onclick="DatePicker.onYearSpreadItemClick(this);" onmouseover="DatePicker.onMouseItemOver(this);" onmouseout="DatePicker.onMouseItemOut(this);" style="width: 100%; height: 25px; cursor: pointer; font-size: 10pt; text-align: center;">' + i + '年</div>';
            }
            innerHtml += '</div>';

            return innerHtml;
        }

        DatePicker.createMonthSpreadInnerHtml = function() {
            var innerHtml = '<div class="spread">';
            for (var i = 1; i <= 12; i++) {
                innerHtml += '<div data-month="' + i + '" onclick="DatePicker.onMonthSpreadItemClick(this);" onmouseover="DatePicker.onMouseItemOver(this);" onmouseout="DatePicker.onMouseItemOut(this);" style="width: 100%; height: 25px; cursor: pointer; font-size: 10pt; text-align: center;">' + i + '月</div>';
            }
            innerHtml += '</div>';

            return innerHtml;
        }

        DatePicker.createDaySpreadInnerHtml = function(num) {
            var innerHtml = '<div class="spread">';
            for (var i = 1; i <= num; i++) {
                innerHtml += '<div data-day="' + i + '" onclick="DatePicker.onDaySpreadItemClick(this);" onmouseover="DatePicker.onMouseItemOver(this);" onmouseout="DatePicker.onMouseItemOut(this);" style="width: 100%; height: 25px; cursor: pointer; font-size: 10pt; text-align: center;">' + i + '日</div>';
            }
            innerHtml += '</div>';

            return innerHtml;
        }

        DatePicker.onYearSpreadItemClick = function(obj) {
            DatePicker.isOnYearClicked = false;
            DatePicker.isOut = false;  // 属于控件的一部分
            DatePicker.curYear = obj.getAttribute("data-year");
            document.getElementById("datePicker_year_center_text").innerText = DatePicker.curYear + "年";
            document.getElementById("datePicker_year_select_div").style.display = "none";
            document.getElementById("datePicker_menu_display_div").innerText = DatePicker.curYear + "年" + DatePicker.curMonth + "月" + DatePicker.curDay + "日";

            DatePicker.updateDay();
        }

        DatePicker.onMonthSpreadItemClick = function(obj) {
            DatePicker.isOnMonthClicked = false;
            DatePicker.isOut = false;  // 属于控件的一部分
            DatePicker.curMonth = obj.getAttribute("data-month");
            DatePicker.curMonth = (DatePicker.curMonth < 10) ? ('0' + DatePicker.curMonth) : DatePicker.curMonth;
            document.getElementById("datePicker_month_center_text").innerText = DatePicker.curMonth + "月";
            document.getElementById("datePicker_month_select_div").style.display = "none";
            document.getElementById("datePicker_menu_display_div").innerText = DatePicker.curYear + "年" + DatePicker.curMonth + "月" + DatePicker.curDay + "日";

            DatePicker.updateDay();
        }

        DatePicker.onDaySpreadItemClick = function(obj) {
            DatePicker.isOnDayClicked = false;
            DatePicker.isOut = false;  // 属于控件的一部分
            DatePicker.curDay = obj.getAttribute("data-day");
            DatePicker.curDay = (DatePicker.curDay < 10) ? ('0' + DatePicker.curDay) : DatePicker.curDay;
            document.getElementById("datePicker_day_center_text").innerText = DatePicker.curDay + "日";
            document.getElementById("datePicker_day_select_div").style.display = "none";
            document.getElementById("datePicker_menu_display_div").innerText = DatePicker.curYear + "年" + DatePicker.curMonth + "月" + DatePicker.curDay + "日";

            DatePicker.updateDay();
        }

        DatePicker.onBottomLayerClick = function () {
            DatePicker.isOut = false;  // 属于控件的一部分

            if (DatePicker.isOnYearClicked == true) {
                DatePicker.isOnYearClicked = false;
                document.getElementById("datePicker_year_select_div").style.display = "none";
            }
            if (DatePicker.isOnMonthClicked == true) {
                DatePicker.isOnMonthClicked = false;
                document.getElementById("datePicker_month_select_div").style.display = "none";
            }
            if (DatePicker.isOnDayClicked == true) {
                DatePicker.isOnDayClicked = false;
                document.getElementById("datePicker_day_select_div").style.display = "none";
            }
        }

        DatePicker.updateDay = function () {
            var date = new Date(parseInt(DatePicker.curYear), parseInt(DatePicker.curMonth), 0);

            var daySelectDiv = document.getElementById('datePicker_day_select_div');
            daySelectDiv.innerHTML = DatePicker.createDaySpreadInnerHtml(date.getDate());

            if (parseInt(DatePicker.curDay) > date.getDate()) {
                DatePicker.curDay = '01';
                document.getElementById("datePicker_day_center_text").innerText = DatePicker.curDay + "日";
                document.getElementById("datePicker_menu_display_div").innerText = DatePicker.curYear + "年" + DatePicker.curMonth + "月" + DatePicker.curDay + "日";
            }
        }

        DatePicker.onMouseItemOver = function(obj) {
            obj.style.color = "#0000ff";
            obj.style.fontSize = "12pt";
            obj.style.opacity = "1.0";
            obj.style.filter = "alpha(opacity=100)";
        }

        DatePicker.onMouseItemOut = function(obj) {
            obj.style.color = "#000000";
            obj.style.fontSize = "10pt";
            obj.style.opacity = "0.9";
            obj.style.filter = "alpha(opacity=90)";
        }
    }

    function DatePickerEvent(){
        this.handlers = {};  //函数处理器数组
    }

    DatePickerEvent.prototype={
        constructor: DatePickerEvent, // 手动指定constructor为MonthPickerEvent

        addHandler:function(type, handler){  // 添加一个事件处理器
            if(typeof this.handlers[type] == "undefined"){
                this.handlers[type]=[];
            }
            this.handlers[type].push(handler);
        },
        fire:function(event){ // 触发事件
            if(!event.target){
                event.target = this;
            }
            if(this.handlers[event.type] instanceof Array){
                var handlers = this.handlers[event.type];
                for(var i = 0,len = handlers.length; i < len; i++){
                    handlers[i](event);
                }
            }
        },
        removeHandler:function(type, handler){  // 删除事件处理器
            if(this.handlers[type] instanceof Array){
                var handlers = this.handlers[type];
                for(var i = 0,len = handlers.length; i < len; i++){
                    if(handlers[i]===handler){
                        break;
                    }
                }
                handlers.splice(i,1); // 删除指定的handler处理器
            }
        }
    }

    /* 载入css资源 */
    var src = document.currentScript.src;
    var dir = src.substring(0, src.lastIndexOf("/"));

    var cssElement = document.createElement('link');
    cssElement.href = dir + "/css/datePicker.css";
    cssElement.type = "text/css";
    cssElement.rel = "styleSheet";

    document.head.appendChild(cssElement);
})(jQuery, window, document);


