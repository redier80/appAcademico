import axios from "axios";

const URL = "http://localhost:8080/matricula";
const requestListaMatriculas = async (id_estudiante, id_curso) => {
  try {
    const response = await axios.get(
      `${URL}/estudiante/${id_estudiante}/curso/${id_curso}`
    );
    if (response.status == 200) {
      return response.data;
    } else {
      throw new Error("Error en el código de estado");
    }
  } catch (error) {
    console.error(error);
    throw error;
  }
};

const requestRegistrarMatricula = async (matricula) => {
  try {
    const response = await axios.post(`${URL}/save`, matricula);
    if (response.status == 201) {
      return response.data;
    } else {
      throw new Error("Error en el código de estado");
    }
  } catch (error) {
    console.error(error);
    throw error;
  }
};

const requestActualizarMatricula = async (id, matricula) => {
  try {
    const response = await axios.put(`${URL}/update/${id}`, matricula);
    if (response.status == 200) {
      return response.data;
    } else {
      throw new Error("Error en el código de estado");
    }
  } catch (error) {
    console.error(error);
    throw error;
  }
};

const requestEliminarMatricula = async (id) => {
  try {
    const response = await axios.delete(`${URL}/delete/${id}`);
    if (response.status == 200) {
      return response.data;
    } else {
      throw new Error("Error en el código de estado");
    }
  } catch (error) {
    console.error(error);
    throw error;
  }
};

export {
  requestListaMatriculas,
  requestRegistrarMatricula,
  requestActualizarMatricula,
  requestEliminarMatricula,
};
