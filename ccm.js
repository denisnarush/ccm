var fs = require('fs');
var readContent = require('./readContent');

const FgRed = "\x1b[31m ";
const FgGreen = "\x1b[32m ";

function LOG() {
//        console.log.apply(this, arguments);
}

function isFileExist(filePath) {


    try {
        fs.lstatSync(filePath).isFile();
        return true;
    } catch (error) {
        return false;
    }

}

module.exports = function (content, filePath) {
  var pageJSON = JSON.parse(content);
  var index = filePath;

  var blocks = {};

  html = '<!doctype html>\n';
  html += '<html lang="en">\n';
  html += '    <head>\n';
  html += '        <title>' + pageJSON.title + '</title>\n';

  pageJSON.head.forEach(function (index) {
    switch (index.elem) {
    case 'css':
        html += "<link href='" + index.url + "' rel='stylesheet' type='text/css'>\n";
        break;
    case 'js':
        html += "<script src='" + index.url + "' type='text/javascript'></script>\n";
        break;
    default:
        break;
    }
  });

  html += '    </head>\n';
  html += '    <body>\n';
  
  readContent(pageJSON.content, undefined, blocks);
  var less = '';
  var js = '';

  blocks.page = {
      'css': index.replace('.json', '')+'.css',
      'js': index.replace('.json', '')+'.js'
  };

  // check files
  Object.keys(blocks).forEach(function (index) {
      if (index == 'page') {
          return;
      }

      if (isFileExist('./' + blocks[index].css)) {
          less += '@import "./' + blocks[index].css + '";\n';
          console.log(FgGreen, './' + blocks[index].css);
      } else {
          console.log(FgRed, './' + blocks[index].css);
      }

      if (isFileExist('./' + blocks[index].js)) {
          js += '<script src="../' + blocks[index].js + '"></script>';
          console.log(FgGreen, './' + blocks[index].js);
      } else {
          console.log(FgRed, './' + blocks[index].js);
      }

      if (isFileExist('./blocks/' + blocks[index].css)) {
          less += '@import "./blocks/' + blocks[index].css + '";\n';
          console.log(FgGreen, './blocks/' + blocks[index].css);
      } else {
          console.log(FgRed, './blocks/' + blocks[index].css);
      }

      if (isFileExist('./blocks/' + blocks[index].js)) {
          js += '<script src="../blocks/' + blocks[index].js + '"></script>';
          console.log(FgGreen, './blocks/' + blocks[index].js);
      } else {
          console.log(FgRed, './blocks/' + blocks[index].js);
      }

      if (isFileExist('./blocks.theme/' + blocks[index].css)) {
          less += '@import "./blocks.theme/' + blocks[index].css + '";\n';
          LOG(FgGreen, './blocks.theme/' + blocks[index].css);
      } else {
          LOG(FgRed, './blocks.theme/' + blocks[index].css);
      }
  });

  if (less) {
      fs.writeFileSync(index.substring(0, index.length - 4) + 'less', less, 'utf-8');
  }

  if (js) {
      html += js;
  }

  html += '    </body>\n';
  html += '</html>';
  fs.writeFileSync(index.substring(0, index.length - 4) + 'html', html, 'utf-8');

  console.log('\x1b[0m');
}