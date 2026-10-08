const fs = require('fs');

let indexHtml = fs.readFileSync('index.html', 'utf8');

const badHtmlTarget = `                      </div>>
                    <div>
                        <label class="block text-xs font-bold text-slate-600 uppercase mb-1.5">Initial Stock Quantity</label>`;
const fixedHtml = `                      </div>
                      <div id="part-expiry-wrap" class="hidden"></div>
                    <div>
                        <label class="block text-xs font-bold text-slate-600 uppercase mb-1.5">Initial Stock Quantity</label>`;

const t = badHtmlTarget.replace(/\r\n/g, '\n');
let idxHtmlUnix = indexHtml.replace(/\r\n/g, '\n');
if (idxHtmlUnix.includes(t)) {
    indexHtml = idxHtmlUnix.replace(t, fixedHtml);
    console.log('Fixed stray > and added part-expiry-wrap');
} else {
    console.log('Could not find bad HTML target in index.html');
}

if (indexHtml.includes('PRICE (?)')) {
    indexHtml = indexHtml.replace('PRICE (?)', 'PRICE (&#8369;)');
    console.log('Fixed PRICE (?) in index.html');
}

fs.writeFileSync('index.html', indexHtml, 'utf8');

let scriptJs = fs.readFileSync('script.js', 'utf8');

// The ? symbol precedes a variable interpolation for peso, e.g. "?${" -> "\u20B1${"
let countPesoVars = 0;
scriptJs = scriptJs.replace(/\?\$\{/g, () => {
    countPesoVars++;
    return '\\u20B1${';
});
console.log(`Replaced ${countPesoVars} occurrences of "?\${" with Peso sign code.`);

// "? " -> "\u20B1 " in fmtPeso
let countPesoSpace = 0;
scriptJs = scriptJs.replace(/\? /g, (match, offset, str) => {
    countPesoSpace++;
    return '\\u20B1 ';
});
console.log(`Replaced ${countPesoSpace} occurrences of "? " with Peso sign code.`);

// "?500" -> "\u20B1500"
scriptJs = scriptJs.replace(/\?([0-9]+)/g, '\\u20B1$1');
scriptJs = scriptJs.replace(/\?([0-9,.]+)/g, '\\u20B1$1');

// Now let's handle \uFFFD (Replacement Character, U+FFFD)
// Context 1: SKU: ... \uFFFD ... / unit \uFFFD
scriptJs = scriptJs.replace(/ \uFFFD /g, ' \\u2022 ');

// Context 2: "All checked \uFFFD" -> "All checked \\u2713" (check mark)
scriptJs = scriptJs.replace(/All (.*?) checked \uFFFD/g, 'All $1 checked \\u2713');

// Context 3: <span class="font-semibold opacity-70">\uFFFD ${part.stock} in stock</span> -> bullet
scriptJs = scriptJs.replace(/\uFFFD \$\{/g, '\\u2022 ${');

// Context 4: join(' \uFFFD ') -> join(' \\u2022 ')
scriptJs = scriptJs.replace(/join\(' \uFFFD '\)/g, "join(' \\u2022 ')");

// Replace any remaining \uFFFD
scriptJs = scriptJs.replace(/\uFFFD/g, '\\u2022');

fs.writeFileSync('script.js', scriptJs, 'utf8');
console.log('Processed script.js');

