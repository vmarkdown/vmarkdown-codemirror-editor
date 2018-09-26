import Editor from './editor';

class CodeMirrorEditor extends Editor {

    constructor(value) {
        super();

        const self = this;

        self.editor = CodeMirror(document.getElementById('editor'), {
            lineNumbers: true,
            value: '',
            mode:  "markdown",
            viewportMargin: 100,
            // maxHighlightLength: Infinity,
            lineWrapping: true,
            styleActiveLine: true,
        });


        self.editor.on("scroll", function () {
            console.log('scroll');
        });

        self.editor.on("beforeChange", function (editor, change) {
            console.log('beforeChange');
            console.log(change);
        });


        self.editor.on("change", function (editor, change) {
            console.log('change');
            console.log(change);
        });


        self.editor.on("change1", function () {
            // if(self.isFirst){self.isFirst = false;return;}
            // self.isUnSaved = true;
            // self.$emit('change', self.getValue());

            // console.log(arguments);

            const c = arguments[1];
            console.log(c);

            let action = '';
            let content = '';

            if(c.origin === "+delete"){
                action = 'remove';
                content = c.removed;
            }
            else if(c.origin === "+input" ||c.origin ==='paste') {

                if(c.removed.length && c.removed[0]){
                    action = 'replace';
                }
                else{
                    action = 'insert';
                    content = c.text;
                }

            }

            const change = {
                start:{
                    line: c.from.line + 1,
                    column: c.from.ch+ 1,
                },
                end:{
                    line: c.to.line + 1,
                    column: c.to.ch+ 1,
                },
                action: action,
                content: content
            };

            console.log(change);

            return change;

        });



    }

    onCursorChange(e, editor) {
        const cursor = editor.cursor;
        const self = this;
        // self.$emit('cursorChange', {
        //     line: cursor.row+1,
        //     column: cursor.column+1
        // });
    }

    getValue() {
        return this.editor.getValue();
    }

    setValue(value) {
        const self = this;
        this.editor.setValue(value);
    }

    scrollTo(scrollTop) {
    }

    async scrollToLine(line) {
        const self = this;

    }

    getFirstVisibleRow() {
        // return this.editor.getFirstVisibleRow() + 1;
    }

    getLastVisibleRow() {
        // return this.editor.getLastVisibleRow() + 1;
    }
}


export default CodeMirrorEditor;
