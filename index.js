const spinner = document.getElementById("spinner");
const imgEle = document.getElementById("image-output");

function init() {
    let select = document.getElementById("category");

    fetch("https://cataas.com/api/tags")
        .then(resp => resp.json())
        .then(data => {
            for (var i=1; i<data.length; i++) {
                let option = document.createElement("option");
                option.value = data[i];
                option.innerHTML = data[i];
                select.appendChild(option);
            }
             
            console.log()
        })
};

init();

function handleSubmission(event) {
    event.preventDefault();

    spinner.classList.remove('hidden');
    imgEle.classList.add('hidden');
    

    const type = document.getElementById("category").value;
    const text = document.getElementById("text").value;
    const rotate = document.getElementById("rotate").value;
    const flip = document.getElementById("flip").value;
    const random = document.getElementById("random").checked;
    const params = {
        type,
        text,
        rotate,
        flip,
        random
    }

    console.log(type)
    console.log(text)
    console.log(rotate)
    console.log(flip)
    console.log(random)

    getImg(params)
}

function getImg(params) {
    

    console.log(params)
    const endpoint = "https://id786qvxv4.execute-api.us-east-1.amazonaws.com/Prod/?";

    const jP = jQuery.param({
        category: params.type,
        text: params.text,
        rotate: params.rotate,
        flip: params.flip,
        random: params.random,
    });

    console.log(endpoint + jP)
    fetch(endpoint + jP, {
        headers: {
            "Content-Type": 'text/plain'
        },
       
    })
        .then(resp => resp.json())
        .then(data => {
            console.log(data)
            setImg(data.base64Str)
        })

}

function setImg(bs4) {

    const base = `data:image/png;base64, `
    imgEle.src = base + bs4 
    imgEle.classList.remove("hidden");
    spinner.classList.add('hidden');

}

// end of code
