import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import {
  Table,
  Button,
  IconButton,
  Input,
  DatePicker,
  InputNumber,
  SelectPicker,
  Modal,
  Message,
  toaster,
  Tooltip,
  Whisper,
  Pagination,
} from "rsuite";
import { VscEdit, VscSave } from "react-icons/vsc";
import { SiAnkermake } from "react-icons/si";
import { RiDeleteBinLine } from "react-icons/ri";
import { GiProgression } from "react-icons/gi";
import {
  requestListaMatriculas,
  requestRegistrarMatricula,
  requestActualizarMatricula,
  requestEliminarMatricula,
} from "../services/matriculaServices";

import { fechaFormateada } from "../utils/fechaFormateada";

const { Column, HeaderCell, Cell } = Table;

const styles = `
.table-cell-editing .rs-table-cell-content {
  padding: 4px;
}
.table-cell-editing .rs-input {
  width: 100%;
}
`;

const grupoOptions = ["A", "B", "C", "D"].map((g) => ({
  label: g,
  value: g,
}));

const horarioOptions = [
  "07:00 - 08:30 am",
  "08:30 - 10:00 am",
  "03:30 - 05:00 pm",
  "05:00 - 06:30 pm",
  "06:30 - 08:00 pm",
].map((h) => ({ label: h, value: h }));

