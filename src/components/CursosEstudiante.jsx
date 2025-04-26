// src/components/ModalCursosEstudiante.jsx
import { useEffect, useState } from "react";
import { Modal, Button, CheckboxGroup, Checkbox } from "rsuite";
import { requestUpdateEstudiante } from "../services/estudianteServices";
import { requestCursos } from "../services/cursoServices";

const CursosEstudiante = ({ open, onClose, estudiante, onActualizar }) => {
  const [cursosDisponibles, setCursosDisponibles] = useState([]);
  const [cursosSeleccionados, setCursosSeleccionados] = useState([]);

  useEffect(() => {
    if (estudiante) {
      const obtenerCursos = async () => {
        const disponibles = await requestCursos();
        setCursosDisponibles(disponibles.objeto);
        setCursosSeleccionados(estudiante.cursos?.map((c) => c.id) || []);
      };

      obtenerCursos();
    }
  }, [estudiante]);

  const handleGuardar = async () => {
    const { id, cursos, ...estudianteActualizado } = estudiante;
    estudianteActualizado.cursos = cursosSeleccionados;

    await requestUpdateEstudiante(estudianteActualizado);
    onClose();
  };

  return (
    <Modal open={open} onClose={onClose}>
      <Modal.Header>
        <Modal.Title>Editar Cursos del Estudiante</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <p>
          <b>
            {estudiante?.nombres} {estudiante?.apaterno}
          </b>
        </p>
        <CheckboxGroup
          value={cursosSeleccionados}
          onChange={setCursosSeleccionados}
          name="checkboxList"
        >
          {cursosDisponibles.map((curso) => (
            <Checkbox key={curso.id} value={curso.id}>
              {curso.descripcion}
            </Checkbox>
          ))}
        </CheckboxGroup>
      </Modal.Body>
      <Modal.Footer>
        <Button onClick={handleGuardar} appearance="primary">
          Guardar
        </Button>
        <Button onClick={onClose} appearance="subtle">
          Cancelar
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default CursosEstudiante;
