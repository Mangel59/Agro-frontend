import React, { useState } from 'react';
import FormKardexNuevo from './FormKardexNuevo';

export default function KardexNuevo() {
  const [message, setMessage] = useState({ open: false, severity: 'info', text: '' });

  return (
    <div>
      <FormKardexNuevo setMessage={setMessage} />
    </div>
  );
}
