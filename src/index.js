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

    const dogImageHTML = (url, breedName) => {
        return `<img src="${url}" alt="${breedName}" width="200">`
    }

    
    // Data Access logic

    const fetchDogImage = stub => {
        return fetch(`https://dog.ceo/api/breed/${stub}/images/random`)
        .then(resp => resp.json())
    }


    // View definitions

    const loadRandomDogView = breed => {
        fetchDogImage(breed.stub)
        .then(data => {
            console.log(data)
            const imageUrl = data.message
            console.log(dogImageHTML(imageUrl, breed.name))
            mainTag.innerHTML = dogImageHTML(imageUrl, breed.name)
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

    const breedOptionHTML = (name, isSelected) => `<option ${isSelected ? "selected" : ""}>${name}</option>`

    const renderNavigation = (breeds, selectedBreedName) => {
        navTag.innerHTML= `
            <span>Select Breed:<span>
            <select>
                ${breeds.map(breed => breedOptionHTML(breed.name, breed.name === selectedBreedName)).join("")}
            <select>
            <button id="random-shiba-button">Random ${selectedBreedName}</button>
            <button id="viewed-shibas-button">Viewed ${selectedBreedName}s</button>
        `
    }


    // App initialization and first render

    const renderApp = breeds => {
        
        const loadNavigationForBreed = breed => {
            renderNavigation(breeds, breed.name)
            loadRandomDogView(breed)
        }

        let selectedBreed = {name: "shiba", stub: "shiba"}

        loadNavigationForBreed(selectedBreed)


        mainTag.addEventListener("click", e => {
            

        })

        headerTag.addEventListener("click", e => {
            if (e.target.id === "random-shiba-button") {
                loadRandomDogView(selectedBreed)
            } else if (e.target.id === "viewed-shibas-button") {
                loadViewedShibasView()
            }
        })

        navTag.addEventListener("change", e => {
            const breed = breeds.find(b => b.name === e.target.value)
            selectedBreed = breed
            loadNavigationForBreed(selectedBreed)
        })

    }

    fetchBreeds()
    .then(renderApp)



})

