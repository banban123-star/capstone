const fs = require('fs');
const lines = fs.readFileSync('index.html', 'utf8').split('\n');
const line = lines.find(l => l.includes('PRICE'));
console.log("Line content: ", line);
for(let i=0; i<line.length; i++) {
    console.log(line[i], line.charCodeAt(i).toString(16));
}

