//node filesystem require
var fs = require('fs');
//uglify requires
var uglifyParser = require("uglify-js").parser;
var uglify = require("uglify-js").uglify;

var basePath = '../source';

var compressPath = '../output';

var fileList = [];


function recurseCompress(sourcePath, destPath) {

    var files = fs.readdirSync(sourcePath);
    for (var i = 0; i < files.length; ++i) {
        var file = files[i];

        if (files[i].indexOf('.') === -1) {
            fs.mkdirSync(destPath + '/' + files[i]);
            recurseCompress(sourcePath + '/' + files[i], destPath + '/' + files[i]);
        } else if (files[i].indexOf('.js') !== -1) {
            fileList.push(sourcePath + '/' + files[i]);

            var fileData = fs.readFileSync(sourcePath + '/' + files[i], 'utf8');

            try {
                var ast = uglifyParser.parse(fileData); // parse code and get the initial AST
                ast = uglify.ast_squeeze(ast); // get an AST with compression optimizations
                var final_code = uglify.gen_code(ast);
                final_code = '/* Copyright MyCompany 2012 */\n' + final_code;

                fs.writeFileSync(destPath + '/' + files[i], final_code, 'utf8');
            } catch (e) {
                console.log('Failed compress:   ' + sourcePath + '/' + files[i])
            }
        }

    }

}

recurseCompress(basePath, compressPath);













