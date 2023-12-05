import { jwtDecode } from "jwt-decode";
import { getTokenFromCookies, getUserInfoFromToken } from "./verifyToken";

interface TextResult {
    authors: string[],
    titles: string,
    url: string
}

const searchText = async(text:string) => {
    try {
        const token = getTokenFromCookies();
        const decoded = jwtDecode(token!).sub?.username;

        const response = await fetch(`http://localhost:5000/api/text-api`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({text, username: decoded})
        })

        if (response.ok)
            return response
        else {
            console.error("Failed to send data to the server: " + response)
            return null
        }
    } catch (error) {
        console.error("Error at sending data to the server: " + error)
        return null
    }
}


export {searchText}