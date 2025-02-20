import { styled } from "@mui/material/styles";
import FusePageCarded from "@fuse/core/FusePageCarded";
import _ from "@lodash";
import * as React from "react";
import FormControlLabel from "@mui/material/FormControlLabel";
import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import OutlinedInput from "@mui/material/OutlinedInput";
import InputLabel from "@mui/material/InputLabel";
import FormLabel from "@mui/material/FormLabel";
import FormControl from "@mui/material/FormControl";
import Radio from "@mui/material/Radio";
import RadioGroup from "@mui/material/RadioGroup";
import {
  Select,
  MenuItem,
  ListItemText,
  FormHelperText,
  Autocomplete,
} from "@mui/material";
import { Button } from "@mui/material";
import { DateTimePicker } from "@mui/x-date-pickers/DateTimePicker";
import { LocalizationProvider, DatePicker } from "@mui/x-date-pickers";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import Backdrop from "@mui/material/Backdrop";
import Modal from "@mui/material/Modal";
import Fade from "@mui/material/Fade";
import Typography from "@mui/material/Typography";
import { v4 as uuidv4 } from "uuid";
import { apiAuth } from "src/utils/http";
import { useState } from "react";
import { useEffect } from "react";
import { parseISO, format } from "date-fns";
import FuseSvgIcon from "@fuse/core/FuseSvgIcon";
import { useLocation, useNavigate, useParams } from "react-router";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import FuseLoading from "@fuse/core/FuseLoading";
import MocHeader from "../../moc/MocHeader";

