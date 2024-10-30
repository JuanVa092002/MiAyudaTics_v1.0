import { useContext } from 'react'
import { Outlet, Navigate } from 'react-router-dom';
import Loaders from '../components/loaders/Loaders';

import { AuthContext } from '../context/Auth.context';

export default function PrivateRoutes() {

    const { isAuthenticated, loading } = useContext(AuthContext);

    if (loading) return <Loaders/>
    if(!isAuthenticated) return <Navigate to="/loginMain" replace />

    return <Outlet/>
}
