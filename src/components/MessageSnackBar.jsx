import * as React from 'react';
import Button from '@mui/material/Button';
import Snackbar from '@mui/material/Snackbar';
import Alert from '@mui/material/Alert';


export default function MessageSnackBar(props) {
    console.log(props.message);



  const handleClose = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }


    props.setMessage({
        open:false,
        severity:props.message.severity,
        text:props.message.text
    });
    
    // setOpen(false);
    // props.message.open = false;
  };

  return (
    <div>
      {/* <Button onClick={handleClick}>Open Snackbar</Button> */}
      <Snackbar open={props.message.open} autoHideDuration={6000} onClose={handleClose}>
        <Alert
          onClose={handleClose}
          severity={props.message.severity}
          variant="filled"
          sx={{ width: '100%' }}
        >
            {props.message.text}
        </Alert>
      </Snackbar>
    </div>
  );
}