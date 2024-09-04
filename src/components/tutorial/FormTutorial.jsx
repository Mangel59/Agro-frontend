import * as React from 'react';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';

import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import Input from '@mui/material/Input';
import FormHelperText from '@mui/material/FormHelperText';

import StackButtons from '../StackButtons';

export default function FormTutorial(props) {
    const [open, setOpen] = React.useState(false);
    const [methodName, setMethodName] = React.useState("");

    const create = () => {
        const row = {
            id: 0,
            title: "", 
            description: "",
            published: true
        }
        props.setSelectedRow(row);
        setMethodName("Add");
        setOpen(true);
        console.log("create() " + props.selectedRow);
        //{props.handleClickOpen};
    }

    const update = () => {
        if (props.selectedRow.id == 0){
            console.log("select row");
            const messageData = {
                open:true,
                severity:"error",
                text:"Select row!"
            }
            props.setMessage(messageData);
            
            return
        }
        setMethodName("Update");
        setOpen(true);
        console.log("update() " + props.selectedRow);
        //{props.handleClickOpen};
    };

    const deleteRow = () => {
        setMethodName("Delete");
        setOpen(true);
        console.log("delete() " + props.selectedRow);
        //{props.handleClickOpen};
    };

    const methods = {
        create,
        update,
        deleteRow
    }




    // const [id, setId] = React.useState(0);
    // const [title, setTitle] = React.useState("");
    // const [description, setDescription] = React.useState("");
    // const [published, setPublished] = React.useState(true);

    // if (props.selectedRow != undefined){
    //     console.log("SB: " + props.selectedRow.id);
    //     setLastName(props.selectedRow.lastName);
    // }

    React.useEffect(() => {
        // setCount(count + 1); // This triggers a re-render and updates the count
      
        if (props.selectedRow != undefined){
            console.log("SB: " + props.selectedRow.id);
            // setId(props.selectedRow.id);
            // setTitle(props.selectedRow.title);
            // setDescription(props.selectedRow.description);
            // setPublished(props.selectedRow.published);
        }
    }, []);

    const handleClickOpen = () => {
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };

  

    const handleChangePublished = (event) => {
        setPublished(event.target.value);
    };

    return (
        <React.Fragment>
            <StackButtons methods={methods} create={create} open={open} setOpen={setOpen} handleClickOpen={handleClickOpen} />
            <Dialog
                open={open}
                onClose={handleClose}
                PaperProps={{
                    component: 'form',
                    onSubmit: (event) => {
                        event.preventDefault();
                        const formData = new FormData(event.currentTarget);
                        const formJson = Object.fromEntries(formData.entries());
                        const id = props.selectedRow.id;
                        // const title = formJson.title;
                        console.log(id, formJson);
                        // , id, title);
                        handleClose();
                    },
                }}
            >
            <DialogTitle>Tutorial</DialogTitle>
            <DialogContent>
                <DialogContentText>
                    To subscribe to this website, please enter your email address here. We
                    will send updates occasionally.
                </DialogContentText>
          
                <FormControl fullWidth>
                    <TextField
                        autoFocus
                        required
                        id="title"
                        name="title"
                        label="Title"
                        fullWidth
                        variant="standard"
                        margin="normal"
                        defaultValue={props.selectedRow.title}
                        // onChange={e => setTitle(e.target.value)}
                    />
                </FormControl>
        
                <FormControl fullWidth>
                    <TextField
                        id="description"
                        name="description"
                        label="Description"
                        multiline
                        fullWidth
                        rows={3}
                        // defaultValue=""
                        margin="normal"
                        defaultValue={props.selectedRow.description}
                        // onChange={e => setDescription(e.target.value)}
                    />
                </FormControl>

                <FormControl fullWidth>
                    <InputLabel id="published-select-label">Published</InputLabel>
                    <Select
                        label="Published"
                        labelId="published-select-label"
                        id="published"
                        name="published"
                        defaultValue={props.selectedRow.published}
                        // onChange={handleChangePublished}
                        margin="dense"
                    >
                        <MenuItem value={true}>Yes</MenuItem>
                        <MenuItem value={false}>Not</MenuItem>
                    </Select>
                </FormControl>

            </DialogContent>

            <DialogActions>
                <Button onClick={handleClose}>Cancel</Button>
                <Button type="submit">{methodName}</Button>
            </DialogActions>
        </Dialog>

    </React.Fragment>
  );
}