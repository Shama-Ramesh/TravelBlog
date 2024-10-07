import React, { useState, useEffect } from "react";
import { styled } from "@mui/material/styles";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell, { tableCellClasses } from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import Typography from "@mui/material/Typography";
import { Box, Avatar, IconButton, Tooltip } from "@mui/material";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import CancelIcon from "@mui/icons-material/Cancel";
import Modal from "@mui/material/Modal";
import Swal from "sweetalert2";
import axios from "axios";
import config from "../../../../config";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const style = {
  position: "absolute",
  top: "50%",
  borderRadius: "10px",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 700,
  bgcolor: "background.paper",
  maxHeight: "500px",
  overflowY: "auto",
  boxShadow: 24,
  p: 4,
};

const StyledTableCell = styled(TableCell)(({ theme }) => ({
  [`&.${tableCellClasses.head}`]: {
    backgroundColor: theme.palette.common.black,
    color: theme.palette.common.white,
  },
  [`&.${tableCellClasses.body}`]: {
    fontSize: 14,
  },
}));

const StyledTableRow = styled(TableRow)(({ theme }) => ({
  "&:nth-of-type(odd)": {
    backgroundColor: theme.palette.action.hover,
  },
  "&:last-child td, &:last-child th": {
    border: 0,
  },
}));

export default function ManageUser() {
  const host = config.host;

  const [user, setUser] = useState([]);
  const [open, setOpen] = React.useState(false);
  const [description, setDescription] = useState("");
  const [roadmap, setRoadmap] = useState([]);
  const [deleteCat, setDeleteuser] = useState(false);

  const handleClose = () => setOpen(false);

  useEffect(() => {
    axios
      .get(`${host}/api/user/GetUser`)
      .then((res) => {
        console.log(res.data);
        setUser(res.data);
      })
      .catch((err) => {
        console.log(err);
      });
  }, [deleteCat]);

  const handleOpen = (index) => {
    setOpen(true);
    setDescription(user[index].description);
    setRoadmap(user[index].roadmap);
  };

  const handleDelete = async (id) => {
    Swal.fire({
      title: "Are you sure?",
      text: "You want to remove this user",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!",
    }).then((result) => {
      if (result.isConfirmed) {
        axios
          .delete(`${host}/api/user/deleteUser/${id}`)
          .then((response) => {
            setDeleteuser(!deleteCat);
            console.log("Delete Response : " + response.data);
            Swal.fire("Deleted!", "User has been deleted.", "success");
          })
          .catch((err) => {
            console.log("Error : " + err);
          });
      }
    });
  };

  const handleAccept = (id) => {
    axios
      .put(`${host}/api/user/update-status/${id}`, {
        status: "Approved",
      })
      .then(() => {
        setDeleteuser(!deleteCat);
        toast.success(`User approved successfully!`);
        console.log(`User ${id} accepted`);
      })
      .catch((err) => {
        toast.error("Error approving user.");
        console.log("Error : " + err);
      });
  };

  return (
    <div style={{ height: "100vh" }}>
      <Paper sx={{ padding: "20px" }}>
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <Typography
            variant="h6"
            sx={{ mb: 2, color: "gray", fontWeight: "500" }}
          >
            Manage Users
          </Typography>
        </Box>
        <TableContainer>
          <Table sx={{ minWidth: 700 }} aria-label="customized table">
            <TableHead>
              <TableRow>
                <StyledTableCell>Avatar</StyledTableCell>
                <StyledTableCell align="center">Name</StyledTableCell>
                <StyledTableCell align="center">Email</StyledTableCell>
                <StyledTableCell align="center">Phone</StyledTableCell>
                <StyledTableCell align="center">Address</StyledTableCell>
                <StyledTableCell align="center">Actions</StyledTableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {user.length > 0 ? (
                user.map((row) => (
                  <StyledTableRow key={row._id}>
                    <StyledTableCell component="th" scope="row">
                      <Avatar
                        src={`${host}/api/user-image/${row?.image}`}
                        alt={row.username}
                        sx={{ width: 56, height: 56 }}
                      />
                    </StyledTableCell>
                    <StyledTableCell align="center">
                      <Box
                        display="flex"
                        alignItems="center"
                        justifyContent="center"
                      >
                        {row.status === "Approved" && (
                          <CheckCircleIcon sx={{ color: "green", mr: 1 }} />
                        )}
                        {row.username}
                      </Box>
                    </StyledTableCell>
                    <StyledTableCell align="center">
                      {row.email}
                    </StyledTableCell>
                    <StyledTableCell align="center">
                      {row.phone || "--"}
                    </StyledTableCell>
                    <StyledTableCell align="center">
                      {row.address || "--"}
                    </StyledTableCell>

                    <StyledTableCell align="center">
                      <>
                        {!row.status ? (
                          <Tooltip title="Approve User" arrow>
                            <IconButton
                              variant="contained"
                              color="success"
                              onClick={() => handleAccept(row._id)}
                            >
                              <CheckCircleIcon />
                            </IconButton>
                          </Tooltip>
                        ) : null}
                        <Tooltip title="Remove User" arrow>
                          <IconButton
                            variant="contained"
                            color="error"
                            onClick={() => handleDelete(row._id)}
                          >
                            <CancelIcon />
                          </IconButton>
                        </Tooltip>
                      </>
                    </StyledTableCell>
                  </StyledTableRow>
                ))
              ) : (
                <StyledTableRow>
                  <StyledTableCell colSpan={6} align="center">
                    <Typography>No data found</Typography>
                  </StyledTableCell>
                </StyledTableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>

        <Modal
          open={open}
          onClose={handleClose}
          aria-labelledby="modal-modal-title"
          aria-describedby="modal-modal-description"
        >
          <Box sx={style}>
            <Typography
              id="modal-modal-title"
              variant="h6"
              component="h2"
              sx={{ fontWeight: "600", color: "grey" }}
            >
              User Description
            </Typography>
            <Typography id="modal-modal-description" sx={{ mt: 2 }}>
              {description}
            </Typography>

            <Typography
              id="modal-modal-title"
              variant="h6"
              component="h2"
              sx={{ fontWeight: "600", color: "grey", mt: 3 }}
            >
              User Roadmap
            </Typography>
            <ul>
              {roadmap.map((i, index) => (
                <li key={index}>
                  <Typography id="modal-modal-description" sx={{ mt: 2 }}>
                    {i}
                  </Typography>
                </li>
              ))}
            </ul>
          </Box>
        </Modal>
      </Paper>

      {/* Add the ToastContainer here */}
      <ToastContainer />
    </div>
  );
}
