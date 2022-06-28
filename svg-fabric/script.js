const $ = el => document.querySelector(el)

$('.slink').addEventListener('click', event => {
    $('#save-box').style.display = 'block'
})

const canvas = new fabric.Canvas('canvas', {
    width: 360,
    height: 360
})

let curr_template = 6
const $canvas_container = $('.canvas-container')
const canvas_container = $(".canvas_container")
const $canvas_container_wrapper = $('#canvas-container-wrapper')

const colorFill = () => `#${Math.random().toString(16).slice(2, 8)}`

// fabric.Object.prototype.set({
//     originX: 'center',
//     originY: 'center',
//     transparentCorners: false
// })

/**
 * 
 * @param {Number} template_id id do template que será usado.
 * @returns 
 */
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
                // originX: 'center',
                // originY: 'center',
                fill: colorFill()
            };

            // save
            tiles.push(tile);

            usedTiles[tileIndex] = true;
        }
    }
    
    return tiles
}

/**
 * Cria o código em SVG para ser apresentado no front-end
 * @param {Object} tiles será extraído as propriedades para criar o svg.
 * @returns um SVG.
 */
function createSVG(tiles) {
    const rects = tiles.reduce((acc, {width, height, left, top}) => {
        acc += `<rect x="${left}" y="${top}" width="${width}" height="${height}" fill="currentColor" stroke="#fff" fill-opacity="0.25" stroke-opacity="1" />`
        return acc
    }, '')
    
    return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 360 360">${rects}</svg>`
}

/**
 * Cria a grade no Canvas
 * @param {Object} tiles grade
 */
function renderTemplate(tiles) {
    // limpa a tela
    canvas.clear()

    // cria cada um dos clips
    tiles.forEach(({width, height, left, top, fill}) => {
        canvas.add(new fabric.Clip({
            width,
            height,
            left: left+width/2,
            top: top + height /2,
            originX: 'center',
            originY: 'center',
            fill,
            objectCaching: false,
        }))
    })
    canvas.renderAll()
}

/**
 * Gera um HTML com todos os SVGs. Responsável pela listagem de todos os modelos.
 * @param {Array} rules todos os tiles
 * @returns Node HTML contendo todos os SVG
 */
function renderAllLayoutsSVG(rules) {
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
    $grids.innerHTML = renderAllLayoutsSVG(rules)
    const $gridsLayouts = $grids.querySelectorAll('.grids__item')
    $grids.addEventListener('click', ({target}) => {
        if (target.classList.contains('grids__item')) {
            const id = Number(target.dataset.id)
            if (id == curr_template) return
            curr_template = id
                        
            renderTemplate(formTiles(curr_template))

            const $item_active = document.querySelector(".grids__item.active")
            if ($item_active) {
                $item_active.classList.remove('active')
            }
            target.classList.add('active')
            const coordsClips = getCoordsClip()
            coordsClips.forEach(renderIconAddImage)
        }
    })

    getCoordsClip()
})()

function getCoordsClip() {
    const clips = canvas.getObjects('clip')
    const coordsClips = clips.map(({width, height, top, left}) => {
        return { width, height, top, left }
    })

    return coordsClips
}

function renderIconAddImage(coords) {
    const icon = new fabric.Rect({
        width: 20, height: 20,
        top: coords.top,
        left: coords.left,
        fill: '#000'
    })

    canvas.add(icon)
}