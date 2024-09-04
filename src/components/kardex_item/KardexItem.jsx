import * as React from 'react';
import axios from 'axios';
import MessageSnackBar from '../MessageSnackBar';
import FormKardexItem from "./FormKardexItem";
import GridKardexItem from "./GridKardexItem";
import ComboBox from '/src/components/ComboBox.jsx';
import { SiteProps } from '../dashboard/SiteProps';

export default function KardexItem() {
  const row = {
    kai_id: 0,
    kai_kardex_id: 0,
    kai_producto_presentacion_id: 0,
    kai_cantidad: 0,
    kai_precio: 0,
    kai_estado: 0
  };

  const [selectedRow, setSelectedRow] = React.useState(row);
  const messageData = {
    open: false,
    severity: "success",
    text: ""
  };

  const [message, setMessage] = React.useState(messageData);
  const [kardexItems, setKardexItems] = React.useState([]);
  const [kardex, setKardex] = React.useState([]);
  const [productoPresentacion, setProductoPresentacion] = React.useState([]);
  const [estado, setEstado] = React.useState([]);
  const [filteredKardexItems, setFilteredKardexItems] = React.useState([]);
  const [selectedKardex, setSelectedKardex] = React.useState(null);
  const [selectedProductoPresentacion, setSelectedProductoPresentacion] = React.useState(null);
  const [filteredKardex, setFilteredKardex] = React.useState([]);
  const [selectedAlmacen, setSelectedAlmacen] = React.useState(null);
  const [selectedProduccion, setSelectedProduccion] = React.useState(null);
  const [selectedMovimiento, setSelectedMovimiento] = React.useState(null);





  React.useEffect(() => {
    axios.get(`${SiteProps.urlbase}/kardex_item`)
      .then(response => {
        const kardexItemData = response.data.map((item) => ({
          ...item,
          id: item.kai_id
        }));
        setKardexItems(kardexItemData);
        setFilteredKardexItems(kardexItemData);
      })
      .catch(error => {
        console.error("Error al buscar kardex items!", error);
      });
  }, []);

  React.useEffect(() => {
    axios.get(`${SiteProps.urlbase}/kardex`)
      .then(response => {
        setKardex(response.data);
      })
      .catch(error => {
        console.error("Error al buscar kardex!", error);
      });
  }, []);

  React.useEffect(() => {
    axios.get(`${SiteProps.urlbase}/producto_presentacion`)
      .then(response => {
        setProductoPresentacion(response.data);
      })
      .catch(error => {
        console.error("Error al buscar producto_presentacion!", error);
      });
  }, []);

  React.useEffect(() => {
    axios.get(`${SiteProps.urlbase}/estado`)
      .then(response => {
        setEstado(response.data);
      })
      .catch(error => {
        console.error("Error al buscar estado!", error);
      });
  }, []);

  React.useEffect(() => {
    handleFilterChange(selectedAlmacen, selectedProduccion, selectedMovimiento);
  }, [selectedAlmacen, selectedProduccion, selectedMovimiento, kardex]);

  const handleFilterChange = (almacen, produccion, movimiento) => {
    let filteredData = kardex;
    if (almacen) {
      filteredData = filteredData.filter(item => item.kar_almacen_id === almacen.id);
    }
    if (produccion) {
      filteredData = filteredData.filter(item => item.kar_produccion_id === produccion.id);
    }
    if (movimiento) {
      filteredData = filteredData.filter(item => item.kar_tipo_movimiento_id === movimiento.id);
    }
    setFilteredKardex(filteredData);
  };

  return (
    <div style={{ height: '100%', width: '100%' }}>
      <MessageSnackBar message={message} setMessage={setMessage} />
      <ComboBox
        onAlmacenChange={(almacen) => setSelectedAlmacen(almacen)}
        onProduccionChange={(produccion) => setSelectedProduccion(produccion)}
        onMovimientoChange={(movimiento) => setSelectedMovimiento(movimiento)}
      />
      <FormKardexItem
        setMessage={setMessage}
        selectedRow={selectedRow}
        setSelectedRow={setSelectedRow}
        kardex={kardex}
        productoPresentacion={productoPresentacion}
        estado={estado}
      />
      <GridKardexItem
        selectedRow={selectedRow}
        setSelectedRow={setSelectedRow}
        kardexItems={filteredKardexItems}
      />
    </div>
  );
}