function TransportApp() {
  const style = {
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
  const style1 = {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: "1200px",
    maxWidth: "80vw",
    height: "auto",
    borderRadius: "16px",
    bgcolor: "background.paper",

    boxShadow: 24,
    p: 4,
  };

  const BoldLabel = styled("label")({
    fontWeight: "bold",
    color: "black",
  });
  const style2 = {
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

  const drawerStyle = (open) => ({
    width: 350,
    bgcolor: "background.paper",
    borderTopRightRadius: "16px",
    borderBottomRightRadius: "16px",
    boxShadow: 24,
    p: 2,
    position: "absolute",
    top: 0,
    right: open ? 0 : -250, // Move drawer out of view when closed
    height: "100%",
    zIndex: 10,
    transition: "right 0.3s ease",
    overflow: "auto", // Smooth transition for opening/closing
  });
  const [docId, setDocId] = useState("");
  const [docToken, setDocToken] = useState("");
  const [deletes, setDeletes] = useState(false);
  const [docContent, setDocContent] = useState([]);
  const [mockType, setMockType] = useState([]);
  const [expenseNature, setExpenseNature] = useState([]);
  const [expenseType, setExpenseType] = useState([]);
  const [purchaseCat, setPurchaseCat] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const [docController, setDocController] = useState([]);
  const [open, setOpen] = useState(false);

  const handleClose = () => setOpen(false);
  const [openDocModal, setOpenDocModal] = useState(false);
  const [listDocument, setListDocument] = useState([]);
  const routeParams = useParams();
  const navigate = useNavigate();

  const handleOpenDocModal = () => {
    setOpenDocModal(true);
    const newGuid = uuidv4();
    setSelectedFile((prevState) => ({
      ...prevState,
      documentId: newGuid,
    }));
  };

  const [documentState, setDocumentState] = useState({
    type: 1,
    projectValue: "",
    expenseNature: 2,
    expenseType: 3,
    purchaseCategory: 2,
    projectName: "",
    projectDescription: "",
  });

  const [openDrawer, setOpenDrawer] = useState(false);
  const [selectedDocument, setSelectedDocument] = useState(null);
  const [selectedFile, setSelectedFile] = useState({
    name: "",
    description: "",
    type: "",
    document: "binary",
    documentType: "ChangeRequest",
    documentId: "",
    changeRequestToken: null,
  });
  const [fileDetails, setFileDetails] = useState(false);
  const [documenDowToken, setDocumenDowToken] = useState("");
  const [fileUrl, setFileUrl] = useState("");
  const [fileName, setFileName] = useState("");

  const handleDownload = () => {
    if (fileUrl) {
      const link = document.createElement("a");
      link.href = fileUrl;
      link.download = fileName;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
    apiAuth
      .get(`/DocumentManager/download/${documenDowToken}`)
      .then((response) => { });
  };

  const handelDetailDoc = (doc) => {
    setSelectedDocument(doc);
    setFileDetails(true);
    setDocumenDowToken(doc.token);
  };

  const handleOpenDocModalClose = () => {
    setOpenDocModal(false);
    setOpenDrawer(false);
  };

  const toggleDrawer = (open) => () => {
    setOpenDrawer(open);
  };

  const handelFileDiscriptionChange = (event) => {
    const { name, value } = event.target;
    setSelectedFile((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const location = useLocation();

  const [teamOptions, setTeamOptions] = useState([]);
  const [selectedTeams, setSelectedTeams] = useState([]);

  const teamOptionsMap = {
    Transport: [
      "Div Transport In Charge",
      "Task Representative",
      "HOD/HO transport HSE",
    ],
    Routine: [
      "Operations In Charge",
      "Maintenance in charge",
      "HSE in charge",
      "Task Representative",
      "SIC/HOF",
    ],
    NonRoutine: [
      "Project In charge",
      "Maintenance In charge",
      "HSE in charge",
      "Transport in charge",
      "Contractor representative",
    ],
  };
  useEffect(() => {
    // Extract the type from the URL
    const pathSegments = location.pathname.split("/");
    const typeSegment = pathSegments[2].replace("activity", "").toLowerCase();
    // Map the URL segment to the team type
    const teamType = Object.keys(teamOptionsMap).find(
      (key) => key.toLowerCase() === typeSegment
    );

    if (teamType) {
      setTeamOptions(teamOptionsMap[teamType]);
      setSelectedTeams(new Array(teamOptionsMap[teamType].length).fill(null));
      setSelectedType(teamType); // Set the default selected type
    } else {
      setTeamOptions([]);
      setSelectedTeams([]);
      setSelectedType("");
    }
  }, [location.pathname]);

  const [selectedType, setSelectedType] = useState("");

  const handleTypeChange = (event) => {
    const newType = event.target.value;
    setSelectedType(newType);
    setTeamOptions(teamOptionsMap[newType]);
    setSelectedTeams(new Array(teamOptionsMap[newType].length).fill(null));
  };

  const handleTeamChange = (index, newValue) => {
    const newSelectedTeams = [...selectedTeams];
    newSelectedTeams[index] = newValue;
    setSelectedTeams(newSelectedTeams);
  };
  //   const handleChange = (event) => {
  //     const { name, value } = event.target;
  //     setDocumentState({
  //       ...documentState,
  //       [name]: value,
  //     });

  //     if (!!errors[name]) {
  //       setErrors({ ...errors, [name]: "" });
  //     }
  //   };

  //   const handelFileChange = (e) => {
  //     const file = e.target.files[0];
  //     if (file) {
  //       const url = URL.createObjectURL(file);
  //       setFileUrl(url);
  //       setFileName(file.name);
  //     }
  //     setSelectedFile({
  //       name: e.target.files[0].name,
  //       description: "",
  //       type: e.target.files[0].type,
  //       document: e.target.files[0],
  //       documentType: "ChangeRequest",
  //       documentId: selectedFile.documentId,
  //       changeRequestToken: null,
  //     });
  //   };
  //   const [errors, setErrors] = useState({});

  //   const validate = () => {
  //     let tempErrors = {};

  //     if (!documentState.projectName)
  //       tempErrors.projectName = "Project Name is required";
  //     if (!documentState.projectDescription)
  //       tempErrors.projectDescription = "Project Descrpition Name is required";
  //     if (!documentState.projectValue)
  //       tempErrors.projectValue = "Project Value is required";
  //     if (!documentState.type) tempErrors.type = "Type is required";

  //     if (!documentState.expenseNature)
  //       tempErrors.expenseNature = "Expense Nature is required";

  //     if (!documentState.purchaseCategory)
  //       tempErrors.purchaseCategory = "Purchase Category is required";

  //     if (!documentState.expenseType)
  //       tempErrors.expenseType = "Expense Type is required";

  //     // Add other validations here
  //     setErrors(tempErrors);
  //     return Object.keys(tempErrors).length === 0;
  //   };
  //   const handleRadioChange = (event) => {
  //     const { value } = event.target;
  //     setDocumentState((prevState) => ({
  //       ...prevState,
  //       isNewDocument: value === "New",
  //       reasonForNewDocument: "",
  //       reasonForChange: "",
  //     }));
  //     setErrors((prevErrors) => ({
  //       ...prevErrors,
  //       reasonForNewDocument: "",
  //       reasonForChange: "",
  //     }));
  //     setFormValid(true);
  //   };

  const handleOpen = () => {
    toast?.success("Successfully Completed");
    setTimeout(() => navigate("/dashboards/project"), 1000);

    if (!validate()) {
      setOpen(false);
    } else {
      setOpen(true);
    }
  };
  //   const handleSubmitDocument = () => {
  //     const formData = new FormData();
  //     formData.append("name", selectedFile.name);
  //     formData.append("descritpion", selectedFile.description);
  //     formData.append("type", selectedFile.type);
  //     formData.append("document", selectedFile.document);
  //     formData.append("documentType", selectedFile.documentType);
  //     formData.append("documentId", selectedFile.documentId);
  //     formData.append("changeRequestToken", selectedFile.changeRequestToken);
  //     apiAuth
  //       .post("DocumentManager/Create", formData, {
  //         headers: {
  //           "Content-Type": "multipart/form-data",
  //         },
  //       })
  //       .then((response) => {
  //         console.log(response.data);
  //         apiAuth
  //           .get(
  //             `/DocumentManager/DocList/${selectedFile.documentId}/ChangeRequest?changeRequestToken=${selectedFile.changeRequestToken}`
  //           )
  //           .then((response) => {
  //             setOpenDrawer(false);
  //             setListDocument(response?.data?.data);
  //           });
  //       })
  //       .catch((error) => {
  //         console.error("There was an error uploading the document!", error);
  //       });
  //   };

  const [formValid, setFormValid] = useState(true);

  //   const handleSubmit = (event) => {
  //     setIsLoading(true);
  //     event.preventDefault();

  //     apiAuth
  //       .post("/ChangeRequest/Create", documentState)
  //       .then((response) => {
  //         toast?.success("Successfully Created");
  //         setTimeout(() => {
  //           setIsLoading(false);

  //           navigate("/dashboards/project");
  //         }, 1000);
  //         setOpen(false);
  //       })
  //       .catch((error) => {
  //         setIsLoading(false);

  //         setOpen(true);
  //         toast?.success("Some Error Occured");
  //       });
  //   };

  const formatDate = (dateString) => {
    if (!dateString) {
      return "Invalid date";
    }

    try {
      const date = parseISO(dateString);
      return format(date, "M/d/yyyy");
    } catch (error) {
      console.error("Error parsing date:", error);
      return "Invalid date";
    }
  };

  const getRecords = async () => {
    try {
      const staffResponse = await apiAuth.get(`/Staff/LOV`);
      setDocController(staffResponse.data.data);

      const changeRequestResponse = await apiAuth.get(`/ChangeRequest/Create`);
      setIsLoading(false);
      setDocContent(changeRequestResponse.data.data);
      setMockType(changeRequestResponse.data.data.mocType);
      setExpenseNature(changeRequestResponse.data.data.mocExpenseNature);
      setExpenseType(changeRequestResponse.data.data.mocExpenseType);
      setPurchaseCat(changeRequestResponse.data.data.mocPurchaseCategory);
    } catch (error) {
      console.error("Error fetching records:", error);
    }
  };

  useEffect(() => {
    getRecords();
  }, []);

  //   useEffect(() => {
  //     if (Object.keys(docContent).length !== 0) {
  //       setDocumentState({
  //         requestNo: docContent.requestNo,
  //         divisionName: docContent.divisionName,
  //         siteInChargeName: docContent.siteInChargeName,
  //         siteName: docContent.siteName,
  //         functionName: docContent.functionName,
  //         divisionId: docContent.divisionId,
  //         functionId: docContent.functionId,
  //         siteId: docContent.siteId,
  //         siteInchargeId: docContent.siteInchargeId,

  //         documentId: "9f3b2152-36f6-4cc2-86be-e17f96a0f81f",
  //         documentStatus: 2,
  //         documentType: "Activity",
  //         requestDate: formatDate(docContent?.requestDate),
  //       });
  //     }
  //   }, [docContent]);

  if (isLoading) {
    return <FuseLoading />;
  }

  const handleCloseDelete = () => {
    setDeletes(false);
  };
  const handleDelete = (e, id, token) => {
    e.preventDefault();
    setDocId(id);
    setDocToken(token);
    setDeletes(true);
  };

  const handleSubmitDelete = () => {
    apiAuth.delete(`DocumentManager/Delete/${docToken}`).then((response) => {
      apiAuth
        .get(
          `/DocumentManager/DocList/${docId}/ChangeRequest?changeRequestToken=${selectedDocument?.changeRequestToken}`
        )
        .then((response) => {
          setOpenDrawer(false);
          setListDocument(response?.data?.data);
          setDeletes(false);
          setFileDetails(false);
          setSelectedDocument("");
        });
    });
  };

  return (
    <FusePageCarded
      header={<MocHeader risk={"risk"} />}
      content={
        <>
          <ToastContainer
            className="toast-container"
            position="top-right"
            autoClose={5000}
            hideProgressBar={false}
            newestOnTop={false}
            closeOnClick
            rtl={false}
            pauseOnFocusLoss
            draggable
            pauseOnHover
            theme="light"
          />
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
              <Box sx={style2}>
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
                    style={{
                      padding: "23px",
                      backgroundColor: "red",
                    }}
                    type="submit"
                    onClick={handleSubmitDelete}
                  >
                    Confirm
                  </Button>
                </div>
              </Box>
            </Fade>
          </Modal>
          <form
          //    onSubmit={handleSubmit}
          >
            <div className="flex flex-col flex-1 w-full mx-auto px-24 pt-24 sm:p-30">
              <div className="flex flex-col shrink-0 sm:flex-row items-center justify-between space-y-16 sm:space-y-0">
                <div
                  _ngcontent-fyk-c288=""
                  class="flex items-center w-full  border-b justify-between"
                >
                  <h2 _ngcontent-fyk-c288="" class="text-2xl font-semibold">
                    Initiate new risk register
                  </h2>
                </div>
              </div>
              <h5
                _ngcontent-fyk-c288=""
                class="text-2xl font-semibold text-grey pt-5"
              >
                Basic Details
              </h5>
              <div
                style={{ marginTop: "30px", justifyContent: "space-between" }}
                className="flex flex-row "
              >
                <Box
                  sx={{
                    width: 480,
                    maxWidth: "50%",
                  }}
                >
                  <TextField
                    fullWidth
                    label="Request No"
                    id="Request No"
                    value={docContent.requestNo || ""}
                    disabled
                  />
                </Box>
                <Box
                  sx={{
                    width: 480,
                    maxWidth: "50%",
                  }}
                >
                  <TextField
                    fullWidth
                    label="Date"
                    id="Date"
                    value={formatDate(docContent?.requestDate)}
                    disabled
                  />
                </Box>
                <Box
                  sx={{
                    width: 480,
                    maxWidth: "50%",
                  }}
                >
                  <TextField
                    fullWidth
                    label="Site in charge"
                    id="Site in charge"
                    value={docContent.siteInChargeName || ""}
                    disabled
                  />
                </Box>
              </div>
              <div
                style={{ marginTop: "30px", justifyContent: "space-between" }}
                className="flex flex-row "
              >
                <Box
                  sx={{
                    width: 480,
                    maxWidth: "50%",
                  }}
                >
                  <TextField
                    fullWidth
                    label="Site"
                    id="Site
"
                    value={docContent.siteName || ""}
                    disabled
                  />
                </Box>
                <Box
                  sx={{
                    width: 480,
                    maxWidth: "50%",
                  }}
                >
                  <TextField
                    fullWidth
                    label="Division"
                    id="Division"
                    value={docContent.divisionName || ""}
                    disabled
                  />
                </Box>
                <Box
                  sx={{
                    width: 480,
                    maxWidth: "50%",
                  }}
                >
                  <TextField
                    fullWidth
                    label="Function"
                    id="Function"
                    value={docContent.functionName || ""}
                    disabled
                  />
                </Box>
              </div>

              <div
                className="my-10"
                style={{ borderTopWidth: "2px", marginTop: "45px" }}
              ></div>

              <div style={{ marginTop: "20px" }}>
                <Box
                  sx={{
                    width: 480,
                    maxWidth: "50%",
                  }}
                >
                  <FormControl fullWidth sx={{ m: 1 }}>
                    <FormLabel
                      className="font-medium text-14"
                      component="legend"
                    >
                      Type*
                    </FormLabel>
                    <Select
                      variant="outlined"
                      name="type"
                      value={selectedType}
                      onChange={handleTypeChange} // Set the default selected value
                    >
                      <MenuItem value="Transport">Transport</MenuItem>
                      <MenuItem value="Routine">Routine</MenuItem>
                      <MenuItem value="NonRoutine">Non Routine</MenuItem>
                    </Select>
                    {/* {!!errors.type && (
    <FormHelperText>{errors.type}</FormHelperText>
  )} */}
                  </FormControl>
                </Box>
                <Box
                  sx={{ display: "flex", flexWrap: "wrap", marginTop: "15px" }}
                >
                  <FormControl
                    fullWidth
                    sx={{ m: 1 }}
                  // error={!!errors.projectName}
                  >
                    <InputLabel htmlFor="projectName">Title *</InputLabel>
                    <OutlinedInput
                      id="projectName"
                      name="projectName"
                      //   value={documentState.projectName}
                      //   onChange={handleChange}
                      label="Document Name *"
                    />
                    {/* {!!errors.projectName && (
                      <FormHelperText>{errors.projectName}</FormHelperText>
                    )} */}
                  </FormControl>
                </Box>

                <Box
                  sx={{ display: "flex", flexWrap: "wrap", marginTop: "15px" }}
                >
                  <FormControl
                    fullWidth
                    sx={{ m: 1 }}
                  // error={!!errors.projectName}
                  >
                    <InputLabel htmlFor="projectDescription">
                      Description *
                    </InputLabel>
                    <OutlinedInput
                      id="projectDescription"
                      name="projectDescription"
                      //   value={documentState.projectDescription}
                      //   onChange={handleChange}
                      label="Document Description *"
                    />
                    {/* {!!errors.projectName && (
                      <FormHelperText>{errors.projectName}</FormHelperText>
                    )} */}
                  </FormControl>
                </Box>
              </div>
              <div
                className="my-10"
                style={{ borderTopWidth: "2px", marginTop: "40px" }}
              ></div>

              <h5
                _ngcontent-fyk-c288=""
                class="text-2xl font-semibold text-grey "
                style={{ textAlign: "start", margin: "20px 0" }}
              >
                Team Assignment
              </h5>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-24 w-full">
                {teamOptions.map((option, index) => (
                  <Box key={index}>
                    <FormControl fullWidth sx={{ flex: 1 }}>
                      <Autocomplete
                        value={selectedTeams[index] || ""}
                        onChange={(event, newValue) =>
                          handleTeamChange(index, newValue)
                        }
                        options={docController.map(
                          (docOption) => docOption.value
                        )}
                        renderInput={(params) => (
                          <TextField
                            {...params}
                            label={`${option} *`}
                            variant="outlined"
                          />
                        )}
                        getOptionLabel={(option) => {
                          const docOption = docController.find(
                            (doc) => doc.value === option
                          );
                          return docOption ? docOption.text : "";
                        }}
                      />
                    </FormControl>
                  </Box>
                ))}
              </div>

              <div
                className="my-10"
                style={{ borderTopWidth: "2px", marginTop: "40px" }}
              ></div>
              <div className="flex justify-between">
                <div
                  className="flex items-center mt-24 sm:mt-0 sm:mx-8 space-x-12"
                  style={{ marginTop: "15px" }}
                >
                  <Button
                    className="whitespace-nowrap mt-5"
                    style={{
                      border: "1px solid",
                      backgroundColor: "#0000",
                      color: "black",
                      borderColor: "rgba(203,213,225)",
                    }}
                    variant="contained"
                    color="warning"
                    startIcon={
                      <FuseSvgIcon size={20}>
                        heroicons-solid:upload
                      </FuseSvgIcon>
                    }
                    onClick={handleOpenDocModal}
                  >
                    Document
                  </Button>
                </div>
                <div
                  className="flex items-center mt-24 sm:mt-0 sm:mx-8 space-x-12"
                  style={{ marginTop: "15px" }}
                >
                  <div>
                    <Modal
                      aria-labelledby="transition-modal-title"
                      aria-describedby="transition-modal-description"
                      open={openDocModal}
                      onClose={handleOpenDocModalClose}
                      closeAfterTransition
                      // Customize backdrop appearance
                      BackdropComponent={Backdrop}
                      // Props for backdrop customization
                      BackdropProps={{
                        timeout: 500, // Adjust as needed
                        style: {
                          // Add backdrop styles here
                          backgroundColor: "rgba(0, 0, 0, 0.5)",
                        },
                      }}
                    >
                      <Fade in={openDocModal}>
                        <Box sx={style1}>
                          <Box sx={{ flex: 1 }}>
                            <Box
                              className="flex justify-between"
                              style={{ margin: "30px" }}
                            >
                              <Typography
                                id="transition-modal-title"
                                variant="h6"
                                component="h2"
                                style={{
                                  fontSize: "3rem",
                                }}
                              >
                                File Manager
                                {/* <Typography
                                id="transition-modal-title"
                                variant="h6"
                                component="h2"
                              >
                                0 Files
                              </Typography> */}
                              </Typography>
                              <Box>
                                <Button
                                  className=""
                                  variant="contained"
                                  color="secondary"
                                  onClick={toggleDrawer(true)}
                                >
                                  <FuseSvgIcon size={20}>
                                    heroicons-outline:plus
                                  </FuseSvgIcon>
                                  <span className="mx-4 sm:mx-8">
                                    Upload File
                                  </span>
                                </Button>
                              </Box>
                            </Box>
                            <Box>
                              <Typography
                                id="transition-modal-title"
                                variant="h6"
                                className="d-flex flex-wrap p-6 md:p-8 md:py-6 min-h-[415px] max-h-120 space-y-8 overflow-y-auto custom_height"
                                component="div"
                                style={{
                                  backgroundColor: "#e3eeff80",
                                }}
                              >
                                {listDocument.map((doc, index) => (
                                  <div className="content " key={index}>
                                    <div
                                      onClick={() => handelDetailDoc(doc)}
                                      style={{ textAlign: "-webkit-center" }}
                                    >
                                      <img
                                        src="/assets/images/etc/icon_N.png"
                                        style={{}}
                                      />
                                      <h6 className="truncate-text">
                                        {doc?.name}
                                      </h6>
                                      <h6>by {doc?.staffName}</h6>
                                    </div>
                                  </div>
                                ))}
                              </Typography>
                            </Box>
                          </Box>
                          {openDrawer && !fileDetails && (
                            <Box sx={drawerStyle(openDrawer)}>
                              <div className="flex justify-end">
                                <Button
                                  className=""
                                  variant="contained"
                                  style={{ backgroundColor: "white" }}
                                  onClick={() => setOpenDrawer(false)}
                                >
                                  <FuseSvgIcon size={20}>
                                    heroicons-outline:x
                                  </FuseSvgIcon>
                                </Button>
                              </div>
                              <div>&nbsp;</div>
                              <div className="text-center">
                                <input
                                  type="file"
                                  id="fileInput"
                                  style={{ display: "none" }}
                                  onChange={(e) => {
                                    handelFileChange(e);
                                  }}
                                />
                                <label htmlFor="fileInput">
                                  <Button
                                    className=""
                                    variant="contained"
                                    color="secondary"
                                    style={{
                                      backgroundColor: "#24a0ed",
                                      borderRadius: "5px",
                                      paddingLeft: "50px",
                                      paddingRight: "50px",
                                    }}
                                    component="span"
                                  >
                                    <FuseSvgIcon size={20}>
                                      heroicons-outline:plus
                                    </FuseSvgIcon>
                                    <span className="mx-4 sm:mx-8">
                                      Upload File
                                    </span>
                                  </Button>
                                </label>
                                <Box
                                  component="form"
                                  sx={{
                                    "& > :not(style)": { m: 1, width: "25ch" },
                                  }}
                                  noValidate
                                  autoComplete="off"
                                >
                                  <TextField
                                    id="standard-basic"
                                    label={<BoldLabel>Information</BoldLabel>}
                                    variant="standard"
                                    disabled
                                  />
                                </Box>
                                <Box
                                  component="form"
                                  sx={{
                                    "& > :not(style)": { m: 1, width: "25ch" },
                                  }}
                                  noValidate
                                  autoComplete="off"
                                >
                                  <TextField
                                    id="selectedFileName"
                                    label="Selecte File"
                                    variant="standard"
                                    disabled
                                    value={selectedFile.name}
                                  />
                                </Box>
                                <Box
                                  component="form"
                                  sx={{
                                    "& > :not(style)": { m: 1, width: "25ch" },
                                  }}
                                  noValidate
                                  autoComplete="off"
                                >
                                  <TextField
                                    id="standard-basic"
                                    label={<>Description</>}
                                    name="description"
                                    variant="standard"
                                    onChange={handelFileDiscriptionChange}
                                    value={selectedFile.description}
                                  />
                                </Box>
                              </div>

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
                                    backgroundColor: "white",
                                    color: "black",
                                    border: "1px solid grey",
                                  }}
                                >
                                  Cancel
                                </Button>
                                <Button
                                  className="whitespace-nowrap"
                                  variant="contained"
                                  color="secondary"
                                  type="submit"
                                  onClick={handleSubmitDocument}
                                >
                                  Submit
                                </Button>
                              </div>
                            </Box>
                          )}

                          {fileDetails && (
                            <Box sx={drawerStyle(fileDetails)}>
                              <div className="flex justify-end">
                                <Button
                                  className=""
                                  variant="contained"
                                  style={{ backgroundColor: "white" }}
                                  onClick={() => setFileDetails(false)}
                                >
                                  <FuseSvgIcon size={20}>
                                    heroicons-outline:x
                                  </FuseSvgIcon>
                                </Button>
                              </div>
                              <div>&nbsp;</div>
                              <div className="text-center">
                                <input
                                  type="file"
                                  id="fileInput"
                                  style={{ display: "none" }}
                                  onChange={(e) => {
                                    handelFileChange(e);
                                  }}
                                />
                                <label htmlFor="fileInput">
                                  <div className=" ">
                                    <div
                                      onClick={handelDetailDoc}
                                      style={{ textAlign: "-webkit-center" }}
                                    >
                                      <img src="/assets/images/etc/icon_N.png" />
                                    </div>
                                  </div>
                                </label>
                                <Box
                                  component="form"
                                  sx={{
                                    "& > :not(style)": { m: 1, width: "25ch" },
                                  }}
                                  noValidate
                                  autoComplete="off"
                                >
                                  <TextField
                                    id="standard-basic"
                                    label={<BoldLabel>Information</BoldLabel>}
                                    variant="standard"
                                    disabled
                                  />
                                </Box>
                                <Box
                                  component="form"
                                  sx={{
                                    "& > :not(style)": { m: 1, width: "25ch" },
                                  }}
                                  noValidate
                                  autoComplete="off"
                                >
                                  <TextField
                                    id="selectedFileName"
                                    label="Created By"
                                    variant="standard"
                                    disabled
                                    value={selectedDocument.staffName}
                                  />
                                </Box>
                                <Box
                                  component="form"
                                  sx={{
                                    "& > :not(style)": { m: 1, width: "25ch" },
                                  }}
                                  noValidate
                                  autoComplete="off"
                                >
                                  <TextField
                                    id="standard-basic"
                                    label=" Created At"
                                    name="description"
                                    variant="standard"
                                    disabled
                                    value={formatDate(
                                      selectedDocument.createdAt
                                    )}
                                  />
                                </Box>
                                <Box
                                  component="form"
                                  sx={{
                                    "& > :not(style)": { m: 1, width: "25ch" },
                                  }}
                                  noValidate
                                  autoComplete="off"
                                >
                                  <TextField
                                    id="standard-basic"
                                    label={<>Description</>}
                                    name="Description"
                                    variant="standard"
                                    disabled
                                    value={
                                      selectedDocument.description == null
                                        ? ""
                                        : selectedDocument.descritpion
                                    }
                                  />
                                </Box>
                              </div>

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
                                  color="secondary"
                                  type="submit"
                                  onClick={handleDownload}
                                >
                                  Download
                                </Button>
                                <Button
                                  className="whitespace-nowrap"
                                  variant="contained"
                                  color="primary"
                                  style={{
                                    backgroundColor: "white",
                                    color: "black",
                                    border: "1px solid grey",
                                  }}
                                  onClick={(e) =>
                                    handleDelete(
                                      e,
                                      selectedDocument?.documentId,
                                      selectedDocument?.token
                                    )
                                  }
                                >
                                  Delete
                                </Button>
                              </div>
                            </Box>
                          )}
                        </Box>
                      </Fade>
                    </Modal>
                  </div>
                  <Button
                    className="whitespace-nowrap"
                    variant="contained"
                    color="primary"
                    style={{
                      padding: "15px",
                      backgroundColor: "white",
                      color: "black",
                      border: "1px solid grey",
                    }}
                  >
                    Cancel
                  </Button>
                  <Button
                    className="whitespace-nowrap"
                    variant="contained"
                    color="secondary"
                    style={{ padding: "15px" }}
                    onClick={handleOpen}
                  >
                    Submit for Approvel
                  </Button>

                  <Modal
                    aria-labelledby="transition-modal-title"
                    aria-describedby="transition-modal-description"
                    open={open}
                    onClose={handleClose}
                    closeAfterTransition
                    slots={{ backdrop: Backdrop }}
                    slotProps={{
                      backdrop: {
                        timeout: 500,
                      },
                    }}
                  >
                    <Fade in={open}>
                      <Box sx={style}>
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
                              Submit request
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
                                Once submited you will not be able to revert !
                                Are you sure you want to continue ?
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
                            onClick={handleClose}
                          >
                            Cancel
                          </Button>
                          <Button
                            className="whitespace-nowrap"
                            variant="contained"
                            color="secondary"
                            style={{ padding: "23px", backgroundColor: "red" }}
                            type="submit"
                          // onClick={handleSubmit}
                          >
                            Submit
                          </Button>
                        </div>
                      </Box>
                    </Fade>
                  </Modal>
                </div>
              </div>
            </div>
          </form>
        </>
      }
    />
  );
}

export default TransportApp;
