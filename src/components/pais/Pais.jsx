import * as React from 'react';
import axios from 'axios';
import MessageSnackBar from '../MessageSnackBar';
import FormPais from "./FormPais";
import GridPais from "./GridPais";
import { SiteProps } from '../dashboard/SiteProps';


export default function Pais() {
  const row = {
    id: 0,
    name: "",
  };

  const [selectedRow, setSelectedRow] = React.useState(row);
  const messageData = {
    open: false,
    severity: "success",
    text: ""
  };

  
  const [message, setMessage] = React.useState(messageData);;
  const [pais, setPais] = React.useState([]);

  React.useEffect(() => {
    axios.get(`${SiteProps.urlbasev1}/items/pais`)
      .then(response => {
        const paisData = response.data.map((item) => ({
          ...item,
          id: item.id, // Asignar id basado en pai_id
        }));
        setPais(paisData);
        console.log(paisData);
      })
      .catch(error => {
        console.error("Error al buscar pais!", error);
      });
  }, []);

  // React.useEffect(() => {
  //   axios.get(`${SiteProps.urlbase}/pais` )
  //     .then(response => {
  //       setPais(response.data);
  //       console.log(pais);
  //     })
  //     .catch(error => {
  //       console.error("Error al buscar pais!", error);
  //     });
  // }, []);



  return (
    <div style={{ height: '100%', width: '100%' }}>
      <MessageSnackBar message={message} setMessage={setMessage} />
      <FormPais setMessage={setMessage} selectedRow={selectedRow} setSelectedRow={setSelectedRow} pais={pais} />
      <GridPais selectedRow={selectedRow} setSelectedRow={setSelectedRow} pais={pais} />
    </div>
  );
}



