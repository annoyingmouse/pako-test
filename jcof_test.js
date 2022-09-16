import * as jcof from "./jcof.js";
const getSize = (name) => (localStorage[name].length * 2) / 1024;

/*
 .d8888b.  888                     888
d88P  Y88b 888                     888
Y88b.      888                     888
 "Y888b.   888888  8888b.  888d888 888888
    "Y88b. 888        "88b 888P"   888
      "888 888    .d888888 888     888
Y88b  d88P Y88b.  888  888 888     Y88b.
 "Y8888P"   "Y888 "Y888888 888      "Y888
*/

/*
 .d8888b.                                                        888
d88P  Y88b                                                       888
     .d88P                                                       888
    8888"       .d8888b   .d88b.   .d8888b .d88b.  88888b.   .d88888 .d8888b
     "Y8b.      88K      d8P  Y8b d88P"   d88""88b 888 "88b d88" 888 88K
888    888      "Y8888b. 88888888 888     888  888 888  888 888  888 "Y8888b.
Y88b  d88P           X88 Y8b.     Y88b.   Y88..88P 888  888 Y88b 888      X88
 "Y8888P"        88888P'  "Y8888   "Y8888P "Y88P"  888  888  "Y88888  88888P'
*/

setTimeout(() => {
  async function compressAndStore(file, name) {
    const response = await fetch(file);
    const fetchedJSON = await response.json();
    localStorage.setItem(`${name}String`, JSON.stringify(fetchedJSON));
    localStorage.setItem(`${name}JCOF`, jcof.stringify(fetchedJSON));
  }

  async function retrieveAndDecompress(file, name) {
    const response = await fetch(file);
    const fetchedJSON = await response.json();
    const retrievedString = localStorage.getItem(`${name}String`);
    const retrievedJSON = JSON.parse(retrievedString);

    const retrievedJCOFString = localStorage.getItem(`${name}JCOF`);
    const retrievedJCOF = jcof.parse(retrievedJCOFString);

    console.info(
      `Is the fetched ${file} the same as the retrieved, and decompressed, ${name}JCOF: ${_.isEqual(
        fetchedJSON,
        retrievedJCOF
      )}`
    );
    console.info(
      `Is the retrieved ${file} the same as the retrieved, and decompressed, ${name}JCOF: ${_.isEqual(
        retrievedJSON,
        retrievedJCOF
      )}`
    );
    const regularJSONSize = getSize(`${name}String`);
    const stingifiedJCOFSize = getSize(`${name}JCOF`);
    console.info(
      `${name}JCOFString is ${(
        (stingifiedJCOFSize / regularJSONSize) *
        100
      ).toFixed(2)}% of the size of ${name}String`
    );
    console.log(
      `3 Seconds: ${Array(50)
        .fill()
        .map((_) => "*")
        .join("")}`
    );
  }

  compressAndStore("./bodies.json", "bodies");
  compressAndStore("./family.json", "family");
  compressAndStore("./employees.json", "employees");
  retrieveAndDecompress("./bodies.json", "bodies");
  retrieveAndDecompress("./family.json", "family");
  retrieveAndDecompress("./employees.json", "employees");
}, 3000);

/*
 .d8888b.  888                     888                                    d8b
d88P  Y88b 888                     888                                    Y8P
Y88b.      888                     888
 "Y888b.   888888  8888b.  888d888 888888       8888b.   .d88b.   8888b.  888 88888b.
    "Y88b. 888        "88b 888P"   888             "88b d88P"88b     "88b 888 888 "88b
      "888 888    .d888888 888     888         .d888888 888  888 .d888888 888 888  888
Y88b  d88P Y88b.  888  888 888     Y88b.       888  888 Y88b 888 888  888 888 888  888
 "Y8888P"   "Y888 "Y888888 888      "Y888      "Y888888  "Y88888 "Y888888 888 888  888
                                                             888
                                                        Y8b d88P
                                                         "Y88P"
*/

/*
 d888   .d8888b.                                                        888
d8888  d88P  Y88b                                                       888
  888  888    888                                                       888
  888  888    888      .d8888b   .d88b.   .d8888b .d88b.  88888b.   .d88888 .d8888b
  888  888    888      88K      d8P  Y8b d88P"   d88""88b 888 "88b d88" 888 88K
  888  888    888      "Y8888b. 88888888 888     888  888 888  888 888  888 "Y8888b.
  888  Y88b  d88P           X88 Y8b.     Y88b.   Y88..88P 888  888 Y88b 888      X88
8888888 "Y8888P"        88888P'  "Y8888   "Y8888P "Y88P"  888  888  "Y88888  88888P'
*/

