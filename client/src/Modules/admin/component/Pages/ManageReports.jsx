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

export default function ManageReports() {
  const host = config.host;

  const [reports, setReports] = useState([]);
  const [open, setOpen] = useState(false);
  const [reportDetails, setReportDetails] = useState(null);

  useEffect(() => {
    // Fetch all reports
    axios
      .get(`${host}/api/report/reports`)
      .then((res) => {
        console.log(res.data);
        setReports(res.data);
      })
      .catch((err) => {
        console.error(err);
        toast.error("Error fetching reports");
      });
  }, []);

  const handleOpen = (report) => {
    setReportDetails(report);
    setOpen(true);
  };

  const handleClose = () => setOpen(false);

  const handleRemoveBlog = (blogId, reportId) => {
    console.log(reportId, "bbb");
    Swal.fire({
      title: "Are you sure?",
      text: "You want to remove this blog",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!",
    }).then((result) => {
      if (result.isConfirmed) {
        axios
          .delete(`${host}/api/report/delete/${blogId}/${reportId}`)
          .then(() => {
            setReports(
              reports.filter((report) => report.blogId._id !== blogId)
            );
            toast.success("Blog removed successfully!");
          })
          .catch((err) => {
            console.error(err);
            toast.error("Error removing blog.");
          });
      }
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
            Manage Reported Blogs
          </Typography>
        </Box>
        <TableContainer>
          <Table sx={{ minWidth: 700 }} aria-label="customized table">
            <TableHead>
              <TableRow>
                <StyledTableCell>Blog Title</StyledTableCell>
                <StyledTableCell align="center">Reported By</StyledTableCell>
                <StyledTableCell align="center">Date</StyledTableCell>
                <StyledTableCell align="center">Reason</StyledTableCell>
                <StyledTableCell align="center">Blog Link</StyledTableCell>
                <StyledTableCell align="center">Actions</StyledTableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {console.log(reports.length)}
              {reports.length > 0 ? (
                reports.map((report) => {
                  return (
                    <>
                      {report?.blogId?._id ? (
                        <StyledTableRow key={report._id}>
                          <StyledTableCell component="th" scope="row">
                            {report?.blogId?.title || "Blog Not found"}
                            {/* Assuming blog has a title */}
                          </StyledTableCell>
                          <StyledTableCell align="center">
                            {report.userId.username}{" "}
                            {/* Assuming user has a username */}
                          </StyledTableCell>
                          <StyledTableCell align="center">
                            {report.createdAt}{" "}
                            {/* Assuming user has a username */}
                          </StyledTableCell>
                          <StyledTableCell align="center">
                            {report.reason}
                          </StyledTableCell>
                          <StyledTableCell align="center">
                            <a
                              href={
                                `../user/single-blog/${report?.blogId?._id}` ||
                                "#"
                              }
                              target="_blank"
                              rel="noopener noreferrer"
                            >
                              {report?.blogId?._id
                                ? "View Blog"
                                : "Blog Not Found"}
                            </a>
                          </StyledTableCell>
                          <StyledTableCell align="center">
                            <Tooltip title="Remove Blog" arrow>
                              <IconButton
                                variant="contained"
                                color="error"
                                onClick={() =>
                                  handleRemoveBlog(
                                    report.blogId?._id,
                                    report?._id
                                  )
                                }
                              >
                                <CancelIcon />
                              </IconButton>
                            </Tooltip>
                          </StyledTableCell>
                        </StyledTableRow>
                      ) : (
                        <></>
                      )}
                    </>
                  );
                })
              ) : (
                <StyledTableRow>
                  <StyledTableCell colSpan={5} align="center">
                    <Typography>No reports found</Typography>
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
            {reportDetails && (
              <>
                <Typography
                  id="modal-modal-title"
                  variant="h6"
                  component="h2"
                  sx={{ fontWeight: "600", color: "grey" }}
                >
                  Report Details
                </Typography>
                <Typography id="modal-modal-description" sx={{ mt: 2 }}>
                  <strong>Reported By:</strong> {reportDetails.userId.username}
                </Typography>
                <Typography id="modal-modal-description" sx={{ mt: 2 }}>
                  <strong>Reason:</strong> {reportDetails.reason}
                </Typography>
                <Typography id="modal-modal-description" sx={{ mt: 2 }}>
                  <strong>Blog Title:</strong> {reportDetails.blogId.title}
                </Typography>
                <Typography id="modal-modal-description" sx={{ mt: 2 }}>
                  <strong>Blog Link:</strong>
                  <a
                    href={`${host}/blogs/${reportDetails.blogId._id}`}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    {`${host}/blogs/${reportDetails.blogId._id}`}
                  </a>
                </Typography>
              </>
            )}
          </Box>
        </Modal>
      </Paper>

      <ToastContainer />
    </div>
  );
}
