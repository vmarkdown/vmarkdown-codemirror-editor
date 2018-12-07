require('codemirror/lib/codemirror.css');

const CodeMirror = require('codemirror');

require('codemirror/mode/xml/xml.js');
require('codemirror/mode/markdown/markdown.js');

require('codemirror/addon/selection/active-line.js');
require('codemirror/addon/edit/continuelist.js');

require('codemirror/addon/scroll/simplescrollbars.css');
require('codemirror/addon/scroll/simplescrollbars.js');

require('codemirror/addon/mode/overlay.js');
require('codemirror/addon/mode/multiplex.js');

require('codemirror/addon/hint/show-hint.css');
require('codemirror/addon/hint/show-hint.js');



// import Editor from './base/editor';
const Editor = require('./base/editor');

// var deepClone = function (obj) {
//     var _tmp,result;
//     _tmp = JSON.stringify(obj);
//     result = JSON.parse(_tmp);
//     return result;
// }

const util = require('./util');

// "text/markdown"
CodeMirror.defineMode("vmarkdown", function(config, parserConfig) {
    var mustacheOverlay = {
        token1: function(stream, state) {
            var ch;
            if (stream.match("{{")) {
                while ((ch = stream.next()) != null)
                    if (ch == "}" && stream.next() == "}") {
                        stream.eat("}");
                        return "mustache";
                    }
            }
            while (stream.next() != null && !stream.match("{{", false)) {}
            return null;
        },
        token: function(stream, state) {
            // debugger
            // if (stream.match("[TOC]", true, true)) {
            //     return "toc";
            // }
            // while (stream.next() != null && !stream.match("[TOC]", false, true)) {}
            // return null;

            var match = stream.match(/^ {0,3}\[(TOC|toc)\]/, true, true);
            if( match ) {
                return "toc";
            }
            else {
                stream.skipToEnd();
            }
            return null;
        }
    };
    return CodeMirror.overlayMode(CodeMirror.getMode(config, parserConfig.backdrop || "text/markdown"), mustacheOverlay);
});



(function () {

    // const codemirror = CodeMirror(document.body, {
    //     value: '// CodeMirror Addon hint/show-hint.js sample.\n// Snippets are Ctrl-E or Cmd-E.',
    //     mode: 'text/javascript',
    //     lineNumbers: true,
    //     styleActiveLine: true,
    //     theme: 'solarized dark'
    // })
    //
    // // keymap を指定
    // codemirror.setOption('extraKeys', {
    //     'Cmd-E': function() {
    //         snippet()
    //     },
    //     'Ctrl-E': function() {
    //         snippet()
    //     }
    // })




})();

const SNIPPETS = {
    TABLE: [
        '\n',
        '| Month    | Assignee | Backup |',
        '| :------- | --------:| :----: |',
        '| January  | Dave     | Steve  |',
        '| February | Gregg    | Karen  |',
        '| March    | Diane    | Jorge  |',
        '\n',
    ].join('\n'),
    UNORDERED_LIST: [
        '\n',
        '- 1',
        '- 2',
        '- 3',
        '- 4',
        '\n',
    ].join('\n'),
    ORDERED_LIST: [
        '\n',
        '1. 1',
        '2. 2',
        '3. 3',
        '4. 4',
        '\n',
    ].join('\n'),
    TASK_LIST: [
        '\n',
        '- [x] 1',
        '- [ ] 2',
        '- [ ] 3',
        '- [x] 4',
        '\n',
    ].join('\n'),
    MATH_BLOCK: [
        '\n',
        '$$',
        '',
        '$$',
        '\n',
    ].join('\n'),
};


const snippets = [
    { text: SNIPPETS.TABLE, displayText: 'Table' },
    { text: SNIPPETS.UNORDERED_LIST, displayText: 'Unordered List' },
    { text: SNIPPETS.ORDERED_LIST, displayText: 'Ordered List' },
    { text: SNIPPETS.TASK_LIST, displayText: 'Task List' },
    { text: SNIPPETS.MATH_BLOCK, displayText: 'Math Block' },
];

class CodeMirrorEditor extends Editor {

    constructor(el, options) {
        super();
        const self = this;
        self.options = options || {};
        self.editor = CodeMirror(el,
            Object.assign({
                theme:'default vmarkdown',
                value: '',
                mode:  "vmarkdown",
                // mode:  "markdown",
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
                    "Enter": "newlineAndIndentContinueMarkdownList",
                    // "Cmd-B": function(){
                    //     self.execCommand('strong');
                    // }
                    "Cmd-E": function(){
                        snippet();
                    }
                }
            }, self.options)
        );


