const canvas = new fabric.Canvas('c')
fabric.Object.prototype.transparentCorners = false

const inputFile = document.querySelector('#upload')

const rect = new fabric.Rect({
    width: 200,
    height: 250,
    left: 10,
    top: 10,
    fill: 'red',
    hoverCursor: 'default'
});

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
    subTargetCheck: true,
    selectable: false,
    label: 'clip'
});
// canvas.add(group1);
// canvas.renderAll()

group1.on('mousedown_', function (e) {
    // clicked item will be
    console.log('=>',e.subTargets[0])
});

group1.on({
    'mousedown': onMouseDown,
    // 'mouseover': handleMouseover

});

function onMouseDown(option) {
    console.log(option.subTargets[0].type);

    if (option.subTargets[0] && option.subTargets[0].type == 'circle')
        console.log(option.target);
        inputFile.click()
}

function handleMouseover(option) {
    console.log(option);
    if (option.subTargets[0] && option.subTargets[0].type == 'circle') {
        // console.log(option.target);
        console.log('Cursor');
    }
}

/* =========================================*/
fabric.Tag = fabric.util.createClass(fabric.Group, {
    type: 'PItag',

    initialize: function () {

        options = {};
        options.left = 100;
        options.top = 100;

        const defaults = {
            width: 200,
            height: 300,
            originX: 'center',
            originY: 'center'
        };

        const defaults1 = {
            width: 100,
            height: 20,
            originX: 'center',
            originY: 'top',
            top: -20,
            backgroundColor: 'red'
        };

        const defaults2 = {
            width: 100,
            height: 20,
            originX: 'center',
            originY: 'top',
            top: 0
        };

        const items = [];

        items[0] = new fabric.Rect(Object.assign({}, defaults, {
            fill: '#77AAFF',
        }));

        items[1] = new fabric.Textbox('PI tag name', Object.assign({}, defaults1, {
            textAlign: 'center',
            fontSize: 14
        }));

        items[2] = new fabric.IText('####', Object.assign({}, defaults2, {
            textAlign: 'center',
            fontSize: 16
        }));

        this.callSuper('initialize', items, options);

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
        this.callSuper('_render', ctx);
        ctx._objects[1].text = this._objects[1].text;
    }

});

const pi = new fabric.Tag();
pi.setTagName("Unix time");

canvas.add(pi);
setInterval(function () {
    pi.setValue(Math.floor((new Date()).getTime() / 1000).toString());
    canvas.renderAll();
}, 1000);

/******************************************************************** */

















/** ================================
 * UPLOAD
=================================== */

inputFile.addEventListener("change", carregarFoto)

function carregarFoto(e) {
    if (inputFile.files && inputFile.files[0]) {
        const file = e.target.files[0];
        const reader = new FileReader()
        reader.onload = function (f) {
            const data = f.target.result;
            add(data, group1)
        }
        reader.readAsDataURL(file);
    }
}


function add(image, clip) {
    fabric.Image.fromURL(image, function (img) {
        const ratio = getRatio(clip, img)
        img.set({
            clipPath: clip,
            top: clip.top,
            left: clip.left,
            scaleX: ratio,
            scaleY: ratio
        }).setCoords()
        canvas.add(img)
        canvas.renderAll()
    }, {
        crossOrigin: 'anonymous'
    });
}

function getRatio(clip, img) {
    const hRatio = clip.width / img.width;
    const vRatio = clip.height / img.height;
    return Math.max(hRatio, vRatio);
}
