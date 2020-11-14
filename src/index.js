document.addEventListener("DOMContentLoaded", async () => {
    
    const mainTag = document.querySelector("main")
    const headerTag = document.querySelector("header")
    const navTag = document.querySelector("nav")

    const dogAPI = await DogAPI.asyncConstructor()

    const controller = new Controller(dogAPI, {mainTag, headerTag, navTag})

    controller.loadNavigation()

    mainTag.addEventListener("click", e => {
        if (e.target.dataset.breedId) {
            const breedId = parseInt(e.target.dataset.breedId)
            controller.setSelectedBreed(breedId)
            controller.loadNavigation()
        } else if (e.target.id === "more-dogs-button") {
            controller.addDogPreviews()
        }
    })

    headerTag.addEventListener("click", e => {
        if (e.target.id === "random-dog-button") {
            controller.loadRandomDog()
        } else if (e.target.id === "viewed-dogs-button") {
            controller.loadViewedDogs()
        } else if (e.target.id === "browse-breeds"){
            controller.loadBreedBrowser()
        }
    })

    navTag.addEventListener("change", e => {
        const breedId = parseInt(e.target.value)
        controller.setSelectedBreed(breedId)
        controller.loadNavigation()
    })
})