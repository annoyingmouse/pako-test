import pako from './pako.js'
const db = new PouchDB('testing');

const resetDB = () => {
  db.get('bodies').then(function (doc) {
    return db.remove(doc);
  }).then(function (result) {
    console.log(`bodies removed`)
  }).catch(function (err) {});
  db.get('employees').then(function (doc) {
    return db.remove(doc);
  }).then(function (result) {
    console.log(`employees removed`)
  }).catch(function (err) {});
  db.get('family').then(function (doc) {
    return db.remove(doc);
  }).then(function (result) {
    console.log(`family removed`)
  }).catch(function (err) {});
}

const getSize = name => (localStorage[name].length * 2) / 1024

const generateRandomColor = () => {
  let maxVal = 0xFFFFFF; // 16777215
  let randomNumber = Math.random() * maxVal;
  randomNumber = Math.floor(randomNumber);
  randomNumber = randomNumber.toString(16);
  let randColor = randomNumber.padStart(6, 0);
  return `#${randColor.toUpperCase()}`
}

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

resetDB()

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
    // Get our data
    const response = await fetch(file)
    // Convert it into JSON
    const fetchedJSON = await response.json()
    // Convert our JSON to a string
    const stingifiedJSON = JSON.stringify(fetchedJSON)
    // Deflate our data with Pako
    const deflatedStringifiedJSON = pako.deflate(stingifiedJSON)
    // Convert the resulting Uint8Array into a regular array
    const regularArray = Array.from(deflatedStringifiedJSON)
    // Store our data using Pako
    localStorage.setItem(`${name}Array`, JSON.stringify(regularArray))
    // Store our data in localStorage
    localStorage.setItem(`${name}JSON`, stingifiedJSON)
    // Store our data in IndexedDB
    db.put(fetchedJSON);
  }

  async function retrieveAndDecompress(file, name) {
    // Get our data, for later testing
    const response = await fetch(file)
    const fetchedJSON = await response.json()
    // Get our data from localStorage
    const retrievedData = localStorage.getItem(`${name}Array`)
    // Convert it into an array again using JSON.parse()
    const retrievedArray = JSON.parse(retrievedData);
    // Convert the array back into a Uint8Array array
    const retrievedTypedArray = new Uint8Array(retrievedArray);
    // inflate the Uint8Array array using Pako
    const deflatedTypedArray = pako.inflate(retrievedTypedArray)
    // convert it back into the original data
    const json = JSON.parse(new TextDecoder().decode(deflatedTypedArray))
    const anotherJson = JSON.parse(localStorage.getItem(`${name}`))
    console.info(`Is the fetched ${file} the same as the retrieved, and decompressed, ${name}Array: ${JSON.stringify(fetchedJSON) === JSON.stringify(json)}`)
    const regularArraySize = getSize(`${name}Array`)
    const stingifiedJSONSize = getSize(`${name}JSON`)
    db.get(name).then(function(doc) {
      const jsonFromIndexedDB = doc[name]
      console.info(`Is the ${name} fetched from IndexedDB the same as the retrieved data from localStorage: ${JSON.stringify(jsonFromIndexedDB) === JSON.stringify(json[name])}`)
      console.log(Array(50).fill().map((_)=>'*').join(''))
    })
    console.info(`${name}Array is ${((regularArraySize / stingifiedJSONSize) * 100).toFixed(2)}% of the size of ${name}JSON`)
    console.log(Array(50).fill().map((_)=>'*').join(''))
  }

  compressAndStore('./bodies.json', 'bodies')
  compressAndStore('./family.json', 'family')
  compressAndStore('./employees.json', 'employees')
  retrieveAndDecompress('./bodies.json', 'bodies')
  retrieveAndDecompress('./family.json', 'family')
  retrieveAndDecompress('./employees.json', 'employees')

}, 3000)


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

