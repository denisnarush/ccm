module.exports = function isFileExist(filePath) {
    try {
      console.log('----' + filePath);
        fs.lstatSync(filePath).isFile();
        return true;
    } catch (error) {
        return false;
    }
}