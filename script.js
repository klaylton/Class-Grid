const canvas = new fabric.Canvas('canvas', {
    width: 360,
    height: 360
})

const fill = ()=> `#${Math.random().toString(16).slice(2, 8)}`

fabric.Object.prototype.set({
    originX: 'center',
    originY: 'center',
    // stroke: '#00',
    // strokeWidth: 1
})

function formTiles(template_id) {
    const tiles = []
    const usedTiles = {};
    const tilesTotalHeight = rules[template_id].length;
    const tilesTotalWidth = rules[template_id][0].length;
    const tileHeight = Math.round(canvas.height / tilesTotalHeight);
    const tileWidth = Math.round(canvas.width / tilesTotalWidth);

    for (let i = 0; i < tilesTotalHeight; i++) {
        for (let j = 0; j < tilesTotalWidth; j++) {
            const tileIndex = rules[template_id][i][j];

            let h_factor = 1;
            let w_factor = 1;

            if (usedTiles[tileIndex] == true) {
                continue;
            }


            for (let k = i + 1; k < tilesTotalHeight; k++) {
                if (tileIndex == rules[template_id][k][j]) {
                    h_factor++;
                } else {
                    break;
                }
            }

            for (let k = j + 1; k < tilesTotalWidth; k++) {
                if (tileIndex == rules[template_id][i][k]) {
                    w_factor++;
                } else {
                    break;
                }
            }

            const tile = {
                name: tileIndex,
                width: tileWidth * w_factor,
                height: tileHeight * h_factor,
                left: tileWidth * j,
                top: tileHeight * i,
                fill: fill()
            };

            // save
            tiles.push(tile);

            usedTiles[tileIndex] = true;
        }
    }
    
    return tiles
}

function createSVG(tiles) {
    const rects = tiles.reduce((acc, {width, height, left, top}) => {
        acc += `<rect x="${left}" y="${top}" width="${width}" height="${height}" fill="currentColor" stroke="#fff" fill-opacity="0.25" stroke-opacity="1" />`
        return acc
    }, '')
    
    return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 360 360">${rects}</svg>`
}

function renderTemplate(tiles) {
    canvas.clear()
    tiles.forEach(({width, height, left, top, fill}) => {
        canvas.add(new fabric.Rect({
            width,
            height,
            left: left+width/2,
            top: top + height /2,
            fill
        }))
    })
    canvas.renderAll()
}

renderTemplate(formTiles(2))

const layoutsSvgs = Object.keys(rules).reduce((acc, id)=>{
    const tl = formTiles(id)
    const svg = createSVG(tl)
    acc += `<div class='layout' data-id='${id}'>${svg}</div>`
    return acc
}, '')


const $grids = document.querySelector('#grids')
$grids.innerHTML = layoutsSvgs

$grids.addEventListener('click', ({target}) => {
    if (target.classList.contains('layout')) {
        const id = target.dataset.id
        renderTemplate(formTiles(id))        
    }
})











