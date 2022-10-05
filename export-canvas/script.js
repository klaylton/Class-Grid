let canvasCopy = null
const canvas = new fabric.Canvas('c', {
    width: 800, 
    height: 566,
    preserveObjectStacking: true,
})
fabric.Object.prototype.transparentCorners = false

const src = '../img/transparent-pattern.png';
// let newSrc = '../img/moldura-grande.png';
let photo = '../img/menina.jpg';
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
    // canvas.includeDefaultValues = false;
    document.querySelector('#json').innerHTML = JSON.stringify(canvas.toJSON(['label']));
})

document.querySelector('.cleanCanvas').addEventListener('click', function () {
    canvas.clear()
    canvas.renderAll()
})

document.querySelector('.loadCanvas').addEventListener('click', function () {
    canvasCopy = new fabric.Canvas('copy', {
        width: 800,
        height: 566
    })

    const json = document.querySelector('#json').innerHTML

    canvasCopy.loadFromJSON(json, canvasCopy.renderAll.bind(canvasCopy), function (o, object) {
        new Promise(resolve => {
            const image = new Image()
            image.onload = function (event) {
                resolve({
                    width: image.width,
                    height: image.height,
                    url: image.src
                })
            }
            image.src = frame.replace(/(.*)(\-\d+x\d+)(\.png)/, '$1$3')
        }).then(dataImg => {
                canvasCopy.forEachObject(function (obj) {
                    if (obj.isType('image') && obj.label === 'frame') {
                        console.log('moldura');
                        obj.setSrc(dataImg.url, function () {
                            canvasCopy.requestRenderAll();
                        }, { crossOrigin: 'annonymous' })

                        canvasCopy.setDimensions({ width: dataImg.width, height: dataImg.height}, {
                            backstoreOnly: true, cssOnly: true
                        });
                    } else {
                        const ratio = width / 800
                        obj.set({
                            top: obj.top * ratio,
                            left: obj.left * ratio
                        }).scale(ratio).setCoords()
                    }
                });
                console.log(canvasCopy.getObjects());
                canvasCopy.renderAll()

            })
    });
})

document.querySelector('.testCanvas').addEventListener('click', function () {
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
        console.log(data);

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

document.querySelector('#lnkDownload').addEventListener('click', function() {
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