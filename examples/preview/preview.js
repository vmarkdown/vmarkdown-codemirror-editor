// const md = require('../md/demo.md');
const VMarkDown = require('vmarkdown');

const vmarkdown = new VMarkDown({
    pluginManager: {
        load: function (plugins) {

            Object.keys(plugins).forEach(function (name) {

                Vue.component(name, {
                    name: name,
                    props: {
                        'lang': {
                            type: String,
                            default: ''
                        },
                        'code': {
                            type: String,
                            required: true
                        }
                    },
                    data() {
                        return {
                            result: this.code || ''
                        }
                    },
                    render(h) {
                        return h('pre', {
                            'class': [name]
                        }, [
                            h('code', {
                                'class': [],
                                domProps:{
                                    innerHTML: this.result
                                }
                            })
                        ]);
                    }
                });

            });




        }
    }
});

const preview = new VMarkDownPreview({
    scrollContainer: window
});

function scrollTo(firstVisibleLine) {
    const node = vmarkdown.findNodeFromLine(firstVisibleLine);


    if(node) {
        console.log(firstVisibleLine);
        console.log(node.position);

        var position = node.position;

        var startLine = node.position.start.line;
        var endLine = node.position.end.line;

        var currentLine = firstVisibleLine<startLine?startLine:firstVisibleLine;

        var allLine = endLine - startLine + 1;

        var coverageRatio = (currentLine-startLine)/allLine;

        console.log(coverageRatio);
    }

    preview.scrollTo(node, firstVisibleLine);
}

function activeTo(cursor) {
    const node = vmarkdown.findNode(cursor);
    preview.activeTo(node, cursor);
}

const app = new Vue({
    el: '#preview',
    data: {
        vdom: null
    },
    methods: {
        async setValue(md) {
            const h = this.$createElement;
            const vdom = await vmarkdown.render(md, {h: h});


            this.vdom = vdom;
        }
    },
    render(h) {
        // return vmarkdown.compile(h);
        return this.vdom;
    }
});

const md = localStorage.getItem('change');
if(md) {
    // vmarkdown.setValue(md);
    app.setValue(md);
}

/*
vmarkdown.on('change', function (value) {
    app.$forceUpdate();
});

vmarkdown.on('firstVisibleLineChange', function (firstVisibleLine) {
    const node = vmarkdown.findNodeFromLine(firstVisibleLine);
    preview.scrollTo(node);
});

vmarkdown.on('cursorChange', function (cursor) {
    const node = vmarkdown.findNode(cursor);
    preview.activeTo(node);
});
*/
// vmarkdown.setValue(md);

window.addEventListener("storage", function(event){
    const key = event.key;
    const value = event.newValue;
    switch (key) {
        case 'change':{
            // vmarkdown.setValue(value);
            break;
        }
        case 'cursorChange':{
            let cursor = JSON.parse(value);
            // vmarkdown.emit('cursorChange', cursor);
            break;
        }
        case 'firstVisibleLineChange':{
            let firstVisibleLine = parseInt(value, 10);
            // debugger
            // vmarkdown.emit('firstVisibleLineChange', firstVisibleLine);
            scrollTo(firstVisibleLine);
            break;
        }
    }
});


// const md = localStorage.getItem('change');
// if(md) {
//     vmarkdown.setValue(md);
// }


