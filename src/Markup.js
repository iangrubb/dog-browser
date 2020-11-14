class Markup {

    static dogImage(url, breedName) {
        return `<img src="${url}" alt="${breedName}" width="200">`
    }

    static breedOption(breed, selectedBreed) {
        return `<option ${breed.id === selectedBreed.id ? "selected" : ""} value="${breed.id}">${breed.name}</option>`
    }

    static navigation(breeds, selectedBreed) {
        return `
            <span>Select Breed:<span>
            <select>
                ${breeds.map(breed => Markup.breedOption(breed, selectedBreed)).join("")}
            <select>
            <button id="random-dog-button">Random ${selectedBreed.name}</button>
            <button id="viewed-dogs-button">Viewed ${selectedBreed.name}s</button>
            <button id="browse-breeds">Browse Breeds</button>
        `
    }

    static breedSelect(breed) {
        return `
            <div>
                <h3>${breed.name}</h3>
                ${dogImageHTML(breed.previewImage, breed.name)}
                <button data-breed-id="${breed.id}">Select</button>
            </div>
        `
    }

    static dogBrowser(breeds) {
        return `
            ${breeds.map(Markup.breedSelect(breed)).join("")}
            <button id="more-dogs-button">More</button>
        `
    }
}