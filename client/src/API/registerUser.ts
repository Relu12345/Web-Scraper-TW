const registerUser = async (username: string, email: string, password: string) => {
    try {
        const response = await fetch("http://localhost:5000/users/register", {
            method: "POST",
            headers: {
                'content-type': 'application/json'
            },
            body: JSON.stringify({username: username, email: email, password: password})
        })

        return response
    } catch (error) {
        console.error("Failed to send user registration information to the server: ", error)
    }
}

export {registerUser} 