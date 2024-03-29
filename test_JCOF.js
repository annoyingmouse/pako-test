import * as jcof from './jcof.js';

let exampleObject = {
  people: [
    {"first-name": "Bob", "age": 32, "occupation": "Plumber", "full-time": true},
    {"first-name": "Alice", "age": 28, "occupation": "Programmer", "full-time": true},
    {"first-name": "Bernard", "age": 36, "occupation": null, "full-time": null},
    {"first-name": "El", "age": 57, "occupation": "Programmer", "full-time": false}
  ]
};

let encoded = jcof.stringify(exampleObject);
console.log("JCOF-encoded object:", encoded);
let decoded = jcof.parse(encoded);
console.log("Decoded object:", decoded);