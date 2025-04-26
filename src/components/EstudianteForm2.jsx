import React, { useEffect, useState } from "react";
import {
  requestCreateEstudiante,
  requestReniec,
} from "../services/estudianteServices";
import { requestCursos } from "../services/cursoServices";
import { useForm } from "react-hook-form";

const EstudianteForm2 = () => {
  const [idiomasDisponibles, setIdiomasDisponibles] = useState([]);

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    reset,
    formState: { errors },
  } = useForm();

  const handleBuscar = async () => {
    const documento = watch("numDocumento");
    if (!documento) {
      alert("Ingrese un número de documento");
      return;
    }
    try {
      const response = await requestReniec(documento);

      if (response) {
        const est = response;
        setValue("nombres", est.nombres || "");
        setValue("apaterno", est.apellidoPaterno || "");
        setValue("amaterno", est.apellidoMaterno || "");
        setValue("tipoDocumento", est.tipoDocumento || "");
      } else {
        alert("No se encontró estudiante con ese DNI.");
      }
    } catch (error) {
      alert("Error al buscar estudiante.");
    }
  };

  const onSubmit = async (data) => {
    //filtrar solo los cursos seleccionados en un array de ids
    const cursosSeleccionados = data.cursos
      .map((valor, index) => (valor ? index : null))
      .filter((val) => val !== null);
    const datosAEnviar = {
      ...data,
      cursos: cursosSeleccionados,
    };

    try {
      const response = await requestCreateEstudiante(datosAEnviar);
      if (response.codigo === 200) {
        alert("Estudiante registrado correctamente");
        reset();
      } else {
        alert("Error al registrar estudiante.");
      }
    } catch (error) {
      alert("Error en la transaccion");
    }
  };

  useEffect(() => {
    const obtenerIdiomas = async () => {
      try {
        const response = await requestCursos();

        const cursos = response.objeto.map((curso) => ({
          id: curso.id,
          descripcion: curso.descripcion,
        }));
        setIdiomasDisponibles(cursos);
      } catch (error) {
        console.error("Error al obtener los idiomas:", error);
      }
    };

    obtenerIdiomas();
  }, []);

  return (
    <div className="min-h-screen bg-gray-900 text-white py-10 px-4">
      <div className="max-w-4xl mx-auto bg-gray-800 p-6 rounded-2xl shadow-lg">
        <h2 className="text-3xl font-bold mb-6 text-center text-white">
          Registro de Estudiante
        </h2>
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="col-span-1 sm:col-span-2">
              <label className="label text-white">Número de DNI</label>
              <div className="flex gap-2">
                <input
                  type="number"
                  name="numDocumento"
                  className="input input-bordered w-full"
                  {...register("numDocumento", {
                    required: "Numero de DNI requerido",
                    minLength: {
                      value: 8,
                      message: "El DNI debe tener 8 digitos",
                    },
                    maxLength: {
                      value: 8,
                      message: "El DNI debe tener 8 digitos",
                    },
                  })}
                />
                {errors.numDocumento && (
                  <p className="text-red-500">{errors.numDocumento.message}</p>
                )}
                <button
                  type="button"
                  className="btn btn-info"
                  onClick={handleBuscar}
                >
                  Buscar
                </button>
              </div>
            </div>

            <div>
              <label className="label text-white">Nombres</label>
              <input
                type="text"
                name="nombres"
                className="input input-bordered w-full"
                {...register("nombres", {
                  required: "Nombres requeridos",
                })}
              />
              <p className="text-red-600">{errors.nombres?.message}</p>
            </div>

            <div>
              <label className="label text-white">Apellido Paterno</label>
              <input
                type="text"
                name="apaterno"
                className="input input-bordered w-full "
                {...register("apaterno", {
                  required: "Apellido Paterno requerido",
                })}
              />
              <p className="text-red-600">{errors.apaterno?.message}</p>
            </div>

            <div>
              <label className="label text-white">Apellido Materno</label>
              <input
                type="text"
                name="amaterno"
                className="input input-bordered w-full "
                {...register("amaterno", {
                  required: "Apellido Materno requerido",
                })}
              />
              <p className="text-red-600">{errors.amaterno?.message}</p>
            </div>

            <div>
              <label className="label text-white">Fecha de Nacimiento</label>
              <input
                type="date"
                name="fechaNacimiento"
                className="input input-bordered w-full "
                {...register("fechaNacimiento", {
                  required: "Fecha de Nacimiento requerida",
                })}
              />
              <p className="text-red-600">{errors.fechaNacimiento?.message}</p>
            </div>

            <div>
              <label className="label text-white">Sexo</label>
              <select
                name="sexo"
                className="select select-bordered w-full "
                {...register("sexo", {
                  required: "Sexo requerido",
                })}
              >
                <option value="">Seleccione Sexo</option>
                <option value="M">Masculino</option>
                <option value="F">Femenino</option>
              </select>
              <p className="text-red-600">{errors.sexo?.message}</p>
            </div>

            <div>
              <label className="label text-white">Correo Electrónico</label>
              <input
                type="email"
                name="correo"
                className="input input-bordered w-full "
                {...register("correo", {
                  required: "Correo Electronico requerido",
                  pattern: {
                    value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                    message: "Correo Electronico no valido",
                  },
                })}
              />
              <p className="text-red-600">{errors.correo?.message}</p>
            </div>

            <div>
              <label className="label text-white">Teléfono</label>
              <input
                type="text"
                name="telefono"
                className="input input-bordered w-full "
                {...register("telefono", {
                  required: "Telefono requerido",
                  pattern: {
                    value: /^[0-9]{9}$/,
                    message: "Telefono no valido",
                  },
                })}
              />
              <p className="text-red-600">{errors.telefono?.message}</p>
            </div>

            <div className="sm:col-span-2">
              <label className="label text-white">Dirección</label>
              <input
                type="text"
                name="direccion"
                className="input input-bordered w-full "
                {...register("direccion", {
                  required: "Direccion requerida",
                })}
              />
              <p className="text-red-600">{errors.direccion?.message}</p>
            </div>
          </div>

          <div className="mt-6">
            <label className="label text-white">Idiomas</label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {idiomasDisponibles.map((curso) => (
                <label
                  key={curso.id}
                  className="flex items-center gap-2 text-white"
                >
                  <input
                    type="checkbox"
                    className="checkbox checkbox-primary"
                    {...register(`cursos.${curso.id}`)}
                  />
                  <span>{curso.descripcion}</span>
                </label>
              ))}
            </div>
          </div>

          <div className="mt-6 flex justify-center">
            <button type="submit" className="btn btn-success w-full sm:w-auto">
              Registrar Estudiante
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EstudianteForm2;
