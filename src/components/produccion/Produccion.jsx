import * as React from 'react';
import axios from 'axios';
import MessageSnackBar from '../MessageSnackBar';
import FormProduccion from "./FormProduccion";
import GridProduccion from "./GridProduccion";
import { SiteProps } from '../dashboard/SiteProps';

export default function Produccion() {
  const row = {
    pro_id: 0,
    pro_nombre: "",
    pro_tipo_produccion_id: 0,
    pro_descripcion: "",
    pro_estado: 0,
    pro_fecha_inicio: new Date(),
    pro_fecha_final: new Date(),
    pro_espacio_id: 0
  };

  const [selectedRow, setSelectedRow] = React.useState(row);
  const messageData = {
    open: false,
    severity: "success",
    text: ""
  };

  const [message, setMessage] = React.useState(messageData);
  const [produccion, setProduccion] = React.useState([]);
  const [tipoProduccion, setTipoProduccion] = React.useState([]);
  const [espacio, setEspacio] = React.useState([]);
  const [estado, setEstado] = React.useState([]);

  React.useEffect(() => {
    axios.get(`${SiteProps.urlbase}/produccion`)
      .then(response => {
        const produccionData = response.data.map((item) => ({
          ...item,
          id: item.pro_id,
          pro_fecha_inicio: new Date(item.pro_fecha_inicio),
          pro_fecha_final: new Date(item.pro_fecha_final)
        }));
        setProduccion(produccionData);
        console.log(produccionData);
      })
      .catch(error => {
        console.error("Error al buscar produccion!", error);
      });
  }, []);

  React.useEffect(() => {
    axios.get(`${SiteProps.urlbase}/tipo_produccion`)
      .then(response => {
        setTipoProduccion(response.data);
        console.log(tipoProduccion);
      })
      .catch(error => {
        console.error("Error al buscar tipo_produccion!", error);
      });
  }, []);

  React.useEffect(() => {
    axios.get(`${SiteProps.urlbase}/espacio`)
      .then(response => {
        setEspacio(response.data);
        console.log(espacio);
      })
      .catch(error => {
        console.error("Error al buscar espacio!", error);
      });
  }, []);

  React.useEffect(() => {
    axios.get(`${SiteProps.urlbase}/estado`)
      .then(response => {
        setEstado(response.data);
        console.log(estado);
      })
      .catch(error => {
        console.error("Error al buscar estado!", error);
      });
  }, []);

  return (
    <div style={{ height: '100%', width: '100%' }}>
      <MessageSnackBar message={message} setMessage={setMessage} />
      <FormProduccion
        setMessage={setMessage}
        selectedRow={selectedRow}
        setSelectedRow={setSelectedRow}
        tipoProduccion={tipoProduccion}
        espacio={espacio}
        estado={estado}
      />
      <GridProduccion
        selectedRow={selectedRow}
        setSelectedRow={setSelectedRow}
        produccion={produccion}
      />
    </div>
  );
}

