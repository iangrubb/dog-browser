document.addEventListener("DOMContentLoaded", ()=>{

    const mainTag = document.querySelector("main")

    const renderShiba = shibaUrl => {
        mainTag.innerHTML = `
            <button id="new-random-shiba">New Shiba</button>
            <img src="${shibaUrl}" alt="A Shiba" width="200" >
            `
    }

    const fetchShibaImage = () => {
        return fetch("https://dog.ceo/api/breed/shiba/images/random")
        .then(resp => resp.json())
    }

    fetchShibaImage().then(data => renderShiba(data.message))

    mainTag.addEventListener("click", e => {
        console.log(e.target.id)
        if (e.target.id === "new-random-shiba") {
            fetchShibaImage().then(data => renderShiba(data.message))
        }
    })



})

