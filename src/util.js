module.exports = {
    trimTrailingLines: function trimTrailingLines(value) {
    var val = value;
    var index = val.length - 1;
    while (index >= 0) {
        var v = val.charAt(index);
        if(v !== '\n' && v !== ' '){
            break
        }
        --index;
    }

    return val.slice(0, index + 1)
}
};
