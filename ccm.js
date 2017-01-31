var fs = require('fs'),
  readContent = require('./readContent');

function isFileExist(filePath) {
  try {
    fs.lstatSync(filePath).isFile();
    return true;
  } catch (error) {
    return false;
  }
}

const FgRed = "\x1b[31m ";
const FgGreen = "\x1b[32m ";

module.exports = function (content, filePath) {
  var pageJSON;
  try {
    pageJSON = JSON.parse(content);
  } catch (error) {
    try {
      pageJSON = JSON.parse(fs.readFileSync(filePath, "utf8"));
    } catch (error) {
      console.log('not valid json file');
      return false;
    }
  }
  if (Object.keys(pageJSON).length < 1) {
    return false;
  }
  var index = filePath;
  var blocks = {
    "page": {
      "css": "page/page.less",
      "js": "page/page.js"
    }
  };
  html = '<!doctype html>';
  html += '<html lang="en">';
  html += '<head>';
  html += '<title>' + pageJSON.title + '</title>';
  html += '<meta charset="utf-8">';
  pageJSON.head.forEach(function (index) {
    switch (index.elem) {
    case 'css':
      html += "<link href='" + index.url + "' rel='stylesheet' type='text/css'>";
      break;
    case 'js':
      html += "<script src='" + index.url + "' type='text/javascript'></script>";
      break;
    default:
      break;
    }
  });
  html += '</head>';
  html += '<body>';
  readContent(pageJSON.content, undefined, blocks);
  var less = '';
  var js = '';
  // check files
  Object.keys(blocks).forEach(function (index) {
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
      console.log(FgGreen, './blocks.theme/' + blocks[index].css);
    } else {
      //          console.log(FgRed, './blocks.theme/' + blocks[index].css);
    }
  });
  if (less) {
    fs.writeFileSync(index.substring(0, index.length - 4) + 'less', less, 'utf-8');
  }
  if (js) {
    html += js;
  }
  html += '</body>';
  html += '</html>';
  fs.writeFileSync(index.substring(0, index.length - 4) + 'html', html, 'utf-8');
  // set console color to white
  console.log('\x1b[0m');
};