const Jimp = require('jimp');

exports.handler = async (event) => {
    
    const requestObj = getRequestParams(event);
    
    if (requestObj.random === "true") {
         requestObj.category = "";
         requestObj.text = randomText(); // get a random text 
         requestObj.rotate = randomNumber(0, 360); // rotate a random number of degrees
         requestObj.flip = Math.random() > 0.5 ? "x" : "y"; // random flip in either x or y
    }
    const catUrl = getCat(requestObj.category);
    const base64Str = await manipulateImage(catUrl, requestObj);
    
    
    return {
    headers: {
      "Access-Control-Allow-Headers" : "Content-Type",
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "OPTIONS,POST,GET"
    },
    body: JSON.stringify({base64Str})
  };
};


function getRequestParams(event) {
    const category = event["queryStringParameters"]["category"];
    const text = event["queryStringParameters"]["text"];
    const rotate = event["queryStringParameters"]["rotate"];
    const flip = event["queryStringParameters"]["flip"];
    const random = event["queryStringParameters"]["random"];
    
    return {category, text, rotate, flip, random}
}


function randomText() {
  const puns = [
    "Purrfect",
    "Poo Poo",
    "Kitty!",
    "Paw-some."
  ]
  // returns a random item from the puns array
  return puns[Math.floor(Math.random()*puns.length)];
}

function randomNumber(min, max) {
  return Math.floor(Math.random() * max) + min
}


function getCat(tag) {
    if (tag) {
        return `https://cataas.com/cat/${tag}`
    }
    else {
        return `https://cataas.com/cat`
    }
}

async function manipulateImage(url, requestObj) {
    let response;
    const image = await Jimp.read(url);
    

    if (requestObj.rotate) {
        const rotateDeg = parseInt(requestObj.rotate);
        console.log(rotateDeg)
        await image.rotate(rotateDeg);
    }

  if (requestObj.flip === "h") {
      console.log("h")
    await image.flip(true, false);
  }
  else if (requestObj.flip === "v") {
      console.log("v")
    await image.flip(false, true);
  }
  else if (requestObj.flip === "b") {
      console.log("b")
    await image.flip(true, true);
  } 
  
  
    if (requestObj.text) {
        const font = await Jimp.loadFont(Jimp.FONT_SANS_64_BLACK);
        await image.print(font, 50, 50, requestObj.text);
    }
    
    
    image.getBuffer(Jimp.MIME_PNG, (err, buffer) => {
        response = Buffer.from(buffer).toString('base64');
    });
    return response;
}
