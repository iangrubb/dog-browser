class DogAPI {

    // Public
    
    static async asyncConstructor() {
        const api = new DogAPI()
        const breeds = await DogAPI.fetchBreedData()
        api.breeds = breeds.map((b, idx) => new Breed({id: idx, ...b}))
        return api
    }

    async requestRandomImageForBreed(id) {
        const response = await this.fetchDogImageForBreed(id)
        const imageUrl = response.message
        this.getBreedById(id).saveImage(imageUrl)
        return imageUrl
    }

    async fetchPreviewImageBatch() {
        const initial = this.previewPageCount * 9
        const targetBreeds = this.breeds.slice(initial, initial + 9)

        if (targetBreeds.length > 0) {
            return Promise.all(targetBreeds.map(breed => this.fetchDogImageForBreed(breed.id)))
                .then(resps => {
                    this.previewPageCount++
                    resps.forEach((resp, idx) => {
                        targetBreeds[idx].previewImage = resp.message
                    })
                    return targetBreeds
                })
        } else {
            return new Promise([])
        }
    }

    getBreedsWithPreviews() {
        return this.breeds.filter(b => b.previewImage)
    }

    getBreedById(id){
        return this.breeds[id]
    }

    getBreedByName(name) {
        return this.breeds.find(b => b.name === name)
    }


    // Private

    fetchDogImageForBreed(id) {
        const stub = this.breeds[id].stub
        return fetch(`https://dog.ceo/api/breed/${stub}/images/random`)
        .then(resp => resp.json())
    }
    
    constructor() {
        this.breeds = null
        this.previewPageCount = 0
    }

    static fetchBreedData() {
        return fetch("https://dog.ceo/api/breeds/list/all")
        .then(resp => resp.json())
        .then(data => DogAPI.parseBreedData(data.message))
    }

    static parseBreedData(resp) {
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
}