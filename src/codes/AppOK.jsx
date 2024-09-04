/*
import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
      <div>
        <a href="https://vitejs.dev" target="_blank">
          <img src={viteLogo} className="logo" alt="Vite logo" />
        </a>
        <a href="https://react.dev" target="_blank">
          <img src={reactLogo} className="logo react" alt="React logo" />
        </a>
      </div>
      <h1>Vite + React</h1>
      <div className="card">
        <button onClick={() => setCount((count) => count + 1)}>
          count is {count}
        </button>
        <p>
          Edit <code>src/App.jsx</code> and save to test HMR
        </p>
      </div>
      <p className="read-the-docs">
        Click on the Vite and React logos to learn more
      </p>
    </>
  )
}

export default App
*/




import * as React from 'react';
import PropTypes from 'prop-types';
import { useTheme } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableFooter from '@mui/material/TableFooter';
import TablePagination from '@mui/material/TablePagination';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import IconButton from '@mui/material/IconButton';
import FirstPageIcon from '@mui/icons-material/FirstPage';
import KeyboardArrowLeft from '@mui/icons-material/KeyboardArrowLeft';
import KeyboardArrowRight from '@mui/icons-material/KeyboardArrowRight';
import LastPageIcon from '@mui/icons-material/LastPage';

import MessageSnackBar from '../components/MessageSnackBar';
import FormTutorial from "../components/tutorial/FormTutorial";
import GridTutorial from "../components/tutorial/GridTutorial";
// import StackButtons from './components/StackButtons';

export default function Home() {
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
    <div style={{ height: 400, width: '100%' }}>
      <MessageSnackBar message={message} setMessage={setMessage} />
      <FormTutorial setMessage={setMessage} selectedRow={selectedRow} setSelectedRow={setSelectedRow} />
      <GridTutorial selectedRow={selectedRow} setSelectedRow={setSelectedRow}/>
    </div>
  );
}
