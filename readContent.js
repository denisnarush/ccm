module.exports = function readContent (content, block, blocks) {

function checkTagParam(tag) {
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







function isPairOfTag(tag) {
    if (tag === 'img' ||
            tag === 'input' ||
            tag === 'hr' ||
            tag === 'br') {
        return false;
    } else {
        return true;
    }
}







    if (!content) {
        return;
    }

    html += '\n';

    content.forEach(function (index) {
        var tag = checkTagParam(index.tag);

        if (tag) {


            // feeel block paths
            if (index.block) {
                blocks[index.block] = blocks[index.block] || {
                    css: index.block + '/' + index.block + '.less',
                    js: index.block + '/' + index.block + '.js'
                };
            }

            if (block && index.elem) {
                blocks[block + '__' + index.elem] = blocks[block + '__' + index.elem] || {
                    css: block + '/' + '__' + index.elem + '/' + block + '__' + index.elem + '.less',
                    js: block + '/' + '__' + index.elem + '/' + block + '__' + index.elem + '.js'
                };
            }

            if (index.mods !== undefined) {
                Object.keys(index.mods).forEach(function (i) {
                    blocks[(index.block || (block ? block + '__' + index.elem : false)) + '_' + i + (typeof index.mods[i] === 'string' ? '_' + index.mods[i] : '')] = blocks[(index.block || (block ? block + '__' + index.elem : false)) + '_' + i + (typeof index.mods[i] === 'string' ? '_' + index.mods[i] : '')] || {
                        css:  (index.block || block) + '/' + (index.elem ? '__' + index.elem + '/' : '') + '_' + i + '/' + (index.block || (block ? block + '__' + index.elem : false)) + '_' + i + (typeof index.mods[i] === 'string' ? '_' + index.mods[i] : '') + '.less',
                        js:  (index.block || block) + '/' + (index.elem ? '__' + index.elem + '/' : '') + '_' + i + '/' + (index.block || (block ? block + '__' + index.elem : false)) + '_' + i + (typeof index.mods[i] === 'string' ? '_' + index.mods[i] : '') + '.js'
                    };
                });
            }
            // -feeel block paths

            // class
            html += '<' + tag + ' class="' + (index.block || (block ? block + '__' + index.elem : false));

            // mods
            if (index.mods !== undefined) {
                Object.keys(index.mods).forEach(function (i) {
                    html += ' ' + (index.block || (block ? block + '__' + index.elem : false)) + '_' + i + (typeof index.mods[i] === 'string' ? '_' + index.mods[i] : '');
                });
            }

            // close class attr
            html +=  '"';

            // attrs
            if (index.attrs !== undefined) {
                Object.keys(index.attrs).forEach(function (i) {
                    html += ' ' + i + '="' + index.attrs[i] + '"';
                });
            }

            html += '>';
        }

        html += (index.html || index.text || '');

        readContent(index.content, index.block, blocks);

        // close tag
        if (tag) {
            if (isPairOfTag(tag)) {
                html += '</' + tag + '>\n';
            }
        }
    });
}