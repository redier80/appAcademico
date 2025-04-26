import axios from "axios";
import { data } from "react-router-dom";

const URL = "http://localhost:8080/estudiante";

// Para consultar datos de Reniec
const requestReniec = async (dni) => {
  try {
    const response = await axios.get(`${URL}/buscarDniReniec/${dni}`);
    if (response.status == 200) {
      return response.data;
    } else {
      throw new Error("Error en el código de estado");
    }
  } catch (error) {
    console.error(error);
    return null;
  }
};

// Para crear un estudiante
const requestCreateEstudiante = async (estudiante) => {
  try {
    const response = await axios.post(`${URL}/save`, estudiante);
    console.log(response);
    if (response.status === 201) {
      return response.data;
    } else {
      throw new Error("Error en el código de estado");
    }
  } catch (error) {
    console.error(error);
    throw error;
  }
};

// Para actualizar un estudiante
const requestUpdateEstudiante = async (estudiante) => {
  try {
    const response = await axios.put(
      `${URL}/update/${estudiante.numDocumento}`,
      estudiante
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

// Para eliminar un estudiante
const requestDeleteEstudiante = async (numDocumento) => {
  try {
    const response = await axios.delete(`${URL}/delete/${numDocumento}`);
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

// Para listar todos los estudiantes
const requestListaEstudiantes = async () => {
  try {
    const response = await axios.get(`${URL}/lista`);
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

//Para listar estudiantes filtrados y paginados
const requestListaEstudiantesPaginados = async (
  search = "",
  page = 0,
  size = 10,
  sort = ["apaterno,asc", "amaterno,asc", "nombres,asc"]
) => {
  try {
    const response = await axios.get(`${URL}/busquedaFiltrada`, {
      params: {
        search,
        page,
        size,
        sort,
      },
      paramsSerializer: (params) => {
        const query = new URLSearchParams();
        query.append("search", params.search);
        query.append("page", params.page);
        query.append("size", params.size);
        params.sort.forEach((element) => {
          query.append("sort", element);
        });
        return query.toString();
      },
    });

    return response; // Page<Estudiante>, los datos van en .content
  } catch (error) {
    console.error(error);
    throw error;
  }
};

export {
  requestReniec,
  requestCreateEstudiante,
  requestUpdateEstudiante,
  requestDeleteEstudiante,
  requestListaEstudiantes,
  requestListaEstudiantesPaginados,
};