        function snippet() {
            const codemirror = self.editor;
            CodeMirror.showHint(codemirror, function () {
                const cursor = codemirror.getCursor();
                const token = codemirror.getTokenAt(cursor);
                const start = token.start;
                const end = cursor.ch;
                const line = cursor.line;
                const currentWord = token.string;
                const list = snippets.filter(function (item) {
                    return item.text.indexOf(currentWord) >= 0
                });
                return {
                    list: list.length ? list : snippets,
                    from: CodeMirror.Pos(line, start),
                    to: CodeMirror.Pos(line, end)
                }
            }, { completeSingle: false })
        }


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
        const value = util.trimTrailingLines(self.editor.getValue());
        return value;
    }

    setValue(value) {
        const self = this;
        // const newValue = value + '\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n';
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
        const self = this;
        return self.editor.display.scroller.scrollTop;
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

    formatHeading({level}) {
        const self = this;
        const selections = self.editor.listSelections();
        selections.forEach(function ({anchor}) {

            const line = anchor.line;
            let string = self.getLine(line+1);

            const from = {
                line: line,
                ch: 0
            };

            const to = {
                line: line,
                ch: string.length
            };

            if(string) {
                string = string.replace(/^#+[ ]{0,3}/,'');
            }

            let prefix = '#';

            if(level===1){
                prefix = '#';
            }
            else if(level===2){
                prefix = '##';
            }
            else if(level===3){
                prefix = '###';
            }
            else if(level===4){
                prefix = '####';
            }
            else if(level===5){
                prefix = '#####';
            }
            else if(level===6){
                prefix = '######';
            }

            self.editor.replaceRange( prefix +' '+ string, from, to);
        });
    }

    formatStrong() {
        const self = this;
        const selection = self.editor.getSelection();
        self.editor.replaceSelection( '**'+ selection +'**' );
    }

    formatEmphasis() {
        const self = this;
        const selection = self.editor.getSelection();
        self.editor.replaceSelection( '*'+ selection +'*' );
    }

    formatDelete() {
        const self = this;
        const selection = self.editor.getSelection();
        self.editor.replaceSelection( '~~'+ selection +'~~' );
    }

    formatUnderline() {
        const self = this;
        self.editor.replaceSelection( '---' );
    }

    formatInlineCode() {
        const self = this;
        const selection = self.editor.getSelection();
        self.editor.replaceSelection( '`'+ selection +'`' );
    }

    formatCode() {
        const self = this;

        const cursor = self.editor.getCursor();

        const selection = self.editor.getSelection();

        const string = [
            '\n',
            '``` ',
            selection,
            '```',
            '\n',
        ].join('\n');

        self.editor.replaceSelection( string );

        const position = {line: cursor.line+2, ch: 4};
        self.editor.setCursor(position);
    }

    formatLink() {
        const self = this;
        const selection = self.editor.getSelection();
        self.editor.replaceSelection( '['+ selection +']()' );
    }

    formatImage({url=''}) {
        const self = this;
        const selection = self.editor.getSelection();
        self.editor.replaceSelection( '!['+ selection +']('+url+')' );
    }

    formatTable() {
        const self = this;
        const cursor = self.editor.getCursor();
        const string = [
            '\n',
            '| Month    | Assignee | Backup |',
            '| :------- | --------:| :----: |',
            '| January  | Dave     | Steve  |',
            '| February | Gregg    | Karen  |',
            '| March    | Diane    | Jorge  |',
            '\n',
        ].join('\n');
        self.editor.replaceRange(string, cursor, cursor);
    }


    formatThematicBreak() {
        const self = this;
        const cursor = self.editor.getCursor();

        const string = [
            '',
            '***',
            '',
        ].join('\n');

        self.editor.replaceRange(string, cursor, cursor);
    }

    formatBlockquote() {
        const self = this;
        const selections = self.editor.listSelections();
        selections.forEach(function ({anchor}) {

            const line = anchor.line;
            let string = self.getLine(line+1);

            const from = {
                line: line,
                ch: 0
            };

            const to = {
                line: line,
                ch: string.length
            };

            if(string) {
                string = string.replace(/^<[ ]{0,3}/,'');
            }

            let prefix = '<';
            self.editor.replaceRange( prefix +' '+ string, from, to);
        });
    }


    execCommand(name, options = {}) {
        const self = this;
        switch (name) {
            case 'heading': {
                self.formatHeading(options);
                break;
            }
            case 'strong': {
                self.formatStrong();
                break;
            }
            case 'emphasis': {
                self.formatEmphasis();
                break;
            }
            case 'delete': {
                self.formatDelete();
                break;
            }
            case 'underline': {
                self.formatUnderline();
                break;
            }
            case 'inlineCode': {
                self.formatInlineCode();
                break;
            }
            case 'code': {
                self.formatCode();
                break;
            }
            case 'link': {
                self.formatLink();
                break;
            }
            case 'image': {
                self.formatImage(options);
                break;
            }
            case 'table': {
                self.formatTable(options);
                break;
            }
            case 'thematicBreak': {
                self.formatThematicBreak(options);
                break;
            }
            case 'blockquote': {
                self.formatBlockquote(options);
                break;
            }
            default: {

            }
        }

    }




}

module.exports = CodeMirrorEditor;
