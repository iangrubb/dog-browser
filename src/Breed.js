class Breed {

    constructor({id, name, stub}) {
        this.id = id
        this.name = name
        this.stub = stub
        this.previewImage = null
        this.randomImageSet = new Set()
    }

    saveImage(url) {
        this.randomImageSet.add(url)
    }

    randomImages() {
        return Array.from(this.randomImageSet)
    }
    
}