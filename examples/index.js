(async function () {

    const editor = new CodeMirrorEditor(document.getElementById('editor'));



    editor.on('change', function () {
        console.log('change');
    });


    const md = await ((await fetch('./demo.md')).text());
    editor.setValue(md);


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