// const vmarkdown = require('./vmarkdown');
// const VMarkDown = require('vmarkdown');
//
// const vmarkdown = new VMarkDown({
//     pluginManager: {
//         load: function (plugins) {
//
//         }
//     }
// });

// vmarkdown.on('change', function (value) {
//     localStorage.setItem("change", value);
// });
//
// vmarkdown.on('cursorChange', function (cursor) {
//     localStorage.setItem("cursorChange", JSON.stringify(cursor));
// });
//
// vmarkdown.on('firstVisibleLineChange', function (firstVisibleLine) {
//     localStorage.setItem("firstVisibleLineChange", firstVisibleLine);
// });


const CodeMirrorEditor = require('../../src/index');

const editor = new CodeMirrorEditor(document.getElementById('editor'), {
    lineNumbers: true
});

editor.on('cursorChange', function (cursor) {
    console.log(cursor);
    // vmarkdown.emit('cursorChange', cursor);

    localStorage.setItem("cursorChange", JSON.stringify(cursor));
});

function onScroll() {
    const firstVisibleLine = editor.getFirstVisibleLine();

    console.log('firstVisibleLine', firstVisibleLine);

    localStorage.setItem("firstVisibleLineChange", firstVisibleLine);

    // (function () {
    //
    //     const node = vmarkdown.findNode({
    //         line: firstVisibleLine,
    //         column: 1
    //     });
    //
    //     console.log( node ) ;
    //
    //     if(node) {
    //         console.log( editor.getFirstVisibleCoverageRatio(firstVisibleLine, node.position) ) ;
    //     }
    //
    //
    // })();


    // var lineIndex = firstVisibleLine-1;
    //
    // // console.log('getLineHandle', editor.editor.getLineHandle(lineIndex));
    // // console.log('heightAtLine', editor.editor.heightAtLine(lineIndex));
    //
    // var heightAtLine = editor.editor.heightAtLine(lineIndex);
    // var lineHandle = editor.editor.getLineHandle(lineIndex);
    // var height = lineHandle.height;
    //
    // console.log('getLineHandle', heightAtLine);
    // console.log('height', height);
    //
    // var p = (heightAtLine/height);
    //
    // // debugger
    // console.log('p', p);


    // vmarkdown.emit('firstVisibleLineChange', firstVisibleLine);
}

editor.on('scroll', _.throttle(onScroll, 300));

function onChange() {
    const value = editor.getValue();
    // vmarkdown.setValue(value)
    localStorage.setItem("change", value);
}

editor.on('change', _.debounce(onChange, 500));

const md = require('../md/demo.md');
editor.setValue(md);
