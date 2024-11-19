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
    pro_descripcion: "",
    pro_estado: 0,
    pro_fecha_inicio: new Date(),
    pro_fecha_final: new Date()
  };

  const [selectedRow, setSelectedRow] = React.useState(row);
  const messageData = {
    open: false,
    severity: "success",
    text: ""
  };

  const [message, setMessage] = React.useState(messageData);
  const [producciones, setProduccion] = React.useState([]);

  // Función para recargar los datos de producciones
  const reloadData = () => {
    axios.get(`${SiteProps.urlbasev1}/producciones`)
      .then((response) => {
        if (Array.isArray(response.data)) {
          const produccionesData = response.data.map((item) => ({
            ...item,
            id: item.pro_id,
            pro_fecha_inicio: new Date(item.pro_fecha_inicio),
            pro_fecha_final: new Date(item.pro_fecha_final)
          }));
          setProduccion(produccionesData);
        } else {
          console.error('La respuesta de producciones no es un array:', response.data);
          setMessage({
            open: true,
            severity: 'error',
            text: 'Error al cargar producciones: respuesta no válida'
          });
        }
      })
      .catch((error) => {
        console.error('Error al cargar producciones:', error);
        setMessage({
          open: true,
          severity: 'error',
          text: 'Error al cargar producciones'
        });
      });
  };

  React.useEffect(() => {
    reloadData();
  }, []);

  return (
    <div style={{ height: '100%', width: '100%' }}>
      <MessageSnackBar message={message} setMessage={setMessage} />
      <FormProduccion
        setMessage={setMessage}
        selectedRow={selectedRow}
        setSelectedRow={setSelectedRow}
        reloadData={reloadData}
      />
      <GridProduccion
        selectedRow={selectedRow}
        setSelectedRow={setSelectedRow}
        producciones={producciones}
      />
    </div>
  );
}
