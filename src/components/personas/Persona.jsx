import * as React from "react";
import axios from "../axiosConfig";
import MessageSnackBar from "../MessageSnackBar";
import FormPersona from "./FormPersona";
import GridPersona from "./GridPersona";
import { SiteProps } from "../dashboard/SiteProps";

export default function Persona() {
  const defaultRow = {
    id: 0,
    tipoIdentificacion: "",
    identificacion: "",
    nombre: "",
    apellido: "",
    genero: "",
    fechaNacimiento: "",
    estrato: "",
    direccion: "",
    email: "",
    celular: "",
    estado: 1,
  };

  const [selectedRow, setSelectedRow] = React.useState(defaultRow);
  const [message, setMessage] = React.useState({ open: false, severity: "success", text: "" });
  const [personas, setPersonas] = React.useState([]);
  const [pagination, setPagination] = React.useState({
    page: 0,
    pageSize: 5,
    total: 0,
  });

  const reloadData = (page = 0, pageSize = 5) => {
    axios
      .get(`${SiteProps.urlbasev1}/persona?page=${page}&size=${pageSize}`)
      .then((response) => {
        const content = response.data?.content || response.data?.data || [];
        setPersonas(content);
        setPagination({
          page,
          pageSize,
          total: response.data.totalElements || content.length || 0,
        });
      })
      .catch((err) => {
        console.error("Error al cargar personas", err);
      });
  };

  React.useEffect(() => {
    reloadData();
  }, []);

  return (
    <div style={{ height: "100%", width: "100%" }}>
      <h1>Personas</h1>
      <MessageSnackBar message={message} setMessage={setMessage} />
      <FormPersona
        selectedRow={selectedRow}
        setSelectedRow={setSelectedRow}
        setMessage={setMessage}
        reloadData={() => reloadData(pagination.page, pagination.pageSize)}
      />
      <GridPersona
        personas={personas}
        selectedRow={selectedRow}
        setSelectedRow={setSelectedRow}
        pagination={pagination}
        onPageChange={reloadData}
      />
    </div>
  );
}
