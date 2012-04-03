//node filesystem require
var fs = require('fs');
//uglify requires
var uglifyParser = require("uglify-js").parser;
var uglify = require("uglify-js").uglify;
var rmSettings = require('./rm-settings.json');

console.log(rmSettings);

var fileList = [];

var bypassFolders = rmSettings.bypassFolders || [];
var ignoreFolders = rmSettings.ignoreFolders || [];


function recurseMinify(sourcePath, destPath, copyOnly) {

    var files = [];
    try {
        files = fs.readdirSync(sourcePath);
    } catch (e) {
        //ignore hidden folders
    }
    for (var i = 0; i < files.length; ++i) {
        var file = files[i];

        if (fs.statSync(sourcePath + '/' + files[i]).isDirectory() === true) {
            if (ignoreFolders.indexOf(files[i]) === -1) {
                fs.mkdirSync(destPath + '/' + files[i]);
                recurseMinify(sourcePath + '/' + files[i], destPath + '/' + files[i], copyOnly || bypassFolders.indexOf(files[i]) != -1);
            }
        } else {

            if (copyOnly === true || files[i].indexOf('.js') === -1) {
                //copy only
                try {
                    fs.linkSync(sourcePath + '/' + files[i], destPath + '/' + files[i]);
                } catch (e) {
                    //ignore hidden file errors
                }
            } else {
                fileList.push(sourcePath + '/' + files[i]);
                var fileData = fs.readFileSync(sourcePath + '/' + files[i], 'utf8');

                try {
                    var ast = uglifyParser.parse(fileData); // parse code and get the initial AST
                    ast = uglify.ast_squeeze(ast); // get an AST with compression optimizations
                    var final_code = uglify.gen_code(ast);
                    final_code = rmSettings.copyright + final_code;

                    fs.writeFileSync(destPath + '/' + files[i], final_code, 'utf8');
                } catch (e) {
                    console.log('Failed compress:   ' + sourcePath + '/' + files[i])
                }
            }
        }

    }

}

recurseMinify(rmSettings.sourcepath, rmSettings.destinationpath);












