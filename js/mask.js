const $ = document.querySelector.bind(document)
const canvas = new fabric.Canvas('c')
fabric.Object.prototype.set({
    transparentCorners: false,
    cornerColor: '#0000ff',
    cornerSize: 20,
    padding: 0
});

fabric.Image.fromURL('../img/mascara.png', function (oImg) {
    const img = oImg.set({
        
    })
//multiply, add, diff, screen, subtract, darken, lighten, overlay, exclusion, tint
    var filter = new fabric.Image.filters.BlendImage({
        image: oImg,
        mode: 'mask',
        alpha: 1
    });

    fabric.Image.fromURL('../img/mae.jpg', function (zImg) {
        var image = zImg.set({ left: 0, top: 0}).scale(0.8);
        // image.filters.push(filter);
        // image.applyFilters();

        canvas.add(image);

    }, {
        crossOrigin: 'annonymous'
    });


}, {
    crossOrigin: 'annonymous'
});

fabric.Image.fromURL('../img/mae.jpg', function (zImg) {
    var image = zImg.set({ left: 0, top: 0}).scale(0.25);

    //canvas.add(image);
}, {
    crossOrigin: 'annonymous'
});





