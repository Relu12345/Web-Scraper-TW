const searchText = async(text:string) => {
    try {
        const response = await fetch(`http://localhost:5000/api/text-api`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({text})
        })

        if (response.ok) {
            const data = await response.json()
            return data
        } else {
            console.error("Failed to send data to the server: " + response)
            return null
        }
    } catch (error) {
        console.error("Error at sending data to the server: " + error)
        return null
    }
}

export {searchText}