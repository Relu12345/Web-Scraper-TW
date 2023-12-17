interface ResponseMessageText {
    authors: Array<string>,
    title: string,
    url: string
}

const addItemToFavorites = async (item : ResponseMessageText) => {
    try {
        const response = await fetch("http://localhost:5000/api/add-favorites", {
            method: "POST",
            headers: {
                'Content-Type': 'application/json',   
            },
            body: JSON.stringify(item)
        })
    } catch (error) {
        console.error("Failed to send selected item to the favorites list", error)
    }
}

const removeItemFromFavorites = async (item : ResponseMessageText) => {
    try {
        const response = await fetch("http://localhost:5000/api/remove-favorites", {
            method: "DELETE",
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(item)
        })
    } catch (error) {
        console.error("Failed to send selected item to be removed from the favorites list", error)
    }
}

const getFavoritesItems = async () => {
    try {
        const response = await fetch("http://localhost:5000/api/get-favorites", {
            method: "GET",
            headers: {
                'Content-Type': 'application/json',
            }    
        })

        return response.json()
    } catch (error) {
        console.error("Failed to fetch items from favorites list", error)
    }
}

export {addItemToFavorites, removeItemFromFavorites, getFavoritesItems}