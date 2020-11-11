document.addEventListener("DOMContentLoaded", ()=>{

    // DOM elements

    const mainTag = document.querySelector("main")
    const headerTag = document.querySelector("header")
    const navTag = document.querySelector("nav")

    // Shiba images (set in case of fetching the same random image again)

    const viewedShibas = new Set()

    const saveShiba = shibaUrl => {
        viewedShibas.add(shibaUrl)
    }


    // Breed logic

    const parseBreeds = resp => {
        const breeds = []

        for (const breed in resp){
            const subBreeds = resp[breed]
            if (subBreeds.length === 0) {
                breeds.push({name: breed, stub: breed})
            } else {
                subBreeds.forEach(subBreed => {
                    breeds.push({name: `${subBreed} ${breed}`, stub: `${breed}/${subBreed}`})
                })
            }
        }

        return breeds
    }

    const fetchBreeds = () => {
        return fetch("https://dog.ceo/api/breeds/list/all")
        .then(resp => resp.json())
        .then(data => parseBreeds(data.message))
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

    // Navigation for a breed

    const breedOptionHTML = (breed, isSelected) => `<option ${isSelected ? "selected" : ""}>${breed.name}</option>`

    const loadNavigationForBreed = (breeds, selectedBreed) => {
        navTag.innerHTML= `
            <span>Select Breed:<span>
            <select>
                ${breeds.map(breed => breedOptionHTML(breed, breed.name === selectedBreed.name)).join("")}
            <select>
            <button id="random-shiba-button">Random ${selectedBreed.name}</button>
            <button id="viewed-shibas-button">Viewed ${selectedBreed.name}s</button>
        `
    }


    // App initialization and first render

    const renderApp = breeds => {

        console.log(breeds)

        loadNavigationForBreed(breeds, {name: "shiba", stub: "shiba"})

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

        navTag.addEventListener("change", e => {
            console.log("Selected Name:", e.target.value)
        })

    }

    fetchBreeds()
    .then(renderApp)



})

