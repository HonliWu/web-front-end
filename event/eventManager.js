
/* Ready对象专门管理document ready时回调的工作。有些插件必须在document ready的时候初始化，Vue.js的生命周期钩子mounted, this.nextTick(callback), 虽然dom已经渲染完成，但插件的初始化会失败 */

window.EventManager = {
    init: function () {
        window.EventManager.event = new MyEvent();
        window.EventManager.callbacks = {};
        window.EventManager.eventNames = [];
    },
    register: function(eventName, callback) {
        if (EventManager.callbacks[eventName] != null && EventManager.callbacks[eventName] != undefined) return false;

        EventManager.eventNames[EventManager.eventNames.length] = eventName;
        EventManager.callbacks[eventName] = callback;
        EventManager.event.addHandler(eventName, EventManager.callbacks[eventName]);

        return true;
    },
    unRegister: function(eventName) {
        for (var i =0; i < EventManager.eventNames.length; i++) {
            if (EventManager.eventNames[i] == eventName) {
                EventManager.eventNames.splice(i, 1);
                EventManager.event.removeHandler(eventName, EventManager.callbacks[eventName]);
                return true;
            }
        }
        return false;
    },
    fire: function(eventName, data) {
        EventManager.event.fire({type: eventName, message: data});
    },
    fireAll: function () {
        for (var i =0; i < EventManager.eventNames.length; i++) {
            EventManager.event.fire({type: EventManager.eventNames[i], message: EventManager.eventNames[i] + ' fire success'});
        }
    },
    clear: function () {
        for (var i =0; i < EventManager.eventNames.length; i++) {
            EventManager.event.removeHandler(EventManager.eventNames[i], EventManager.callbacks[EventManager.eventNames[i]]);
        }
        EventManager.eventNames.splice(0, EventManager.eventNames.length);
    }
}

window.EventManager.init();
