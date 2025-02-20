import * as React from "react";
import Paper from "@mui/material/Paper";
import Table from "@mui/material/Table";
import { motion } from "framer-motion";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import { useEffect, useState } from "react";
import Fade from "@mui/material/Fade";
import Backdrop from "@mui/material/Backdrop";
import { Box } from "@mui/material";
import Typography from "@mui/material/Typography";
import {
  Button,
  InputAdornment,
  InputLabel,
  TextField,
  FormControlLabel,
  Switch,
  TablePagination,
  Modal,
} from "@mui/material";
import FuseSvgIcon from "@fuse/core/FuseSvgIcon";
import SearchIcon from "@mui/icons-material/Search";
import { apiAuth } from "src/utils/http";
import Loader from "src/app/main/loader/Loader";
import { decryptFeature } from "src/app/main/sign-in/tabs/featureEncryption";
import FuseLoading from "@fuse/core/FuseLoading";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Link } from "react-router-dom";
function createData(
    type,
    mocno,
    initiatedby,
    initiatedon,
    projectname,
    changeleader,
    token,
  status,percent
) {
  return { type, mocno, initiatedby, initiatedon, projectname, changeleader,token,status,percent };
}

export default function StickyHeadTable({filteredDatas}) {

  const columns = [
    // { id: "index", label: "#", minWidth: 50 },
    // { id: "code", label: "Code", minWidth: 100 },
    { id: "type", label: "Type" },
    { id: "mocno", label: "MOC Number" ,
        render: (item) => {
            return (
              <Link
                className="text-blue"
                to={
                  item.type === "Asset"
                    ? `/moc/assetEvaluation/${item.token}`
                    : item.type === "Document"
                      ? `/moc/evaluation/${item.token}`
                      :item.type === "Engg"
                      ? `/moc/assetEvaluation/${item.token}`
                      :item.type === "TransportAct"
                      ? `/moc/assetEvaluation/${item.token}`
                      :item.type === "Others"
                      ? `/moc/assetEvaluation/${item.token}`
                      : `/moc/orgEvaluation/${item.token}`
                }
              >
                {item.mocno}
              </Link>
            );
          },
    },
    {
      id: "initiatedby",
      label: "Initiated By",
      //minWidth: 170,
      align: "left",
      format: (value) => value.toLocaleString("en-US"),
    },
    {
        id: "initiatedon",
        label: "Initiated On",
        //minWidth: 170,
        align: "left",
        format: (value) => value.toLocaleString("en-US"),
        render: (item) => {
            const date = new Date(item.initiatedon);
            const formattedDate = date.toLocaleDateString("en-US", {
              month: "long",
              day: "numeric",
              year: "numeric",
            });
            return <span>{formattedDate}</span>;
          },
      },
      {
        id: "projectname",
        label: "Moc Name",
        //minWidth: 170,
        align: "left",
        format: (value) => value.toLocaleString("en-US"),
      },
      {
        id: "changeleader",
        label: "Doc Controllers",
        //minWidth: 170,
        align: "left",
        format: (value) => value.toLocaleString("en-US"),
      },
      {
        id: "status",
        label: "Status",
        //minWidth: 170,
        align: "left",
        format: (value) => value.toLocaleString("en-US"),
      },      {
        id: "percent",
        label: "Percentage",
        //minWidth: 170,
        align: "left",
        format: (value) => value.toLocaleString("en-US"),
      },
   
  ];
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10); // Set a high number to display all rows
  const [siteList, setSiteList] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
//   const filteredDepartmentList = siteList.filter(
//     (row) =>
//       row.index.toString().includes(searchQuery) ||
//       row.code.toLowerCase().includes(searchQuery.toLowerCase()) ||
//       row.description.toLowerCase().includes(searchQuery.toLowerCase())
//   );

  function getRecords() {
    apiAuth.get(`/ChangeRequest/List`).then((resp) => {
      setIsLoading(false);
      console.log(filteredDatas,"fillllll");
    
        const transformedData = filteredDatas.map((item, index) =>
            createData(
              item.requestTypeName,
              item.requestNo,
              item.initiatorName,
              item.requestDate,
              item.projectName,
              item.changeLeaderName,
              item.token,
              item.statusName,
              item.completionPercent+"%"
    
            )
          );
          setSiteList(transformedData);

    });
  }

  useEffect(() => {
    getRecords();
  }, [filteredDatas]);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };
console.log(siteList,"siteee");


  if (isLoading) {
    return <FuseLoading />;
  }
  return (
    <motion.div  className="sm:col-span-2 md:col-span-4 mt-5">
    <Paper className="flex flex-col flex-auto shadow rounded-2xl overflow-hidden">
      <div style={{ backgroundColor: "white" }}>
        <div>
      <ToastContainer className="toast-container" />

      <div>
        <div className="flex d-flex flex-col p-30 pt-24 pb-24 justify-between flex-wrap task_form_area sm:flex-row w-full sm:w-auto space-y-16 sm:space-y-0 sm:space-x-16">
          <InputLabel
            id="category-select-label"
            className="text-2xl mt-0"
            style={{ color: "black" }}
          >
            <b>Moc Request</b>
          </InputLabel>
          <div className="flex items-center d-sm-block justify-between mt-0">
            <div className="flex-auto"></div>
 
            
          </div>
        </div>
      </div>
      <div className="flex items-center w-full border-b justify-between"></div>
      <Paper className="box_reset" sx={{ width: "100%", overflow: "hidden" }}>
        <TableContainer>
          <Table stickyHeader aria-label="sticky table">
            <TableHead>
              <TableRow>
                {columns.map((column) => (
                  <TableCell
                    key={column.id}
                    align={column.align}
                    style={{
                      minWidth: column.minWidth,
                    }}
                  >
                    {column.label}
                  </TableCell>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
              {siteList
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map((row) => {
                  return (
                    <TableRow
                      hover
                      role="checkbox"
                      tabIndex={-1}
                      key={row.code}
                    
                    >
                      {columns.map((column) => {
                        const value = row[column.id];
                        return (
                          <TableCell
                            key={column.id}
                            align={column.align}
                            style={{ borderBottom: "1px solid #dddddd" }}
                          >
                            { column.render ? (
                              column.render(row) // Render custom actions
                            ) : column.format && typeof value === "number" ? (
                              column.format(value)
                            ) : (
                              value
                            )}
                          </TableCell>
                        );
                      })}
                    </TableRow>
                  );
                })}
            </TableBody>
          </Table>
        </TableContainer>
        <TablePagination
          rowsPerPageOptions={[10, 25, 100]}
          component="div"
          count={siteList.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </Paper>
    </div>
    </div>
    </Paper>
    </motion.div>
  );
}
