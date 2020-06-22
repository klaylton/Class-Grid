/**
 * função para navegar nas abas do Toolbar
 */

const $get = el => document.querySelector(el)
let isOpenToolbar = false;

function closeOrOpenToolbar(e) {
    $get('#collage-toolbar').classList.toggle('active');
    e.target.classList.toggle('closed');
    isOpenToolbar = !isOpenToolbar;
}

function closeOrOpenTabs(e) {
    const valueFor = e.target.getAttribute("for")
    if (!valueFor) return
    const isChecked = $get(`input[id='${valueFor}']`).checked

    if (isChecked && isOpenToolbar) {
        $get('#collage-toolbar').classList.remove('active');
        $get('#close-toolbar').classList.add('closed');
        isOpenToolbar = false;
    } else {
        $get('#collage-toolbar').classList.add('active');
        $get('#close-toolbar').classList.remove('closed');
        // real click event gets lost, so simulate it
        $get(`input[id='${valueFor}']`).setAttribute('checked', true)
        isOpenToolbar = true;
    }
    return true;
}

$get("#close-toolbar").addEventListener('click', closeOrOpenToolbar)
$get(".toolbar-button").addEventListener('mousedown', closeOrOpenTabs)