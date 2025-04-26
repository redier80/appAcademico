import React, { useState } from 'react';
import axios from 'axios';

const EstudianteForm = () => {
    const [dni, setDni] = useState('');
    const [nombre, setNombre] = useState('');
    const [apaterno, setApaterno] = useState('');
    const [amaterno, setAmaterno] = useState('');
    const [fechaNacimiento, setFechaNacimiento] = useState('');
    const [sexo, setSexo] = useState('');
    const [correo, setCorreo] = useState('');
    const [telefono, setTelefono] = useState('');
    const [direccion, setDireccion] = useState('');
    const [idiomas, setIdiomas] = useState([]);
    const [error, setError] = useState(null);

    const handleDniChange = (e) => {
        setDni(e.target.value);
    };

    const handleSearch = async () => {
        try {
            const response = await axios.get(`http://localhost:8080/estudiantes/${dni}`);
            const estudiante = response.data.objeto;

            if (estudiante) {
                setNombre(estudiante.nombres);
                setApaterno(estudiante.apaterno);
                setAmaterno(estudiante.amaterno);
            } else {
                setError('Estudiante no encontrado');
            }
        } catch (err) {
            setError('Hubo un error al buscar el estudiante');
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const estudianteData = {
            numDocumento: dni,
            nombres: nombre,
            apaterno: apaterno,
            amaterno: amaterno,
            fechaNacimiento,
            sexo,
            correo,
            telefono,
            direccion,
            cursos: idiomas,
        };

        try {
            await axios.post('http://localhost:8080/estudiantes', estudianteData);
            alert('Estudiante registrado correctamente');
        } catch (err) {
            alert('Hubo un error al registrar al estudiante');
        }
    };

    return (
        <div className="max-w-4xl mx-auto p-6 bg-white rounded-xl shadow-md mt-10">
            <h2 className="text-2xl font-bold mb-6">Registrar Estudiante</h2>
            {error && <div className="text-red-600 mb-4">{error}</div>}
            <form onSubmit={handleSubmit}>
                {/* Campo DNI */}
                <div className="mb-4">
                    <label htmlFor="dni" className="block text-sm font-semibold text-gray-700">Número de DNI</label>
                    <input
                        type="text"
                        id="dni"
                        value={dni}
                        onChange={handleDniChange}
                        className="input input-bordered w-full mt-2"
                        placeholder="Ingresa el número de DNI"
                    />
                </div>
                <button
                    type="button"
                    onClick={handleSearch}
                    className="btn btn-primary mb-4"
                >
                    Buscar
                </button>

                {/* Campos de datos personales */}
                <div className="grid grid-cols-2 gap-4 mb-4">
                    <div>
                        <label htmlFor="nombre" className="block text-sm font-semibold text-gray-700">Nombre</label>
                        <input
                            type="text"
                            id="nombre"
                            value={nombre}
                            onChange={(e) => setNombre(e.target.value)}
                            className="input input-bordered w-full mt-2"
                            placeholder="Nombre"
                        />
                    </div>
                    <div>
                        <label htmlFor="apaterno" className="block text-sm font-semibold text-gray-700">Apellido Paterno</label>
                        <input
                            type="text"
                            id="apaterno"
                            value={apaterno}
                            onChange={(e) => setApaterno(e.target.value)}
                            className="input input-bordered w-full mt-2"
                            placeholder="Apellido Paterno"
                        />
                    </div>
                </div>

                <div className="grid grid-cols-2 gap-4 mb-4">
                    <div>
                        <label htmlFor="amaterno" className="block text-sm font-semibold text-gray-700">Apellido Materno</label>
                        <input
                            type="text"
                            id="amaterno"
                            value={amaterno}
                            onChange={(e) => setAmaterno(e.target.value)}
                            className="input input-bordered w-full mt-2"
                            placeholder="Apellido Materno"
                        />
                    </div>
                    <div>
                        <label htmlFor="fechaNacimiento" className="block text-sm font-semibold text-gray-700">Fecha de Nacimiento</label>
                        <input
                            type="date"
                            id="fechaNacimiento"
                            value={fechaNacimiento}
                            onChange={(e) => setFechaNacimiento(e.target.value)}
                            className="input input-bordered w-full mt-2"
                        />
                    </div>
                </div>

                <div className="grid grid-cols-2 gap-4 mb-4">
                    <div>
                        <label htmlFor="sexo" className="block text-sm font-semibold text-gray-700">Sexo</label>
                        <select
                            id="sexo"
                            value={sexo}
                            onChange={(e) => setSexo(e.target.value)}
                            className="select select-bordered w-full mt-2"
                        >
                            <option value="">Selecciona</option>
                            <option value="M">Masculino</option>
                            <option value="F">Femenino</option>
                        </select>
                    </div>
                    <div>
                        <label htmlFor="correo" className="block text-sm font-semibold text-gray-700">Correo Electrónico</label>
                        <input
                            type="email"
                            id="correo"
                            value={correo}
                            onChange={(e) => setCorreo(e.target.value)}
                            className="input input-bordered w-full mt-2"
                            placeholder="Correo Electrónico"
                        />
                    </div>
                </div>

                <div className="grid grid-cols-2 gap-4 mb-4">
                    <div>
                        <label htmlFor="telefono" className="block text-sm font-semibold text-gray-700">Teléfono</label>
                        <input
                            type="text"
                            id="telefono"
                            value={telefono}
                            onChange={(e) => setTelefono(e.target.value)}
                            className="input input-bordered w-full mt-2"
                            placeholder="Teléfono"
                        />
                    </div>
                    <div>
                        <label htmlFor="direccion" className="block text-sm font-semibold text-gray-700">Dirección</label>
                        <input
                            type="text"
                            id="direccion"
                            value={direccion}
                            onChange={(e) => setDireccion(e.target.value)}
                            className="input input-bordered w-full mt-2"
                            placeholder="Dirección"
                        />
                    </div>
                </div>

                {/* Selección múltiple de idiomas */}
                <div className="mb-4">
                    <label htmlFor="idiomas" className="block text-sm font-semibold text-gray-700">Idiomas</label>
                    <select
                        id="idiomas"
                        multiple
                        value={idiomas}
                        onChange={(e) => setIdiomas(Array.from(e.target.selectedOptions, option => option.value))}
                        className="select select-bordered w-full mt-2"
                    >
                        <option value="ingles">Inglés</option>
                        <option value="portugues">Portugués</option>
                        <option value="italiano">Italiano</option>
                        <option value="quechua">Quechua</option>
                    </select>
                </div>

                {/* Botón de Enviar */}
                <button type="submit" className="btn btn-primary w-full mt-4">Registrar Estudiante</button>
            </form>
        </div>
    );
};

export default EstudianteForm;
