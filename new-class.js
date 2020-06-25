var canvas = new fabric.Canvas('c');

fabric.Clip = fabric.util.createClass(fabric.Group, {
    type: 'clip',

    initialize: function (items, options) {

        options = {};
        options.left = 100;
        options.top = 100;

        var defaults = {
            width: 200,
            height: 140,
            originX: 'center',
            originY: 'center'
        };

        var defaults1 = {
            width: 100,
            height: 120,
            originX: 'center',
            originY: 'top',
            top: -20,
            backgroundColor: 'red'
        }; 

        var defaults2 = {
            width: 100,
            height: 120,
            originX: 'center',
            originY: 'top',
            top: 0
        };

        items.push(new fabric.Rect(Object.assign(defaults, {
            fill: '#77AAFF',
        })));

        items.push(new fabric.Textbox('PI tag name', Object.assign(defaults1, {
            textAlign: 'center',
            fontSize: 14
        })));

        items.push(new fabric.IText('####', Object.assign(defaults2, {
            textAlign: 'center',
            fontSize: 16
        })));

        this.callSuper('initialize', items, options);

        this.setTagName("Unix time");
        

    },

    getTagName: function () {
        return this._objects[1].text;
    },

    setTagName: function (value) {
        this._objects[1].text = value;
    },

    getValue: function () {
        return this._objects[2].text;
    },

    setValue: function (value) {
        this._objects[2].set({
            text: value
        });
        this.canvas.renderAll();
    },

    _render: function (ctx, noTransform) {

        console.log('xs')
        this.callSuper('_render', ctx);
        //ctx._objects[1].text = this._objects[1].text;

    }

});

var c1 = new fabric.Circle({
    radius: 80,
    left: 0,
    fill: '#a6ff00'
});
var c2 = new fabric.Circle({
    radius: 100,
    left: 50,
    fill: '#a68f00'
});
var pi = new fabric.Clip([c1, c2], {
    // left: 20,
    // top: 20,
    // subTargetCheck: true,
    // perPixelTargetFind: true,
    absolutePositioned: true,
});

// canvas.pi.async = true;
// pi.setTagName("Unix time");


canvas.add(c1, c2);

// if (canvas.getObjects().contains(c1)) {
//     console.log('oi');  
// }


// setInterval(function () {
    //     pi.setValue(Math.floor((new Date()).getTime() / 1000).toString());
    //     canvas.renderAll();
    // }, 1000);
    
    fabric.Image.fromURL('http://fabricjs.com/assets/pug.jpg', function (img) {
        img.clipPath = pi;
        img.scaleToWidth(200);
        // canvas.add(img);
    });
    

/*
var rect = new fabric.Rect({
    width: 200,
    height: 250,
    left: 10,
    top: 10,
    fill: 'red'
});
var circle = new fabric.Circle({
    left: rect.left + rect.width/2,
    top: rect.top + rect.height/2,
    fill: 'yellow',
    radius: 15,
    originX: 'center',
    originY: 'center',
    hoverCursor: 'pointer',
});
var group = new fabric.Group([rect, circle], {
    left: 20,
    top: 20,
    subTargetCheck: true
});
//canvas.add(group);
group.on('mousedown', onMouseDown);
pi.on('mousedown', onMouseDown);

function onMouseDown(option) {
    console.log(option.subTargets[0].type);

    if(option.subTargets[0] && option.subTargets[0].type == 'textbox')
        console.log('Deu certo');
        
}
*/

/********** *
var c1 = new fabric.Circle({
    radius: 100,
    left: 0,
    fill: '#a6ff00'
});

var c2 = new fabric.Circle({
    radius: 100,
    left: 50,
    fill: '#a6ff00'
});

var text = new fabric.Text("Very long text data displayed \n on hover", {
    width: '50px',
    fill: 'green',
    visible: false
});
var group = new fabric.Group([c1, c2, text], {
    left: 20,
    top: 20,
    subTargetCheck: true,
    perPixelTargetFind: true,
    absolutePositioned: true,
});
canvas.add(group);

fabric.Image.fromURL('http://fabricjs.com/assets/pug.jpg', function (img) {
    img.clipPath = group;
    img.scaleToWidth(500);
    canvas.add(img);
});

group.on('mouseover', function (option) {
    canvas.on('mouse:move', onMouseMove)
});

group.on('mouseout', function (option) {
    onMouseMove();
    canvas.off('mouse:move', onMouseMove)
});

function onMouseMove(option) {
    var textObj = group.getObjects()[1];
    if (option && option.subTargets[0] && (option.subTargets[0].type == 'circle')) {
        if (textObj.visible) return;
        textObj.visible = true;
    } else {
        if (!textObj.visible) return;
        textObj.visible = false;
    }
    group.dirty = true;
    canvas.requestRenderAll();
}


*/

var CustomGroup = fabric.util.createClass(fabric.Group, {
    type: 'customGroup',

    initialize: function (objects, options) {
        options || (options = {});

        objects.push(new fabric.Circle({
            radius: 50,
            left: 50,
            fill: '#a6ff00',
            angle: 45,
        }))

        var rect1 = new fabric.Rect({
            left: 50,
            top: 160,
            fill: 'green',
            width: 60,
            height: 100
        });

        objects.push(rect1)

        this.callSuper('initialize', objects, options);
        this.set('customAttribute', options.customAttribute || 'undefinedCustomAttribute');
    },

    toObject: function () {
        return fabric.util.object.extend(this.callSuper('toObject'), {
            customAttribute: this.get('customAttribute')
        });
    },

    _render: function (ctx) {
        this.callSuper('_render', ctx);
    }
});

function drawTestRect() {
    // create a rectangle object
    var rect = new fabric.Rect({
        left: 100,
        top: 100,
        fill: 'red',
        width: 20,
        angle: 45,
        height: 20
    });

    var rect1 = new fabric.Rect({
        left: 100,
        top: 150,
        fill: 'green',
        width: 40,
        height: 40
    });
    var rect2 = new fabric.Rect({
        left: 80,
        top: 70,
        fill: 'blue',
        width: 150,
        height: 50
    });

    const objs = [rect, rect1]
    var cgroup = new CustomGroup([], {
        top: 50,
        left: 50,
        customAttribute: 'Hello World',
        absolutePositioned: true,
        subTargetCheck: true,
    });

    cgroup.add(rect2)

    canvas.add(cgroup);

    fabric.Image.fromURL('http://fabricjs.com/assets/pug.jpg', function (img) {
        img.clipPath = cgroup;
        img.scaleToWidth(200);
        canvas.add(img);
    });

    cgroup.on('mousedown', onMouseDown);

    function onMouseDown(option) {
        console.log(option.subTargets[0].type);

        if (option.subTargets[0] && option.subTargets[0].type == 'textbox')
            console.log('Deu certo');

    }

};

// drawTestRect()
