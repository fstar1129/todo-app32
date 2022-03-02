import React, { useEffect, useState } from "react";
import { DataGrid } from "@mui/x-data-grid";
import { Button, Container } from "@mui/material";
import TodoModal from "../modal/TodoModal";
import EditIcon from "@mui/icons-material/Edit";
import IconButton from "@mui/material/IconButton";
import DeleteIcon from "@mui/icons-material/Delete";
import { Box } from "@mui/system";
import { getTodoContract } from "../contract/todoContract";
import { ethers } from "ethers";

export default function Home() {
  const [open, setOpen] = React.useState(false);
  const [account, setAccount] = React.useState("0x");
  const [rows, setRows] = React.useState([]);
  const [editData, setEditData] = React.useState({
    id: -1,
    date: new Date().setHours(23, 59, 59, 999),
    title: "",
    description: "",
    status: "1",
    priority: "0",
  });

  function padTo2Digits(num) {
    return num.toString().padStart(2, '0');
  }
  
  const handleOpen = async (idx) => {
    if (idx != -1) {
      setEditData(rows[idx]);
      setOpen(true);
    } else {
      if (window.ethereum) {
        setOpen(true);
      } else {
        alert("Metamask not found");
        console.log("has");
      }
    }
  };
  const handleDelete = async (id) => {
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const contract = getTodoContract(provider.getSigner());
    const tx = await contract.removeTodo(id);
    await tx.wait();
    window.location.reload(false);
  };

  function formatDate(date) {
    return [
      padTo2Digits(date.getMonth() + 1),
      padTo2Digits(date.getDate()),
      date.getFullYear(),
    ].join('/');
  }

  useEffect(() => {
    (async function () {
      if (window.ethereum) {
        const accounts = await window.ethereum.request({
          method: "eth_requestAccounts",
        });
        const chainId = await window.ethereum.request({
          method: "eth_chainId",
        });
        if (chainId !== "0x61") {
          await window.ethereum.request({
            method: "wallet_switchEthereumChain",
            params: [{ chainId: "0x61" }],
          });
        }
        setAccount(accounts[0]);
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        const contract = getTodoContract(provider.getSigner());
        const length = parseInt(
          (await contract.numberOfTodo(accounts[0])).toString()
        );
        const arr = [];
        for (let i = 0; i < length; i++) {
          const row = await contract.todosByWallet(accounts[0], i);
          arr.push({
            id: i,
            title: row.title,
            date: formatDate(new Date(parseInt(row.date.toString())*1000)),
            description: row.description,
            status: row.status.toString(),
            priority: row.priority.toString(),
          });
          console.log(row);
        }
        setRows(arr);
        console.log(length);
      } else {
        alert("Metamask not found");
        console.log("has");
      }
    })();
  }, []);

  const priority = ["Low", "Medium", "High"];
  const status = ["Complete", "Not-Complete"];
  const columns = [
    { field: "id", headerName: "ID", width: 70 },
    { field: "date", headerName: "Date", width: 130 },
    { field: "title", headerName: "Title", width: 130 },
    {
      field: "description",
      headerName: "Description",
      width: 350,
    },
    {
      field: "status",
      headerName: "Status",
      width: 160,
      valueGetter: (params) => {
        return status[params.row.status];
      },
    },
    {
      field: "priority",
      headerName: "Priority",
      width: 100,
      valueGetter: (params) => {
        return priority[params.row.priority];
      },
    },
    {
      field: "Action",
      renderCell: (cellValues) => {
        return (
          <>
            <IconButton
              aria-label="edit"
              size="small"
              onClick={(event) => {
                handleOpen(cellValues.row.id);
              }}
            >
              <EditIcon fontSize="inherit" />
            </IconButton>
            <IconButton
              aria-label="delete"
              size="small"
              onClick={(event) => {
                handleDelete(cellValues.row.id);
              }}
            >
              <DeleteIcon fontSize="inherit" />
            </IconButton>
          </>
        );
      },
    },
  ];

  // const rows = [
  //     { id: 1, title: 'Create design', date: '15/01/2022', description: 'To do task for details', status: 1, priority: 0 },
  //     { id: 2, title: 'Lannister', date: '03/02/2022', description: 'To do task for details', status: 1, priority: 1 },
  //     { id: 3, title: 'Lannister', date: '03/02/2022', description: 'To do task for details', status: 1, priority: 2 },
  //     { id: 4, title: 'Stark', date: 'Arya', description: 'To do task for details', status: 1, priority: 0 },
  //     { id: 5, title: 'Targaryen', date: '16/05/2021', description: 'To do task for details', status: 1, priority: 2 },
  //     { id: 6, title: 'Melisandre', date: null, description: 'To do task for details', status: 1, priority: 0 },
  //     { id: 7, title: 'Clifford', date: '03/02/2022', description: 'To do task for details', status: 1, priority: 0 },
  //     { id: 8, title: 'Frances', date: '03/02/2022', description: 'To do task for details', status: 1, priority: 1 },
  //     { id: 9, title: 'Roxie', date: '03/02/2022', description: 'To do task for details', status: 1, priority: 0 },
  // ];
  return (
    <>
      <Container maxWidth="lg">
        <Button variant="outlined" onClick={()=>handleOpen(-1)} sx={{ m: 3 }}>
          Add
        </Button>
        <Box sx={{ m: 3 }} style={{ float: "right" }}>
          <b>Connected to: </b>
          {account}
        </Box>
        <div style={{ height: 500, width: "100%" }} sx={{ p: 3 }}>
          <DataGrid
            rows={rows}
            columns={columns}
            // pageSize={5}
            // rowsPerPageOptions={[5]}
          />
        </div>
        {open && (
          <TodoModal
            account={account}
            formData={editData}
            open={open}
            setOpen={setOpen}
          ></TodoModal>
        )}
      </Container>
    </>
  );
}
