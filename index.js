import pako from './pako.js'

async function compressAndStore(file, name) {
  // Get our data
  const response = await fetch(file)
  const fetchedJSON = await response.json()
  // Convert our JSON to a string
  const stingifiedJSON = JSON.stringify(fetchedJSON)
  // Deflate our data with Pako
  const deflatedStringifiedJSON = pako.deflate(stingifiedJSON)
  // Convert the resulting Uint8Array into a regular array
  const regularArray = Array.from(deflatedStringifiedJSON)
  // Store our data (both deflated and the original)
  localStorage.setItem(`${name}Array`, JSON.stringify(regularArray))
  localStorage.setItem(`${name}JSON`, stingifiedJSON)
}

compressAndStore('./bodies.json', 'bodies')
compressAndStore('./family.json', 'family')

async function retrieveAndDecompress(file, name) {
  // Get our data for later testing
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
  console.info(`Is the fetched ${file} the same as the retrieve and decompressed ${name}Array: ${JSON.stringify(fetchedJSON) === JSON.stringify(json)}`)
  const regularArraySize = (localStorage[`${name}Array`].length * 2) / 1024
  const stingifiedJSONSize = (localStorage[`${name}JSON`].length * 2) / 1024
  console.log(`${name}Array is ${((regularArraySize / stingifiedJSONSize) * 100).toFixed(2)}% of the size of ${name}JSON`)
}

retrieveAndDecompress('./bodies.json', 'bodies')
retrieveAndDecompress('./family.json', 'family')

// // Get our data
// const response = await fetch('./bodies.json')
// const fetchedJSON = await response.json()
// // Convert our JSON to a string
// const stingifiedJSON = JSON.stringify(fetchedJSON)
// // Deflate our data with Pako
// const deflatedStringifiedJSON = pako.deflate(stingifiedJSON)
// // Convert the resulting Uint8Array into a regular array
// const regularArray = Array.from(deflatedStringifiedJSON)
// // Store our data (both deflated and original)
// localStorage.setItem('regularArray', JSON.stringify(regularArray))
// localStorage.setItem('stingifiedJSON', stingifiedJSON)

// // Get our data from localStorage
// const retrievedData = localStorage.getItem('regularArray')
// // Convert it into an array again using JSON.parse()
// const retrievedArray = JSON.parse(retrievedData);
// // Convert the array back into a Uint8Array array
// const retrievedTypedArray = new Uint8Array(retrievedArray);
// // inflate the Uint8Array array using Pako
// const deflatedTypedArray = pako.inflate(retrievedTypedArray)
// // convert it back into the original data
// const json = JSON.parse(new TextDecoder().decode(deflatedTypedArray))
// // console.info(`Is fetchedJSON the same as json: ${JSON.stringify(fetchedJSON) === JSON.stringify(json)}`)
//
// const getLocalStorageSize = () => {
//   let total = 0;
//   for (let x in localStorage) {
//     // Value is multiplied by 2 due to data being stored in `utf-16` format, which requires twice the space.
//     const amount = (localStorage[x].length * 2) / 1024;
//     if (!isNaN(amount) && localStorage.hasOwnProperty(x)) {
//       console.log(x, amount);
//       total += amount;
//     }
//   }
//   return total.toFixed(2);
// };
//
// /*
//  * Check our local storage
//  */
// setTimeout(() => {
//   getLocalStorageSize()
//   const regularArraySize = (localStorage['regularArray'].length * 2) / 1024
//   const stingifiedJSONSize = (localStorage['stingifiedJSON'].length * 2) / 1024
//   console.log(`regularArraySize is ${((regularArraySize / stingifiedJSONSize) * 100).toFixed(2)}% of the size of stingifiedJSONSize`)
//
//
// }, 500)