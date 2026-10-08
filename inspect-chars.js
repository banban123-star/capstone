const fs = require('fs');
const lines = fs.readFileSync('script.js', 'utf8').split('\n');
const line = lines[219]; // 0-indexed, so line 220
console.log("Line content: ", line);
for(let i=0; i<line.length; i++) {
    console.log(line[i], line.charCodeAt(i).toString(16));
}

