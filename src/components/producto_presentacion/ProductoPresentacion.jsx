import * as React from 'react';
import axios from 'axios';
import MessageSnackBar from '../MessageSnackBar';
import FormProductoPresentacion from "./FormProductoPresentacion";
import GridProductoPresentacion from "./GridProductoPresentacion";
import { SiteProps } from '../dashboard/SiteProps';

export default function ProductoPresentacion() {
  const row = {
    prp_id: 0,
    prp_producto_id: 0,
    prp_nombre: "",
    prp_unidad_id: 0,
    prp_descripcion: "",
    prp_estado: 0,
    prp_cantidad: 0,
    prp_marca_id: 0,
    prp_presentacion_id: 0
  };

  const [selectedRow, setSelectedRow] = React.useState(row);
  const messageData = {
    open: false,
    severity: "success",
    text: ""
  };

  const [message, setMessage] = React.useState(messageData);
  const [productoPresentacion, setProductoPresentacion] = React.useState([]);
  const [producto, setProducto] = React.useState([]);
  const [unidad, setUnidad] = React.useState([]);
  const [marca, setMarca] = React.useState([]);
  const [estado, setEstado] = React.useState([]);
  const [presentacion, setPresentacion] = React.useState([]);

  React.useEffect(() => {
    axios.get(`${SiteProps.urlbase}/producto_presentacion`)
      .then(response => {
        const productoPresentacionData = response.data.map((item) => ({
          ...item,
          id: item.prp_id,
        }));
        setProductoPresentacion(productoPresentacionData);
        console.log(productoPresentacionData);
      })
      .catch(error => {
        console.error("Error al buscar producto_presentacion!", error);
      });
  }, []);

  React.useEffect(() => {
    axios.get(`${SiteProps.urlbase}/producto`)
      .then(response => {
        setProducto(response.data);
        console.log(producto);
      })
      .catch(error => {
        console.error("Error al buscar product!", error);
      });
  }, []);

  React.useEffect(() => {
    axios.get(`${SiteProps.urlbase}/unidad`)
      .then(response => {
        setUnidad(response.data);
        console.log(unidad);
      })
      .catch(error => {
        console.error("Error al buscar unidad!", error);
      });
  }, []);

  React.useEffect(() => {
    axios.get(`${SiteProps.urlbase}/marca`)
      .then(response => {
        setMarca(response.data);
        console.log(marca);
      })
      .catch(error => {
        console.error("Error al buscar marca!", error);
      });
  }, []);

  React.useEffect(() => {
    axios.get(`${SiteProps.urlbase}/presentacion`)
      .then(response => {
        setPresentacion(response.data);
        console.log(presentacion);
      })
      .catch(error => {
        console.error("Error al buscar presentacion!", error);
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
      <FormProductoPresentacion
        setMessage={setMessage}
        selectedRow={selectedRow}
        setSelectedRow={setSelectedRow}
        producto={producto}
        unidad={unidad}
        marca={marca}
        presentacion={presentacion}
        estado={estado}
      />
      <GridProductoPresentacion
        selectedRow={selectedRow}
        setSelectedRow={setSelectedRow}
        productoPresentacion={productoPresentacion}
      />
    </div>
  );
}