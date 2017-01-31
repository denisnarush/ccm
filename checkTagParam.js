module.exports = function checkTagParam(tag) {
    if (tag === undefined) {
        return 'div';
    }

    if (tag === false) {
        return false;
    }

    if (typeof tag === 'string' && !!tag) {
        return tag;
    }
}
