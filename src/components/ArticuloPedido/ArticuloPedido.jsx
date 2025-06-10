import React from "react";
import axios from "../axiosConfig";
import MessageSnackBar from "../MessageSnackBar";
import FormArticuloPedido from "./FormArticuloPedido.jsx";
import GridArticuloPedido from "./GridArticuloPedido.jsx";

export default function ArticuloPedido() {
  const row = {
    id: 0,
    cantidad: "",
    pedidoId: "",
    productoPresentacionId: "",
    estadoId: 1,
  };

  const [selectedRow, setSelectedRow] = React.useState(row);
  const [message, setMessage] = React.useState({ open: false, severity: "success", text: "" });
  const [articulos, setArticulos] = React.useState([]);

  const reloadData = () => {
    axios
      .get("/v1/articulo-pedido")
      .then((response) => {
        const data = Array.isArray(response.data.data) ? response.data.data : response.data;
        setArticulos(data);
      })
      .catch((error) => {
        setMessage({ open: true, severity: "error", text: "Error al cargar artículos del pedido" });
      });
  };

  React.useEffect(() => {
    reloadData();
  }, []);

  return (
    <div style={{ height: "100%", width: "100%" }}>
      <h1>Artículo del Pedido</h1>
      <MessageSnackBar message={message} setMessage={setMessage} />
      <FormArticuloPedido
        selectedRow={selectedRow}
        setSelectedRow={setSelectedRow}
        setMessage={setMessage}
        reloadData={reloadData}
      />
      <GridArticuloPedido
        articulos={articulos}
        selectedRow={selectedRow}
        setSelectedRow={setSelectedRow}
      />
    </div>
  );
}