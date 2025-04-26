import axios from "axios";

const URL = "http://localhost:8080/curso";

// Para consultar todos los cursos activos
const requestCursos = async () => {
    try {
        const response = await axios.get(`${URL}/obtenerCursos`);
        if (response.status == 200) {
            return response.data
        }else{
            throw new Error("Error en el código de estado");
        }
    } catch (error) {
        console.error(error);
        return null;
    }
}

export { requestCursos };