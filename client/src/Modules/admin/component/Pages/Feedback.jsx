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
import { Box, Avatar } from "@mui/material";
import axios from "axios";
import config from "../../../../config";

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
  // border: '2px solid #000',
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
  // hide last border
  "&:last-child td, &:last-child th": {
    border: 0,
  },
}));

// New set of colors
const colors = [
  "#F44336", // Red
  "#E91E63", // Pink
  "#9C27B0", // Purple
  "#3F51B5", // Indigo
  "#03A9F4", // Light Blue
  "#009688", // Teal
  "#4CAF50", // Green
  "#FFEB3B", // Yellow
];

function getColor(name) {
  const charCode = name.charCodeAt(0);
  const colorIndex = charCode % colors.length;
  return colors[colorIndex];
}

export default function Feedback() {
  const host = config.host;
  const [services, setServices] = useState([]);

  useEffect(() => {
    axios
      .get(`${host}/api/report/all-feed`)
      .then((res) => {
        console.log(res.data);
        const sortedData = res.data.sort(
          (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
        );
        setServices(sortedData);
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);

  return (
    <div style={{ height: "100vh" }}>
      <Paper sx={{ padding: "20px 20px 20px 20px" }}>
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <Typography
            variant="h6"
            sx={{ mb: 2, color: "#0D0B45", fontWeight: "500" }}
          >
            View Feedback
          </Typography>
        </Box>
        <TableContainer>
          <Table sx={{ minWidth: 700 }} aria-label="customized table">
            <TableHead>
              <TableRow>
                <StyledTableCell>Thumbnail</StyledTableCell>
                <StyledTableCell align="center">Name</StyledTableCell>
                <StyledTableCell align="center">Email</StyledTableCell>
                <StyledTableCell align="center">Message</StyledTableCell>
                <StyledTableCell align="center">Date</StyledTableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {services.map((row) => (
                <StyledTableRow key={row._id}>
                  <StyledTableCell component="th" scope="row">
                    <Avatar sx={{ bgcolor: getColor(row.name) }}>
                      {row.name.charAt(0)}
                    </Avatar>
                  </StyledTableCell>
                  <StyledTableCell align="center">{row.name}</StyledTableCell>
                  <StyledTableCell align="center">{row.email}</StyledTableCell>
                  <StyledTableCell align="center">
                    {row.message}
                  </StyledTableCell>
                  <StyledTableCell align="center">
                    {new Date(row.createdAt).toLocaleDateString()}
                  </StyledTableCell>
                </StyledTableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>
    </div>
  );
}
