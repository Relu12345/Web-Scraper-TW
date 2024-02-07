import { jwtDecode } from "jwt-decode";
import { getTokenFromCookies } from "./verifyToken";

interface SearchProps {
    text: string,
    date: {
        from: number,
        to: number
    }
}

const searchText = async({text, date}: SearchProps) => {
    try {
        const token = getTokenFromCookies();
        const decoded = jwtDecode(token!).sub?.username;

        const response = await fetch(`http://localhost:5000/api/text-api`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({text, username: decoded, date: {from: date.from, to: date.to}})
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