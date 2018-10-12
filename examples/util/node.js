const findNode = require("unist-find-node");


function findNodeByLine(mdast, line) {
    let node = findNode(mdast, {line: line,column: 1});

    if(!node || node.type === 'root') {
        return null;
    }

    return node;
}

function findNodeFromLine(mdast, line, maxNum = 10) {

    let node = findNode(mdast, {line: line,column: 1});

    const lastLine = mdast.position.end.line;

    if(!node || node.type === 'root') {
        if(maxNum <=0 && line + 1 > lastLine) {
            return null;
        }
        return findNodeFromLine(mdast, line + 1, maxNum - 1);
    }

    return node;
}

module.exports = {
    findNodeByLine: findNodeByLine,
    findNodeFromLine: findNodeFromLine
};
