import axios from "./axios.js"

//servicio para consumir el register

export const register = async (credentials) =>{
    try {
        const response = await axios.post("api/auth/register", credentials);
        return response.data;
    } catch (error) {
        return error;
    }
}

export const login = async(credentials) => {
    try {
        const response = await axios.post("api/auth/login", credentials);
        return response;      
    } catch (error) {
        return error;
    }
}

export const verifyToken = async() => {
    try {
        const response = await axios.get("api/auth/verify-token")
        return response
    } catch (error) {
        console.log(error)
        return error.message;
    }
}

export const logout = async() => {
    try {
        const response = await axios.post("api/auth/logout");
        return response;
    } catch (error) {
        console.log("Error al cerrar sesion!");
    }
}