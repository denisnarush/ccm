var checkTagParam = require("./checkTagParam");
var isPairOfTag = require("./isPairOfTag");
var fs = require('fs');

module.exports = function readContent(content, block, blocks) {
  if (!content) {
    return;
  }

  html += '\n';

  content.forEach(function (index) {
    var indexJSON;
    var attrs = index.attrs || {};

    // block
    try {
      indexJSON = JSON.parse(fs.readFileSync('./blocks/' + index.block + '/' + index.block + '.json', "utf8"));
    } catch (error) {}
    
    // elem
    try {
      indexJSON = JSON.parse(fs.readFileSync('./blocks/' + block + '/__' + index.elem + '/' + block + '__' + index.elem + '.json', "utf8"));
    } catch (error) {}

    if (indexJSON) {
      attrs = Object.assign({}, indexJSON.attrs, index.attrs || {});
      mods = Object.assign({}, indexJSON.mods, index.mods || {});
      index = Object.assign({}, indexJSON, index);

      index.attrs = attrs;
      index.mods = mods;

      indexJSON = undefined;
    }
    
    try {
      indexJSON = JSON.parse(fs.readFileSync('./blocks/' + block + '/__' + index.elem + '/' + block + '__' + index.elem +  '.json', "utf8"));
    } catch (error) {}

    if (indexJSON) {
      attrs = Object.assign({}, indexJSON.attrs, index.attrs || {});
      mods = Object.assign({}, indexJSON.mods, index.mods || {});
      index = Object.assign({}, indexJSON, index);

      index.attrs = attrs;
      index.mods = mods;

      indexJSON = undefined;
    }


    var tag = checkTagParam(index.tag);

    if (tag) {


      // feeel blocks object
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

      if (index.parent && index.elem) {
        blocks[block + '__' + index.elem] = blocks[block + '__' + index.elem] || {
          css: block + '/' + '__' + index.elem + '/' + block + '__' + index.elem + '.less',
          js: block + '/' + '__' + index.elem + '/' + block + '__' + index.elem + '.js'
        };
      }

      if (index.mods !== undefined) {
        Object.keys(index.mods).forEach(function (i) {
          blocks[(index.block || (block ? block + '__' + index.elem : false)) + '_' + i + (typeof index.mods[i] === 'string' ? '_' + index.mods[i] : '')] = blocks[(index.block || (block ? block + '__' + index.elem : false)) + '_' + i + (typeof index.mods[i] === 'string' ? '_' + index.mods[i] : '')] || {
            css: (index.block || block) + '/' + (index.elem ? '__' + index.elem + '/' : '') + '_' + i + '/' + (index.block || (block ? block + '__' + index.elem : false)) + '_' + i + (typeof index.mods[i] === 'string' ? '_' + index.mods[i] : '') + '.less',
            js: (index.block || block) + '/' + (index.elem ? '__' + index.elem + '/' : '') + '_' + i + '/' + (index.block || (block ? block + '__' + index.elem : false)) + '_' + i + (typeof index.mods[i] === 'string' ? '_' + index.mods[i] : '') + '.js'
          };
        });
      }
      // -feeel block paths

      // class
      html += '<' + tag + ' class="' + ((index.block ? index.block + (index.attrs && index.attrs.class ? " " + index.attrs.class : "") : "") || (block ? block + '__' + index.elem : index.attrs ? index.attrs.class : false));

      // mods
      if (index.mods !== undefined) {
        Object.keys(index.mods).forEach(function (i) {
          html += ' ' + (index.block || (block ? block + '__' + index.elem : false)) + '_' + i + (typeof index.mods[i] === 'string' ? '_' + index.mods[i] : '');
        });
      }

      // close class attr
      html += '"';

      // attrs
      if (index.attrs !== undefined && !index.attrs.class) {
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
};