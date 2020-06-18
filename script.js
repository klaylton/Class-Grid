const canvas = new fabric.Canvas('canvas', {
    width: 360,
    height: 360
})

let curr_template = 6

const fill = () => `#${Math.random().toString(16).slice(2, 8)}`

fabric.Object.prototype.set({
    originX: 'center',
    originY: 'center'
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

function renderAllLayousSVG(rules) {
    const layoutsSvgs = Object.keys(rules).reduce((acc, id) => {
        const tl = formTiles(id)
        const svg = createSVG(tl)
        acc += `<div class='grids__item' data-id='${id}'>${svg}</div>`
        return acc
    }, '')

    return layoutsSvgs
}


(function() {
    renderTemplate(formTiles(curr_template))
    
    const $grids = document.querySelector('#grids')
    $grids.innerHTML = renderAllLayousSVG(rules)
    $gridsLayouts = $grids.querySelectorAll('.grids__item')
    $grids.addEventListener('click', ({target}) => {
        if (target.classList.contains('grids__item')) {
            const id = Number(target.dataset.id)
            if (id == curr_template) return
            curr_template = id
                        
            renderTemplate(formTiles(curr_template))

            $gridsLayouts.forEach(item => item.classList.remove('active'))
            target.classList.add('active')
        }
    })
})()











