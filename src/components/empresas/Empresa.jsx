import * as React from "react";
// import axios from "../axiosConfig";
import axios from "axios"; 
import MessageSnackBar from "../MessageSnackBar";
import FormEmpresa from "./FormEmpresa";
import GridEmpresa from "./GridEmpresa";
import { SiteProps } from "../dashboard/SiteProps";

/**
 * El componente Empresa gestiona el módulo de empresas, incluyendo el formulario
 * y la tabla de datos para crear, actualizar, y eliminar empresas.
 * 
 * @componente
 * @returns {JSX.Element} El módulo de gestión de empresas.
 */
export default function Empresa() {
  const row = {
    id: 0,
    nombre: "",
    descripcion: "",
    estado: 0,
    celular: "",
    correo: "",
    contacto: "",
    tipoIdentificacionId: 0,
    personaId: 0,
    identificacion: "",
  };

  const [selectedRow, setSelectedRow] = React.useState(row);
  const messageData = {
    open: false,
    severity: "success",
    text: "",
  };

  const [message, setMessage] = React.useState(messageData);
  const [empresas, setEmpresas] = React.useState([]);

  // Función para recargar los datos
  const reloadData = () => {
    axios
      .get(`${SiteProps.urlbasev1}/empresas`)
      .then((response) => {
        const empresaData = response.data.data.map((item) => ({
          ...item,
          id: item.id,
        }));
        setEmpresas(empresaData);
      })
      .catch((error) => {
        console.error("Error al buscar empresas!", error);
      });

  };

  React.useEffect(() => {
    reloadData();  // Llama a reloadData para cargar los datos iniciales
  }, []);

  return (
    <div style={{ height: "100%", width: "100%" }}>
      <MessageSnackBar message={message} setMessage={setMessage} />
      <FormEmpresa
        setMessage={setMessage}
        selectedRow={selectedRow}
        setSelectedRow={setSelectedRow}
        reloadData={reloadData}  // Pasa reloadData como prop a FormProductocategoria
        empresas={empresas}

      />
      <GridEmpresa
        selectedRow={selectedRow}
        setSelectedRow={setSelectedRow}
        empresas={empresas}
      />
    </div>
  );
}
