let canvasCopy = null
let json = null

const $ = document.querySelector.bind(document)
const canvas = new fabric.Canvas('c', {
    width: 200, 
    height: 166,
    preserveObjectStacking: true,
})
fabric.Object.prototype.transparentCorners = false

canvas.setDimensions({
    width: 800,
    height: 566
})

const src = '../img/transparent-pattern.png';
const photo = '../img/menina.jpg';
const frame = '../img/moldura-jesus-te-ama-800x566.png'

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
    json = JSON.stringify(canvas.toJSON(['label']));
    document.querySelector('#json').innerHTML = json
})

document.querySelector('.cleanCanvas').addEventListener('click', function () {
    canvas.clear()
    canvas.renderAll()
})

$('.loadCanvas').addEventListener('click', function () {
    canvas.includeDefaultValues = false;
    json = JSON.stringify(canvas.toJSON(['label']));
    new Promise(resolve => {
        const image = new Image()
        image.onload = function () {
            resolve({
                width: image.width,
                height: image.height,
                url: image.src
            })
        }
        image.src = frame.replace(/(.*)(\-\d+x\d+)(\.png)/, '$1$3')
    })
    .then(dataImg => {
        canvasCopy = new fabric.Canvas('copy', {
            width: dataImg.width,
            height: dataImg.height,
            backgroundColor: '#eee',
            preserveObjectStacking: true
        })

        return dataImg
    })
    .then(dataImg => {
        const ratio = dataImg.width / 800
        canvasCopy.loadFromJSON(json, canvasCopy.renderAll.bind(canvasCopy), function (o, object) {
            if (object.hasOwnProperty('label') && object.label === 'frame') {
                object.setSrc(dataImg.url, function () {
                    canvasCopy.requestRenderAll();
                }, { crossOrigin: 'annonymous' })
            } else {
                if (object.clipPath) {
                    object.clipPath.top = object.clipPath.top * ratio
                    object.clipPath.left = object.clipPath.left * ratio
                    object.clipPath.width = object.clipPath.width * ratio
                    object.clipPath.height = object.clipPath.height * ratio

                    const new_ratio = ratio * object.scaleX
                    object.set({
                        top: object.top * ratio,
                        left: object.left * ratio
                    }).scale(new_ratio).setCoords()
                } else {
                    object.set({
                        top: object.top * ratio,
                        left: object.left * ratio
                    }).scale(ratio).setCoords()
                }
            }
        })
        canvasCopy.renderAll()
        return new Promise(resolve => {
            setTimeout(() => {
                resolve('ok')
            }, 100);
        })
    })
    .then( dataImg =>{
        $('#lnkDownload').href = canvasCopy.toDataURL({
            format: 'png',
            quality: 0.8
        });
        $('#lnkDownload').download = 'canvas.png'
        $('#lnkDownload').click()
    })
})

$('.testCanvas').addEventListener('click', function () {
    new Promise(resolve =>{
        const image = new Image()
        image.onload = function(event) {
            resolve({
                width: image.width,
                height: image.height,
                url: image.src
            })
        }
        image.src = frame.replace(/(.*)(\-\d+x\d+)(\.png)/, '$1$3')
    })
    .then(data =>{

        canvas.forEachObject(function (object) {
            if (object.isType('image') && object.hasOwnProperty('label')) {
                const reg = /(.*)(\-\d+x\d+)(\.png)/
                const url = object.getSrc()
                const newSrc = url.replace(reg, '$1$3')
                
                object.setSrc(newSrc, function () {
                    canvas.requestRenderAll();
                }, { crossOrigin: 'annonymous' })

                canvas.setDimensions({ width: 1536, height: 1086 }, {
                    backstoreOnly: true, cssOnly: false
                });
            } else {
                const ratio = 1536 / 800
                object.set({
                    top: object.top * ratio,
                    left: object.left * ratio
                }).scale(ratio).setCoords()
            }

            
        });

    })
})

$('#lnkDownload').addEventListener('click', function() {
    this.href = canvasCopy.toDataURL({
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
        label: 'clip',
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
        console.log(rate);
        img.set({
            left: clip.left,
            top: clip.top,
            scaleX: rate,
            scaleY: rate,
            originY: 'center',
            originX: 'center',
            clipPath: clip,
            label: 'photo'
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
        label: 'rect',
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