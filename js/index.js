const canvas = new fabric.Canvas('c', {
    width: 500,
    height: 500,
    serializeBgOverlay: false,
    controlsAboveOverlay: true,
    selection: false,
    controlsAboveOverlay: true
})
 
const $ = document.querySelector.bind(document)

fabric.Object.prototype.set({
    transparentCorners: false,
    cornerColor: '#0000ff',
    cornerSize: 20,
    padding: 0
});

fabric.Image.fromURL('../img/mae.jpg', img =>{

    img.filters.push(
        new fabric.Image.filters.Sepia(),
        // new fabric.Image.filters.Brightness({
        //     brightness: 100
        // })
    );

    // img.applyFilters();
    canvas.add(img)
    canvas.renderAll()
})