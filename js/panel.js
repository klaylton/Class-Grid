const canvas = new fabric.Canvas('c', {
    width: 500,
    height: 500,
    serializeBgOverlay: false,
    controlsAboveOverlay: true,
    selection: false,
    controlsAboveOverlay: true
})

const $ = document.querySelector.bind(document)
const $inputFile = $('#uploadPhoto')

fabric.Object.prototype.set({
    transparentCorners: false,
    cornerColor: '#0000ff',
    cornerSize: 20,
    padding: 0
});

fabric.StaticCanvas.prototype._toObjectMethod = function (methodName, propertiesToInclude) {
    const data = {
        objects: this._toObjects(methodName, propertiesToInclude)
    };

    if (this.serializeBgOverlay) {
        fabric.util.object.extend(data, this.__serializeBgOverlay(methodName, propertiesToInclude));
    }
    fabric.util.populateWithProperties(this, data, propertiesToInclude);
    return data;
}

function addRect() {
    const rect = new fabric.Rect({
        width: 600,
        height: 515,
        top: 300,
        left: 553,
        fill: 'red',
        originX: 'center',
        originY: 'center',
        objectCaching: false,
        absolutePositioned: true
    })
    canvas.add(rect).renderAll()
    canvas.setActiveObject(rect)
    canvas.renderAll()
}

function exportToJson() {
    canvas.includeDefaultValues = false;
    $('#json').innerHTML = JSON.stringify(canvas.toJSON());
}

function getRatioContainerAndCanvas(img) {
    const scaleRatio = Math.min(600 / img.width, 600 / img.height);
    return scaleRatio
}

function addFrame(e) {
    const file = e.target.files[0];
    const reader = new FileReader();
    reader.onload = function (f) {
        const data = f.target.result;
        fabric.Image.fromURL(data, function (img) {

            const oImg = img.set({
                left: 0,
                top: 0
            });

            canvas.setOverlayImage(oImg);
            
            canvas.setDimensions({
                width: img.width,
                height: img.height
            },
            {
                backstoreOnly: true,
                // cssOnly: true
            }
            );

            const factor = getRatioContainerAndCanvas(canvas)
            const newWidth = 600
            const newHeight = newWidth * canvas.height / canvas.width

            $('.canvas-container').style.width = `${newWidth}px`
            $('.canvas-container').style.height = `${newHeight}px`

            $('.lower-canvas').style.width = `${newWidth}px`
            $('.lower-canvas').style.height = `${newHeight}px`

            $('.upper-canvas').style.width = `${newWidth}px`
            $('.upper-canvas').style.height = `${newHeight}px`

           /*  canvas.setDimensions({
                width: img.width * factor,
                height: img.height * factor
            }, {
                cssOnly: true
            }) */
            canvas.requestRenderAll()
            canvas.renderAll();
        });
    };
    reader.readAsDataURL(file);
}

function handleFrame(event) {
    $('#uploadFrame').click()
}

function clearCanvas() {
    canvas.clear()
}

function getRatio(clip, img) {
    const hRatio = clip.width / img.width;
    const vRatio = clip.height / img.height;
    return Math.max(hRatio, vRatio);
}

function addPhoto(e) {
    if ($inputFile.files && $inputFile.files[0]) {
        const file = e.target.files[0];
        const reader = new FileReader()
        reader.onload = function (f) {
            const data = f.target.result;
            const clip = canvas.activeClip
            fabric.Image.fromURL(data, function (img) {
                img.set({
                    left: clip.left,
                    top: clip.top,
                    angle: clip.angle,
                    originX: 'center',
                    originY: 'center',
                    clipPath: clip
                })
                const ratio = getRatio(clip, img)
                img.scale(ratio).setCoords()
                canvas.add(img)
                canvas.renderAll()
            }, {
                crossOrigin: 'anonymous'
            });
        }
        reader.readAsDataURL(file);
    }
    console.log(canvas.activeClip);
}

function activeClips() {
    canvas.forEachObject(function(obj) {
        if (obj.type == 'rect') {
            obj.selectable = false
            obj.label = 'clipPath',
            obj.fill = 'gray'
        }
    })
    canvas.discardActiveObject()
    canvas.renderAll()
}

function getRatioCanvas(canvas, size) {
    const scale = size / canvas.width
    return scale
}

function saveImage(e) {
    $('#lnkDownload').href = canvas.toDataURL({
        format: 'jpg',
        quality: 0.8,
        multiplier: getRatioCanvas(canvas, 500)
    });
    $('#lnkDownload').download = 'canvas.jpg'
}

function handlePhoto(event) {
    const obj = event.target
    if (obj && obj.label == 'clipPath') {
        canvas.activeClip = obj
        $inputFile.click()
    }
}

function scaleObject() {
    const obj = canvas.getActiveObject()
    obj.set({
        width: obj.width * obj.scaleX,
        height: obj.height * obj.scaleY,
        scaleX: 1,
        scaleY: 1
    }).setCoords()
}

canvas.on({
    'mouse:down': handlePhoto,
    'object:scaled': scaleObject
})

$('.add-rect').addEventListener('click', addRect)
$('.add-frame').addEventListener('click', handleFrame)
$('.export-json').addEventListener('click', exportToJson)
$('.active-clip').addEventListener('click', activeClips)
$('.clear-canvas').addEventListener('click', clearCanvas)
$('#uploadFrame').addEventListener("change", addFrame)
$inputFile.addEventListener("change", addPhoto)
$('#lnkDownload').addEventListener('click', saveImage);


