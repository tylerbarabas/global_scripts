#!/usr/bin/env node

var fs = require('fs');
var argv = require('yargs').argv;
var shell = require('shelljs');

var templatePath = __dirname + '/template_controller.js';
var jsonPath = argv._[0] || null;
var destinationDir = argv._[1] || null;

//Make sure I have all the args I need
if ( jsonPath === null || destinationDir === null ) {
    throw 'Invalid args: Try "makesprite [original-json] [destination-directory]"';
}

var questions = [
    "Name of the new sprite? (lowercase-with-dashes)",
    "How would you like it to be oriented? (height, width, none)"
];
var answers = [];
function ask(i){
    process.stdout.write(`\n ${questions[i]}`);
    process.stdout.write("  >  ");
}

ask(0);

process.stdin.on('data', data => {
    var str = data.toString().trim().toLowerCase();
    if (answers.length === 0 && str === '') {
        ask(0);
        return;
    }
    if (answers.length === 1) {
        switch(str){
            case 'height':
            case 'width':
            case 'none':
                break;
            default:
                str = 'none';
                break;
        }
    }
    answers.push(str);

    if (answers.length < questions.length) {
        ask(answers.length);
    } else {
        //Import the original json and parse
        fs.readFile(jsonPath, (err, data) => {
            if (err) {
                throw err;
            }
            var json = JSON.parse(data);
            processContent(json);
        });
    }
});

function processContent(json){
    var jsonCopy = JSON.parse(JSON.stringify(json));
    var name = answers[0];
    var nameCamel = name.replace(/-([a-z])/g, function (g) { return g[1].toUpperCase(); });
    var orientation = answers[1];

    //Create new directory
    var dir = `${destinationDir}/${name}`;
    if (!fs.existsSync(dir)){
        fs.mkdirSync(dir);
    } else {
        throw `Sprite directory already exists.`;
    }

    //Copy images from old directory to new one
    var ogdir = jsonPath.substr(0,jsonPath.lastIndexOf('/'));
    for (var i=0;i<json.images.length;i++){
        var imgpath = `${ogdir}/${json.images[i]}`;
        var destpath = `${dir}/ss-${i}.${json.images[i].split('.')[1]}`;

        shell.cp(imgpath, destpath);
    }

    //Remove images from json data object
    delete json.images;

    //set framerate to 12
    json.framerate = 12;
    
    // iterate through frames, find the max in last two fields of array
    var max1 = null;
    var max2 = null;
    for (var i=0;i<json.frames.length;i++){
        var n1 = json.frames[i][5],
            n2 = json.frames[i][6];
        if (max1 === null || n1 > max1) max1 = n1;
        if (max2 === null || n2 > max2) max2 = n2;
    }

    // iterate through again, subtract max from each value
    // prepare frames array for next step
    var frames = [];
    for (i=0;i<json.frames.length;i++){
        json.frames[i][5] -= max1;
        json.frames[i][6] -= max2;
        frames.push(i);
    }
 
    //Truncate animations
    // animations.default = { "frames": [{{all the frames}}] }
    json.animations = {
        "default": { frames: frames }
    }

    //write to new json file
    fs.writeFileSync(`${dir}/instructions.json`, JSON.stringify(json, null, 4), 'utf8');

    //read the template controller
    fs.readFile(templatePath, (err, data) => {
        if (err) {
            throw err;
        }


        //make mods to template
        var str = data.toString('utf8');
        str = str.replace(/%a/, importImgString(jsonCopy.images));
        str = str.replace(/%b/, nameCamel);
        str = str.replace(/%c/, imgArrayString(jsonCopy.images));
        str = str.replace(/%d/, name);

        if (orientation === 'none') {
            var parts = str.split('\n');
            var line = parts.findIndex(c=>{
                return c.indexOf('%e') !== -1;
            });
            parts.splice(line,1);
            str = parts.join('\n');
        } else {
            str = str.replace(/%e/, orientation);
        }

        //write to controller.js
        fs.writeFileSync(`${dir}/controller.js`, str, 'utf8');

        console.log('\n New sprite created at ' + dir);
        process.exit();
    });
}

function importImgString(images){
    var str = '';
    for (var i=0;i<images.length;i++){
        var img = images[i];
        var ext = `.${img.split('.')[1]}`;
        str += `import IMG${i} from './ss-${i}${ext}';\n`;
    }
    return str;
}

function imgArrayString(images){
    var str = '';
    for (var i=0;i<images.length;i++){
        if (i===0) str += '[';
        str += ` IMG${i},`
    }
    str = str.substr(0, str.length-1) + ' ]';
    return str;
}

