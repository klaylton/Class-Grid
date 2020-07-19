const canvas = new fabric.Canvas('c')

fabric.Clip = fabric.util.createClass(fabric.Group, {
    type: 'clip',

    initialize: function (items, options) {

        options = {};
        options.left = 100;
        options.top = 100;

        const defaults = {
            width: 200,
            height: 140,
            originX: 'center',
            originY: 'center'
        };

        const defaults1 = {
            width: 100,
            height: 120,
            originX: 'center',
            originY: 'top',
            top: -20,
            backgroundColor: 'red'
        }; 

        const defaults2 = {
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

        items.push(new fabric.IText('Add Photo', Object.assign(defaults2, {
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

const pi = new fabric.Clip([], {
    left: 20,
    top: 20,
    subTargetCheck: true,
    perPixelTargetFind: true,
    absolutePositioned: true,
});

canvas.add(pi)
pi.setTagName("Label clip");



const c1 = new fabric.Circle({
    radius: 80,
    left: 0,
    fill: '#a6ff00'
});

const c2 = new fabric.Circle({
    radius: 100,
    left: 50,
    fill: '#a68f00'
});


fabric.Image.fromURL('http://fabricjs.com/assets/pug.jpg', function (img) {
    img.clipPath = pi;
    img.scaleToWidth(200);
    canvas.add(img);
});
    

const rect = new fabric.Rect({
    width: 200,
    height: 250,
    left: 10,
    top: 10,
    fill: 'red'
});
const circle = new fabric.Circle({
    left: rect.left + rect.width/2,
    top: rect.top + rect.height/2,
    fill: 'yellow',
    radius: 15,
    originX: 'center',
    originY: 'center',
    hoverCursor: 'pointer',
});

const group1 = new fabric.Group([rect, circle], {
    left: 20,
    top: 20,
    subTargetCheck: true
});
canvas.add(group1);

group1.on('mousedown', onMouseDown);
pi.on('mousedown', onMouseDown);

function onMouseDown(option) {
    if(option.subTargets[0] && option.subTargets[0].type == 'textbox')
        console.log('Deu certo');
}


/********** */
const c11 = new fabric.Circle({
    radius: 100,
    left: 0,
    fill: '#a6ff00'
});

const c22 = new fabric.Circle({
    radius: 100,
    left: 50,
    fill: '#a6ff00'
});

const text = new fabric.Text("Very long text data displayed \n on hover", {
    width: '50', top: 100,
    fill: 'green',
    visible: false
});
const group2 = new fabric.Group([c11, c22, text], {
    left: 20,
    top: 20,
    subTargetCheck: true,
    perPixelTargetFind: true,
    absolutePositioned: true,
});
canvas.add(group2);

fabric.Image.fromURL('http://fabricjs.com/assets/pug.jpg', function (img) {
    img.clipPath = group2;
    img.scaleToWidth(500);
    canvas.add(img);
});

group2.on('mouseover', function (option) {
    canvas.on('mouse:move', onMouseMove)
});

group2.on('mouseout', function (option) {
    onMouseMove();
    canvas.off('mouse:move', onMouseMove)
});

function onMouseMove(option) {
    const textObj = group2.getObjects()[1];
    if (option && option.subTargets[0] && (option.subTargets[0].type == 'circle')) {
        if (textObj.visible) return;
        textObj.visible = true;
    } else {
        if (!textObj.visible) return;
        textObj.visible = false;
    }
    group2.dirty = true;
    canvas.requestRenderAll();
}


const CustomGroup = fabric.util.createClass(fabric.Group, {
    type: 'customGroup',

    initialize: function (objects, options) {
        options || (options = {});

        objects.push(new fabric.Circle({
            radius: 50,
            left: 50,
            fill: 'blue',
            angle: 45,
        }))

        const rect1 = new fabric.Rect({
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
    const rect = new fabric.Rect({
        left: 100,
        top: 100,
        fill: 'red',
        width: 20,
        angle: 45,
        height: 20
    });

    const rect1 = new fabric.Rect({
        left: 100,
        top: 150,
        fill: 'green',
        width: 40,
        height: 40
    });
    const rect2 = new fabric.Rect({
        left: 80,
        top: 70,
        fill: 'blue',
        width: 150,
        height: 50
    });

    const objs = [rect, rect1]
    const cgroup = new CustomGroup([], {
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
