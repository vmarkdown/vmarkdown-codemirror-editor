require('codemirror/lib/codemirror.css');

const CodeMirror = require('codemirror');

require('codemirror/mode/xml/xml.js');
require('codemirror/mode/markdown/markdown.js');

require('codemirror/addon/selection/active-line.js');
require('codemirror/addon/edit/continuelist.js');

require('codemirror/addon/scroll/simplescrollbars.css');
require('codemirror/addon/scroll/simplescrollbars.js');


// import Editor from './base/editor';
const Editor = require('./base/editor');

// var deepClone = function (obj) {
//     var _tmp,result;
//     _tmp = JSON.stringify(obj);
//     result = JSON.parse(_tmp);
//     return result;
// }

class CodeMirrorEditor extends Editor {

    constructor(el, options) {
        super();
        const self = this;
        self.options = options || {};
        self.editor = CodeMirror(el,
            Object.assign({
                theme:'default vmarkdown',
                value: '',
                mode:  "markdown",
                // viewportMargin: 100,
                // maxHighlightLength: Infinity,
                lineWrapping: true,
                styleActiveLine: true,
                // scrollbarStyle: "native", //overlay simple
                scrollbarStyle: "native",

                dragDrop: true,
                selectionsMayTouch: false,

                // pollInterval: 5000,
                extraKeys: {
                    "Enter": "newlineAndIndentContinueMarkdownList"
                }
            }, self.options)
        );
    }

    on(type, handler) {
        const self = this;
        switch (type) {
            case 'beforeChange': {
                // self.editor.on("beforeChange", function (editor, change) {
                //     self._describeBeforeChange(change);
                //     // self.$onChange(change, handler);
                // });
                break;
            }
            case 'change': {
                // self.editor.on("beforeChange", function (editor, change) {
                //     // self._describeChange(change);
                //     // self.$onChange(change, handler);
                // });
                self.editor.on("change", function (editor, change) {
                    // self._describeChange(change);
                    self.$onChange(change, handler);
                });
                break;
            }
            // case 'incremental': {
            //     self.editor.on("change", function (editor, change) {
            //         self.$onIncremental(change, handler);
            //     });
            //     break;
            // }
            case 'scroll': {
                self.editor.on("scroll", function () {
                    self.$onScroll(handler);
                });
                break;
            }
            case 'cursorChange': {
                self.editor.on("cursorActivity", function () {
                    self.$onCursorChange(handler);
                });
                break;
            }
        }
    }

    $onChange(change, handler) {

        // console.log(change);

        const self = this;
        var origin = change.origin;
        var from = change.from;
        var to = change.to;
        var text = change.text;
        var removed = change.removed;

        var fromLine = from.line + 1;
        var toLine = to.line + 1;
        //
        var fromColumn = from.ch + 1;
        var toColumn = to.ch + 1;

        const incremental = {
            origin: origin,
            changes: []
        };

        if(origin=== '+input' && text[0].length>0 && removed[0].length ===0) {
            incremental.origin = 'insert';
        } else if(origin=== '+input' && text[0].length>0 && removed[0].length>0) {
            incremental.origin = 'replace';
        } else if(origin=== '+delete' && removed[0].length>0) {
            incremental.origin = 'remove';
        }

        if( origin === '+input' || origin === '+delete' ) {

            let index = 0;
            let toLineIsEmpty = (removed.slice(-1)[0].length === 0);

            for(let i=fromLine;i<=toLine;i++) {

                if( i===fromLine &&
                    (
                        (text[0].length === 0 && removed[index].length > 0 && !toLineIsEmpty)
                        ||
                        (text[0].length > 0 && removed[0].length ===0 )
                        ||
                        (text[0].length > 0 && removed[index].length >0 )
                    )
                ) {

                    let surplus = self.getLine(i);
                    // console.log('line:', i , 'is replaced by', surplus);

                    incremental.changes.push({
                        action: 'replace',
                        line: i,
                        before: '',
                        after: surplus
                    });
                }
                else if( i===toLine && toLineIsEmpty) {

                }
                else{
                    // console.log('line:', i , 'deleted');

                    incremental.changes.push({
                        action: 'remove',
                        line: i,
                        before: '',
                        after: ''
                    });
                }

                index++;
            }

        }
        else{
            // console.log(origin, 'not support');
            // incremental.support = false;
        }

        handler && handler.call(self, incremental);
    }

