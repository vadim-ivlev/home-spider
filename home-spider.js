//jshint esversion: 6

const child_process = require('child_process');
const fs            = require('fs');
const path          = require('path');
const cheerio       = require('cheerio');
const elasticlunr   = require('elasticlunr');
const read          = require('fs-readdir-recursive'); // TODO: get rid of
const u             = require('./home-spider-utils.js');

const exec = child_process.execSync;

function diff(a1,a2){
    return a1.filter((n)=> !a2.includes(n));
}

// function getListOfFiles(startFolder){
//     return exec(`find ${startFolder} -name '*.htm*'`).toString().split('\n');
// }

function getListOfFiles(startFolder='.', regexp ){
    var re  = new RegExp(regexp);
    var lst = read(startFolder).filter((name) => re.test(name));
        lst = lst.map( (e) => path.join(startFolder,e) );
    return lst;
}

let dirName = '_oreilly';
let fileMask = '\\.s?html?$';

let files = getListOfFiles(dirName,fileMask);
console.log(`Number of files2 = ${files.length}`);


let stat = new u.StatPrinter();

// let index = elasticlunr(function () {
//     this.setRef  ('id');
//     this.addField('title');
//     this.addField('h1');
//     this.addField('text');
// });

let index = elasticlunr();
index.setRef  ('id');
index.addField('title');
index.addField('h1');
index.addField('text');
index.saveDocument(false);





let id = 0;
for (let file of files.slice(0,1010)){
    if (!file) continue;

    let fileText = fs.readFileSync(file).toString();
    let chee     = cheerio.load(fileText);
    
    
    
    let doc={
        id   : ++id,
        title: u.trimSpaces(chee('title').text()),
        h1   : u.trimSpaces(chee('h1').text()),
        text : u.trimSpaces(chee('body').text())
    };

    index.addDoc(doc);


    stat.add(fileText.length, doc.text.length);
}
stat.print();  
let indexJSON = index.toJSON();
let indexStr  = JSON.stringify( indexJSON );

console.log(`\nbulding index done. len=${(indexStr.length/1024/1024).toFixed(2)} mb`);




let results = index.search('database search engine',{});
console.log(JSON.stringify(results.slice(0,5),null,2));

let indexFileName='_lunr_index_'+ dirName;
fs.writeFileSync(indexFileName + '.json', indexStr);  
console.log(exec(`zip ${indexFileName} ${indexFileName}.json`).toString());

