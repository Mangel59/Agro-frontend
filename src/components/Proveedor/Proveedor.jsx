
/**
 * Proveedor componente principal.
 * @component
 * @returns {JSX.Element}
 */
// import React, { useState, useEffect } from "react";
// import axios from "axios";
// import MessageSnackBar from "../MessageSnackBar";
// import FormProveedor from "./FormProveedor";
// import GridProveedor from "./GridProveedor";
// import { SiteProps } from "../dashboard/SiteProps";

/**
 * Componente Proveedor.
 * @module Proveedor.jsx
 * @component
 * @returns {JSX.Element}
 */
// export default function Proveedor() {
//   const initialRow = {
//     id: 0,
//     nombre: "",
//     descripcion: "",
//     estado: 0,
//     empresa: 0,
//   };

//   const [selectedRow, setSelectedRow] = useState(initialRow);
//   const [message, setMessage] = useState({
//     open: false,
//     severity: "success",
//     text: "",
//   });
//   const [proveedores, setProveedores] = useState([]);
//   const [paginationModel, setPaginationModel] = useState({
//     page: 0,
//     pageSize: 5,
//   });

//   const reloadData = () => {
//     const token = localStorage.getItem("token");

//     if (!token) {
//       setMessage({
//         open: true,
//         severity: "error",
//         text: "Error: Token de autenticación no encontrado.",
//       });
//       return;
//     }

//     axios
//       .get(`${SiteProps.urlbasev1}/proveedores`, {
//         params: {
//           page: paginationModel.page,
//           size: paginationModel.pageSize,
//         },
//         headers: {
//           Authorization: `Bearer ${token}`,
//         },
//       })
//       .then((response) => {
//         if (response.data && Array.isArray(response.data)) {
//           setProveedores(response.data);
//         } else if (response.data.data && Array.isArray(response.data.data)) {
//           setProveedores(response.data.data);
//         } else {
//           console.error("La respuesta no es un array válido:", response.data);
//           setMessage({
//             open: true,
//             severity: "error",
//             text: "Error al cargar Proveedores: respuesta no válida.",
//           });
//         }
//       })
//       .catch((error) => {
//         console.error("Error al cargar Proveedores:", error);
//         setMessage({
//           open: true,
//           severity: "error",
//           text: `Error al cargar Proveedores: ${error.message}`,
//         });
//       });
//   };

//   useEffect(() => {
//     reloadData();
//   }, [paginationModel]);

//   return (
//     <div style={{ height: "100%", width: "100%" }}>
//       <MessageSnackBar message={message} setMessage={setMessage} />
//       <FormProveedor
//         setMessage={setMessage}
//         selectedRow={selectedRow}
//         setSelectedRow={setSelectedRow}
//         reloadData={reloadData}
//       />
//       <GridProveedor
//         selectedRow={selectedRow}
//         setSelectedRow={setSelectedRow}
//         proveedores={proveedores}
//         paginationModel={paginationModel}
//         setPaginationModel={setPaginationModel}
//       />
//     </div>
//   );
// }


import React, { useState, useEffect } from "react";
import FormProveedor from "./FormProveedor";
import GridProveedor from "./GridProveedor";

export default function Proveedor() {
  const [proveedores, setProveedores] = useState([]);
  const [selectedRow, setSelectedRow] = useState(null);

  // Cargar datos desde el archivo JSON
  useEffect(() => {
    fetch("/proveedor.json")
      .then((response) => response.json())
      .then((data) => setProveedores(data))
      .catch((error) => console.error("Error al cargar proveedores:", error));
  }, []);

  // Agregar un nuevo proveedor
  const handleAdd = (newProveedor) => {
    setProveedores([...proveedores, { ...newProveedor, pro_id: Date.now() }]);
  };

  // Actualizar un proveedor existente
  const handleUpdate = (updatedProveedor) => {
    setProveedores(
      proveedores.map((prov) =>
        prov.pro_id === updatedProveedor.pro_id ? updatedProveedor : prov
      )
    );
    setSelectedRow(null); // Limpiar selección
  };

  // Eliminar un proveedor
  const handleDelete = (id) => {
    setProveedores(proveedores.filter((prov) => prov.pro_id !== id));
    setSelectedRow(null); // Limpiar selección
  };

  return (
    <div style={{ padding: "2rem" }}>
      <h1>Gestión de Proveedores</h1>
      <FormProveedor
        onAdd={handleAdd}
        onUpdate={handleUpdate}
        onDelete={handleDelete}
        selectedRow={selectedRow}
        setSelectedRow={setSelectedRow}
      />
      <GridProveedor
        proveedores={proveedores}
        onEdit={setSelectedRow}
      />
    </div>
  );
}
