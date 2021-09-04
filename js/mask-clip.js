const canvas = new fabric.Canvas('c', {
    width: 500,
    height: 500,
    serializeBgOverlay: false,
    controlsAboveOverlay: true,
    selection: false,
    controlsAboveOverlay: true,
    backgroundColor: '#ddd'
})

const $ = document.querySelector.bind(document)

fabric.Image.fromURL('../img/image.png', mask => {
    const obj = mask.set({
        objectCaching: false,
        absolutePositioned: true
    }).scale(0.6)
    fabric.Image.fromURL('../img/menina.jpg', img => {
        img.scale(0.4)
        img.clipPath = mask
        canvas.add(img)
        canvas.renderAll()
    })
})


