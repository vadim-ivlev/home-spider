//jshint esversion: 6
const readline = require('readline');


class StatPrinter {
    constructor(){
        this.n=0;
        this.fileSize=0;
        this.textSize=0;
    }

    add(fileSize, textSize){
        this.n++;
        // this.fileSize+=fs.statSync(fileName).size;
        this.fileSize+=fileSize;
        this.textSize+=textSize;
        if (this.n%10 ==0){
            this.print();
        }    
    }
    
    print(){
        let s=`n=${this.n} file size=${ (this.fileSize/1024/1024).toFixed(2)} mb. text=${(this.textSize/1024/1024).toFixed(2)} mb.`;
        // console.log(s);
        readline.clearLine(process.stdout, 0);
        readline.cursorTo(process.stdout, 0);
        process.stdout.write(s);
    }
}


function trimSpaces(body) {
    body = body.replace(/\n  */g, '\n');
    body = body.replace(/\n\n+/g, '\n\n');
    body = body.replace(/^\n+/g, '');
    body = body.replace(/\n+$/g, '');
    return body;
}

module.exports.StatPrinter=StatPrinter;
module.exports.trimSpaces=trimSpaces;
