document.addEventListener("DOMContentLoaded", ()=>{

    // DOM elements

    const mainTag = document.querySelector("main")
    const headerTag = document.querySelector("header")
    const navTag = document.querySelector("nav")

    // Dog images (set in case of fetching the same random image again)

    const viewedDogs = {}

    const saveDog = (breedName, url) => {
        if (viewedDogs[breedName]) {
            viewedDogs[breedName].add(url)
        } else {
            const breedSet = new Set()
            breedSet.add(url)
            viewedDogs[breedName] = breedSet
        }
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



    const loadRandomDogOfBreed = breed => {
        fetchDogImage(breed.stub)
        .then(data => {
            const imageUrl = data.message
            saveDog(breed.name, imageUrl)
            mainTag.innerHTML = dogImageHTML(imageUrl, breed.name)
        })
    }

    const loadViewedDogsOfBreed = breed => {
        const breedSet = viewedDogs[breed.name]
        mainTag.innerHTML = 
        Array.from(breedSet)
        .map(imageUrl => dogImageHTML(imageUrl, breed.name))
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
            loadRandomDogOfBreed(breed)
        }

        let selectedBreed = {name: "shiba", stub: "shiba"}

        loadNavigationForBreed(selectedBreed)


        mainTag.addEventListener("click", e => {
            

        })

        headerTag.addEventListener("click", e => {
            if (e.target.id === "random-shiba-button") {
                loadRandomDogOfBreed(selectedBreed)
            } else if (e.target.id === "viewed-shibas-button") {
                loadViewedDogsOfBreed(selectedBreed)
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