setTimeout(() => {
  resetDB()
}, 6000)

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

  console.log(Array(50).fill().map((_)=>'*').join(''))

  async function timedCompressAndStore(file, name) {
    const response = await fetch(file)
    const fetchedJSON = await response.json()
    const stingifiedJSON = JSON.stringify(fetchedJSON)
    console.time(`Saving ${name} without Pako`)
    const StartSavingWithoutPako = window.performance.now()
    localStorage.setItem(`${name}JSON`, stingifiedJSON)
    console.timeEnd(`Saving ${name} without Pako`)
    const EndSavingWithoutPako = window.performance.now()
    const TimeTakenToSaveWithoutPako = (EndSavingWithoutPako - StartSavingWithoutPako) / 1000
    console.log(`Time taken to save without Pako: ${TimeTakenToSaveWithoutPako}`)

    const StartSavingWithPako = window.performance.now()
    console.time(`Deflating and saving ${name} with Pako`)
    const deflatedStringifiedJSON = pako.deflate(stingifiedJSON)
    const regularArray = Array.from(deflatedStringifiedJSON)
    localStorage.setItem(`${name}Array`, JSON.stringify(regularArray))
    console.timeEnd(`Deflating and saving ${name} with Pako`)
    const EndSavingWithPako = window.performance.now()
    const TimeTakenToSaveWithPako = (EndSavingWithPako - StartSavingWithPako)
    console.log(`Time taken to save with Pako: ${TimeTakenToSaveWithPako}`)
    console.log(Array(50).fill().map((_)=>'*').join(''))
    console.info(`The time taken to save ${name} as JSON is ${((TimeTakenToSaveWithoutPako / TimeTakenToSaveWithPako) * 100).toFixed(2)}% of the time it took to deflate and save using Pako`)
    console.log(Array(50).fill().map((_)=>'*').join(''))

    console.time(`saving ${name} with PouchDB`)
    const StartSavingWithPouchDB = window.performance.now()
    db.put(fetchedJSON).then(function(){
      console.timeEnd(`saving ${name} with PouchDB`)
      const EndSavingWithPouchDB = window.performance.now()
      const TimeTakenToSaveWithPouchDB = (EndSavingWithPouchDB - StartSavingWithPouchDB)
      console.log(Array(50).fill().map((_)=>'*').join(''))
      console.log(`Time taken to save ${name} using localStorage: ${TimeTakenToSaveWithoutPako}`)
      console.log(`Time taken to save ${name} with Pako: ${TimeTakenToSaveWithPako}`)
      console.log(`Time taken to save ${name} with PouchDB: ${TimeTakenToSaveWithPouchDB}`)
      console.log(Array(50).fill().map((_)=>'*').join(''))
      console.info(`The time taken to save ${name} as JSON is ${((TimeTakenToSaveWithoutPako / TimeTakenToSaveWithPouchDB) * 100).toFixed(2)}% of the time it took to save using PouchDB`)
      console.log(Array(50).fill().map((_)=>'*').join(''))
    });

  }

  timedCompressAndStore('./bodies.json', 'bodies')
  timedCompressAndStore('./family.json', 'family')
  timedCompressAndStore('./employees.json', 'employees')

}, 9000)

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
    console.time(`Getting and inflating ${name} with Pako`);
    const StartGettingWithPako = window.performance.now();
    const retrievedData = localStorage.getItem(`${name}Array`)
    const retrievedArray = JSON.parse(retrievedData);
    const retrievedTypedArray = new Uint8Array(retrievedArray);
    const deflatedTypedArray = pako.inflate(retrievedTypedArray)
    const json1 = JSON.parse(new TextDecoder().decode(deflatedTypedArray))
    console.timeEnd(`Getting and inflating ${name} with Pako`)
    const EndGettingWithPako = window.performance.now();
    const TimeTakenToGetWithPako = (EndGettingWithPako - StartGettingWithPako);


    console.time(`Getting and inflating ${name} without Pako`)
    const StartGettingWithoutPako = window.performance.now();
    const json2 = JSON.parse(localStorage.getItem(`${name}JSON`))
    console.timeEnd(`Getting and inflating ${name} without Pako`)
    const EndGettingWithoutPako = window.performance.now();
    const TimeTakenToGetWithoutPako = (EndGettingWithoutPako - StartGettingWithoutPako);

    console.log(Array(50).fill().map((_)=>'*').join(''))
    console.info(`The time taken to get ${name} as JSON is ${((TimeTakenToGetWithoutPako / TimeTakenToGetWithPako) * 100).toFixed(2)}% of the time it took to get and inflate using Pako`)
    console.log(Array(50).fill().map((_)=>'*').join(''))

    const StartGettingWithPounchDB = window.performance.now();
    db.get(name).then(function(doc) {
      const jsonFromIndexedDB = doc[name]
      const EndGettingWithPounchDB = window.performance.now();
      const TimeTakenToGetWithPounchDB = (EndGettingWithPounchDB - StartGettingWithPounchDB);
      console.log(`Time taken to get ${name} using localStorage: ${TimeTakenToGetWithoutPako}`)
      console.log(`Time taken to get ${name} with Pako: ${TimeTakenToGetWithPako}`)
      console.log(`Time taken to get ${name} with PouchDB: ${TimeTakenToGetWithPounchDB}`)
      console.info(`The time taken to get ${name} as JSON is ${((TimeTakenToGetWithoutPako / TimeTakenToGetWithPounchDB) * 100).toFixed(2)}% of the time it took to get using PouchDB`)
      console.log(Array(50).fill().map((_)=>'*').join(''))
    })
  }

  timedRetrieveAndDecompress('./bodies.json', 'bodies')
  timedRetrieveAndDecompress('./family.json', 'family')
  timedRetrieveAndDecompress('./employees.json', 'employees')

}, 15000)
