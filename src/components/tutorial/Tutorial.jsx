
import * as React from 'react';

import MessageSnackBar from '../MessageSnackBar';
import FormTutorial from "./FormTutorial";
import GridTutorial from "./GridTutorial";
// import StackButtons from './components/StackButtons';

export default function Tutorial() {
  const row = {
    id: 0,
    title: "", 
    description: "",
    published: true
  }

  const [selectedRow, setSelectedRow] = React.useState(row);

  const messageData = {
    open:false,
    severity:"success",
    text:""
  }
  const [message, setMessage] = React.useState(messageData);
0
  return (
    <div style={{ height: '100%', width: '100%' }}>
      <MessageSnackBar message={message} setMessage={setMessage} />
      <FormTutorial setMessage={setMessage} selectedRow={selectedRow} setSelectedRow={setSelectedRow} />
      <GridTutorial selectedRow={selectedRow} setSelectedRow={setSelectedRow}/>
    </div>
  );
}
