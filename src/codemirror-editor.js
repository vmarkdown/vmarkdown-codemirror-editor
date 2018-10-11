import Editor from './editor';

var deepClone = function (obj) {
    var _tmp,result;
    _tmp = JSON.stringify(obj);
    result = JSON.parse(_tmp);
    return result;
}

class CodeMirrorEditor extends Editor {

    constructor(el, options) {
        super();
        const self = this;
        self.editor = CodeMirror(el,
            Object.assign({
                theme:'default vmarkdown',
                // lineNumbers: true,
                value: '',
                mode:  "markdown",
                viewportMargin: 100,
                // maxHighlightLength: Infinity,
                lineWrapping: true,
                styleActiveLine: true,
                scrollbarStyle: "native", //overlay

                dragDrop: true,
                selectionsMayTouch: false



            }, options)
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
                    self._describeChange(change);
                    // self.$onChange(change, handler);
                });

                break;
            }
            case 'incremental': {
                self.editor.on("change", function (editor, change) {
                    self.$onIncremental(change, handler);
                });
                break;
            }
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

    _formatChange(c) {
        let action = '';
        let content = '';

        const change = {
            from:{
                line: c.from.line + 1,
                column: c.from.ch + 1,
            },
            to:{
                line: c.to.line + 1,
                column: c.to.ch + 1,
            },
            action: action,
            content: content
        };

        if(c.origin ==='setValue'){
            change.action = 'set';
            change.content = c.text;
            change.to.line = c.text.length;
        }
        else if(c.origin === "+delete"){
            change.action = 'remove';
            change.content = c.removed;
        }
        else if(c.origin === "+input" || c.origin ==='paste'||c.origin ==='undo') {

            if(c.removed.length && c.removed[0]){
                change.action = 'replace';
                change.content = c.text;
            }
            else{
                change.action = 'insert';
                change.content = c.text;
            }

            if(c.origin ==='undo'){
                change.to.line = change.from.line + c.text.length -1;
            }

        }

        return change;
    }

    _describeBeforeChange(change) {
        const self = this;

        (function (_change) {

            var change = deepClone(_change);

            change.from.line = change.from.line+1;
            change.from.ch = change.from.ch+1;
            change.to.line = change.to.line+1;
            change.to.ch = change.to.ch+1;
            console.log(change);

        })(change);











    }

    _describeChange(change) {




        (function (_change) {

            var change = deepClone(_change);

            change.from.line = change.from.line+1;
            change.from.ch = change.from.ch+1;
            change.to.line = change.to.line+1;
            change.to.ch = change.to.ch+1;
            console.log(change);

        })(change);

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
            changes: []
        };

        if( origin === '+input' || origin === '+delete' ) {

            let index = 0;
            let toLineIsEmpty = (removed.slice(-1)[0].length === 0);

            for(let i=fromLine;i<=toLine;i++) {

                if( i===fromLine && text[0].length === 0 && removed[index].length > 0 && !toLineIsEmpty ) {
                    let surplus = self.getLine(i);
                    console.log('line:', i , 'is replaced by', surplus);
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
            console.log(origin, 'not support');
        }

        return incremental;

    }

    $onChange(c, handler) {
        const self = this;

        // console.log(c);

        // let action = '';
        // let content = '';

        // const change = {
        //     start:{
        //         line: c.from.line + 1,
        //         column: c.from.ch + 1,
        //     },
        //     end:{
        //         line: c.to.line + 1,
        //         column: c.to.ch + 1,
        //     },
        //     action: action,
        //     content: content
        // };
        //
        // if(c.origin ==='setValue'){
        //     change.action = 'set';
        //     change.content = c.text;
        //     change.end.line = c.text.length;
        // }
        // else if(c.origin === "+delete"){
        //     change.action = 'remove';
        //     change.content = c.removed;
        // }
        // else if(c.origin === "+input" || c.origin ==='paste'||c.origin ==='undo') {
        //
        //     if(c.removed.length && c.removed[0]){
        //         change.action = 'replace';
        //         change.content = c.text;
        //     }
        //     else{
        //         change.action = 'insert';
        //         change.content = c.text;
        //     }
        //
        //     if(c.origin ==='undo'){
        //         change.end.line = change.start.line + c.text.length -1;
        //     }
        //
        // }

        // console.log(change);
        // const change = self._formatChange(c);


        // const self = this;
        // var origin = change.origin;
        // var from = change.from;
        // var to = change.to;
        // var text = change.text;
        // var removed = change.removed;
        //
        // var fromLine = from.line + 1;
        // var toLine = to.line + 1;
        // //
        // var fromColumn = from.ch + 1;
        // var toColumn = to.ch + 1;
        //
        //
        // const incremental = {
        //     support: true,
        //     change: []
        // };
        //
        // if( origin === '+input' || origin === '+delete' ) {
        //
        //     let index = 0;
        //     let toLineIsEmpty = (removed.slice(-1)[0].length === 0);
        //
        //     for(let i=fromLine;i<=toLine;i++) {
        //
        //         if( i===fromLine && text[0].length === 0 && removed[index].length > 0 && !toLineIsEmpty ) {
        //             let surplus = self.getLine(i);
        //             console.log('line:', i , 'is replaced by', surplus);
        //             incremental.change.push({
        //                 action: 'replace',
        //                 line: i,
        //                 before: '',
        //                 after: surplus
        //             });
        //         }
        //         else if( i===toLine && toLineIsEmpty) {
        //
        //         }
        //         else{
        //             // console.log('line:', i , 'deleted');
        //             incremental.change.push({
        //                 action: 'remove',
        //                 line: i,
        //                 before: '',
        //                 after: ''
        //             });
        //         }
        //
        //         index++;
        //     }
        //
        // }
        // else{
        //     console.log(origin, 'not support');
        //     incremental.support = false;
        // }
        //
        // // return incremental;
        //
        //
        // handler && handler.call(self, incremental);
    }

    $onIncremental(change, handler) {

        console.log(change);

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
            action: null,
            changes: []
        };


        if(origin=== '+input' && text[0].length>0 && removed[0].length ===0) {
            incremental.action = 'insert';
        } else if(origin=== '+input' && text[0].length>0 && removed[0].length>0) {
            incremental.action = 'replace';
        } else if(origin=== '+delete' && removed[0].length>0) {
            incremental.action = 'remove';
        }
        else {
            incremental.action = origin;
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
                    console.log('line:', i , 'is replaced by', surplus);

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
                    console.log('line:', i , 'deleted');

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
            console.log(origin, 'not support');
            incremental.support = false;
        }

        handler && handler.call(self, incremental);
    }

    $onIncremental1(c, handler) {
        const self = this;

        const change = self._formatChange(c);

        const incremental = {
            action: '',
            content: [],
            start: {
                line: 0
            },
            end: {
                line: 0
            }
        };

        const action = change.action;
        const start = change.start;
        const end = change.end;

        if(action === "set") {
            // console.log('parse all');
            incremental.action = 'reset';
            incremental.content.push( self.getValue() );
        }
        else if(action === "insert") {

            if(start.line === end.line) {
                // console.log('parse line', start.line);

                if(start.column === 1){
                    // console.log('incremental:insert', editor.getLine(start.line));
                    incremental.action = 'insert';
                }
                else {
                    // console.log('incremental:replace', editor.getLine(start.line));
                    incremental.action = 'replace';
                }

                incremental.content.push( self.getLine(start.line) );

                incremental.start.line = start.line;
                incremental.end.line = start.line;

            }

            // console.log('parse all');
        }
        else if(action === "remove") {

            if(start.line === end.line) {
                // console.log('incremental:replace', editor.getLine(start.line));
                incremental.action = 'replace';
                incremental.content.push( self.getLine(start.line) );
            }
            else{
                // console.log('incremental:remove', start.line);
                incremental.action = 'remove';
                incremental.start.line = start.line;
                incremental.end.line = start.line;
            }
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
        handler && handler.call(self, result);
    }

    getValue() {
        const self = this;
        return self.editor.getValue();
    }

    setValue(value) {
        const self = this;
        self.editor.setValue(value);
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

    getFirstVisibleLine() {
        const self = this;
        var top = self.editor.display.scroller.scrollTop; //+200;
        var result = self.editor.coordsChar({
            top: top,
            left: 0
        }, 'local');
        let lineIndex = result.line;
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
}


export default CodeMirrorEditor;
