const getHistory = async (username: string | undefined) => {
    try {
        if (typeof username !== 'string')
            return 
        const response = await fetch(`http://localhost:5000/api/get_history/${username}`, {
            method: 'POST',
            headers: {
                'content-type': 'application/json'
            },
            body: JSON.stringify({user: username})
        })

        return response
    } catch (error) {
        console.error("Failed to send user for history!")
    }
}

export {getHistory}
