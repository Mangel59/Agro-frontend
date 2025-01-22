// import React, { useState, useEffect } from "react";
// import axios from "axios";
// import { Box, Button, TextField, Alert } from "@mui/material";
// import { DataGrid } from "@mui/x-data-grid";
// import { SiteProps } from "../SiteProps";

// export default function OrdenCompra() {
//   const [productos, setProductos] = useState([]);
//   const [productoSeleccionado, setProductoSeleccionado] = useState("");
//   const [cantidad, setCantidad] = useState("");
//   const [precio, setPrecio] = useState("");
//   const [unidad, setUnidad] = useState("");
//   const [ordenItems, setOrdenItems] = useState([]);
//   const [error, setError] = useState("");

//   // Cargar productos desde el backend
//   useEffect(() => {
//     const fetchProductos = async () => {
//       try {
//         const response = await axios.get(`${SiteProps.urlbasev1}/productos`, {
//           headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
//         });
//         // Asegurar que cada producto tenga un `id`
//         const productosConId = response.data.data.map((producto, index) => ({
//           ...producto,
//           id: producto.id || index, // Usa `id` o genera uno único
//         }));
//         setProductos(productosConId || []);
//       } catch (error) {
//         setError("Error al cargar productos.");
//       }
//     };
//     fetchProductos();
//   }, []);

//   // Agregar un producto a la orden de compra
//   const agregarProducto = () => {
//     if (!productoSeleccionado || !cantidad || !precio || !unidad) {
//       setError("Completa todos los campos.");
//       return;
//     }
//     const nuevoItem = {
//       id: ordenItems.length + 1, // Generar un ID único
//       producto: productoSeleccionado,
//       cantidad,
//       precio,
//       unidad,
//     };
//     setOrdenItems([...ordenItems, nuevoItem]);
//     setProductoSeleccionado("");
//     setCantidad("");
//     setPrecio("");
//     setUnidad("");
//   };

//   // Eliminar un producto de la orden de compra
//   const eliminarProducto = (id) => {
//     setOrdenItems(ordenItems.filter((item) => item.id !== id));
//   };

//   // Configuración de columnas de la grilla
//   const columns = [
//     { field: "producto", headerName: "Producto", width: 200 },
//     { field: "cantidad", headerName: "Cantidad", width: 150 },
//     { field: "precio", headerName: "Precio", width: 150 },
//     { field: "unidad", headerName: "Unidad", width: 150 },
//     {
//       field: "acciones",
//       headerName: "Acciones",
//       width: 150,
//       renderCell: (params) => (
//         <Button
//           color="error"
//           onClick={() => eliminarProducto(params.row.id)}
//         >
//           Eliminar
//         </Button>
//       ),
//     },
//   ];

//   return (
//     <Box>
//       {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

//       {/* Formulario para agregar productos */}
//       <Box display="flex" gap={2} mb={2}>
//         <TextField
//           label="Producto"
//           select
//           value={productoSeleccionado}
//           onChange={(e) => setProductoSeleccionado(e.target.value)}
//           SelectProps={{ native: true }}
//         >
//           <option value="">Seleccionar</option>
//           {productos.map((producto) => (
//             <option key={producto.id} value={producto.nombre}>
//               {producto.nombre}
//             </option>
//           ))}
//         </TextField>
//         <TextField
//           label="Cantidad"
//           type="number"
//           value={cantidad}
//           onChange={(e) => setCantidad(e.target.value)}
//         />
//         <TextField
//           label="Precio"
//           type="number"
//           value={precio}
//           onChange={(e) => setPrecio(e.target.value)}
//         />
//         <TextField
//           label="Unidad"
//           value={unidad}
//           onChange={(e) => setUnidad(e.target.value)}
//         />
//         <Button variant="contained" onClick={agregarProducto}>
//           Agregar
//         </Button>
//       </Box>

//       {/* Grilla para mostrar los productos */}
//       <DataGrid
//         rows={ordenItems}
//         columns={columns}
//         pageSize={5}
//         autoHeight
//         getRowId={(row) => row.id} // Asegurar que se use `id` como clave única
//       />

//       {/* Botón para ver reporte */}
//       <Box mt={2}>
//         <Button
//           variant="contained"
//           color="primary"
//           href="/reporte-orden-compra" // Navegación al reporte de orden de compra
//         >
//           Ver Reporte de Orden de Compra
//         </Button>
//       </Box>
//     </Box>
//   );
// }




import React, { useState, useEffect } from "react";
import { Box, TextField, Button, Modal, FormControl, InputLabel, Select, MenuItem } from "@mui/material";
import axios from "axios";
import { SiteProps } from "../dashboard/SiteProps";

