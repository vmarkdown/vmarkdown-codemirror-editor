import unified from 'unified';
import parse from './lib/remark-parse2.common';
import toDom from './lib/mdast-util-to-dom.common';
// const findNode = require("unist-find-node");
const NodeUtil = require("./util/node");
const processor = unified()
    .use(parse, {});

let mdast = null;

function getDate() {

    const date = new Date();

    return (''+date.getFullYear()+'-'+date.getMonth()+'-'+date.getDate()+' '+date.getHours()+':'+date.getMinutes()+':'+date.getSeconds());
}

$.extend($.scrollTo.defaults, {
    axis: 'y',
    duration: 300,
    // offset: {
    //     top: '50%'
    // }
    // interrupt: true
});

function scrollTo(target) {
    $(window).stop();
    $(window).scrollTo(target);
}

function render(value) {

    console.log(getDate());

    console.time('parse');

    mdast = processor.parse(value);

    mdast.properties = {
        className: 'markdown-body'
    };

    const dom = toDom(mdast);

    console.timeEnd('parse');


    const container = document.querySelector('.markdown-body');
    container && container.remove();
    document.getElementById('preview').appendChild(dom);
}

function active(cursor) {

    console.log(cursor);

    const node = NodeUtil.findNodeByLine(mdast, cursor.line);

    if(!node) return;

    const hash = node.hash;

    const $target = $('[data-hash='+hash+']');

    $('.active').removeClass('active');

    $target.addClass('active');


    if($target.length>0) {
        $target[0].scrollIntoViewIfNeeded();
        // scrollTo($target[0]);
    }

}





function scrollIntoView(line) {

    const node = NodeUtil.findNodeFromLine(mdast, line);
    console.log(line);
    console.log(node);

    if(!node) return;

    const hash = node.hash;

    const $target = $('[data-hash='+hash+']');

    // if($target.length>0) {
    //     // $target[0].scrollIntoView();
    //     // $target[0].scrollIntoViewIfNeeded();
    //
    // }
    if($target.length>0) {
        scrollTo($target[0]);

        // $(document.body).stop();
        // $(document.body).scrollTo($target[0]);
        // $(window).stop();
        // $(window).scrollTo($target[0]);

        // setTimeout(function () {
        //     // $(document.body).stop()
        //     $(window).stop();
        // }, 2000);
    }


}

window.addEventListener("storage", function(event){
    // console.log(event.key + "=" + event.newValue);

    var key = event.key;
    if(key === 'markdown') {
        let value = event.newValue;
        render(value);
    }
    else if (key === 'cursor') {
        let cursor = JSON.parse(event.newValue);
        active(cursor);
    }
    else if (key === 'firstVisibleLine') {
        // let cursor = JSON.parse(event.newValue);
        // active(cursor);
        let value = parseInt(event.newValue, 10);
        scrollIntoView(value)
    }
});
//
// localStorage.setItem("preview", 'getValue');

render(localStorage.getItem('markdown'));