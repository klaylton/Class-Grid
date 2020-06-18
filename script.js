const canvas = new fabric.Canvas('canvas', {
    width: 400,
    height: 600
})

const fill = ()=> `#${Math.random().toString(16).slice(2, 8)}`

fabric.Object.prototype.set({
    originX: 'center',
    originY: 'center',
    stroke: '#00',
    strokeWidth: 1
})

function setGrid(largura, posX, altura, posY, fill) {
    const width = largura * canvas.width / 100
    const height = altura * canvas.height / 100
    const ww = posX * canvas.width / 100
    const hh = posY * canvas.height / 100
    const left = ww - width / 2
    const top = hh - height / 2

    return {width,height,top,left,fill}
}

const templates = [
    setGrid(60, 60, 50, 50, fill()),
    setGrid(40, 100, 50, 50, fill()),
    setGrid(40, 40, 50, 100, fill()),
    setGrid(60, 100, 50, 100, fill())
]

function renderTemplates(grids){
    grids.forEach(grid => canvas.add(new fabric.Rect({...grid})));
    canvas.renderAll()
}

renderTemplates(templates)


// console.log(Math.random().toString(16).slice(2, 8));

console.log('0.915edda328c5a'.slice(2,8));





