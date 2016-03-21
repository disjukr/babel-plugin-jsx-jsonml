var fs = require('fs');
var path = require('path');

var babel = require('babel-core');
var plugin = require('../index');

var input = fs.readFileSync(path.join(__dirname, 'input.jsx'), 'utf8');
var output = fs.readFileSync(path.join(__dirname, 'output.js'), 'utf8');
var babeled = babel.transform(input, {plugins: [plugin]}).code;

if (output !== babeled) {
    console.error('not equals!');
    console.error('--- expected ---');
    console.error(output);
    console.error('--- actual ---');
    console.error(babeled);
    process.exit(1);
}
