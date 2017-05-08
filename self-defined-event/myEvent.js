window.MyEvent = function() {
    this.handlers = {};  //函数处理器数组
}

window.MyEvent.prototype={
    constructor: MyEvent, // 手动指定constructor为MyEvent

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

