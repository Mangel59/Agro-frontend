import * as React from 'react';
import axios from '../axiosConfig';
import MessageSnackBar from '../MessageSnackBar';
import FormProductoPresentacion from "./FormProductoPresentacion";
import GridProductoPresentacion from "./GridProductoPresentacion";
import { SiteProps } from '../dashboard/SiteProps';

export default function ProductoPresentacion() {
  const row = {
    prp_id: 0,
    prp_producto_id: 0,
    prp_unidad_id: 0,
    prp_nombre: "",
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
    axios.get(`${SiteProps.urlbase}/producto-presentaciones`)
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
    axios.get(`${SiteProps.urlbase}/productos`)
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

// import * as React from 'react';
// import MessageSnackBar from '../MessageSnackBar';
// import FormProductoPresentacion from "./FormProductoPresentacion";
// import GridProductoPresentacion from "./GridProductoPresentacion";

// export default function ProductoPresentacion() {
//   const row = {
//     prp_id: 0,
//     prp_producto_id: 0,
//     prp_unidad_id: 0,
//     prp_nombre: "",
//     prp_descripcion: "",
//     prp_estado: 0,
//     prp_cantidad: 0,
//     prp_marca_id: 0,
//     prp_presentacion_id: 0
//   };

//   const [selectedRow, setSelectedRow] = React.useState(row);
//   const messageData = {
//     open: false,
//     severity: "success",
//     text: ""
//   };

//   const [message, setMessage] = React.useState(messageData);
//   const [productoPresentacion, setProductoPresentacion] = React.useState([]);
//   const [producto, setProducto] = React.useState([]);
//   const [unidad, setUnidad] = React.useState([]);
//   const [marca, setMarca] = React.useState([]);
//   const [estado, setEstado] = React.useState([]);
//   const [presentacion, setPresentacion] = React.useState([]);

//   // Función para cargar archivos JSON locales
//   const fetchData = (url, setStateFunction) => {
//     fetch(url)
//       .then(response => response.json())
//       .then(data => setStateFunction(data))
//       .catch(error => console.error(`Error al buscar datos de ${url}`, error));
//   };

//   // Cargar datos desde JSON al inicio
//   React.useEffect(() => {
//     fetchData('/productoPresentacion.json', setProductoPresentacion);
//     fetchData('/producto.json', setProducto);
//     fetchData('/unidad.json', setUnidad);
//     fetchData('/marca.json', setMarca);
//     fetchData('/presentacion.json', setPresentacion);
//     fetchData('/estado.json', setEstado);
//   }, []);

//   // Función para agregar un nuevo producto
//   const addProductoPresentacion = (newData) => {
//     setProductoPresentacion((prevData) => [...prevData, newData]);
//     setMessage({ open: true, severity: "success", text: "Producto presentación creado con éxito!" });
//   };

//   // Función para actualizar un producto
//   const updateProductoPresentacion = (updatedData) => {
//     setProductoPresentacion((prevData) =>
//       prevData.map((item) => (item.prp_id === updatedData.prp_id ? updatedData : item))
//     );
//     setMessage({ open: true, severity: "success", text: "Producto presentación actualizado con éxito!" });
//   };

//   // Función para eliminar un producto
//   const deleteProductoPresentacion = (id) => {
//     setProductoPresentacion((prevData) =>
//       prevData.filter((item) => item.prp_id !== id)
//     );
//     setMessage({ open: true, severity: "success", text: "Producto presentación eliminado con éxito!" });
//   };

//   return (
//     <div style={{ height: '100%', width: '100%' }}>
//       <MessageSnackBar message={message} setMessage={setMessage} />
//       <FormProductoPresentacion
//         setMessage={setMessage}
//         selectedRow={selectedRow}
//         setSelectedRow={setSelectedRow}
//         producto={producto}
//         unidad={unidad}
//         marca={marca}
//         presentacion={presentacion}
//         estado={estado}
//         addProductoPresentacion={addProductoPresentacion}  // Pasa las funciones para simular CRUD
//         updateProductoPresentacion={updateProductoPresentacion}
//         deleteProductoPresentacion={deleteProductoPresentacion}
//       />
//       <GridProductoPresentacion
//         selectedRow={selectedRow}
//         setSelectedRow={setSelectedRow}
//         productoPresentacion={productoPresentacion}
//       />
//     </div>
//   );
// }
