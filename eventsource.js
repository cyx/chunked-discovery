var EventSource = require('eventsource');

var es = new EventSource('http://localhost:3000/');

es.onmessage = function(e) {
    console.log(e.data);
};

es.onerror = function(err) {
    if (err) {
        console.log(err);
    }
};
