/**
 * @file ProductoPresentacion.jsx
 * @module ProductoPresentacion
 * @description Componente principal para gestionar la entidad Producto Presentación.
 * Muestra un formulario para agregar/editar y una grilla con paginación.
 * Utiliza Axios para obtener datos del backend como marcas, unidades, productos y presentaciones.
 * Incluye paginación, control de errores, mensajes tipo snackbar y manejo de autenticación por token.
 * @author Karla
 */

import * as React from 'react';
import axios from '../axiosConfig';
import MessageSnackBar from '../MessageSnackBar';
import FormProductoPresentacion from '../producto_presentacion/FormProductoPresentacion';
import GridProductoPresentacion from '../producto_presentacion/GridProductoPresentacion';
import { SiteProps } from '../dashboard/SiteProps';

/**
 * @typedef {Object} ProductoPresentacionRow
 * @property {number} id
 * @property {string} nombre
 * @property {number} producto
 * @property {number} unidad
 * @property {number} cantidad
 * @property {number} marca
 * @property {number} presentacion
 * @property {string} descripcion
 * @property {number} estado
 */

/**
 * @typedef {Object} SnackbarMessage
 * @property {boolean} open
 * @property {"success"|"error"|"info"|"warning"} severity
 * @property {string} text
 */

/**
 * Componente principal para la gestión de producto presentación.
 * @returns {JSX.Element}
 */
export default function ProductoPresentacion() {
  /** @type {ProductoPresentacionRow} */
  const row = {
    id: 0,
    nombre: "",
    producto: 0,
    unidad: 0,
    cantidad: 0,
    marca: 0,
    presentacion: 0,
    descripcion: "",
    estado: 0,
  };

  /** Total de filas para paginación */
  const [rowCount, setRowCount] = React.useState(0);

  /** Fila actualmente seleccionada */
  const [selectedRow, setSelectedRow] = React.useState(row);

  /** Estado del mensaje tipo snackbar */
  const [message, setMessage] = React.useState({
    open: false,
    severity: "success",
    text: "",
  });

  /** Lista de presentaciones paginadas */
  const [presentaciones, setPresentaciones] = React.useState([]);

  /** Modelo de paginación */
  const [paginationModel, setPaginationModel] = React.useState({
    page: 0,
    pageSize: 5,
  });

  /** Listas auxiliares */
  const [marcas, setMarcas] = React.useState([]);
  const [unidades, setUnidades] = React.useState([]);
  const [presentacionesList, setPresentacionesList] = React.useState([]);
  const [productos, setProductos] = React.useState([]);

  const token = localStorage.getItem("token");

  if (!token) {
    setMessage({
      open: true,
      severity: "error",
      text: "Token no disponible. Inicie sesión nuevamente.",
    });
  }

  /**
   * Carga la lista paginada de producto-presentaciones desde el backend.
   * @function reloadData
   */
  const reloadData = () => {
    axios.get(`${SiteProps.urlbasev1}/producto-presentacion`, {
      params: {
        page: paginationModel.page,
        size: paginationModel.pageSize,
      },
      headers: {
        Authorization: `Bearer ${token}`,
      }
    })
      .then((response) => {
        if (response.data && Array.isArray(response.data.content)) {
          setPresentaciones(response.data.content);
          setRowCount(response.data.page?.totalElements || response.data.content.length);
        } else {
          console.error('La respuesta no es un array:', response.data);
          setMessage({
            open: true,
            severity: 'error',
            text: 'Error al cargar Producto Presentación: respuesta no válida'
          });
        }
      })
      .catch((error) => {
        console.error('Error al cargar Producto Presentación:', error);
        setMessage({
          open: true,
          severity: 'error',
          text: 'Error al cargar Producto Presentación'
        });
      });
  };

  React.useEffect(() => {
    reloadData();
  }, [paginationModel]);

  /**
   * Carga los datos auxiliares: marcas, unidades, presentaciones y productos.
   */
  React.useEffect(() => {
    axios.get(`${SiteProps.urlbasev1}/marca`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((response) => setMarcas(Array.isArray(response.data) ? response.data : []))
      .catch((error) => console.error("Error al cargar Marcas:", error));

    axios.get(`${SiteProps.urlbasev1}/unidad`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((response) => setUnidades(Array.isArray(response.data) ? response.data : []))
      .catch((error) => console.error("Error al cargar Unidades:", error));

    axios.get(`${SiteProps.urlbasev1}/presentaciones`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((response) => setPresentacionesList(Array.isArray(response.data) ? response.data : []))
      .catch((error) => console.error("Error al cargar Presentaciones:", error));

    axios.get(`${SiteProps.urlbasev1}/producto`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((response) => {
        if (response.data && Array.isArray(response.data.content)) {
          setProductos(response.data.content);
        } else {
          console.error("Formato incorrecto en productos:", response.data);
        }
      })
      .catch((error) => console.error("Error al cargar Productos:", error));
  }, []);

  return (
    <div style={{ height: "100%", width: "100%" }}>
      <h1>Producto Presentación</h1>
      <MessageSnackBar message={message} setMessage={setMessage} />
      <FormProductoPresentacion
        setMessage={setMessage}
        selectedRow={selectedRow}
        setSelectedRow={setSelectedRow}
        reloadData={reloadData}
        presentaciones={presentaciones}
        marcas={marcas}
        unidades={unidades}
        presentacionesList={presentacionesList}
        productos={productos}
      />
      <GridProductoPresentacion
        selectedRow={selectedRow}
        setSelectedRow={setSelectedRow}
        presentaciones={presentaciones}
        paginationModel={paginationModel}
        setPaginationModel={setPaginationModel}
        rowCount={rowCount}
      />
    </div>
  );
}
