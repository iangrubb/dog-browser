document.addEventListener("DOMContentLoaded", ()=>{

    // DOM elements

    const mainTag = document.querySelector("main")
    const headerTag = document.querySelector("header")

    // Shiba images (set in case of fetching the same random image again)

    const viewedShibas = new Set()

    const saveShiba = shibaUrl => {
        viewedShibas.add(shibaUrl)
    }


    // HTML rendering

    const shibaImageHTML = shibaUrl => `<img src="${shibaUrl}" alt="Shiba" width="200" >`

   
    // Data Access logic

    const fetchShibaImage = () => {
        return fetch("https://dog.ceo/api/breed/shiba/images/random")
        .then(resp => resp.json())
    }


    // View definitions

    const loadRandomShibaView = () => {
        fetchShibaImage()
        .then(data => {
            const shibaUrl = data.message
            saveShiba(shibaUrl)
            mainTag.innerHTML = shibaImageHTML(shibaUrl)
        })
    }

    // Previous shibas view

    const loadViewedShibasView = () => {
        mainTag.innerHTML = 
        Array.from(viewedShibas)
        .map(shibaImageHTML)
        .join("")
    }


    // DOM manipulation

    loadRandomShibaView()

    mainTag.addEventListener("click", e => {
        

    })

    headerTag.addEventListener("click", e => {
        if (e.target.id === "random-shiba-button") {
            loadRandomShibaView()
        } else if (e.target.id === "viewed-shibas-button") {
            loadViewedShibasView()
        }
    })



})

