const canvas = new fabric.Canvas('c', {
    width: 800, 
    height: 566,
    preserveObjectStacking: true,
})
fabric.Object.prototype.transparentCorners = false

const src = '../img/transparent-pattern.png';
let newSrc = '../img/moldura-grande.png';
let photo = '../img/menina.jpg';
const frame = '../img/moldura-800x566.png'

const width = 800
const height = 566

const ratio = 1536 / 800


function loadElements(){
    return new Promise(resolve =>{
        resolve('ok')
    })
}

loadElements()
    .then(addFrame)
    .then(addClip)
    .then(addPhoto)
    .then(addRect)

function clickOn() {
    console.log('teste');
}

document.querySelector('.jsonExport').addEventListener('click', function () {
    canvas.includeDefaultValues = false;
    document.querySelector('#json').innerHTML = JSON.stringify(canvas.toJSON());
})

document.querySelector('.cleanCanvas').addEventListener('click', function () {
    canvas.clear()
    canvas.renderAll()
})

document.querySelector('.loadCanvas').addEventListener('click', function () {

    canvas.setDimensions({ width: 1536, height: 1086 },{
        backstoreOnly: true, cssOnly:false
    });
    const json = document.querySelector('#json').innerHTML

    canvas.loadFromJSON(json, canvas.renderAll.bind(canvas), function (o, object) {
        object.set({
            width: object.width * ratio,
            height: object.height * ratio,
            top: object.top * ratio,
            left: object.left * ratio
        })
        if (object.label == 'image') {
            object.setSrc(newSrc, canvas.renderAll.bind(canvas))
            console.log(object);
        }
        canvas.renderAll()
    });
})

document.querySelector('.testCanvas').addEventListener('click', function () {
    canvas.forEachObject(function (object) {
        object.set({
            width: object.width * ratio,
            height: object.height * ratio,
            top: object.top * ratio,
            left: object.left * ratio
        }).setCoords()

        if (object.isType('image') && object.hasOwnProperty('label')) {
            object.setSrc(newSrc, function () {
                canvas.requestRenderAll();
            }, { crossOrigin: 'annonymous' })
            canvas.setDimensions({ width: 1536, height: 1086 }, {
                backstoreOnly: true, cssOnly: false
            });
        }
    });
})
document.querySelector('#lnkDownload').addEventListener('click', function() {
    this.href = canvas.toDataURL({
        format: 'png',
        quality: 0.8
    });
    this.download = 'canvas.png'
})


function addFrame() {
    fabric.Image.fromURL(frame, function (img) {
        img.scaleToWidth(800);
        img.set({
            label: 'frame',
            top: 0,
            left: 0,
            evented: false,
            selectable: false,
            originX: 'left',
            originY: 'top',
        })
        canvas.add(img);
        canvas.sendToBack(img);
        canvas.renderAll()
    });
}

function addClip() {
    const clip = new fabric.Rect({
        left: 556.43,
        top: 287.98,
        fill: 'red',
        width: 421.6,
        height: 515.51,
        originY: 'center',
        originX: 'center',
        selectable: false,
        hoverCursor: 'default',
        objectCaching: false,
        absolutePositioned: true,
    });
    canvas.add(clip).renderAll()
    canvas.sendToBack(clip)
    clip.on({
        'mouseup': clickOn
    })
    return clip
}

function addPhoto(clip) {
    fabric.Image.fromURL(photo, function (img) {
        const rate = getRatio(clip, img)
        img.set({
            left: clip.left,
            top: clip.top,
            scaleX: rate,
            scaleY: rate,
            originY: 'center',
            originX: 'center',
            clipPath: clip
        });
        img.filters.push(new fabric.Image.filters.Grayscale());
        img.applyFilters();

        canvas.add(img)
        canvas.sendToBack(img)
        canvas.sendToBack(clip)
        canvas.renderAll()
    }, {
        crossOrigin: 'anonymous'
    })
}

function addRect() {
    const rect = new fabric.Rect({
        left: 200,
        top: 200,
        fill: 'red',
        width: 100,
        height: 100
    });
    canvas.add(rect).renderAll()
}

function getRatio(clip, img) {
    const hRatio = clip.width / img.width;
    const vRatio = clip.height / img.height;
    return Math.max(hRatio, vRatio);
}