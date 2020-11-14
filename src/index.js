document.addEventListener("DOMContentLoaded", async () => {

    const mainTag = document.querySelector("main")
    const headerTag = document.querySelector("header")
    const navTag = document.querySelector("nav")

    let dogAPI = await DogAPI.asyncConstructor()

    const breeds = dogAPI.breeds

    const loadRandomDogOfBreed = breed => {
        dogAPI.requestRandomImageForBreed(breed.id)
        .then(imageUrl => {
            mainTag.innerHTML = Markup.dogImage(imageUrl, breed.name)
        })
    }

    const loadViewedDogsOfBreed = breed => {
        mainTag.innerHTML =
            dogAPI.getBreedById(breed.id)
            .randomImages()
            .map(image => Markup.dogImage(image, breed.name))
            .join("")
    }

    const loadBreedBrowser = () => {
        const previewedBreeds = dogAPI.getBreedsWithPreviews()

        if (previewedBreeds.length > 0) {
            mainTag.innerHTML = Markup.dogBrowser(previewedBreeds)
        } else {
            dogAPI.fetchPreviewImageBatch()
            .then(fetchedBreeds => {
                mainTag.innerHTML = Markup.dogBrowser(fetchedBreeds)
            })
        }
    }

    const loadNavigationForBreed = selectedBreed => {
        navTag.innerHTML = Markup.navigation(breeds, selectedBreed)
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
                    breeds.map(Markup.breedSelect).join("")
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

