import * as React from "react";
import axios from "axios";
import MessageSnackBar from "../MessageSnackBar";
import FormMunicipio from "./FormMunicipio";
import GridMunicipio from "./GridMunicipio";
import { SiteProps } from "../dashboard/SiteProps";


export default function Municipio() {
  const row = {
    mun_id: 0,
    mun_nombre: "",
    mun_departamento_id: 0,
    mun_codigo: 0,
    mun_acronimo: "",
  };

  const [selectedRow, setSelectedRow] = React.useState(row);
  const messageData = {
    open: false,
    severity: "success",
    text: "",
  };

  const [message, setMessage] = React.useState(messageData);
  const [municipios, setMunicipios] = React.useState([]);
  const [departamentos, setDepartamentos] = React.useState([]);

  React.useEffect(() => {
    axios
      .get(`${SiteProps.urlbase}/municipio`)
      .then((response) => {
        const municipioData = response.data.map((item) => ({
          ...item,
          id: item.mun_id,
        }));
        setMunicipios(municipioData);
        console.log(municipioData);
      })
      .catch((error) => {
        console.error("Error al buscar pais!", error);
      });
  }, []);

  React.useEffect(() => {
    axios
      .get(`${SiteProps.urlbase}/departamento`)
      .then((response) => {
        setDepartamentos(response.data);
        console.log(response.data);
      })
      .catch((error) => {
        console.error("Error al buscar departamento!", error);
      });
  }, []);

  return (
    <div style={{ height: "100%", width: "100%" }}>
      <MessageSnackBar message={message} setMessage={setMessage} />
      <FormMunicipio
        setMessage={setMessage}
        selectedRow={selectedRow}
        setSelectedRow={setSelectedRow}
        municipios={municipios}
        departamentos={departamentos}
      />
      <GridMunicipio
        selectedRow={selectedRow}
        setSelectedRow={setSelectedRow}
        municipios={municipios}
      />
    </div>
  );
}
