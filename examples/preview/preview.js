// const md = require('../md/demo.md');

const vmarkdown = new VMarkDown();

const preview = new VMarkDownPreview({
    scrollContainer: window
});

const app = new Vue({
    el: '#preview',
    render(h) {
        return vmarkdown.compile(h);
    }
});

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

// vmarkdown.setValue(md);

window.addEventListener("storage", function(event){
    const key = event.key;
    const value = event.newValue;
    switch (key) {
        case 'change':{
            vmarkdown.setValue(value);
            break;
        }
        case 'cursorChange':{
            let cursor = JSON.parse(value);
            vmarkdown.emit('cursorChange', cursor);
            break;
        }
        case 'firstVisibleLineChange':{
            let firstVisibleLine = parseInt(value, 10);
            vmarkdown.emit('firstVisibleLineChange', firstVisibleLine);
            break;
        }
    }
});


const md = localStorage.getItem('change');
if(md) {
    vmarkdown.setValue(md);
}


