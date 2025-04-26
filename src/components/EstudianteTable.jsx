import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Table,
  Button,
  IconButton,
  Input,
  DatePicker,
  InputNumber,
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
import { GoBook } from "react-icons/go";
import {
  requestDeleteEstudiante,
  requestUpdateEstudiante,
  requestListaEstudiantesPaginados,
} from "../services/estudianteServices";

import CursosEstudiante from "./CursosEstudiante";

const { Column, HeaderCell, Cell } = Table;

const styles = `
.table-cell-editing .rs-table-cell-content {
  padding: 4px;
}
.table-cell-editing .rs-input {
  width: 100%;
}
`;

const EstudianteTable = () => {
  // Estado para almacenar los datos
  const [data, setData] = useState();
  // Estado para controlar el modo de edición
  const [showConfirm, setShowConfirm] = useState(false);
  // Estado para almacenar el registro seleccionado
  const [registroSeleccionado, setRegistroSeleccionado] = useState(null);
  // Estado para guardar el texto de búsqueda
  const [searchTerm, setSearchTerm] = useState("");
  // Estado para controlar la paginación
  const [total, setTotal] = useState(0); // total de registros desde backend
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(5);

  const navigate = useNavigate();

  const [showMatricula, setShowMatricula] = useState(false);
  const [showCursosModal, setShowCursosModal] = useState(false);

  const handleChange = (id, key, value) => {
    const nextData = Object.assign([], data);
    nextData.find((item) => item.id === id)[key] = value;
    setData(nextData);
  };

  const handleEdit = async (id) => {
    const nextData = [...data];
    const activeItem = nextData.find((item) => item.id === id);

    if (activeItem.status === "EDIT") {
      // Guardar cambios al hacer clic en el ícono de guardar
      try {
        const {
          id, // excluir
          status, // excluir
          cursos, // excluir
          ...dataToUpdate
        } = activeItem;

        if (dataToUpdate.fechaNacimiento instanceof Date) {
          // Formatear a 'YYYY-MM-DD'
          const yyyy = dataToUpdate.fechaNacimiento.getFullYear();
          const mm = String(
            dataToUpdate.fechaNacimiento.getMonth() + 1
          ).padStart(2, "0");
          const dd = String(dataToUpdate.fechaNacimiento.getDate()).padStart(
            2,
            "0"
          );
          dataToUpdate.fechaNacimiento = `${yyyy}-${mm}-${dd}`;
        }

        await requestUpdateEstudiante(dataToUpdate);
        activeItem.status = null;
        setData(nextData);
        // notificación de éxito
        alert("Estudiante actualizado correctamente.");
      } catch (error) {
        console.error("Error al actualizar estudiante:", error);
        // También puedes mostrar un mensaje de error aquí
      }
    } else {
      // Activar modo edición
      activeItem.status = "EDIT";
      setData(nextData);
    }
  };

  const handleConfirmRemove = async () => {
    if (registroSeleccionado) {
      try {
        await requestDeleteEstudiante(registroSeleccionado.numDocumento);
        setData(data.filter((item) => item.id !== registroSeleccionado.id));
        setShowConfirm(false);
        setRegistroSeleccionado(null);
      } catch (error) {
        console.error("Error al eliminar el registro:", error);
      }
    }
  };

  const handleAskRemove = (id) => {
    const item = data.find((i) => i.id === id);
    setRegistroSeleccionado(item);

    setShowConfirm(true);
  };

  const handleMatricula = (estudiante) => {
    //setRegistroSeleccionado(estudiante);
    navigate("/matriculas", { state: estudiante });
  };

  const handleVerCursos = (estudiante) => {
    setRegistroSeleccionado(estudiante);
    setShowCursosModal(true);
  };

  useEffect(() => {
    const obtenerEstudiantes = async () => {
      try {
        const response = await requestListaEstudiantesPaginados(
          searchTerm,
          page - 1,
          limit
        );

        const dataEstudiantes = response.data.objeto.content.map((est) => ({
          ...est,
          fechaNacimiento: est.fechaNacimiento
            ? new Date(est.fechaNacimiento)
            : "",
        }));

        setData(dataEstudiantes);
        setTotal(response.data.objeto.totalElements);
      } catch (error) {
        console.error("Error al obtener los idiomas:", error);
      }
    };

    obtenerEstudiantes(searchTerm, page, limit);
  }, [page, limit, searchTerm]);

  return (
    <div style={{ padding: 20 }}>
      <style>{styles}</style>
      <h2>Tabla Estudiantes</h2>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <Button
          color="green"
          appearance="primary"
          onClick={() => navigate("/nuevoEstudiante")}
        >
          Nuevo
        </Button>
        <Input
          placeholder="Buscar por apellidos y nombres o DNI"
          value={searchTerm}
          onChange={(value) => {
            setSearchTerm(value);
            requestListaEstudiantesPaginados({
              search: value,
              page: page - 1,
              size: limit,
              sort: ["apaterno,asc", "amaterno,asc", "nombres,asc"],
            });
            console.log(data);
          }}
          style={{ width: 300 }}
        />
      </div>
      <hr />
      <Table height={420} data={data}>
        <Column flexGrow={1}>
          <HeaderCell>ID</HeaderCell>
          <EditableCell dataKey="id" dataType="number" />
        </Column>

        <Column width={200}>
          <HeaderCell>Numero Documento</HeaderCell>
          <EditableCell
            dataKey="numDocumento"
            dataType="number"
            onChange={handleChange}
            onEdit={handleEdit}
          />
        </Column>

        <Column width={200}>
          <HeaderCell>Apellido Paterno</HeaderCell>
          <EditableCell
            dataKey="apaterno"
            dataType="string"
            onChange={handleChange}
            onEdit={handleEdit}
          />
        </Column>
        <Column width={200}>
          <HeaderCell>Apellido Materno</HeaderCell>
          <EditableCell
            dataKey="amaterno"
            dataType="string"
            onChange={handleChange}
            onEdit={handleEdit}
          />
        </Column>
        <Column width={200}>
          <HeaderCell>Nombres</HeaderCell>
          <EditableCell
            dataKey="nombres"
            dataType="string"
            onChange={handleChange}
            onEdit={handleEdit}
          />
        </Column>
        <Column width={200}>
          <HeaderCell>FEcha Nacimiento</HeaderCell>
          <EditableCell
            dataKey="fechaNacimiento"
            dataType="date"
            onChange={handleChange}
            onEdit={handleEdit}
          />
        </Column>
        <Column width={200}>
          <HeaderCell>Correo</HeaderCell>
          <EditableCell
            dataKey="correo"
            dataType="string"
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
            onMatricula={handleMatricula}
            onVerCursos={handleVerCursos}
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
          ¿Estás seguro de que deseas eliminar el registro{" "}
          <b>{registroSeleccionado?.name}</b>?
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

      <CursosEstudiante
        open={showCursosModal}
        onClose={() => setShowCursosModal(false)}
        estudiante={registroSeleccionado}
      />
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
};

const EditableCell = ({
  rowData,
  dataType,
  dataKey,
  onChange,
  onEdit,
  ...props
}) => {
  const editing = rowData.status === "EDIT";

  const Field = fieldMap[dataType];
  const value = rowData[dataKey];
  const text = toValueString(value, dataType);

  return (
    <Cell
      {...props}
      className={editing ? "table-cell-editing" : ""}
      onDoubleClick={() => {
        onEdit?.(rowData.id);
      }}
    >
      {editing ? (
        <Field
          value={value}
          onChange={(value) => {
            onChange?.(rowData.id, dataKey, value);
          }}
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
  onMatricula,
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
        speaker={<Tooltip>Matricular</Tooltip>}
      >
        <IconButton
          appearance="ghost"
          icon={<SiAnkermake />}
          onClick={() => {
            onMatricula(rowData);
          }}
        />
      </Whisper>
      <Whisper
        placement="top"
        trigger="hover"
        speaker={<Tooltip>Cursos</Tooltip>}
      >
        <IconButton
          appearance="ghost"
          icon={<GoBook />}
          onClick={() => props.onVerCursos(rowData)}
        />
      </Whisper>
    </Cell>
  );
};

export default EstudianteTable;
