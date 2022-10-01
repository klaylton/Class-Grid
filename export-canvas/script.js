const canvas = new fabric.Canvas('c', {
    width: 800, 
    height: 566
})
fabric.Object.prototype.transparentCorners = false

const src = '../img/transparent-pattern.png';
let newSrc = '../img/moldura.png';
// newSrc = '../img/fundo-2.jpg';
const frame = '../img/moldura-800x566.png'

const width = 800
const height = 566

const ratio = 1536 / 800

fabric.Image.fromURL(frame, function (img) {
    img.set({
        label: 'frame',
        top: 0,
        left: 0,
        evented: false,
        selectable: false,
        width: 800,
        height: 566,
        originX: 'left',
        originY: 'top',
    });
    // canvas.add(img)
    // canvas.renderAll()
    //carrega uma cópia inicial da canvas para o state property.
    canvas.state = canvas.toJSON()
}, {
    crossOrigin: 'anonymous'
})

fabric.Image.fromURL(frame, function (img) {
    img.scaleToWidth(800);
    canvas.add(img);
    canvas.sendToBack(img);
});

const rect = new fabric.Rect({
    left: 100,
    top: 100,
    fill: 'red',
    width: 100,
    angle: 45,
    height: 100
});
canvas.add(rect).renderAll()


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
        // backstoreOnly: true, cssOnly:false
    });
    const json = document.querySelector('#json').innerHTML

    canvas.loadFromJSON(json, canvas.renderAll.bind(canvas), function (o, object) {
        object.set({
            width: object.width * ratio,
            height: object.height * ratio,
            top: object.top * ratio,
            left: object.left * ratio
        })
        if (object.type == 'image') {
            object.setSrc(newSrc, canvas.renderAll.bind(canvas))
            console.log(object);
        }
        canvas.renderAll()
    });
})

document.querySelector('.testCanvas').addEventListener('click', function () {
    console.log(canvas.getObjects()[0].getSrc());
})