document.addEventListener("DOMContentLoaded", async () => {

    // DOM elements

    const mainTag = document.querySelector("main")
    const headerTag = document.querySelector("header")
    const navTag = document.querySelector("nav")





    // HTML rendering

    const dogImageHTML = (url, breedName) => `<img src="${url}" alt="${breedName}" width="200">`
    
    const breedSelectHTML = (breed) => {
        return `
            <div>
                <h3>${breed.name}</h3>
                ${dogImageHTML(breed.previewImage, breed.name)}
                <button data-breed-id="${breed.id}">Select</button>
            </div>
        `
    }

    const renderDogBrowserHTML = (breeds) => {
        return `
            ${breeds.map(breedSelectHTML).join("")}
            <button id="more-dogs-button">More</button>
        `
    }

    const breedOptionHTML = (breed, selectedBreed) => `<option ${breed.id === selectedBreed.id ? "selected" : ""} value="${breed.id}">${breed.name}</option>`

    const navigationHTML = (breeds, selectedBreed) => {
        return `
            <span>Select Breed:<span>
            <select>
                ${breeds.map(breed => breedOptionHTML(breed, selectedBreed)).join("")}
            <select>
            <button id="random-dog-button">Random ${selectedBreed.name}</button>
            <button id="viewed-dogs-button">Viewed ${selectedBreed.name}s</button>
            <button id="browse-breeds">Browse Breeds</button>
        `
    }




    let dogAPI = await DogAPI.asyncConstructor()

    const breeds = dogAPI.breeds

    const loadRandomDogOfBreed = breed => {
        dogAPI.requestRandomImageForBreed(breed.id)
        .then(imageUrl => {
            mainTag.innerHTML = dogImageHTML(imageUrl, breed.name)
        })
    }

    const loadViewedDogsOfBreed = breed => {
        mainTag.innerHTML =
            dogAPI.getBreedById(breed.id)
            .randomImages()
            .map(image => dogImageHTML(image, breed.name))
            .join("")
    }

    const loadBreedBrowser = () => {
        const previewedBreeds = dogAPI.getBreedsWithPreviews()

        if (previewedBreeds.length > 0) {
            mainTag.innerHTML = renderDogBrowserHTML(previewedBreeds)
        } else {
            dogAPI.fetchPreviewImageBatch()
            .then(fetchedBreeds => {
                mainTag.innerHTML = renderDogBrowserHTML(fetchedBreeds)
            })
        }
    }

    const loadNavigationForBreed = selectedBreed => {
        navTag.innerHTML = navigationHTML(breeds, selectedBreed)
        loadRandomDogOfBreed(selectedBreed)
    }


    let selectedBreed = dogAPI.getBreedByName("shiba")

    loadNavigationForBreed(selectedBreed)

    mainTag.addEventListener("click", e => {
        if (e.target.dataset.breedId) {
            const breedId = parseInt(e.target.dataset.breedId)
            const breed = dogAPI.getBreedById(breedId)
            selectedBreed = breed
            loadNavigationForBreed(selectedBreed)
        } else if (e.target.id === "more-dogs-button") {
            dogAPI.fetchPreviewImageBatch()
            .then(breeds => {
                const moreDogsButton = document.getElementById("more-dogs-button")
                moreDogsButton.insertAdjacentHTML("beforebegin",
                    breeds.map(breedSelectHTML).join("")
                )
            })
        }
    })

    headerTag.addEventListener("click", e => {
        if (e.target.id === "random-dog-button") {
            loadRandomDogOfBreed(selectedBreed)
        } else if (e.target.id === "viewed-dogs-button") {
            loadViewedDogsOfBreed(selectedBreed)
        } else if (e.target.id === "browse-breeds"){
            loadBreedBrowser(breeds)
        }
    })

    navTag.addEventListener("change", e => {
        const breedId = parseInt(e.target.value)
        const breed = dogAPI.getBreedById(breedId)
        selectedBreed = breed
        loadNavigationForBreed(selectedBreed)
    })
    
    
})

