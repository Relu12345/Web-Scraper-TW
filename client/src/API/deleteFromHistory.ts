interface historyObj {
    date: Date,
    query: string
}

const deleteFromHistory = async (item: historyObj, username: string) => {
    try {
        const response = await fetch("http://localhost:5000/api/delete_history", {
            method: "POST",
            headers: {
                'content-type': 'application/json'
            },
            body: JSON.stringify({user: username, date: new Date(item.date), query: item.query})
        })

        return response
    } catch (error) {
        console.error("Failed to send item from history to delete!")
    }
}

export {deleteFromHistory}