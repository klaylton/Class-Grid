const canvas = new fabric.Canvas('c')
fabric.Object.prototype.transparentCorners = false

var LabeledRect = fabric.util.createClass(fabric.Rect, {

    type: 'labeledRect',

    initialize: function (options) {
        options || (options = {});

        this.callSuper('initialize', options);
        this.set('label', options.label || '');
    },

    toObject: function () {
        return fabric.util.object.extend(this.callSuper('toObject'), {
            label: this.get('label')
        });
    },

    _render: function (ctx) {
        this.callSuper('_render', ctx);

        ctx.font = '20px Helvetica';
        ctx.fillStyle = '#333';
        ctx.fillText(this.label, -this.width / 2, -this.height / 2 + 20);
    }
});
/** nova classe */
var labeledRect = new LabeledRect({
    width: 200,
    height: 250,
    left: 250,
    top: 10,
    label: 'Class de teste',
    fill: '#faa',
    absolutePositioned: true
});
// canvas.add(labeledRect);

const rect = new fabric.Rect({
    width: 200,
    height: 250,
    left: 10,
    top: 10,
    fill: 'red',
    // absolutePositioned: true
});
// canvas.add(rect)

const circle = new fabric.Circle({
    left: rect.left + rect.width / 2,
    top: rect.top + rect.height / 2,
    fill: 'yellow',
    radius: 15,
    originX: 'center',
    originY: 'center',
    hoverCursor: 'pointer',
});

const group1 = new fabric.Group([rect, circle], {
    left: 20,
    top: 20,
    absolutePositioned: true,
    subTargetCheck: true
});
// canvas.add(group1);

group1.on('mouse:down', function (e) {
// clicked item will be
  console.log(e.subTargets[0])  
});


fabric.Image.fromURL('http://fabricjs.com/assets/pug.jpg', function (img) {
    img.clipPath = labeledRect;
    img.scaleToWidth(200);
    canvas.add(img);
});

/*
group1.on('mousedown', onMouseDown);

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

/----------------------------------------------------
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

const text = new fabric.Text("Very long \n on hover", {
    width: '50',
    top: 100,
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

const rect = new fabric.Rect({
    width: 200,
    height: 250,
    left: 10,
    top: 10,
    fill: 'red',
    absolutePositioned: true
});
canvas.add(rect)
/*
------------------------------------------------
*/

fabric.Clip = fabric.util.createClass(fabric.Group, {
    type: 'clip',

    initialize: function (items, options) {

        options = {};
        options.left = 250;
        options.top = 10;

        this.add(new fabric.Rect({
            fill: '#77AAFF',
            width: 200,
            height: 140,
            originX: 'center',
            originY: 'center'
        }));

        this.add(new fabric.Textbox('PI tag name', {
            textAlign: 'center',
            fontSize: 14,
            width: 100,
            height: 120,
            originX: 'center',
            originY: 'top',
            top: -20,
            backgroundColor: 'red'
        }));

        this.add(new fabric.IText('Add Photo', {
            textAlign: 'center',
            fontSize: 16,
            width: 100,
            height: 120,
            originX: 'center',
            originY: 'top',
            top: 0
        }));

        this.callSuper('initialize', items, options);
        this.set('label', options.label || '');

        this.setTagName("Unix time");
    },

    toObject: function () {
        return fabric.util.object.extend(this.callSuper('toObject'), {
            label: this.get('label')
        });
    },

    getTagName: function () {
        return this._objects[1].text;
    },

    setTagName: function (value) {
        // this._objects[1].text = value;
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

        this.callSuper('_render', ctx);
        //ctx._objects[1].text = this._objects[1].text;
    }

});

const customClip = new fabric.Clip([], {
    left: 250,
    top: 200,
    width: 200,
    height: 200,
    absolutePositioned: true,
});

// canvas.add(customClip)

function onMouseDown(option) {
    if(option.subTargets[0] && option.subTargets[0].type == 'textbox')
        console.log('Deu certo');
}

/********** */


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


fabric.CustomGroup = fabric.util.createClass(fabric.Group, {
    type: 'customGroup',

    initialize: function (objects, options) {
        options || (options = {});

        const circle = new fabric.Circle({
            radius: 50,
            left: 50,
            fill: 'blue',
            angle: 45,
        })

        const rect1 = new fabric.Rect({
            left: 50,
            top: 160,
            fill: 'green',
            width: 60,
            height: 100
        });

        objects.push(rect1, circle)

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
    const cgroup = new fabric.CustomGroup(objs, {
        top: 50,
        left: 50,
        customAttribute: 'Hello World',
        absolutePositioned: true,
        subTargetCheck: true,
    });

    canvas.add(cgroup);

    // fabric.Image.fromURL('http://fabricjs.com/assets/pug.jpg', function (img) {
    //     img.clipPath = cgroup;
    //     img.scaleToWidth(200);
    //     canvas.add(img);
    // });

    cgroup.on('mousedown', onMouseDown);

    function onMouseDown(option) {
        console.log(option.subTargets[0].type);

        if (option.subTargets[0] && option.subTargets[0].type == 'textbox')
            console.log('Deu certo');
    }

};
// drawTestRect()
const src = './img/transparent-pattern.png';

canvas.setBackgroundColor({source: src, repeat: 'repeat'}, function () {
  canvas.renderAll();
});


fabric.util.loadImage(src, function (img) {
    shape.set('fill', new fabric.Pattern({
        source: img,
        repeat: 'repeat'
    }));
    canvas.renderAll();
});

const shape = new fabric.Rect({
    width: 200,
    height: 200,
    left: 100,
    top: 100,
});
canvas.add(shape);