    $onScroll(handler) {
        const self = this;
        handler && handler.call(self);
    }

    $onCursorChange(handler) {
        const self = this;
        const cursor = self.editor.getCursor();

        const result = {
            line: cursor.line + 1,
            column: cursor.ch + 1
        };

        const position = self.editor.cursorCoords(cursor.line);
        Object.assign(result, position);

        handler && handler.call(self, result);
    }

    getValue() {
        const self = this;
        return self.editor.getValue();
    }

    setValue(value) {
        const self = this;
        const newValue = value; // + '\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n';
        self.editor.setValue(newValue);
    }

    scrollTo(scrollTop) {
    }

    async scrollToLine(line) {
        const self = this;

    }

    scrollIntoViewByLine(line) {
        const self = this;
        const params = {
            line: line,
            ch: 0
        };
        self.editor.scrollIntoView(params);
    }

    getScrollTop() {

    }

    getFirstVisibleCoverageRatio(firstVisibleLine, position) {
        const self = this;


        if( position.start.line === position.end.line ) {

            const lineIndex = firstVisibleLine - 1;
            var heightAtLine = self.editor.heightAtLine(lineIndex);
            var lineHandle = self.editor.getLineHandle(lineIndex);
            var height = lineHandle.height;

            // console.log('getLineHandle', heightAtLine);
            // console.log('height', height);

            const coverageRatio = height?(heightAtLine/height):0;

            return {
                line: firstVisibleLine,
                // height: height,
                // top: heightAtLine,
                coverageRatio: coverageRatio
            };

        }

        // const coverageRatio = height?(heightAtLine/height):0;

        // const startLine = (firstVisibleLine<position.start.line)?position.start.line;
        const startLine = position.start.line;
        const endLine = position.end.line;

        const allLine = endLine - startLine + 1;

        const currentLine = (firstVisibleLine<position.start.line)?position.start.line:firstVisibleLine;

        return {
            line: firstVisibleLine,
            coverageRatio: currentLine/allLine
        }




        // var top = self.editor.display.scroller.scrollTop;
        // var result = self.editor.coordsChar({
        //     top: top,
        //     left: 0
        // }, 'local');
        // let lineIndex = result.line;


        // var heightAtLine = self.editor.heightAtLine(lineIndex);
        // var lineHandle = self.editor.getLineHandle(lineIndex);
        // var height = lineHandle.height;
        //
        // console.log('getLineHandle', heightAtLine);
        // console.log('height', height);
        //
        // var p = height?(heightAtLine/height):0;
        //
        // // debugger
        // console.log('p', p);
        //
        // let line = lineIndex + 1;
        // return {
        //     line: line,
        //     height: height,
        //     top: heightAtLine,
        //
        // };
    }

    getFirstVisibleLine() {
        const self = this;
        var top = self.editor.display.scroller.scrollTop; //+200;
        var result = self.editor.coordsChar({
            top: top,
            left: 0
        }, 'local');
        let lineIndex = result.line;





        // var lineIndex = firstVisibleLine-1;
        // console.log('getLineHandle', editor.editor.getLineHandle(lineIndex));
        // console.log('heightAtLine', editor.editor.heightAtLine(lineIndex));

        // var heightAtLine = self.editor.heightAtLine(lineIndex);
        // var lineHandle = self.editor.getLineHandle(lineIndex);
        // var height = lineHandle.height;
        //
        // console.log('getLineHandle', heightAtLine);
        // console.log('height', height);
        //
        // var p = height?(heightAtLine/height):0;
        //
        // // debugger
        // console.log('p', p);






        let line = lineIndex + 1;
        return line;
    }

    getLastVisibleRow() {
        // return this.editor.getLastVisibleRow() + 1;
    }

    getLine(line) {
        const self = this;
        return self.editor.doc.getLine(line - 1);
    }


    openSma() {

    }

}

module.exports = CodeMirrorEditor;
