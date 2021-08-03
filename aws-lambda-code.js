const Jimp = require('jimp'); // npm package jimp

exports.handler = async (event) => {

  const requestObj = getRequestParams(event); // get all the `queryStringParameters` that were passed in

  // randomizing the image returned
  if (requestObj.random === "true") {
    requestObj.category = ""; // get a cat from a random category (blank strings evaluate to false in JS)
    requestObj.text = randomText(); // get a random text 
    requestObj.rotate = randomNumber(0, 360); // rotate a random number of degrees
    requestObj.flip = Math.random() > 0.5 ? "x" : "y"; // random flip in either x or y
  }
  const catUrl = getCat(requestObj.category); // get either a category of a cat or a random cat URL back 
  const base64Str = await manipulateImage(catUrl, requestObj); // manipulate the image according to the user's desires!

  return {
    headers: {
      "Access-Control-Allow-Headers": "Content-Type", // determines which headers can be used in the request
      "Access-Control-Allow-Origin": "*", // determines which domains the request can come from (* means any)
      "Access-Control-Allow-Methods": "OPTIONS,POST,GET" // determines which request methods are allowed on this endpoint
    },
    body: JSON.stringify({ base64Str }) // return a string of a JSON object
  };
};


function getRequestParams(event) {
  // function gets each parameter (category, text, rotate, flip, random) from the query string from what the user passed in
  const category = event["queryStringParameters"]["category"]; // ex: fat, cute, etc
  const text = event["queryStringParameters"]["text"]; // ex: ganning, hello there, etc
  const rotate = event["queryStringParameters"]["rotate"]; // ex: 45, 134, etc
  const flip = event["queryStringParameters"]["flip"]; // ex: v, h, b
  const random = event["queryStringParameters"]["random"]; // ex: true, false

  return { category, text, rotate, flip, random } // returns an object of each queryStringParameters
}


function randomText() {
  // function generates a random text from a array
  const puns = [
    "Purrfect",
    "Poo Poo",
    "Kitty!",
    "Paw-some."
  ]
  // returns a random item from the puns array
  return puns[Math.floor(Math.random() * puns.length)];
}

function randomNumber(min, max) {
  // function returns a random integer (whole number) between `min` and `max`
  return Math.floor(Math.random() * max) + min
}

function getCat(tag) {
  // if the `tag` parameter is not an empty string, then we will return a cat from a category, otherwise, return a random cat
  if (tag) {
    return `https://cataas.com/cat/${tag}` // cat from a category
  }
  else {
    return `https://cataas.com/cat` // random cat
  }
}

async function manipulateImage(url, requestObj) {
  // the `url` parameter is the url of the cat image
  // the `requestObj` parameter is the object with all of the queryStringParameters
  let response;
  const image = await Jimp.read(url); // reads the cat url into an instance of the Jimp object

  // [ROTATING THE IMAGE]
  // syntax: await image.rotate(degrees)
  if (requestObj.rotate) {
    // if the user passed in a value for rotate, then rotate the image however many degrees they specified
    const rotateDeg = parseInt(requestObj.rotate); // rotating by an integer
    await image.rotate(rotateDeg);
  }

  // [FLIPPING THE IMAGE]
  // syntax: await image.flip(horizontalFlilp, verticalFlip)
  if (requestObj.flip === "h") {
    // if the user passed in `h` for flip, we flip the image horizontally
    console.log("h")
    await image.flip(true, false);
  }
  else if (requestObj.flip === "v") {
    // if the user passed in `v` for flip, we flip the image vertically
    console.log("v")
    await image.flip(false, true);
  }
  else if (requestObj.flip === "b") {
    // if the user passed in `b` for flip, we flip the image both horizontally and vertically
    console.log("b")
    await image.flip(true, true);
  }

  // [ADDING TEXT TO IMAGE]
  // syntax: await image.print(font, x, y, text)
  if (requestObj.text) {
    const font = await Jimp.loadFont(Jimp.FONT_SANS_64_BLACK); // loads the font we will use
    await image.print(font, 50, 50, requestObj.text); // adds text the user passed in onto the image at the coordinate point (50, 50), with (0,0) being at the top left corner
  }

  image.getBuffer(Jimp.MIME_PNG, (err, buffer) => {
    response = Buffer.from(buffer).toString('base64'); // return the image in a base64 format
  });
  return response; // return the base64 string
}
