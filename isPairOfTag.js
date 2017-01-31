module.exports = function isPairOfTag(tag) {
    if (tag === 'img' ||
            tag === 'input' ||
            tag === 'hr' ||
            tag === 'br') {
        return false;
    } else {
        return true;
    }
}
