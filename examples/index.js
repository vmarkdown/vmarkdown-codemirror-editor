(async function () {

    const editor = new CodeMirrorEditor(document.getElementById('editor'), {
        lineNumbers: true
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


    editor.on('incremental', function (incremental) {

        console.log(incremental);

    });

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


    const md = await ((await fetch('./demo.md')).text());
    editor.setValue(md);


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