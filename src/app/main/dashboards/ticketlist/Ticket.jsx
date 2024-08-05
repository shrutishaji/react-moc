import * as React from "react";
import Paper from "@mui/material/Paper";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import { useEffect, useState } from "react";
import Fade from "@mui/material/Fade";
import Backdrop from "@mui/material/Backdrop";
import { Box, Grid, TextareaAutosize } from "@mui/material";
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
  IconButton,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import FuseSvgIcon from "@fuse/core/FuseSvgIcon";
import SearchIcon from "@mui/icons-material/Search";
import { apiAuth } from "src/utils/http";
import Loader from "src/app/main/loader/Loader";
import { decryptFeature } from "src/app/main/sign-in/tabs/featureEncryption";
import FuseLoading from "@fuse/core/FuseLoading";
import { toast } from "react-toastify";
import MocHeader from "../moc/MocHeader";
import axios from "axios";
import {
  TicketCategoryEnum,
  TicketPriorityEnum,
  TicketSourceEnum,
  TicketStatusEnum,
} from "../EnumTicket/ticketEnums";
const mapEnumValueToName = (value, enumObject) => {
  return (
    Object.keys(enumObject).find((key) => enumObject[key] === value) || "-"
  );
};
function createData(
  index,
  subject,
  message,
  ticketstatus,
  priority,
  category,
  source,
  action,

  id
) {
  return {
    index,
    subject,
    message,
    ticketstatus: mapEnumValueToName(ticketstatus, TicketStatusEnum),
    priority: mapEnumValueToName(priority, TicketPriorityEnum),
    category: mapEnumValueToName(category, TicketCategoryEnum),
    source: mapEnumValueToName(source, TicketSourceEnum),
    action,

    id,
  };
}

