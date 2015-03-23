var request = require('request');

request.get('http://localhost:3000').pipe(process.stdout);
