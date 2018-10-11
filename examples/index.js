import CodeMirrorEditor from '../src/index';
import unified from 'unified';
import parse from './lib/remark-parse2.common';
// import toDom from './lib/mdast-util-to-dom.common';
const findNode = require("unist-find-node");
const processor = unified()
    .use(parse, {});

const md = require('./test.md');

function findNodeByLine(mdast, line) {
    let node = findNode(mdast, {line: line,column: 1});

    if(!node || node.type === 'root') {
        return null;
    }

    return node;
}

(async function () {

    const mdast = processor.parse(md);

    const editor = new CodeMirrorEditor(document.getElementById('editor'), {
        value: md,
        lineNumbers: true,
        // firstLineNumber: 0
    });

    editor.on('incremental', function (incremental) {


        console.log(incremental);

        const changes = incremental.changes;


        changes.forEach(function (change) {
            console.log(change);

            const node = findNodeByLine(mdast, change.line);
            console.log(node);

        });



    });














    editor.on('change1', function (change) {
        console.log('change');
        console.log(change);

        const action = change.action;

        const start = change.start;
        const end = change.end;

        if(action === "set") {
            console.log('parse all');
        }
        else if(action === "insert") {

            if(start.line === end.line) {
                console.log('parse line', start.line);
                // console.log('insert line', start.line);

                if(start.column === 1){
                    console.log('incremental:insert', editor.getLine(start.line));
                }
                else {
                    console.log('incremental:replace', editor.getLine(start.line));
                }

            }

            // console.log('parse all');
        }
        else if(action === "remove") {

            if(start.line === end.line) {
                console.log('incremental:replace', editor.getLine(start.line));
            }
            else{
                console.log('incremental:remove', start.line);
            }
        }

    });

    /*
    editor.on('cursorChange', function (cursor) {
        console.log('cursorChange');
        console.log(cursor);

        if(!mdast) return;

        let node = findNode(mdast, cursor);

        if(!node || node.type === 'root') {
            return;
        }

        console.log(node);
    });
    */


    // editor.setValue(md);





    // editor.on('incremental', function (incremental) {
    //
    //     console.log(incremental);
    //
    // });

    /*
    editor.on('scroll', function () {
        console.log('scroll');

        const line = editor.getFirstVisibleLine();
        console.log(line);
    });

    editor.on('cursorChange', function (cursor) {
        console.log('cursorChange');
        console.log(cursor);
    });
    */


    // const md = await ((await fetch('./demo.md')).text());
    // editor.setValue(md);


    // console.log(editor.getLine(1));


    // setTimeout(function () {
    //     editor.scrollIntoViewByLine(60);
    // }, 3000);

    // console.log(editor.getValue());

    /*

    editor.$on('cursorChange', function (cursor) {
        console.log(cursor);
    });

    editor.$on('scroll', function (top) {
        console.log(top, editor.getFirstVisibleRow());
    });



    */
















    // setTimeout(async function () {
    //     editor.setValue(md.substring(0,50));
    // }, 3000);





    // setTimeout(async function () {
    //     editor.setValue(md+md+md);
    // }, 3000);


    // setTimeout(async function () {
    //     // editor.scrollToLine(100);
    //     await editor.scrollToLine(100);
    //     console.log(editor.getFirstVisibleRow());
    // }, 3000);


    // var editor = ace.edit("editor", {
    //     // options
    // });
    //
    // editor.setFontSize(16);
    // editor.setTheme("ace/theme/github");
    // editor.session.setMode("ace/mode/markdown");
    //
    // editor.setOption("wrap", "free");
    //
    //
    // setTimeout(function () {
    //     // editor.gotoLine(90, 0, true);
    //     // editor.centerSelection();
    //     // getFirstVisibleRow
    //     // console.log( editor.getLastVisibleRow() );
    //
    // }, 3000);
    //
    // editor.getSession().on('change', function(e) {
    //     console.log(e);
    // });
    //
    // editor.getSession().on('changeScrollTop', function(scrollTop) {
    //     console.log(scrollTop);
    // });



})();