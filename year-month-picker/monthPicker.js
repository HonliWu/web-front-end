/**
 * Created by Administrator on 2016/5/31.
 */

function MonthPicker() {
    MonthPicker.isOut = false;
    MonthPicker.curYear = "";  // ��̬��Ա����
    MonthPicker.curMonth = "";
    MonthPicker.isOnYearClicked = false;
    MonthPicker.isOnMonthClicked = false;
    MonthPicker.monthPickerEventHandler = new MonthPickerEvent();

    /**
     * @param obj: ���obj�������·�ѡ��˵�
     * @param align: "left" �� obj����룬 "center" �� objˮƽ�м��Ҷ��룬 "right" �� obj�Ҷ���
     */
    this.createMonthPicker = function(obj, align, marginTop, marginLeft) {
        var top = obj.getBoundingClientRect().bottom; // obj�ĵײ�Ϊ�����Ķ���
        var left = obj.getBoundingClientRect().left;  // Ĭ���������

        if ("right" == align || "RIGHT" == align) {
            left = obj.getBoundingClientRect().right - 300;  // ��ȹ̶���300px
        } else if ("center" == align || "CENTER" == align) {
            var objCenter = (obj.getBoundingClientRect().left + obj.getBoundingClientRect().right) / 2;
            left = objCenter - 150;
        }

        if (typeof marginTop != "undefined") {
            top = top + marginTop;
        }
        if (typeof  marginLeft != "undefined") {
            left = left + marginLeft;
        }

        var monthPickerDiv = document.createElement("div");
        monthPickerDiv.setAttribute("id", "monthPicker_div");
        monthPickerDiv.style.position = "absolute";
        monthPickerDiv.style.top = top + "px";
        monthPickerDiv.style.left = left + "px";
        monthPickerDiv.style.width = "300px";
        monthPickerDiv.style.height = "auto";
        monthPickerDiv.style.zIndex = "1000";

        monthPickerDiv.innerHTML = MonthPicker.createMonthPickerHtml();

        document.body.appendChild(monthPickerDiv);

        monthPickerDiv.onclick = function() {
            MonthPicker.isOut = false;
        };

        window.document.onclick = function(){
            if(MonthPicker.isOut){  // ����˿ؼ����������
                MonthPicker.onCloseClick();
            }
            MonthPicker.isOut = true;
        };

        MonthPicker.createYearSpreadLayout();
    }

    this.setOnConfirmEventHandler = function() {
        MonthPicker.monthPickerEventHandler.addHandler("confirm", MonthPicker.onConfirmEvent);
    }

    MonthPicker.createMonthPickerHtml = function() {
        var curDate = new Date();
        var curYear = curDate.getFullYear();  // Ĭ����ʾ��ǰ��
        var curMonth = curDate.getMonth() + 1;  // �·ݵ����ּ�1

        if (curMonth < 10) {
            curMonth = '0' + curMonth;
        }

        MonthPicker.curYear = curYear;
        MonthPicker.curMonth = curMonth;

        return '<div style="position: relative; width: 300px; height: auto; min-height: 60px; background-color: #0099ff">' +
                    '<div id="monthPicker_menu_div" style="width: 300px; height: 65px;">' +
                        '<div id="monthPicker_year_div" style="width: 150px; height: 30px; margin-top: 10px; display: inline-block; float: left;">' +
                        '<div id="monthPicker_year_left" style="width: 0; height: 0; display: inline-block; float: left; cursor: pointer; border: 8px solid #ffffff; border-color: transparent #ffffff transparent transparent; border-style: dashed solid dashed dashed;" onclick="MonthPicker.onYearLeftClick();"></div>' +
                        '<div id="monthPicker_year_center" style="width: 118px; height: 25px; display: inline-block; cursor: pointer; text-align: center; color: #ffffff" onclick="MonthPicker.onYearClick();">' +
                            '<div id="monthPicker_year_center_text" style="display: inline-block; margin-top: 0px; vertical-align: top; font-size: 10pt; color: #ffffff">' + curYear + '��</div>' +
                            '<div id="monthPicker_year_center_down" style="width: 0; height: 0; margin-left: 5px; margin-top: 8px; display: inline-block; border: 5px solid #ffffff; border-color:  #ffffff transparent transparent transparent; border-style: solid dashed dashed dashed;"></div>' +
                        '</div>' +
                        '<div id="monthPicker_year_right" style="width: 0; height: 0; display: inline-block; float: right; cursor: pointer; border: 8px solid #ffffff; border-color: transparent transparent transparent #ffffff; border-style: dashed dashed dashed solid;" onclick="MonthPicker.onYearRightClick();"></div>' +
                    '</div>' +
                    '<div id="monthPicker_month_div" style="width: 150px; height: 30px; margin-top: 10px; display: inline-block; float: right;">' +
                        '<div id="monthPicker_month_left" style="width: 0; height: 0; display: inline-block; float: left; cursor: pointer; border: 8px solid #ffffff; border-color: transparent #ffffff transparent transparent; border-style: dashed solid dashed dashed;" onclick="MonthPicker.onMonthLeftClick();"></div>' +
                        '<div id="monthPicker_month_center" style="width: 118px; height: 25px; display: inline-block; cursor: pointer; text-align: center; color: #ffffff" onclick="MonthPicker.onMonthClick();">' +
                            '<div id="monthPicker_month_center_text" style=" display: inline-block; margin-top: 0px; vertical-align: top; font-size: 10pt; color: #ffffff">' + curMonth + '��</div>' +
                            '<div id="monthPicker_month_center_down" style="width: 0; height: 0; margin-left: 5px; margin-top: 8px; display: inline-block; border: 5px solid #ffffff; border-color: #ffffff transparent transparent transparent; border-style: solid dashed dashed dashed;"></div>' +
                        '</div>' +
                        '<div id="monthPicker_month_right" style="width: 0; height: 0; display: inline-block; float: right; cursor: pointer; border: 8px solid #ffffff; border-color: transparent transparent transparent #ffffff; border-style: dashed dashed dashed solid;" onclick="MonthPicker.onMonthRightClick();"></div>' +
                    '</div>' +
                    '<div style="clear: both;"></div>' +
                    '<div>' +
                        '<div id="monthPicker_menu_display_div" style="display: inline-block; margin-left: 6px; margin-bottom: 10px; width: 100px; height: 20px; line-height: 20px; padding-left: 5px; text-align: left; border: 1px solid #0099ff; background-color: #fff; font-size: 10pt; color: #514721">' + curYear + '��' + curMonth + '��' + '</div>' +
                            '<div id="monthPicker_menu_confirm_div" style="width: 60px; height: 20px; line-height: 20px; margin-bottom: 10px; margin-right: 6px; display: inline-block; float: right; border-radius: 4px; background-color: #78BA32; color: #fff; text-align: center; font-size: 10pt; cursor: pointer;" onclick="MonthPicker.onConfirmClick();">ȷ��</div>' +
                            '<div id="monthPicker_menu_close_div" style="width: 60px; height: 20px; line-height: 20px; margin-bottom: 10px; margin-right: 10px; display: inline-block; float: right; border-radius: 4px; background-color: #78BA32; color: #fff; text-align: center; font-size: 10pt; cursor: pointer;" onclick="MonthPicker.onCloseClick();">�ر�</div>' +
                        '</div>' +
                    '</div>' +
                '</div>';
    }

    MonthPicker.onYearClick = function() {
        if (false == MonthPicker.isOnYearClicked) {
            MonthPicker.isOnYearClicked = true;
            document.getElementById("monthPicker_year_select_div").style.display = "block";

            MonthPicker.isOnMonthClicked = false;
            document.getElementById("monthPicker_month_select_div").style.display = "none";
        } else {
            MonthPicker.isOnYearClicked = false;
            document.getElementById("monthPicker_year_select_div").style.display = "none";
        }
    }

    MonthPicker.onMonthClick = function() {
        if (false == MonthPicker.isOnMonthClicked) {
            MonthPicker.isOnMonthClicked = true;
            document.getElementById("monthPicker_month_select_div").style.display = "block";

            MonthPicker.isOnYearClicked = false;
            document.getElementById("monthPicker_year_select_div").style.display = "none";
        } else {
            MonthPicker.isOnMonthClicked = false;
            document.getElementById("monthPicker_month_select_div").style.display = "none";
        }
    }

    MonthPicker.onYearLeftClick = function() {
        var year = parseInt(MonthPicker.curYear);
        if (year > 2000) {
            year = year - 1;
        }
        MonthPicker.curYear = year;
        document.getElementById("monthPicker_year_center_text").innerText = MonthPicker.curYear + "��";
        document.getElementById("monthPicker_menu_display_div").innerText = MonthPicker.curYear + "��" + MonthPicker.curMonth + "��";

        MonthPicker.isOnYearClicked = false;
        document.getElementById("monthPicker_year_select_div").style.display = "none";
        MonthPicker.isOnMonthClicked = false;
        document.getElementById("monthPicker_month_select_div").style.display = "none";
    }

    MonthPicker.onYearRightClick = function() {
        var year = parseInt(MonthPicker.curYear);
        if (year < 2020) {
            year = year + 1;
        }
        MonthPicker.curYear = year;
        document.getElementById("monthPicker_year_center_text").innerText = MonthPicker.curYear + "��";
        document.getElementById("monthPicker_menu_display_div").innerText = MonthPicker.curYear + "��" + MonthPicker.curMonth + "��";

        MonthPicker.isOnYearClicked = false;
        document.getElementById("monthPicker_year_select_div").style.display = "none";
        MonthPicker.isOnMonthClicked = false;
        document.getElementById("monthPicker_month_select_div").style.display = "none";
    }

    MonthPicker.onMonthLeftClick = function() {
        var month = parseInt(MonthPicker.curMonth);
        if (month > 1) {
            month = month - 1;
        }
        if (month < 10) {
            month = "0" + month;
        }
        MonthPicker.curMonth = month;

        document.getElementById("monthPicker_month_center_text").innerText = MonthPicker.curMonth + "��";
        document.getElementById("monthPicker_menu_display_div").innerText = MonthPicker.curYear + "��" + MonthPicker.curMonth + "��";

        MonthPicker.isOnYearClicked = false;
        document.getElementById("monthPicker_year_select_div").style.display = "none";
        MonthPicker.isOnMonthClicked = false;
        document.getElementById("monthPicker_month_select_div").style.display = "none";
    }

    MonthPicker.onMonthRightClick = function() {
        var month = parseInt(MonthPicker.curMonth);
        if (month < 12) {
            month = month + 1;
        }
        if (month < 10) {
            month = "0" + month;
        }
        MonthPicker.curMonth = month;

        document.getElementById("monthPicker_month_center_text").innerText = MonthPicker.curMonth + "��";
        document.getElementById("monthPicker_menu_display_div").innerText = MonthPicker.curYear + "��" + MonthPicker.curMonth + "��";

        MonthPicker.isOnYearClicked = false;
        document.getElementById("monthPicker_year_select_div").style.display = "none";
        MonthPicker.isOnMonthClicked = false;
        document.getElementById("monthPicker_month_select_div").style.display = "none";
    }

    MonthPicker.onConfirmClick = function() {
        var yearMonth = MonthPicker.curYear + '' + MonthPicker.curMonth;
        MonthPicker.monthPickerEventHandler.fire({type: "confirm", message: yearMonth}); // ����ȷ���¼�

        MonthPicker.onCloseClick();  // �رյ���
    }

    // �����涨�壬���û��Լ������¼��ľ������
    //MonthPicker.onConfirmEvent = function(event) {
    //    alert(event.message);
    //}

    MonthPicker.onCloseClick = function() {
        var rootDiv = document.getElementById("monthPicker_div");
        var yearSelectDiv = document.getElementById("monthPicker_year_select_div");
        var monthSelectDiv = document.getElementById("monthPicker_month_select_div");
        if (rootDiv) {
            document.body.removeChild(rootDiv);
        }
        if (yearSelectDiv) {
            document.body.removeChild(yearSelectDiv);
        }
        if (monthSelectDiv) {
            document.body.removeChild(monthSelectDiv);
        }

        MonthPicker.monthPickerEventHandler.removeHandler("confirm", MonthPicker.onConfirmEvent);
    }

    MonthPicker.createYearSpreadLayout = function() {
        var yearDiv = document.getElementById("monthPicker_year_center");
        var monthDiv = document.getElementById("monthPicker_month_center");

        var yearSelectDiv = document.createElement("div");
        var monthSelectDiv = document.createElement("div");

        yearSelectDiv.setAttribute("id", "monthPicker_year_select_div");
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

        monthSelectDiv.setAttribute("id", "monthPicker_month_select_div");
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

        yearSelectDiv.innerHTML = MonthPicker.createYearSpreadInnerHtml();
        monthSelectDiv.innerHTML = MonthPicker.createMonthSpreadInnerHtml();

        document.body.appendChild(yearSelectDiv);
        document.body.appendChild(monthSelectDiv);
    }

    MonthPicker.createYearSpreadInnerHtml = function() {
        var innerHtml = '<div style="position: relative; width: 100%; height: 275px; background-color: #D0EEFF;">';
        for (var i = 2010; i <= 2020; i++) {
            innerHtml += '<div data-year="' + i + '" onclick="MonthPicker.onYearSpreadItemClick(this);" onmouseover="MonthPicker.onMouseItemOver(this);" onmouseout="MonthPicker.onMouseItemOut(this);" style="width: 100%; height: 25px; cursor: pointer; font-size: 10pt; text-align: center;">' + i + '��</div>';
        }
        innerHtml += '</div>';

        return innerHtml;
    }

    MonthPicker.createMonthSpreadInnerHtml = function() {
        var innerHtml = '<div style="position: relative; width: 100%; height: 300px; background-color: #D0EEFF;">';
        for (var i = 1; i <= 12; i++) {
            innerHtml += '<div data-month="' + i + '" onclick="MonthPicker.onMonthSpreadItemClick(this);" onmouseover="MonthPicker.onMouseItemOver(this);" onmouseout="MonthPicker.onMouseItemOut(this);" style="width: 100%; height: 25px; cursor: pointer; font-size: 10pt; text-align: center;">' + i + '��</div>';
        }
        innerHtml += '</div>';

        return innerHtml;
    }

    MonthPicker.onYearSpreadItemClick = function(obj) {
        MonthPicker.isOnYearClicked = false;
        MonthPicker.isOut = false;  // ���ڿؼ���һ����
        MonthPicker.curYear = obj.getAttribute("data-year");
        document.getElementById("monthPicker_year_center_text").innerText = MonthPicker.curYear + "��";
        document.getElementById("monthPicker_year_select_div").style.display = "none";
        document.getElementById("monthPicker_menu_display_div").innerText = MonthPicker.curYear + "��" + MonthPicker.curMonth + "��";
    }

    MonthPicker.onMonthSpreadItemClick = function(obj) {
        MonthPicker.isOnMonthClicked = false;
        MonthPicker.isOut = false;  // ���ڿؼ���һ����
        MonthPicker.curMonth = obj.getAttribute("data-month");
        MonthPicker.curMonth = (MonthPicker.curMonth < 10) ? ('0' + MonthPicker.curMonth) : MonthPicker.curMonth;
        document.getElementById("monthPicker_month_center_text").innerText = MonthPicker.curMonth + "��";
        document.getElementById("monthPicker_month_select_div").style.display = "none";
        document.getElementById("monthPicker_menu_display_div").innerText = MonthPicker.curYear + "��" + MonthPicker.curMonth + "��";
    }

    MonthPicker.onMouseItemOver = function(obj) {
        obj.style.color = "#0000ff";
        obj.style.fontSize = "12pt";
        obj.style.opacity = "1.0";
        obj.style.filter = "alpha(opacity=100)";
    }

    MonthPicker.onMouseItemOut = function(obj) {
        obj.style.color = "#000000";
        obj.style.fontSize = "10pt";
        obj.style.opacity = "0.9";
        obj.style.filter = "alpha(opacity=90)";
    }
}


// ------------------------------< �Զ����¼� start >-------------------------------
function MonthPickerEvent(){
    this.handlers = {};  //��������������
}

MonthPickerEvent.prototype={
    constructor: MonthPickerEvent, // �ֶ�ָ��constructorΪMonthPickerEvent

    addHandler:function(type, handler){  // ���һ���¼�������
        if(typeof this.handlers[type] == "undefined"){
            this.handlers[type]=[];
        }
        this.handlers[type].push(handler);
    },
    fire:function(event){ // �����¼�
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
    removeHandler:function(type, handler){  // ɾ���¼�������
        if(this.handlers[type] instanceof Array){
            var handlers = this.handlers[type];
            for(var i = 0,len = handlers.length; i < len; i++){
                if(handlers[i]===handler){
                    break;
                }
            }
            handlers.splice(i,1); // ɾ��ָ����handler������
        }
    }
}
// ----------------------------< �Զ����¼� start >--------------------------------
