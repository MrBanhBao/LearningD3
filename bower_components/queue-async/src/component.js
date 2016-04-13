var queue = require("../../../Chapter6/resources/queue");

console.log(JSON.stringify({
  "name": "queue-async",
  "version": queue.version,
  "main": "./queue.js"
}, null, 2));
