const $ = document.querySelector.bind(document)
const canvas = new fabric.Canvas('c', {
    backgroundColor: 'green'
})
fabric.Object.prototype.set({
    transparentCorners: false,
    cornerColor: '#0000ff',
    cornerSize: 20,
    padding: 0
}); 

fabric.Image.fromURL('https://picsum.photos/1000/800', img =>{
    // canvas.setBackgroundImage(img);
    // canvas.requestRenderAll();
    // imagens()
})

function imagens(){
let oImg = null
fabric.Image.fromURL('../img/mascara.png', function (img) {
    oImg = img.set({
        left: 0,
        top: 0,
        objectCaching: false,
        absolutePositioned: true
    });

    fabric.Image.fromURL('../img/mae.jpg', function (img2) {
        const foto = img2.set({
            left: 0,
            top: 0,
            clipPath: oImg
        });

        canvas.add(foto)
        canvas.requestRenderAll()
        canvas.renderAll();
    });

    canvas.add(oImg)
    canvas.renderAll();
});
}

/**
 * Initial responsive code
 */

const imageObj = {width: 1000, height: 800}
const wrap = $('.container')

canvas.setDimensions({
    width: imageObj.width,
    height: imageObj.height
}, {
    backstoreOnly: true
});

function getRatio(container, image) {
    const { clientWidth, clientHeight } = container
    const scaleRatio = Math.min(clientWidth / image.width, clientHeight / image.height);
    return scaleRatio
}

function render_after_scale() {
    const { clientWidth, clientHeight } = $('.canvas-container')

    $('.lower-canvas').style.width = `${clientWidth}px`
    $('.lower-canvas').style.height = `${clientHeight}px`

    $('.upper-canvas').style.width = `${clientWidth}px`
    $('.upper-canvas').style.height = `${clientHeight}px`

    const cornerSize = 20
    const rotatingPointOffset = 30
    const new_size_corner = Math.round(cornerSize * canvas.width / clientWidth);
    const new_size_rotate = Math.round(rotatingPointOffset * canvas.width / clientHeight);

    fabric.Object.prototype.set({
        cornerSize: new_size_corner,
        rotatingPointOffset: new_size_rotate
    });
    
    canvas.renderAll()
} 

function resizeCanvas(ratio) {

    const newWidth = canvas.width * ratio
    const newHeight = canvas.height * ratio

    $('.canvas-container').style.width = `${newWidth}px`
    $('.canvas-container').style.height = `${newHeight}px`

    render_after_scale()
}

function responsiveCanvas(container, image) {
    const ratio = getRatio(container, image)
    console.log(ratio);
    resizeCanvas(ratio)
}


window.addEventListener('resize', e => {
    responsiveCanvas(wrap, imageObj)
})
window.addEventListener('load', e => {
    responsiveCanvas(wrap, imageObj)
})

$('#slide').addEventListener('input', function(event) {
    resizeCanvas(Number(this.value))
})

/**
 * estudar mask
 * @link https://stackoverflow.com/questions/55670558/fabric-js-image-blend-filter-and-change-image-src-issues
 * https://github.com/fabricjs/fabric.js/issues/5018
 * http://resources.aleph-1.com/mask/
 * http://jsfiddle.net/88LRm/45/
 */