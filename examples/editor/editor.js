// const vmarkdown = require('./vmarkdown');
const vmarkdown = new VMarkDown({

});

vmarkdown.on('change', function (value) {
    localStorage.setItem("change", value);
});

vmarkdown.on('cursorChange', function (cursor) {
    localStorage.setItem("cursorChange", JSON.stringify(cursor));
});

vmarkdown.on('firstVisibleLineChange', function (firstVisibleLine) {
    localStorage.setItem("firstVisibleLineChange", firstVisibleLine);
});


const CodeMirrorEditor = require('../../src/index');

const editor = new CodeMirrorEditor(document.getElementById('editor'), {
    lineNumbers: true
});

editor.on('cursorChange', function (cursor) {
    console.log(cursor);
    vmarkdown.emit('cursorChange', cursor);
});

function onScroll() {
    const firstVisibleLine = editor.getFirstVisibleLine();
    vmarkdown.emit('firstVisibleLineChange', firstVisibleLine);
}

editor.on('scroll', _.throttle(onScroll, 300));

function onChange() {
    const value = editor.getValue();
    vmarkdown.setValue(value)
}

editor.on('change', _.debounce(onChange, 500));

const md = require('../md/demo.md');
editor.setValue(md);
