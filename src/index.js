document.addEventListener("DOMContentLoaded", ()=>{

    const mainTag = document.querySelector("main")

    console.log(mainTag)

    const renderShiba = shibaUrl => {
        mainTag.innerHTML = `<img src="${shibaUrl}" alt="A Shiba" width="200" >`
    }

    fetch("https://dog.ceo/api/breed/shiba/images/random")
    .then(resp => resp.json())
    .then(data => renderShiba(data.message))



})

