#!/usr/bin/env node

var fs = require('fs');
var argv = require('yargs').argv;
var shell = require('shelljs');

var templatePath = __dirname + '/template_controller.js';
var imgPath = argv._[0] || null;
var destinationDir = argv._[1] || null;

//Make sure I have all the args I need
if ( imgPath === null || destinationDir === null ) {
    throw 'Invalid args: Try "makestill [original-image] [destination-directory]"';
}

var questions = [
    "Name of the new still? (lowercase-with-dashes)",
    "How would you like it to be oriented? (height, width, none)"
];
var answers = [];
function ask(i){
    process.stdout.write(`\n ${questions[i]}`);
    process.stdout.write("  >  ");
}

ask(0);

process.stdin.on('data', data => {
    var a = data.toString().trim().toLowerCase();
    if (answers.length === 0 && a === '') {
        ask(0);
        return;
    }
    if (answers.length === 1) {
        switch(a){
            case 'height':
            case 'width':
            case 'none':
                break;
            default:
                a = 'none';
                break;
        }
    }
    answers.push(a);

    if (answers.length < questions.length) {
        ask(answers.length);
    } else {
        //gather data
        var name = answers[0];
        var nameCamel = name.replace(/-([a-z])/g, function (g) { return g[1].toUpperCase(); });
        var orientation = answers[1];
        var ext = imgPath.split('.')[1];
        var dir = `${destinationDir}/${name}`;
        var newImg = `${dir}/img.${ext}`;

        //Create new directory
        if (!fs.existsSync(dir)){
            fs.mkdirSync(dir);
        } else {
            throw `Sprite directory already exists.`;
        }

        //copy over the image
        shell.cp(imgPath, newImg);

        //Import the template file
        fs.readFile(templatePath, (err, data) => {
            if (err) {
                throw err;
            }
            var str = data.toString('utf8');

            //mod the file
            str = str.replace(/%a/, ext);
            str = str.replace(/%b/, nameCamel);
            str = str.replace(/%c/, name);
            if (orientation === 'none') {
                var parts = str.split('\n');
                var line = parts.findIndex(c=>{
                    return c.indexOf('%d') !== -1;
                });
                parts.splice(line,1);
                str = parts.join('\n');
            } else {
                str = str.replace(/%d/, orientation);
            }

            //write the template file
            fs.writeFileSync(`${dir}/controller.js`, str, 'utf8');

            process.exit();
        });
    }
});
