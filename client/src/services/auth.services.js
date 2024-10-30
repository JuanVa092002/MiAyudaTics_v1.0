import axios from "./axios.js"

//servicio para consumir el register

export const register = async (credentials) =>{
    try {
        const response = await axios.post("/auth/register", credentials);
        return response.data;
    } catch (error) {
        return error;
    }
}

export const login = async(credentials) => {
    try {
        const response = await axios.post("/auth/login", credentials);
        return response;      
    } catch (error) {
        return error;
    }
}

export const verifyToken = async() => {
    try {
        const response = await axios.get("/auth/verify-token")
        return response
    } catch (error) {
        console.log(error)
        return error.message;
    }
}

export const logout = async() => {
    try {
        const response = await axios.post("/auth/logout");
        return response;
    } catch (error) {
        console.log("Error al cerrar sesion!");
    }
}