setTimeout(() => {
  async function timedCompressAndStore(file, name) {
    const response = await fetch(file);
    const fetchedJSON = await response.json();

    console.time(`Saving ${name} without JCOF`);
    const StartSavingWithoutJCOF = window.performance.now();
    localStorage.setItem(`${name}JSON`, JSON.stringify(fetchedJSON));
    console.timeEnd(`Saving ${name} without JCOF`);
    const EndSavingWithoutJCOF = window.performance.now();
    const TimeTakenToSaveWithoutJCOF =
      (EndSavingWithoutJCOF - StartSavingWithoutJCOF) / 1000;
    console.log(
      `Time taken to save without JCOF: ${TimeTakenToSaveWithoutJCOF}`
    );

    console.time(`Saving ${name} with JCOF`);
    const StartSavingWithJCOF = window.performance.now();
    localStorage.setItem(`${name}JCOF`, jcof.stringify(fetchedJSON));
    console.timeEnd(`Saving ${name} with JCOF`);
    const EndSavingWithJCOF = window.performance.now();
    const TimeTakenToSaveWithJCOF =
      (EndSavingWithJCOF - StartSavingWithJCOF) / 1000;
    console.log(`Time taken to save without JCOF: ${TimeTakenToSaveWithJCOF}`);
    console.log(
      `10 Seconds: ${Array(50)
        .fill()
        .map((_) => "*")
        .join("")}`
    );
    console.info(
      `The time taken to save ${name} as JSON is ${(
        (TimeTakenToSaveWithoutJCOF / TimeTakenToSaveWithJCOF) *
        100
      ).toFixed(2)}% of the time it took to deflate and save using JCOF`
    );
    console.log(
      `10 Seconds: ${Array(50)
        .fill()
        .map((_) => "*")
        .join("")}`
    );
    console.log(
      `Time taken to save ${name} using localStorage: ${TimeTakenToSaveWithoutJCOF}`
    );
    console.log(
      `Time taken to save ${name} with JCOF: ${TimeTakenToSaveWithJCOF}`
    );
    console.log(
      `10 Seconds: ${Array(50)
        .fill()
        .map((_) => "*")
        .join("")}`
    );
  }

  timedCompressAndStore("./bodies.json", "bodies");
  timedCompressAndStore("./family.json", "family");
  timedCompressAndStore("./employees.json", "employees");
}, 9000);

/*
 d888  888888888                                                        888
d8888  888                                                              888
  888  888                                                              888
  888  8888888b.       .d8888b   .d88b.   .d8888b .d88b.  88888b.   .d88888 .d8888b
  888       "Y88b      88K      d8P  Y8b d88P"   d88""88b 888 "88b d88" 888 88K
  888         888      "Y8888b. 88888888 888     888  888 888  888 888  888 "Y8888b.
  888  Y88b  d88P           X88 Y8b.     Y88b.   Y88..88P 888  888 Y88b 888      X88
8888888 "Y8888P"        88888P'  "Y8888   "Y8888P "Y88P"  888  888  "Y88888  88888P'
*/

setTimeout(() => {
  async function timedRetrieveAndDecompress(file, name) {
    console.time(`Getting and inflating ${name} with JCOF`);
    const StartGettingWithJCOF = window.performance.now();
    const json1 = jcof.parse(localStorage.getItem(`${name}JCOF`));
    console.timeEnd(`Getting and inflating ${name} with JCOF`);
    const EndGettingWithJCOF = window.performance.now();
    const TimeTakenToGetWithJCOF = EndGettingWithJCOF - StartGettingWithJCOF;

    console.time(`Getting and inflating ${name} without JCOF`);
    const StartGettingWithoutJCOF = window.performance.now();
    const json2 = JSON.parse(localStorage.getItem(`${name}String`));
    console.timeEnd(`Getting and inflating ${name} without JCOF`);
    const EndGettingWithoutJCOF = window.performance.now();
    const TimeTakenToGetWithoutJCOF =
      EndGettingWithoutJCOF - StartGettingWithoutJCOF;

    console.log(
      `15 Seconds: ${Array(50)
        .fill()
        .map((_) => "*")
        .join("")}`
    );
    console.info(
      `The time taken to get ${name} as JSON is ${(
        (TimeTakenToGetWithoutJCOF / TimeTakenToGetWithJCOF) *
        100
      ).toFixed(2)}% of the time it took to get and inflate using JCOF`
    );
    console.log(
      `15 Seconds: ${Array(50)
        .fill()
        .map((_) => "*")
        .join("")}`
    );
    console.log(
      `Size of ${name} as JSON in localStorage: ${getSize(`${name}String`)}`
    );
    console.log(
      `Size of ${name} as JCOF in localStorage: ${getSize(`${name}JCOF`)}`
    );
    console.info(
      `The size of ${name} as JCOF (in localStorage) is ${(
        (getSize(`${name}JCOF`) / getSize(`${name}String`)) *
        100
      ).toFixed(2)}% of the size as JSON in localStorage`
    );
    console.log(
      `15 Seconds: ${Array(50)
        .fill()
        .map((_) => "*")
        .join("")}`
    );
  }

  timedRetrieveAndDecompress("./bodies.json", "bodies");
  timedRetrieveAndDecompress("./family.json", "family");
  timedRetrieveAndDecompress("./employees.json", "employees");
}, 15000);
