import React from "react";

export default function VistaPreviaPDFProductoVencido({ url }) {
  if (!url) return null;

  return (
    <iframe
      src={url}
      width="100%"
      height="600"
      title="Vista previa PDF Producto Vencido"
      style={{ border: "none" }}
    />
  );
}
