const fs = require('fs');
let scriptJs = fs.readFileSync('script.js', 'utf8');

// Reverse the ternary operator corruption
// We look for literal "\u20B1" preceded by a space or specific characters
scriptJs = scriptJs.replace(/ \\u20B1 /g, ' ? ');
scriptJs = scriptJs.replace(/\\u20B1 '/g, "? '");
scriptJs = scriptJs.replace(/\\u20B1 `/g, "? `");
scriptJs = scriptJs.replace(/\\u20B1 "/g, '? "');
scriptJs = scriptJs.replace(/\\u20B1 \{/g, '? {');

// Fix fmtPeso back to what it should be
scriptJs = scriptJs.replace(/const fmtPeso = n => '\? '/g, "const fmtPeso = n => '\\u20B1 '");

// Restore \u20B1 where it was supposed to be (for currencies)
scriptJs = scriptJs.replace(/">\? \$\{/g, '">\\u20B1 ${');

fs.writeFileSync('script.js', scriptJs, 'utf8');
console.log('Fixed ternary operators in script.js');