export default function FormOrdenCompra({
  fetchOrdenesCompra,
  sedes,
  almacenes,
  setSede,
  setAlmacenId,
  selectedOrdenCompra,
  setSelectedOrdenCompra,
}) {
  const [modalOpen, setModalOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [newOrdenCompra, setNewOrdenCompra] = useState({
    pedidoId: "",
    proveedor: "",
    descripcion: "",
    estado: 1,
  });

  const [proveedores, setProveedores] = useState([]);

  useEffect(() => {
    const fetchProveedores = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await axios.get(`${SiteProps.urlbasev1}/proveedor/minimal`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setProveedores(response.data.content || []);
      } catch (error) {
        console.error("Error al cargar proveedores:", error);
      }
    };
    fetchProveedores();
  }, []);

  const handleOpenAddModal = () => {
    setIsEditing(false);
    setNewOrdenCompra({
      pedidoId: "",
      proveedor: "",
      descripcion: "",
      estado: 1,
    });
    setModalOpen(true);
  };

  const handleOpenUpdateModal = () => {
    if (selectedOrdenCompra) {
      setIsEditing(true);
      setNewOrdenCompra({
        pedidoId: selectedOrdenCompra.pedidoId,
        proveedor: selectedOrdenCompra.proveedor,
        descripcion: selectedOrdenCompra.descripcion,
        estado: selectedOrdenCompra.estado,
      });
      setModalOpen(true);
    } else {
      alert("Selecciona una orden de compra para actualizar.");
    }
  };

  const handleSaveOrdenCompra = async () => {
    if (!newOrdenCompra.pedidoId || !newOrdenCompra.proveedor || !newOrdenCompra.descripcion) {
      alert("Todos los campos son obligatorios.");
      return;
    }

    try {
      const token = localStorage.getItem("token");
      if (isEditing) {
        await axios.put(`${SiteProps.urlbasev1}/orden_compra/${selectedOrdenCompra.id}`, newOrdenCompra, {
          headers: { Authorization: `Bearer ${token}` },
        });
        alert("Orden de compra actualizada correctamente.");
      } else {
        await axios.post(`${SiteProps.urlbasev1}/orden_compra`, newOrdenCompra, {
          headers: { Authorization: `Bearer ${token}` },
        });
        alert("Orden de compra creada correctamente.");
      }

      setModalOpen(false);
      fetchOrdenesCompra();
    } catch (error) {
      console.error("Error al guardar la orden de compra:", error);
      alert("Hubo un problema al guardar la orden de compra.");
    }
  };

  return (
    <Box mb={2}>
      <Box display="flex" justifyContent="flex-end" mb={2}>
        <Button variant="contained" color="primary" onClick={handleOpenAddModal} style={{ marginRight: "10px" }}>
          ADD
        </Button>
        <Button variant="contained" color="secondary" onClick={handleOpenUpdateModal} style={{ marginRight: "10px" }}>
          UPDATE
        </Button>
        <Button
          variant="contained"
          color="error"
          onClick={() => {
            if (selectedOrdenCompra) {
              if (window.confirm("¿Estás seguro de eliminar esta orden de compra?")) {
                axios
                  .delete(`${SiteProps.urlbasev1}/orden_compra/${selectedOrdenCompra.id}`, {
                    headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
                  })
                  .then(() => {
                    alert("Orden de compra eliminada correctamente.");
                    fetchOrdenesCompra();
                    setSelectedOrdenCompra(null);
                  })
                  .catch((error) => {
                    console.error("Error al eliminar la orden de compra:", error);
                    alert("Hubo un problema al eliminar la orden de compra.");
                  });
              }
            } else {
              alert("Selecciona una orden de compra para eliminar.");
            }
          }}
        >
          DELETE
        </Button>
      </Box>

      <Modal open={modalOpen} onClose={() => setModalOpen(false)}>
        <Box
          p={4}
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: 400,
            bgcolor: "background.paper",
            borderRadius: "8px",
          }}
        >
          <h2>{isEditing ? "Editar Orden de Compra" : "Añadir Orden de Compra"}</h2>
          <TextField
            label="Pedido ID"
            fullWidth
            margin="normal"
            value={newOrdenCompra.pedidoId}
            onChange={(e) => setNewOrdenCompra({ ...newOrdenCompra, pedidoId: e.target.value })}
          />
          <FormControl fullWidth margin="normal">
            <InputLabel>Proveedor</InputLabel>
            <Select
              value={newOrdenCompra.proveedor}
              onChange={(e) => setNewOrdenCompra({ ...newOrdenCompra, proveedor: e.target.value })}
            >
              {proveedores.map((prov) => (
                <MenuItem key={prov.id} value={prov.id}>
                  {prov.nombre}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <TextField
            label="Descripción"
            fullWidth
            margin="normal"
            value={newOrdenCompra.descripcion}
            onChange={(e) => setNewOrdenCompra({ ...newOrdenCompra, descripcion: e.target.value })}
          />
          <Button variant="contained" color="primary" onClick={handleSaveOrdenCompra} fullWidth>
            Guardar
          </Button>
        </Box>
      </Modal>
    </Box>
  );
}
