(function () {
  'use strict';

  const fs = require('fs');
  const beautify = require('js-beautify').html;
  const FgRed = "\x1b[31m ";
  const FgGreen = "\x1b[32m ";


  /**
   * Constructor
   */
  function Compiler() {
    this.HTML = "";
    this.BLOCKS = {};
  }

  /**
   * Checks whether a file exists by specified path
   * @param   {string} path Path to file
   * @returns {boolean}  Result
   */
  Compiler.prototype.isFileExist = function (path) {
    try {
      fs.lstatSync(path).isFile();
      return true;
    } catch (error) {
      return false;
    }
  };


  /**
   * Reads file and return JSON representation of it
   * @param   {string}   path Path to file
   * @returns {object} JSON representation
   */
  Compiler.prototype.readAsJSON = function (path) {
    try {
      return JSON.parse(fs.readFileSync(path, "utf8"));
    } catch (error) {
      return null;
    }
  };

  /**
   * Reads `tag` parametr and return string representation of it 
   * @param   {string|boolean} tag = "div" Tag parametr
   * @returns {string} String representation
   */
  Compiler.prototype.checkTagParametr = function () {
    var tag = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : "div";

    return (typeof tag === "string" || typeof tag === "boolean" ? tag : false);
  };

  /**
   * Checks if tag is self-closing
   * @param   {string} tag Tag parametr
   * @returns {boolean} Result
   */
  Compiler.prototype.isTagSelfClosing = function (tag) {
    switch (tag) {
    case 'input':
    case 'img':
    case 'hr':
    case 'br':
      return true;
    default:
      return false;
    }
  };

}());