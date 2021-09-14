const $ = document.querySelector.bind(document)
const canvas = new fabric.Canvas('c',{
    backgroundColor: '#00b140'
})

fabric.Object.prototype.set({
    transparentCorners: false,
    cornerColor: '#0000ff',
    cornerSize: 20,
    padding: 0
});

fabric.Image.filters.BlendMask = fabric.util.createClass(fabric.Image.filters.BaseFilter, {
    type: 'BlendMask',
    image: null,
    mode: 'multiply',
    alpha: 1,
    vertexSource: 'attribute vec2 aPosition;\n' +
        'varying vec2 vTexCoord;\n' +
        'varying vec2 vTexCoord2;\n' +
        'uniform mat3 uTransformMatrix;\n' +
        'void main() {\n' +
        'vTexCoord = aPosition;\n' +
        'vTexCoord2 = (uTransformMatrix * vec3(aPosition, 1.0)).xy;\n' +
        'gl_Position = vec4(aPosition * 2.0 - 1.0, 0.0, 1.0);\n' +
        '}',
    fragmentSource: {
        multiply: 'precision highp float;\n' +
            'uniform sampler2D uTexture;\n' +
            'uniform sampler2D uImage;\n' +
            'uniform vec4 uColor;\n' +
            'varying vec2 vTexCoord;\n' +
            'varying vec2 vTexCoord2;\n' +
            'void main() {\n' +
            'vec4 color = texture2D(uTexture, vTexCoord);\n' +
            'vec4 color2 = texture2D(uImage, vTexCoord2);\n' +
            'color.rgba *= color2.rgba;\n' +
            'gl_FragColor = color;\n' +
            '}',
        mask: 'precision highp float;\n' +
            'uniform sampler2D uTexture;\n' +
            'uniform sampler2D uImage;\n' +
            'uniform vec4 uColor;\n' +
            'varying vec2 vTexCoord;\n' +
            'varying vec2 vTexCoord2;\n' +
            'void main() {\n' +
            'vec4 color = texture2D(uTexture, vTexCoord);\n' +
            'vec4 color2 = texture2D(uImage, vTexCoord2);\n' +
            'float rgb = (color2.r + color2.b + color2.g) / 3.0;\n' +
            'color.a = rgb;\n' +
            'gl_FragColor = color;\n' +
            '}',
    },
    retrieveShader: function (options) {
        var cacheKey = this.type + '_' + this.mode;
        var shaderSource = this.fragmentSource[this.mode];
        if (!options.programCache.hasOwnProperty(cacheKey)) {
            options.programCache[cacheKey] = this.createProgram(options.context, shaderSource);
        }
        return options.programCache[cacheKey];
    },
    applyToWebGL: function (options) {
        var gl = options.context,
            texture = this.createTexture(options.filterBackend, this.image);
        this.bindAdditionalTexture(gl, texture, gl.TEXTURE1);
        this.callSuper('applyToWebGL', options);
        this.unbindAdditionalTexture(gl, gl.TEXTURE1);
    },
    createTexture: function (backend, image) {
        return backend.getCachedTexture(image.cacheKey, image._element);
    },
    calculateMatrix: function () {
        var image = this.image,
            width = image._element.width,
            height = image._element.height;
        return [
            1 / image.scaleX, 0, 0,
            0, 1 / image.scaleY, 0,
            -image.left / width, -image.top / height, 1
        ];
    },
    applyTo2d: function (options) {
        var imageData = options.imageData,
            resources = options.filterBackend.resources,
            data = imageData.data,
            iLen = data.length,
            width = imageData.width,
            height = imageData.height,
            tr, tg, tb, ta,
            r, g, b, a,
            canvas1, context, image = this.image,
            blendData;
        if (!resources.blendImage) {
            resources.blendImage = fabric.util.createCanvasElement();
        }
        canvas1 = resources.blendImage;
        context = canvas1.getContext('2d');
        if (canvas1.width !== width || canvas1.height !== height) {
            canvas1.width = width;
            canvas1.height = height;
        } else {
            context.clearRect(0, 0, width, height);
        }
        context.setTransform(image.scaleX, 0, 0, image.scaleY, image.left, image.top);
        context.drawImage(image._element, 0, 0, width, height);
        blendData = context.getImageData(0, 0, width, height).data;
        
        let i = 0
        while (i < iLen) {
            let rgb = blendData[i++] + blendData[i++] + blendData[i++];
            data[i++] = rgb / 3;
            // if(i<=100) console.log(i++)
        }
    },
    getUniformLocations: function (gl, program) {
        return {
            uTransformMatrix: gl.getUniformLocation(program, 'uTransformMatrix'),
            uImage: gl.getUniformLocation(program, 'uImage'),
        };
    },
    sendUniformData: function (gl, uniformLocations) {
        var matrix = this.calculateMatrix();
        gl.uniform1i(uniformLocations.uImage, 1); // texture unit 1.
        gl.uniformMatrix3fv(uniformLocations.uTransformMatrix, false, matrix);
    },

    toObject: function () {
        return {
            type: this.type,
            image: this.image && this.image.toObject(),
            mode: this.mode,
            alpha: this.alpha
        };
    }
});

