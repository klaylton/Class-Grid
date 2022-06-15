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

fabric.Object.prototype.set({
    originX: 'center',
    originY: 'center',
    transparentCorners: false
})

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


function canvasPos() {
    const max_height = Math.max(window.innerHeight - 100 - 80, 100);
    const max_height2 = window.innerHeight - 100 - 80;

    // $('#canvas-container').css({'max-height': max_height});
    $canvas_container_wrapper.style.maxHeight = `${max_height2}px`
    $canvas_container_wrapper.style.height = `${max_height}px`

    let new_width = $canvas_container_wrapper.clientWidth;
    let new_height = Math.round(new_width * canvas.height / canvas.width);

    if (new_width > canvas.width) {
        new_width = canvas.width;
        new_height = canvas.height;
    }

    if (new_height > max_height) {
        new_height = max_height;
        new_width = Math.round(new_height * canvas.width / canvas.height);
    }

    canvas_container.style.width = `${new_width}px`
    canvas_container.style.height = `${new_height}px`

    canvas.setDimensions({
        width: `${new_width}px`,
        height: `${new_height}px`
    }, {
        cssOnly: true
    })

    $canvas_container.style.marginLeft = 'auto'
    $canvas_container.style.marginTop = 0

    canvas.requestRenderAll()

};


window.addEventListener('resize', function (event) {
    canvasPos()
});


(function() {
    canvasPos()
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


    const btnDelete = new fabric.DeleteControl({
        width: 50, height: 50, top: 100, left: 200, fill: 'red'
    })
    // canvas.add(btnDelete)
/*
    canvas.on('mouse:over', function (e) {
        if (e.target.type === 'DeleteControl') {
            e.target.hide()
            canvas.renderAll();
        }
    })
    canvas.on('mouse:out', function (e) {
        if (e.target.type === 'DeleteControl') {
            e.target.show()
            canvas.renderAll();
        }
    })
*/

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