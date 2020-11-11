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

    const dogSelectHTML = (url, name) => {
        return `
            <div>
                <h3>${name}</h3>
                ${dogImageHTML(url, name)}
                <button data-breed-name="${name}">Select</button>
            </div>
        `
    }

    const renderDogBrowserHTML = (samples) => {
        const dogSelectors = []
        for (const breed in samples) {
            dogSelectors.push(dogSelectHTML(samples[breed], breed))
        }
        return `
            ${dogSelectors.join("")}
            <button id="more-dogs-button">More</button>
        `
    }

    



    // Data Access logic

    const fetchDogImage = stub => {
        return fetch(`https://dog.ceo/api/breed/${stub}/images/random`)
        .then(resp => resp.json())
    }

    const sampleBreedImages = {}

    let pageCount = 0

    const fetchSampleBreedImages = (breeds) => {
        const initial = pageCount * 9
        const selectBreeds = breeds.slice(initial, initial + 9)

        return Promise.all(
            selectBreeds.map(breed => fetchDogImage(breed.name))
        ).then(resps => {
            pageCount++
            resps.forEach((resp, idx) => {
                const key = breeds[initial + idx].name
                sampleBreedImages[key] = resp.message
            })
        })

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

    const loadBreedBrowser = (breeds) => {
        if (Object.keys(sampleBreedImages).length === 0) {
            fetchSampleBreedImages(breeds)
            .then(() => {
                mainTag.innerHTML = renderDogBrowserHTML(sampleBreedImages)
            })
        } else {
            mainTag.innerHTML = renderDogBrowserHTML(sampleBreedImages)
        }
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
            <button id="browse-breeds">Browse Breeds</button>
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
           if (e.target.dataset.breedName) {
                const breed = breeds.find(b => b.name === e.target.dataset.breedName)
                selectedBreed = breed
                loadNavigationForBreed(selectedBreed)
           }
        })

        headerTag.addEventListener("click", e => {
            if (e.target.id === "random-shiba-button") {
                loadRandomDogOfBreed(selectedBreed)
            } else if (e.target.id === "viewed-shibas-button") {
                loadViewedDogsOfBreed(selectedBreed)
            } else if (e.target.id === "browse-breeds"){
                loadBreedBrowser(breeds)
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