export default function Ticket() {
  const storedFeature = decryptFeature();
  const feature = storedFeature ? storedFeature : [];
  const columns = [
    { id: "index", label: "#" },
    { id: "subject", label: "Subject" },
    {
      id: "message",
      label: "Description",
      align: "left",
      format: (value) => value.toLocaleString("en-US"),
    },
    {
      id: "category",
      label: "Ticket Category",
      align: "left",
    },
    {
      id: "priority",
      label: "Ticket Priority",
      align: "left",
    },
    {
      id: "source",
      label: "Ticket Source",
      align: "left",
    },
    {
      id: "ticketstatus",
      label: "Ticket Status",
      align: "left",
    },
    {
      id: "comment",
      label: "Action",
      align: "left",
      minWidth: 140,
      render: (row) => (
        <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
          <Button
            variant="contained"
            color="primary"
            onClick={() => handleEdit(row)}
            sx={{ minWidth: "40px", minHeight: "40px" }}
          >
            <FuseSvgIcon size={20}>heroicons-solid:eye</FuseSvgIcon>
          </Button>
        </Box>
      ),
    },
  ];
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10); // Set a high number to display all rows
  const [riskTimeList, setRiskTimeList] = useState([]);
  const [dense, setDense] = useState(false);
  const [deletes, setDelete] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [errors, setErrors] = useState({});

  const [Id, setId] = useState(0);
  const [searchQuery, setSearchQuery] = useState("");
  const handleSearch = (event) => {
    setSearchQuery(event.target.value);
  };

  const filteredDepartmentList = riskTimeList.filter(
    (row) =>
      row.index.toString().includes(searchQuery) ||
      row.code.toLowerCase().includes(searchQuery.toLowerCase()) ||
      row.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const [lookupAdd, setLookUpAdd] = useState({
    LookupType: "risktime",
    code: "",
    crudMode: "INSERT",
    description: "",
    isActive: true,
    name: "",
    parentId: 0,
  });
  const [open, setOpen] = useState(false);
  const [openView, setOpenView] = useState({});

  const [isViewMode, setViewMode] = useState(false);

  const style1 = {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: "615px",
    maxWidth: "80vw",
    height: "auto",
    borderRadius: "16px",
    bgcolor: "background.paper",

    boxShadow: 24,
    p: 4,
  };
  const style = {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    bgcolor: "background.paper",
    boxShadow: 24,
    borderRadius: 2,
    p: 2,
    maxWidth: 600,
    width: "100%",
  };

  const headerStyle = {
    p: 2,
    bgcolor: "secondary.main",
    color: "primary.contrastText",
    borderTopLeftRadius: 2,
    borderTopRightRadius: 2,
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
  };
  async function getRecords() {
    const tokenTicket = localStorage.getItem("jwt_access_ticket_token");
    const response = await axios.get(
      "http://tebsdemoserver.westindia.cloudapp.azure.com:128/api/v1/project/tickets/list?projectId=5EC94E1B-E058-4008-EC12-08DC9C361D1D",
      {
        headers: {
          Authorization: `Bearer ${tokenTicket}`,
          Tenant: "root",
          Accept: "application/json",
        },
      }
    );
    if (response.data) {
      setIsLoading(false);

      const transformedData = response.data.map((item, index) =>
        createData(
          index + 1,
          item.subject,
          item.message,
          item.ticketStatus,
          item.ticketPriority,
          item.ticketCategory,
          item.ticketSource,
          "Action",

          item.id
        )
      );
      setRiskTimeList(transformedData);
    }
  }

  useEffect(() => {
    getRecords();
  }, [dense]);

  const handleAdd = (event) => {
    const { name, value } = event.target;
    setLookUpAdd({
      ...lookupAdd,
      [name]: value,
    });
    if (errors[name]) {
      setErrors({ ...errors, [name]: "" });
    }
    setErrors({});
  };

  const handleOpen = () => {
    setOpen(true);
  };
  const handleClose = () => {
    setLookUpAdd({
      ...lookupAdd,
      LookupType: "activity",
      code: "",
      crudMode: "INSERT",
      description: "",
      isActive: true,
      name: "",
      parentId: 0,
    });

    setOpen(false);
  };

  const handleCloseDelete = () => setDelete(false);

  const handleSubmitDelete = () => {
    apiAuth.delete(`/LookupData/Delete/${Id}`).then((resp) => {
      if (resp.data.statusCode == "424") {
        toast.error(resp.data.message);
        setDelete(false);
      } else {
        setDelete(false);

        getRecords();
      }
    });
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };
  const validate = () => {
    let tempErrors = {};

    if (!lookupAdd.code) tempErrors.code = "Code is required";
    if (!lookupAdd.description)
      tempErrors.description = "Description is required";

    setErrors(tempErrors);
    return Object.keys(tempErrors).length === 0;
  };

  const handleEdit = (row) => {
    setViewMode(true);
    setOpenView(row);
    console.log(row, "rowwwww");

    handleOpen();
  };

  const handleChangeDense = (event, index) => {
    const updatedDepartmentList = [...riskTimeList];
    const updatedRow = updatedDepartmentList[index];
    updatedRow.isActive = event.target.checked;

    // Update the state immediately to reflect the change in the UI
    setRiskTimeList(updatedDepartmentList);

    // Call the update API
    apiAuth
      .put(`/LookupData/Update/${updatedRow.id}`, {
        ...updatedRow,
        isActive: updatedRow.isActive,
      })
      .then((resp) => {
        getRecords(); // Fetch the updated records
      })
      .catch((error) => {
        console.error("Failed to update the status:", error);
      });
  };
  if (isLoading) {
    return <FuseLoading />;
  }
  return (
    <div style={{ backgroundColor: "white" }}>
      <MocHeader nothing={"nothing"} type={"Ticket List"} />

      <Modal
        aria-labelledby="transition-modal-title"
        aria-describedby="transition-modal-description"
        open={open}
        onClose={handleClose}
        closeAfterTransition
        BackdropComponent={Backdrop}
        BackdropProps={{ timeout: 500 }}
      >
        <Fade in={open}>
          <Box sx={style}>
            <Box sx={headerStyle}>
              <Typography variant="h6" component="h2">
                Ticket Details
              </Typography>
              <IconButton onClick={handleClose} sx={{ color: "inherit" }}>
                <CloseIcon />
              </IconButton>
            </Box>
            <Box sx={{ p: 2 }}>
              <Grid container spacing={2}>
                <Grid item xs={6}>
                  <TextField
                    label="Subject"
                    value={openView.subject}
                    fullWidth
                    disabled
                    variant="outlined"
                  />
                </Grid>
                <Grid item xs={6}>
                  <TextField
                    label="Description"
                    value={openView.message}
                    fullWidth
                    disabled
                    variant="outlined"
                  />
                </Grid>
                <Grid item xs={6}>
                  <TextField
                    label="Status"
                    value={openView.ticketstatus}
                    fullWidth
                    disabled
                    variant="outlined"
                  />
                </Grid>
                <Grid item xs={6}>
                  <TextField
                    label="Priority"
                    value={openView.priority}
                    fullWidth
                    disabled
                    variant="outlined"
                  />
                </Grid>
                <Grid item xs={6}>
                  <TextField
                    label="Category"
                    value={openView.category}
                    fullWidth
                    disabled
                    variant="outlined"
                  />
                </Grid>
                <Grid item xs={6}>
                  <TextField
                    label="Source"
                    value={openView.source}
                    fullWidth
                    disabled
                    variant="outlined"
                  />
                </Grid>
              </Grid>
            </Box>
          </Box>
        </Fade>
      </Modal>

      <Modal
        aria-labelledby="transition-modal-title"
        aria-describedby="transition-modal-description"
        open={deletes}
        onClose={handleCloseDelete}
        closeAfterTransition
        slots={{ backdrop: Backdrop }}
        slotProps={{
          backdrop: {
            timeout: 500,
          },
        }}
      >
        <Fade in={deletes}>
          <Box sx={style1}>
            <Box>
              <div className="flex">
                <Typography
                  id="transition-modal-title"
                  variant="h6"
                  component="h2"
                  style={{
                    fontSize: "15px",
                    marginRight: "5px",
                    marginTop: "5px",

                    color: "red",
                  }}
                >
                  <img src="/assets/images/etc/icon.png" />
                </Typography>
                <Typography
                  id="transition-modal-title"
                  variant="h6"
                  component="h2"
                  style={{
                    fontSize: "2rem",
                  }}
                >
                  Confirm action
                  <Typography
                    id="transition-modal-title"
                    variant="h6"
                    component="h2"
                    style={{
                      fontSize: "15px",
                      fontWeight: "800px !important",
                      color: "grey",
                    }}
                  >
                    Do you want to delete ?
                  </Typography>
                </Typography>
              </div>
            </Box>
            <div
              className="flex items-center mt-24 sm:mt-0 sm:mx-8 space-x-12"
              style={{
                marginTop: "15px",
                justifyContent: "end",
                backgroundColor: " rgba(248,250,252)",
                padding: "10px",
              }}
            >
              <Button
                className="whitespace-nowrap"
                variant="contained"
                color="primary"
                style={{
                  padding: "23px",
                  backgroundColor: "white",
                  color: "black",
                  border: "1px solid grey",
                }}
                onClick={handleCloseDelete}
              >
                Cancel
              </Button>
              <Button
                className="whitespace-nowrap"
                variant="contained"
                color="secondary"
                style={{ padding: "23px", backgroundColor: "red" }}
                type="submit"
                onClick={handleSubmitDelete}
              >
                Confirm
              </Button>
            </div>
          </Box>
        </Fade>
      </Modal>
      <div>
        <div className="flex d-flex p-30 pt-24 pb-24 flex-col justify-between flex-wrap task_form_area sm:flex-row w-full sm:w-auto space-y-16 sm:space-y-0 sm:space-x-16">
          <InputLabel
            id="category-select-label"
            className="text-2xl mt-0"
            style={{ color: "black" }}
          >
            <b>Ticket List</b>
          </InputLabel>
          <div className="flex items-center d-sm-block justify-between mt-0">
            <div className="flex-auto"></div>
            <TextField
              variant="filled"
              fullWidth
              className="my-4"
              placeholder="Search "
              style={{ marginRight: "15px", backgroundColor: "white" }}
              onChange={handleSearch}
              InputProps={{
                startAdornment: (
                  <InputAdornment
                    position="start"
                    style={{ marginTop: "0px", paddingTop: "0px" }}
                  >
                    <SearchIcon />
                  </InputAdornment>
                ),
              }}
              sx={{ width: 250 }}
            />
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
              {filteredDepartmentList
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map((row) => {
                  return (
                    <TableRow
                      hover
                      role="checkbox"
                      tabIndex={-1}
                      key={row.code}
                      sx={{ padding: dense ? "4px" : "default" }}
                    >
                      {columns.map((column) => {
                        const value = row[column.id];
                        return (
                          <TableCell
                            key={column.id}
                            align={column.align}
                            style={{ borderBottom: "1px solid #dddddd" }}
                          >
                            {column.id === "status" ? (
                              <FormControlLabel
                                control={
                                  <Switch
                                    className="switch_check"
                                    checked={row.isActive} // Reflects the isActive property of the department
                                    onChange={(event) =>
                                      handleChangeDense(
                                        event,
                                        page * rowsPerPage + row.index - 1
                                      )
                                    } // Passes the index of the department
                                  />
                                }
                              />
                            ) : column.render ? (
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
          count={riskTimeList.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </Paper>
    </div>
  );
}
