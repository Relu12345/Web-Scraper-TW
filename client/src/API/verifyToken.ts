import Cookies from 'js-cookie'
import {jwtDecode} from 'jwt-decode'

const setTokenInCookies = (token: string) => {
    Cookies.set('jwtToken', token, {expires: 7}) // set to expire in 7 days
}

const removeTokenFromCookies = () => {
    Cookies.remove('jwtToken')
}

const getTokenFromCookies = () => {
    return Cookies.get('jwtToken')
}

const getUserInfoFromToken = () => {
    const token = getTokenFromCookies()

    if (token !== undefined) {
        const decoded = jwtDecode(token)
        return decoded
    }
    removeTokenFromCookies() 
    return null
}

const isUserAuth = () => {
    const token = getTokenFromCookies()
    if (token)
        return true
    return false
}



export {setTokenInCookies, getUserInfoFromToken, removeTokenFromCookies, isUserAuth} 