class Controller {

    constructor(dogAPI, elements) {
        this.dogAPI = dogAPI
        this.selectedBreed = dogAPI.getBreedByName("shiba")
        this.elements = elements
    }

    setSelectedBreed(id) {
        this.selectedBreed = this.dogAPI.getBreedById(id)
    }

    loadRandomDog() {
        this.dogAPI.requestRandomImageForBreed(this.selectedBreed.id)
        .then(imageUrl => {
            this.elements.mainTag.innerHTML = Markup.dogImage(imageUrl, this.selectedBreed.name)
        })
    }

    loadViewedDogs() {
        this.elements.mainTag.innerHTML =
            this.dogAPI.getBreedById(this.selectedBreed.id)
            .randomImages()
            .map(image => Markup.dogImage(image, this.selectedBreed.name))
            .join("")
    }

    loadNavigation() {
        this.elements.navTag.innerHTML = Markup.navigation(this.dogAPI.breeds, this.selectedBreed)
        this.loadRandomDog()
    }

    loadBreedBrowser() {
        const previewedBreeds = this.dogAPI.getBreedsWithPreviews()

        if (previewedBreeds.length > 0) {
            this.elements.mainTag.innerHTML = Markup.dogBrowser(previewedBreeds)
        } else {
            this.dogAPI.fetchPreviewImageBatch()
            .then(fetchedBreeds => {
                this.elements.mainTag.innerHTML = Markup.dogBrowser(fetchedBreeds)
            })
        }
    }

    addDogPreviews() {
        this.dogAPI.fetchPreviewImageBatch()
        .then(breeds => {
            const moreDogsButton = document.getElementById("more-dogs-button")
            moreDogsButton.insertAdjacentHTML("beforebegin",
                breeds.map(Markup.breedSelect).join("")
            )
        })
    }
}