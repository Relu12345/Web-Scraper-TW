const loginUser = async (email: string, password: string) => {
    try {
        const response = await fetch("http://localhost:5000/users/login",{
            method: "POST",
            headers: {
                'content-type': 'application/json',
            },
            body: JSON.stringify({email: email, password: password})
        })

        return response
    } catch (error) {
        console.error("Failed to send login information to the server", error)
    }
}

export {loginUser}