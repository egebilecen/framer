/*
* Note: This script is not clearing canvas automatically.
* If you want to clear, you should do it by yourself.
* */
var Framer = {
    settings : {
        ctx : null,
        fps : null
    },
    init   : function (ctx, fps) {
        if(typeof ctx === "undefined")
            throw new DOMException("Paramater 'ctx' is empty.");
        if(typeof fps !== "number")
            fps = 60;

        this.settings.ctx = ctx;
        this.settings.fps = fps;
    },
    create : function (key, obj) {
        //example obj:
        /*
            Framer.create("human",{
                name   : "right_side_movement",
                img    : <Image Object>,
                rows   : 3,
                cols   : 4,
                frame_width  : [0, 1, 2], //starts from 0
                frame_height : [3, 3, 3], //starts from 0
                loop       : true,
                auto_start : true
            });
        */
        if(!this.list.hasOwnProperty(key))
            this.list[key] = {};

        if(typeof obj.name === "undefined")
            throw new DOMException("Object's 'name' is undefined.");

        if(typeof obj.img === "undefined")
            throw new DOMException("Object's 'image' is undefined.");

        if(typeof obj.cols === "undefined")
            throw new DOMException("Object's 'cols' is undefined.");

        if(typeof obj.rows === "undefined")
            throw new DOMException("Object's 'rows' is undefined.");

        if(typeof obj.frames === "undefined")
            throw new DOMException("Object's 'frames' is undefined.");

        if(typeof obj.frames.width === "undefined")
            throw new DOMException("Object's 'frames.width' is undefined.");

        if(typeof obj.frames.height === "undefined")
            throw new DOMException("Object's 'frames.height' is undefined.");

        if(typeof obj.loop !== "boolean")
            obj.loop = false;

        if(typeof obj.auto_start !== "boolean")
            obj.auto_start = false;

        obj.frame_counters = {
            width  : 0,
            height : 0
        };

        obj.draw_position = {
            x : 0,
            y : 0
        };

        obj.increase_frame_counter = function (where) {
            if(!this.frame_counters.hasOwnProperty(where))
                throw new DOMException("Cannot find '"+where+"' in the 'frame_counters'");

            this.frame_counters[where]++;
            if(this.frame_counters[where] >= this.frames[where].length && this.loop === true)
                this.frame_counters[where] = 0;
        };
        obj.stop = function () {
          this.loop = false;
          this.frame_counters.width  = 0;
          this.frame_counters.height = 0;
        };

        this.list[key][obj.name] = obj;

        if(obj.auto_start)
            this.start_drawing(key, obj.name);
    },
    get_list : function(key){
        if(typeof key !== "string")
            return this.list;
        else
        {
            if(this.list.hasOwnProperty(key))
                return this.list[key];
            else
                return null;
        }
    },
    set_draw_positions : function (key, name, x, y) {
        if(typeof key === "undefined")
            throw new DOMException("Paramater 'key' is empty.");

        if(typeof name === "undefined")
            throw new DOMException("Paramater 'name' is empty.");

        key  = String(key);
        name = String(name);

        if(!this.list.hasOwnProperty(key))
            throw new DOMException("'"+key+"' not in the 'list'!");

        if(!this.list[key].hasOwnProperty(name))
            throw new DOMException("'"+key+"' has no child named '"+name+"'!");

        this.list[key][name].draw_position.x = x;
        this.list[key][name].draw_position.y = y;
    },
    start_drawing : function (key, name) {
        if(this.settings.ctx === null)
            throw new DOMException("'ctx' is null. Firstly initialize the object please.");

        if(typeof key === "undefined")
            throw new DOMException("Paramater 'key' is empty.");

        if(typeof name === "undefined")
            throw new DOMException("Paramater 'name' is empty.");

        key  = String(key);
        name = String(name);

        if(!this.list.hasOwnProperty(key))
            throw new DOMException("'"+key+"' not in the 'list'!");

        if(!this.list[key].hasOwnProperty(name))
            throw new DOMException("'"+key+"' has no child named '"+name+"'!");

        var obj   = this.list[key][name];
        var image = obj.img;
        var width_per_frame   = Math.floor(image.width / obj.cols);
        var height_per_frame  = Math.floor(image.height / obj.rows);

        var interval_id = Math.random();

        window[interval_id] = setInterval(function () {
            Framer.settings.ctx.drawImage(
                image,
                width_per_frame*obj.frames.width[obj.frame_counters.width],
                height_per_frame*obj.frames.height[obj.frame_counters.height],
                width_per_frame, height_per_frame,
                obj.draw_position.x,obj.draw_position.y,
                width_per_frame, height_per_frame
            );

            if(!obj.loop && obj.frame_counters.width === obj.frames.width.length &&
                obj.frame_counters.height === obj.frames.height.length)
            {
                obj.frame_counters.width  = 0;
                obj.frame_counters.height = 0;
                clearInterval(window[interval_id]);
            }

            obj.increase_frame_counter("width");
            obj.increase_frame_counter("height");

        }, 1000 / this.settings.fps + 250);
    },
    list : {}
};