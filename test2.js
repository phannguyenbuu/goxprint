let input = '{"command_content": "import requests\\\\\\\\nimport urllib3"}';
let obj = JSON.parse(input);
let str = JSON.stringify(obj, null, 2);
console.log('original obj string:', obj.command_content);
console.log('stringified:', str);
console.log('replaced:', str.replace(/\\n/g, '\n'));