fabric.Image.filters.BlendMask.fromObject = function (object, callback) {
    fabric.Image.fromObject(object.image, function (image) {
        var options = fabric.util.object.clone(object);
        options.image = image;
        callback(new fabric.Image.filters.BlendMask(options));
    });
};

function blend(foto){
    canvas.clear();
    fabric.Image.fromURL(`../img/mask-${foto}.jpg`, function (oImg) {

        //multiply, add, diff, screen, subtract, darken, lighten, overlay, exclusion, tint
        const filter = new fabric.Image.filters.BlendMask({
            image: oImg,
            mode: 'mask',
            alpha: 0.5
        });

        fabric.Image.fromURL(`../img/${foto}.jpg`, function (zImg) {
            const image = zImg.set({ left: 0, top: 0});
            
            canvas.setDimensions({
                width: zImg.width,
                height: zImg.height
            })

            
            image.filters.push(filter);
            image.applyFilters();
            
            bgImage(zImg)

        }, {
            crossOrigin: 'annonymous'
        });
    }, {
        crossOrigin: 'annonymous'
    });

}

function bgImage(img) {
    const { width, height } = img
    const url = `https://picsum.photos/${width}/${height}`
    $('#url-image').value = url
    fabric.Image.fromURL(url, function (zImg) {
        const image = zImg.set({ left: 0, top: 0});
        canvas.setBackgroundImage(image)
        canvas.add(img);
        canvas.renderAll()
    }, {
        crossOrigin: 'annonymous'
    });
}



function getRandomArbitrary(min, max) {
    return Math.floor(Math.random() * (max - min) + min);
}

function loadImag(event) {
    const url = $('#url-image').value
    fabric.Image.fromURL(url, function (zImg) {
        const image = zImg.set({
            left: 0,
            top: 0
        });
        canvas.setBackgroundImage(image)
        canvas.renderAll()
    }, {
        crossOrigin: 'annonymous'
    })
}

function exportToJson() {
    canvas.includeDefaultValues = false;
    $('#json').innerHTML = JSON.stringify(canvas.toJSON());
}

function loadJSON() {
    const json = $('#json').value
    canvas.clear();
    canvas.loadFromJSON(json, function () {
        canvas.renderAll();
    });
}

function saveImage(e) {
    const linkDownload = $('#linkDownload')
    linkDownload.href = canvas.toDataURL({
        format: 'jpg',
        quality: 0.8
    });

    const date = new Date().getMilliseconds()
    linkDownload.download = `foto_${date}.jpg`
}

window.addEventListener('load', () => blend('mae'))
$('.upload').addEventListener('click', loadImag)
$('.export').addEventListener('click', exportToJson)
$('.load-json').addEventListener('click', loadJSON)
$('.save').addEventListener('click', saveImage)
$('.reload').addEventListener('click', () => blend('mae'))




