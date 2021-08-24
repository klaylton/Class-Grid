const canvas = new fabric.Canvas('c', {
    width: 500,
    height: 500,
    serializeBgOverlay: false,
    controlsAboveOverlay: true,
    selection: false
})

canvas.controlsAboveOverlay = true;

fabric.Object.prototype.set({
    transparentCorners: false,
    cornerColor: '#ff0000',
    cornerSize: 12,
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

const $ = document.querySelector.bind(document)
const $inputFile = $('#uploadPhoto')

function addRect() {
    const rect = new fabric.Rect({
        width: 100,
        height: 100,
        top: 100,
        left: 100,
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

function addFrame(e) {
    const file = e.target.files[0];
    const reader = new FileReader();
    reader.onload = function (f) {
        const data = f.target.result;
        fabric.Image.fromURL(data, function (img) {

            const oImg = img.set({
                left: 0,
                top: 0,
                angle: 0,
            });
            // canvas.setBackgroundImage(oImg).renderAll();
            canvas.setOverlayImage(oImg).renderAll();

            canvas.setDimensions({
                width: img.width,
                height: img.height
            });
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

function savePhoto() {
    
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
            obj.label = 'clipPath'
        }
    })
    canvas.discardActiveObject()
    canvas.renderAll()
}

canvas.on('mouse:down', function (event) {
    const obj = event.target
    if (obj && obj.label == 'clipPath') {
        canvas.activeClip = obj
        $inputFile.click()
    }
})

canvas.on('object:scaled', function () {
    const obj = canvas.getActiveObject()
    obj.set({
        width: obj.width * obj.scaleX,
        height: obj.height * obj.scaleY,
        scaleX: 1,
        scaleY: 1
    }).setCoords()
})


$('.add-rect').addEventListener('click', addRect)
$('.add-frame').addEventListener('click', handleFrame)
$('.export-json').addEventListener('click', exportToJson)
$('.active-clip').addEventListener('click', activeClips)
$('.clear-canvas').addEventListener('click', clearCanvas)
$('.save-photo').addEventListener('click', savePhoto)
$('#uploadFrame').addEventListener("change", addFrame)
$inputFile.addEventListener("change", addPhoto)

var imageSaver = document.getElementById('lnkDownload');
imageSaver.addEventListener('click', saveImage, false);

function saveImage(e) {
    this.href = canvas.toDataURL({
        format: 'jpg',
        quality: 0.8
    });
    this.download = 'canvas.jpg'
}
