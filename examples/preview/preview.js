const VMarkDown = require('vmarkdown');

const preview = new VMarkDownPreview({
    scrollContainer: window
});

const app = new Vue({
    el: '#preview',
    data: {
        vdom: null
    },
    methods: {
        async setValue(md) {
            const self = this;
            self.vdom = await self.vmarkdown.process(md);
        },
        activeTo(cursor) {
            const self = this;
            const node = self.vmarkdown.findNode(cursor);
            preview.activeTo(node, cursor);
        },
        scrollTo(firstVisibleLine) {
            const self = this;
            const node = self.vmarkdown.findNodeFromLine(firstVisibleLine);
            preview.scrollTo(node, firstVisibleLine);
        }
    },
    render() {
        return this.vdom;
    },
    async mounted(){

        const self = this;

        const h = self.$createElement;

        const vmarkdown = new VMarkDown({
            h: h,
            pluginManager: null,
            rootClassName: 'markdown-body',
            rootTagName: 'main',
            hashid: true
        });

        self.vmarkdown = vmarkdown;

        const md = localStorage.getItem('change');

        if(md) {
            self.setValue(md);
        }

    }
});

window.addEventListener("storage", function(event){
    const key = event.key;
    const value = event.newValue;
    switch (key) {
        case 'change':{
            app.setValue(value);
            break;
        }
        case 'cursorChange':{
            let cursor = JSON.parse(value);
            app.activeTo(cursor);
            break;
        }
        case 'firstVisibleLineChange':{
            let firstVisibleLine = parseInt(value, 10);
            app.scrollTo(firstVisibleLine);
            break;
        }
    }
});
