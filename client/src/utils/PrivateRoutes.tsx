import { Outlet, Navigate } from 'react-router'
import { getUserInfoFromToken } from '../API/verifyToken'


export const PrivateRoutes = () => {
    const auth = getUserInfoFromToken()
    return (
        auth !== null ? <Outlet /> : <Navigate to={"/login"}/>
    )
}
