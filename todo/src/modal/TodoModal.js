import { DatePicker, LocalizationProvider } from "@mui/lab";
import {
    Box,
    Button,
    Container,
    FormControl,
    FormControlLabel,
    FormLabel,
    Grid,
    Modal,
    Radio,
    RadioGroup,
    TextField,
    Typography,
} from "@mui/material";
import React, { useEffect } from "react";
import AdapterDateFns from "@mui/lab/AdapterDateFns";
import todoAbi from "../abis/todoAbi.json";
import { ethers } from "ethers";
import { getTodoContract } from "../contract/todoContract";

const style = {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: "lg",
    boxShadow: 24,
    p: 4,
    bgcolor: "white",
    borderRadius: "25px",
};

const connect = {
    fontSize: "15px",
    marginTop: "10px",
};
export default function TodoModal(props) {
    const handleClose = () => props.setOpen(false);
    const [dateValue, setDateValue] = React.useState(
        props.formData?.date || new Date()
    );
    console.log(props.formData)
    
    const [titleValue, setTitleValue] = React.useState(props.formData?.title);
    const [description, setDescription] = React.useState(
        props.formData?.description
    );
    const [statusValue, setStatusValue] = React.useState(props.formData?.status);
    const [priorityValue, setPriorityValue] = React.useState(
        props.formData?.priority
    );
    const [btnSubmit, setBtnSubmit] = React.useState(props.formData.id != -1?"update todo":"add Todo");
    const PriorityChange = (event) => {
        console.log(event);
        setPriorityValue(event.target.value);
    };
    const statusChange = (event) => {
        setStatusValue(event.target.value);
    };

    const handleTodo = async () => {
        if (props.formData.id != -1) {
            editTodo();
        } else {
            addTodo();
        }
    };

    const addTodo = async () => {
        setBtnSubmit("todo is adding...");
        try {
            const date = parseInt(new Date(dateValue).getTime() / 1000);
            const _title = titleValue;
            const _status = statusValue;
            const _priority = priorityValue;
            const provider = new ethers.providers.Web3Provider(window.ethereum);
            const contract = getTodoContract(provider.getSigner());
            console.log(
                date,
                _title,
                description,
                _status,
                _priority
            );
            const tx = await contract.addTodo(
                date,
                _title,
                description,
                _status,
                _priority
            );
            await tx.wait();
            console.log(date, _title, _status, _priority);
            handleClose();
            window.location.reload(false);
        } catch (err) {
            alert(JSON.stringify(err));
        }
        setBtnSubmit("add todo");
    };



    const editTodo = async () => {
        setBtnSubmit("todo is editing...");
        try {
            const date = parseInt(new Date(dateValue).getTime() / 1000);
            const _title = titleValue;
            const _status = statusValue;
            const _priority = priorityValue;
            const provider = new ethers.providers.Web3Provider(window.ethereum);
            const contract = getTodoContract(provider.getSigner());

            const tx = await contract.updateTodo(
                props.formData?.id,
                date,
                _title,
                description,
                _status,
                _priority
            );
            await tx.wait();
            console.log(date, _title, _status, _priority);
            handleClose();
            window.location.reload(false);
        } catch (err) {
            alert(JSON.stringify(err));
        }
        setBtnSubmit("edit todo");
    };

    return (
        <>
            <Container maxWidth="lg">
                <Modal
                    open={props.open}
                    onClose={handleClose}
                    aria-labelledby="modal-modal-title"
                    aria-describedby="modal-modal-description"
                >
                    <Box sx={style}>
                        <Typography
                            sx={{ borderBottom: 1, pb: 3 }}
                            id="modal-modal-title"
                            variant="h6"
                            component="h2"
                        >
                            {props.formData ? "Add Task" : "Edit Task"}
                            <Box sx={connect}>Connectd</Box>
                        </Typography>

                        <Box sx={{ flexGrow: 1 }}>
                            <Grid container spacing={2}>
                                <Grid item xs={6} md={6}>
                                    <LocalizationProvider dateAdapter={AdapterDateFns}>
                                        <DatePicker
                                            label="Date"
                                            value={dateValue}
                                            onChange={(_date) => {
                                                setDateValue(_date);
                                            }}
                                            renderInput={(params) => (
                                                <TextField sx={{ mt: 3 }} {...params} />
                                            )}
                                        />
                                    </LocalizationProvider>
                                </Grid>
                                <Grid item xs={6} md={6}>
                                    <TextField
                                        sx={{ mt: 3 }}
                                        label="Title"
                                        value={titleValue}
                                        onChange={(e) => {
                                            setTitleValue(e.target.value);
                                        }}
                                    />
                                </Grid>
                                <Grid item xs={12} md={12}>
                                    <TextField
                                        style={{ width: "100%" }}
                                        label="Description"
                                        multiline
                                        rows={4}
                                        value={description}
                                        onChange={(e) => {
                                            setDescription(e.target.value);
                                        }}
                                    />
                                </Grid>
                                <Grid item xs={12} md={12}>
                                    <FormControl>
                                        <FormLabel id="demo-radio-buttons-group-label">
                                            Status
                                        </FormLabel>
                                        <RadioGroup
                                            aria-labelledby="demo-radio-buttons-group-label"
                                            defaultValue="1"
                                            name="radio-buttons-group"
                                            sx={{ display: "block ruby" }}
                                            value={statusValue || "1"}
                                            onChange={statusChange}
                                        >
                                            <FormControlLabel
                                                value="0"
                                                disabled={props.formData.id == -1}
                                                control={<Radio />}
                                                label="Complete"
                                            />
                                            <FormControlLabel
                                                value="1"
                                                disabled={props.formData.id == -1}
                                                control={<Radio />}
                                                label="Not-Complete"
                                            />
                                        </RadioGroup>
                                    </FormControl>
                                </Grid>
                                <Grid item xs={6} md={6}>
                                    <FormControl>
                                        <FormLabel id="demo-radio-buttons-group-label">
                                            Priority
                                        </FormLabel>
                                        <RadioGroup
                                            aria-labelledby="demo-radio-buttons-group-label"
                                            defaultValue="1"
                                            name="radio-buttons-group"
                                            sx={{ display: "block ruby" }}
                                            // value={props.formData.priority}
                                            value={priorityValue || "0"}
                                            onChange={PriorityChange}
                                        >
                                            <FormControlLabel
                                                value="0"
                                                control={<Radio />}
                                                label="Low"
                                            />
                                            <FormControlLabel
                                                value="1"
                                                control={<Radio />}
                                                label="Medium"
                                            />
                                            <FormControlLabel
                                                value="2"
                                                control={<Radio />}
                                                label="High"
                                            />
                                        </RadioGroup>
                                    </FormControl>
                                </Grid>
                            </Grid>
                        </Box>
                        <Box sx={{ mt: 3 }}>
                            <Button
                                onClick={handleClose}
                                style={{ color: "#352f2f" }}
                                sx={{ me: 3 }}
                                variant="text"
                            >
                                Cancel
                            </Button>
                            <Button
                                style={{ float: "right" }}
                                color="success"
                                variant="contained"
                                onClick={handleTodo}
                            >
                                {btnSubmit}
                            </Button>
                        </Box>
                    </Box>
                </Modal>
            </Container>
        </>
    );
}
