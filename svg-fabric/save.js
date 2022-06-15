const save = {
    $modal: null,
    quality: {
        $slider: null,
        $value: null,
        value_def: 95
    },
    quality_value: null,
    $file_name: null,
    $save: null,
    $file_lnk: null,

    init: function () {
        
        if (save.$modal != null) {
            console.log('não iniciou');
            
            return;
        }

        save.$modal = $('#pop-save');

        save.$file_name = save.$modal.querySelector('input[name=filename]');
        save.quality.$slider = $('#slider-size');
        save.quality.$value = $('#slider-size-value');
        save.$save = save.$modal.querySelector('.link-savefile');
        
        // save.reset_params();

        save.quality.$slider.addEventListener("input", function (e) {
            save.quality_value = Number(e.target.value);
        });

        save.$save.addEventListener('click', function () {
            save.exec();
        });
    },

    reset_params: function () {
        save.quality_value = save.quality.value_def;
        save.quality.$slider.slider('value', save.quality.value_def);
        save.quality.$value.val(save.quality.value_def);
    },

    exec: function () {
        const exportCanvas = document.createElement('canvas');
        exportCanvas.width = canvas.width;
        exportCanvas.height = canvas.height;
        const exportContext = exportCanvas.getContext('2d');
        // const newCanvas = document.querySelector('.lower-canvas')
        exportContext.drawImage(canvas.getElement(), 0, 0);

        // editor.fabricjs.deactivateAll();
        const canvas_over = document.querySelector('.lower-canvas');
        exportContext.globalCompositeOperation = 'source-atop';
        exportContext.drawImage(canvas_over, 0, 0, canvas_over.width, canvas_over.height, 0, 0, canvas.width, canvas.height);

        if (save.$modal.querySelector('input[name=fileext]:checked').value == 'png') {
            save.$save.setAttribute('download', save.$file_name.value + '.png');
            mime = 'image/png';
        } else {
            save.$save.setAttribute('download', save.$file_name.value + '.jpg');
            mime = 'image/jpeg';
        }

        var dt = exportCanvas.toDataURL(mime, save.quality_value / 10000 * 95);
        if (isChrome() || isFirefox() || isSafari()) {
            var blob = save.b64toBlob(dt, mime);
            var blobUrl = URL.createObjectURL(blob);
            save.$save.setAttribute('href', blobUrl);
        } else {
            save.$save.setAttribute('href', dt);
        }

    },

    b64toBlob: function (b64Data, contentType, sliceSize) {
        contentType = contentType || '';
        sliceSize = sliceSize || 512;

        var byteCharacters = atob(b64Data.replace(/^data:image\/(png|jpeg);base64,/, ''));
        var byteArrays = [];

        for (let offset = 0; offset < byteCharacters.length; offset += sliceSize) {
            var slice = byteCharacters.slice(offset, offset + sliceSize);

            var byteNumbers = new Array(slice.length);
            for (let i = 0; i < slice.length; i++) {
                byteNumbers[i] = slice.charCodeAt(i);
            }

            var byteArray = new Uint8Array(byteNumbers);

            byteArrays.push(byteArray);
        }

        var blob = new Blob(byteArrays, {
            type: contentType
        });
        return blob;
    }
}

save.init()



function isFirefox() {
    return navigator.userAgent.toLowerCase().indexOf('firefox') > -1;
}

function isIE11() {
    return !!window.MSInputMethodContext && !!document.documentMode;
}

function isChrome() {
    return /Chrome/.test(navigator.userAgent) && /Google Inc/.test(navigator.vendor);
}

function isSafari() {
    return !!navigator.userAgent.match(/Version\/[\d\.]+.*Safari/);
}