const MatriculaTable = () => {
  const { state: estudiante } = useLocation();
  const navigate = useNavigate();

  const [limit, setLimit] = useState(10);
  const [page, setPage] = useState(1);
  const [cursos, setCursos] = useState([]);
  const [idCursoSeleccionado, setIdCursoSeleccionado] = useState(null);
  const [matriculas, setMatriculas] = useState([]);
  const [matriculaSeleccionada, setMatriculaSeleccionada] = useState(null);

  // Estado para controlar el modo de edición
  const [showConfirm, setShowConfirm] = useState(false);
  // Estado para controlar la paginación
  const [total, setTotal] = useState(0); // total de registros desde backend

  const handleChange = (id, key, value) => {
    const nextData = Object.assign([], matriculas);
    nextData.find((item) => item.id === id)[key] = value;
    setMatriculas(nextData);
  };

  const handleEdit = async (id) => {
    const nextData = [...matriculas];
    const activeItem = nextData.find((item) => item.id === id);

    if (activeItem.status === "EDIT") {
      // Guardar cambios al hacer clic en el ícono de guardar
      try {
        const {
          id, // excluir
          status, // excluir
          fechaMatricula, // excluir
          isNew, // excluir
          ...dataToSend
        } = activeItem;

        dataToSend.id_estudiante = estudiante.id;
        dataToSend.id_curso = idCursoSeleccionado;

        if (activeItem.isNew) {
          await requestRegistrarMatricula(dataToSend);
          toaster.push(
            <Message showIcon type="success">
              Matrícula registrada correctamente.
            </Message>
          );
        } else {
          await requestActualizarMatricula(activeItem.id, dataToSend);
          toaster.push(
            <Message showIcon type="success">
              Matrícula actualizada correctamente.
            </Message>
          );
        }

        activeItem.status = null;
        delete activeItem.isNew;
        setMatriculas(nextData);
      } catch (error) {
        console.error("Error al actualizar matricula:", error);
        toaster.push(
          <Message showIcon type="error">
            Error al guardar matrícula
          </Message>
        );
      }
    } else {
      // Activar modo edición
      activeItem.status = "EDIT";
      setMatriculas(nextData);
    }
  };

  const handleConfirmRemove = async () => {
    if (matriculaSeleccionada) {
      try {
        await requestEliminarMatricula(matriculaSeleccionada.id);
        setMatriculas(
          matriculas.filter((item) => item.id !== matriculaSeleccionada.id)
        );
        setShowConfirm(false);
        setMatriculaSeleccionada(null);
      } catch (error) {
        console.error("Error al eliminar el registro:", error);
      }
    }
  };

  const handleAskRemove = (id) => {
    const item = matriculas.find((i) => i.id === id);
    setMatriculaSeleccionada(item);

    setShowConfirm(true);
  };

  const handleChangeCurso = async (cursoId) => {
    setIdCursoSeleccionado(cursoId);

    if (estudiante?.id && cursoId) {
      try {
        const data = await requestListaMatriculas(estudiante.id, cursoId);

        setMatriculas(data.objeto);
        setPage(1); // Reinicia la paginación
      } catch (err) {
        console.error("Error cargando matrículas:", err);
      }
    }
  };

  const handleAgregarMatricula = () => {
    if (!estudiante?.id || !idCursoSeleccionado) {
      alert("Debe seleccionar un idioma primero.");
      return;
    }
    setMatriculas([
      {
        id: Date.now(), // Temporal,
        periodo: "",
        idioma:
          cursos.find((c) => c.value === idCursoSeleccionado)?.label || "",
        ciclo: "",
        grupo: "",
        horario: "",
        fechaMatricula: new Date(),
        status: "EDIT",
        isNew: true,
      },
      ...matriculas,
    ]);
  };

  useEffect(() => {
    if (!estudiante) {
      navigate("/estudiantes");
    }
    if (estudiante?.cursos) {
      const opciones = estudiante.cursos.map((curso) => ({
        label: curso.descripcion,
        value: curso.id,
      }));
      setCursos(opciones);
    }
  }, [estudiante, navigate]);

  return (
    <div style={{ padding: 20 }}>
      <style>{styles}</style>
      <h2>Matriculas</h2>
      <div className="w-full max-w-screen-md mx-auto px-4 space-y-4">
        {/* Nombre completo */}
        <div className="flex flex-col md:flex-row items-start md:items-center gap-2 w-full">
          <label htmlFor="nombre" className="md:w-40">
            Nombre completo
          </label>
          <div className="w-full md:w-1/2">
            <Input
              id="nombre"
              readOnly
              value={
                estudiante.nombres +
                " " +
                estudiante.apaterno +
                " " +
                estudiante.amaterno
              }
              style={{ width: "100%" }}
            />
          </div>
        </div>

        {/* Idioma */}
        <div className="flex flex-col md:flex-row items-start md:items-center gap-2 w-full">
          <label htmlFor="idioma" className="md:w-40">
            Idioma
          </label>
          <div className="w-full md:w-1/2">
            <SelectPicker
              placeholder="Seleccionar idioma"
              data={cursos}
              style={{ width: "100%" }}
              searchable={false}
              onChange={handleChangeCurso}
              value={idCursoSeleccionado}
            />
          </div>
        </div>
        <div>
          <Button
            color="green"
            appearance="primary"
            onClick={handleAgregarMatricula}
            disabled={!idCursoSeleccionado}
          >
            Agregar Matricula
          </Button>
        </div>
      </div>

      <hr />
      <Table height={420} data={matriculas}>
        <Column flexGrow={1}>
          <HeaderCell>ID</HeaderCell>
          <EditableCell dataKey="id" dataType="number" editable={false} />
        </Column>

        <Column width={200}>
          <HeaderCell>Periodo</HeaderCell>
          <EditableCell
            dataKey="periodo"
            dataType="string"
            onChange={handleChange}
            onEdit={handleEdit}
          />
        </Column>

        <Column width={200}>
          <HeaderCell>Idioma</HeaderCell>
          <EditableCell
            dataKey="idioma"
            dataType="string"
            editable={false}
            onChange={handleChange}
            onEdit={handleEdit}
          />
        </Column>
        <Column width={200}>
          <HeaderCell>Ciclo</HeaderCell>
          <EditableCell
            dataKey="ciclo"
            dataType="string"
            onChange={handleChange}
            onEdit={handleEdit}
          />
        </Column>
        <Column width={200}>
          <HeaderCell>Grupo</HeaderCell>
          <EditableCell
            dataKey="grupo"
            dataType="string"
            onChange={handleChange}
            onEdit={handleEdit}
          />
        </Column>
        <Column width={200}>
          <HeaderCell>Horario</HeaderCell>
          <EditableCell
            dataKey="horario"
            dataType="string"
            onChange={handleChange}
            onEdit={handleEdit}
          />
        </Column>
        <Column width={200}>
          <HeaderCell>FEcha de Matricula</HeaderCell>
          <EditableCell
            dataKey="fechaMatricula"
            dataType="date"
            editable={false}
            onChange={handleChange}
            onEdit={handleEdit}
          />
        </Column>
        <Column width={200}>
          <HeaderCell>Action</HeaderCell>
          <ActionCell
            dataKey="id"
            onEdit={handleEdit}
            onRemove={handleAskRemove}
          />
        </Column>
      </Table>

      <Pagination
        total={total}
        limit={limit}
        activePage={page}
        onChangePage={(val) => setPage(val)}
        onChangeLimit={(val) => {
          setLimit(val);
          setPage(1); // volver a la primera página al cambiar límite
        }}
        layout={["total", "-", "limit", "|", "pager"]}
        limitOptions={[5, 10, 20]}
      />

      <Modal
        open={showConfirm}
        onClose={() => setShowConfirm(false)}
        backdrop="static"
      >
        <Modal.Header>
          <Modal.Title>Confirmar eliminación</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          ¿Estás seguro de que deseas eliminar el registro?
        </Modal.Body>
        <Modal.Footer>
          <Button onClick={handleConfirmRemove} appearance="primary">
            Eliminar
          </Button>
          <Button onClick={() => setShowConfirm(false)} appearance="subtle">
            Cancelar
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

function toValueString(value, dataType) {
  return dataType === "date" ? value?.toLocaleDateString() : value;
}

const fieldMap = {
  string: Input,
  number: InputNumber,
  date: DatePicker,
  grupo: ({ value, onChange }) => (
    <SelectPicker
      data={grupoOptions}
      value={value}
      onChange={onChange}
      style={{ width: "100%" }}
      searchable={false}
    />
  ),
  horario: ({ value, onChange }) => (
    <SelectPicker
      data={horarioOptions}
      value={value}
      onChange={onChange}
      style={{ width: "100%" }}
      searchable={false}
    />
  ),
};

const EditableCell = ({
  rowData,
  dataType,
  dataKey,
  onChange,
  onEdit,
  editable = true,
  ...props
}) => {
  const editing = rowData.status === "EDIT";

  //const Field = fieldMap[dataType];
  const value = rowData[dataKey];
  const text =
    dataType === "date"
      ? fechaFormateada(value)
      : toValueString(value, dataType);
  //const text = toValueString(value, dataType);

  const handleChangeValue = (val) => {
    onChange?.(rowData.id, dataKey, val);
  };

  const CustomField =
    typeof fieldMap[dataKey] === "function"
      ? fieldMap[dataKey]
      : fieldMap[dataType];

  return (
    <Cell
      {...props}
      className={editing && editable ? "table-cell-editing" : ""}
      onDoubleClick={() => {
        if (editable) {
          onEdit?.(rowData.id);
        }
      }}
    >
      {editing && editable ? (
        <CustomField
          value={value}
          onChange={handleChangeValue}
          style={{ width: "100%" }}
        />
      ) : (
        text
      )}
    </Cell>
  );
};

const ActionCell = ({
  rowData,
  dataKey,
  onEdit,
  onRemove,
  onVerNotas,
  onSave,
  ...props
}) => {
  return (
    <Cell {...props} style={{ padding: "6px", display: "flex", gap: "4px" }}>
      <Whisper
        placement="top"
        trigger="hover"
        speaker={<Tooltip>Editar</Tooltip>}
      >
        <IconButton
          appearance="ghost"
          icon={rowData.status === "EDIT" ? <VscSave /> : <VscEdit />}
          onClick={() => {
            onEdit(rowData.id);
          }}
        />
      </Whisper>
      <Whisper
        placement="top"
        trigger="hover"
        speaker={<Tooltip>Eliminar</Tooltip>}
      >
        <IconButton
          appearance="ghost"
          icon={<RiDeleteBinLine />}
          onClick={() => {
            onRemove(rowData.id);
          }}
        />
      </Whisper>

      <Whisper
        placement="top"
        trigger="hover"
        speaker={<Tooltip>Ver Notas</Tooltip>}
      >
        <IconButton appearance="ghost" icon={<GiProgression />} />
      </Whisper>
    </Cell>
  );
};

export default MatriculaTable;
