interface ResponseMessageText {
    authors: Array<string>,
    title: string,
    url: string
    source: string
}

const addItemToFavorites = async (item : ResponseMessageText, user: string) => {
    try {
        const response = await fetch("http://localhost:5000/api/insert_favourite", {
            method: "POST",
            headers: {
                'Content-Type': 'application/json',   
            },
            body: JSON.stringify({user, url: item.url, source: item.source, authors: item.authors, title: item.title })
        })

        return response
    } catch (error) {
        console.error("Failed to send selected item to the favorites list", error)
    }
}

const removeItemFromFavorites = async (item : ResponseMessageText, user: string) => {
    try {
        const response = await fetch("http://localhost:5000/api/delete_favourite", {
            method: "POST",
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({user, url: item.url})
        })
        return response
    } catch (error) {
        console.error("Failed to send selected item to be removed from the favorites list", error)
    }
}

const getFavoritesItems = async (user: string) => {
    try {
        const response = await fetch(`http://localhost:5000/api/get_favourites/${user}`, {
            method: "POST",
            headers: {
                'content-type': 'application/json'
            },
            body: JSON.stringify({user})    
        })

        return response.json()
    } catch (error) {
        console.error("Failed to fetch items from favorites list", error)
    }
}

export {addItemToFavorites, removeItemFromFavorites, getFavoritesItems}