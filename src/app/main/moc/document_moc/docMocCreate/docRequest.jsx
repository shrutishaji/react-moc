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
import MocHeader from "../../MocHeader";
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
import { useNavigate, useParams } from "react-router";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import FuseLoading from "@fuse/core/FuseLoading";
import ConfirmationModal from "../../common_modal/confirmation_modal/ConfirmationModal";
import GuideLines from "../../common_modal/GuideLines";

function DocRequest() {
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

  const [docContent, setDocContent] = useState([]);
  const [docController, setDocController] = useState([]);
  const [open, setOpen] = useState(false);

  const handleClose = () => setOpen(false);
  const [openDocModal, setOpenDocModal] = useState(false);
  const [listDocument, setListDocument] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
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
    docControllerId: "",
    isNewDocument: null,
    projectDescription: "",
    projectName: "",
    documentUrl: "",
    reasonForNewDocument: "",
    docOldValidityDate: new Date(),
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
  const [openGuide, SetOpenGuide] = useState(false);
  const handelGuideOpen = () => {
    SetOpenGuide(true);
  };
  const handelGuideClose = () => {
    SetOpenGuide(false);
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

  const handleChange = (event) => {
    const { name, value } = event.target;

    // Skip trimming if the name is 'docControllerId' (or any other Autocomplete field)
    const newValue = name === "docControllerId" ? value : value.trimStart();

    setDocumentState({
      ...documentState,
      [name]: newValue,
    });

    if (name === "reasonForNewDocument") {
      setFormValid(true);
    }

    if (!!errors[name]) {
      setErrors({ ...errors, [name]: "" });
    }
  };

  const handleChanges = (date) => {
    setDocumentState({
      ...documentState,
      docOldValidityDate: date,
    });
  };

  const handelFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setFileUrl(url);
      setFileName(file.name);
    }
    const fileNameWithoutExtension = e.target.files[0].name
      .split(".")
      .slice(0, -1)
      .join(".");

    const fileType = e.target.files[0].type.startsWith("image/")
      ? e.target.files[0].type?.split("/")[1]
      : e.target.files[0].type;
    setSelectedFile({
      ...selectedFile,
      name: fileNameWithoutExtension,
      description: e.target.file[0].description,
      type: fileType,
      document: e.target.files[0],
      documentType: "ChangeRequest",
      documentId: selectedFile.documentId,
      changeRequestToken: null,
    });
  };
  const [errors, setErrors] = useState({});

  const validate = () => {
    let tempErrors = {};

    if (!documentState.projectName)
      tempErrors.projectName = "Document Name is required";
    if (!documentState.projectDescription)
      tempErrors.projectDescription = "Document Description is required";
    if (!documentState.documentUrl)
      tempErrors.documentUrl = "Document Url is required";

    if (!documentState.docControllerId)
      tempErrors.docControllerId = "DoCument Controller is required";

    if (documentState.isNewDocument === true) {
      if (!documentState.reasonForNewDocument)
        tempErrors.reasonForNewDocument = "Reason For New Document is required";
    } else if (documentState.isNewDocument === false) {
      if (!documentState.reasonForNewDocument)
        tempErrors.reasonForNewDocument = "Reason For Change is required";
    }

    // Add other validations here
    setErrors(tempErrors);
    return Object.keys(tempErrors).length === 0;
  };
  const handleRadioChange = (event) => {
    const { value } = event.target;
    setDocumentState((prevState) => ({
      ...prevState,
      isNewDocument: value === "New",
      reasonForNewDocument: "",
      reasonForChange: "",
    }));
    setErrors((prevErrors) => ({
      ...prevErrors,
      reasonForNewDocument: "",
      reasonForChange: "",
    }));
    setFormValid(true);
  };

  const handleOpen = () => {
    debugger;
    if (!validate()) {
      if (
        documentState.reasonForNewDocument != undefined ||
        (documentState.reasonForChange != undefined &&
          documentState.isNewDocument != null)
      ) {
        setFormValid(true);
      } else {
        setFormValid(false);
      }
      setOpen(false);
    } else {
      if (documentState.isNewDocument == undefined) {
        setOpen(false);

        setFormValid(false);
      } else {
        setFormValid(true);
        setOpen(true);
      }
    }
  };

  const handelActClose = () => {
    navigate("/moc");
  };
  const handleSubmitDocument = () => {
    const formData = new FormData();
    formData.append("name", selectedFile.name);
    formData.append("description", selectedFile.description);
    formData.append("type", selectedFile.type);
    formData.append("document", selectedFile.document);
    formData.append("documentType", selectedFile.documentType);
    formData.append("documentId", selectedFile.documentId);
    formData.append("changeRequestToken", selectedFile.changeRequestToken);
    apiAuth
      .post("DocumentManager/Create", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      })
      .then((response) => {
        if (response.data.statusCode === 200) {
          apiAuth
            .get(
              `/DocumentManager/DocList/${selectedFile.documentId}/ChangeRequest?changeRequestToken=${selectedFile.changeRequestToken}`
            )
            .then((response) => {
              setOpenDrawer(false);
              setListDocument(response?.data?.data);
              setSelectedFile({
                ...selectedFile,
                name: "",
                description: "",
              });
            });
        } else {
          toast.error(response.data.message);
          setOpenDocModal(false);
          setOpenDrawer(false);
          setSelectedFile({
            ...selectedFile,
            name: "",
            description: "",
          });
        }
      })
      .catch((error) => {
        if (error.errorsData) {
          if (error.errorsData.Name && error.errorsData.Name.length) {
            toast.error(error.errorsData.Name[0]);
          } else {
            toast.error("There was an error uploading the document!");
          }
        } else {
          toast.error("There was an error uploading the document!");
        }
        setOpenDocModal(false);
        setOpenDrawer(false);
        setSelectedFile({
          ...selectedFile,
          name: "",
          description: "",
        });
      });
  };

  const [formValid, setFormValid] = useState(true);

  const handleSubmit = (event) => {
    setIsLoading(true);
    event.preventDefault();
    const date = new Date(documentState.docOldValidityDate);
    let formattedDate = null;

    if (date != "Invalid Date") {
      formattedDate = date.toISOString();
    }

    const formattedDocumentState = {
      ...documentState,
      docOldValidityDate: formattedDate,
    };

    apiAuth
      .post("/DocMoc/CreateChangeRequest", formattedDocumentState)
      .then((response) => {
        if (docContent.siteInChargeName == null) {
          setOpen(false);
          setIsLoading(false);

          toast.error("Site in charge is not assigned for this site.");
        } else if (response.data.statusCode != 200) {
          setOpen(false);
          setIsLoading(false);

          toast.error(response.data.message);
        } else {
          setIsLoading(false);

          toast?.success("Successfully Created");

          setTimeout(() => {
            navigate("/moc");
          }, 1000);
          setOpen(false);
        }
      })

      .catch((error) => {
        setIsLoading(false);

        setOpen(true);
      });
  };

  const formatDate = (dateString) => {
    if (!dateString) {
      return "Invalid date";
    }

    try {
      const date = parseISO(dateString);
      return format(date, "M/d/yyyy");
    } catch (error) {
      console.log("Error parsing date:", error);
      return "Invalid date";
    }
  };

  const getRecords = async () => {
    try {
      const staffResponse = await apiAuth.get(`/Staff/LOV`);
      setDocController(staffResponse.data.data);

      const changeRequestResponse = await apiAuth.get(`/ChangeRequest/Create`);
      setDocContent(changeRequestResponse.data.data);
      setIsLoading(false);
    } catch (error) {
      console.log("Error fetching records:", error);
    }
  };

  useEffect(() => {
    getRecords();
  }, []);

  useEffect(() => {
    if (docContent && Object.keys(docContent).length !== 0) {
      setDocumentState({
        requestNo: docContent.requestNo,
        divisionName: docContent.divisionName,
        siteInChargeName: docContent.siteInChargeName,
        siteName: docContent.siteName,
        functionName: docContent.functionName,
        divisionId: docContent.divisionId,
        functionId: docContent.functionId,
        siteId: docContent.siteId,
        siteInchargeId: docContent.siteInchargeId,
        type: "Document",
        documentId: "9f3b2152-36f6-4cc2-86be-e17f96a0f81f",
        documentStatus: 2,
        documentType: 0,
        docType: "1",
        requestDate: formatDate(docContent?.requestDate),
      });
    }
  }, [docContent]);

  if (isLoading) {
    return <FuseLoading />;
  }

  return (
    <FusePageCarded
      header={<MocHeader />}
      content={
        <>
          <ToastContainer className="toast-container" />
          <GuideLines
            handelGuideOpen={openGuide}
            handelGuideClose={handelGuideClose}
          />
          <form onSubmit={handleSubmit}>
            <div className="p-24">
              <div className="flex flex-col flex-1 w-full mx-auto px-24 pt-24 sm:p-24 white_box rounded-2xl shadow">
                <div className="flex flex-col shrink-0 sm:flex-row items-center justify-between space-y-16 sm:space-y-0">
                  <div
                    _ngcontent-fyk-c288=""
                    class="flex items-center w-full justify-between"
                  >
                    <h2 _ngcontent-fyk-c288="" class="text-2xl font-semibold">
                      New Document MOC Request
                    </h2>
                    <Button
                      className="whitespace-nowrap "
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
                          heroicons-solid:document
                        </FuseSvgIcon>
                      }
                      onClick={handelGuideOpen}
                    >
                      Guide
                    </Button>
                  </div>
                </div>
                <div
                  style={{ justifyContent: "space-between" }}
                  className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-24 w-full"
                >
                  <Box
                    sx={{
                      width: 480,
                      maxWidth: "100%",
                      marginTop: "25px",
                    }}
                  >
                    <TextField
                      fullWidth
                      label="Request No"
                      id="Request No"
                      value={docContent?.requestNo || ""}
                      disabled
                    />
                  </Box>
                  <Box
                    sx={{
                      width: 480,
                      maxWidth: "100%",
                      marginTop: "25px",
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
                      maxWidth: "100%",
                      marginTop: "25px",
                    }}
                  >
                    <TextField
                      fullWidth
                      label="Site in charge"
                      id="Site in charge"
                      value={docContent?.siteInChargeName || ""}
                      disabled
                    />
                  </Box>
                </div>
                <div
                  style={{ justifyContent: "space-between" }}
                  className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-24 w-full"
                >
                  <Box
                    sx={{
                      width: 480,
                      maxWidth: "100%",
                      marginTop: "25px",
                    }}
                  >
                    <TextField
                      fullWidth
                      label="Site"
                      id="Site
  "
                      value={docContent?.siteName || ""}
                      disabled
                    />
                  </Box>
                  <Box
                    sx={{
                      width: 480,
                      maxWidth: "100%",
                      marginTop: "25px",
                    }}
                  >
                    <TextField
                      fullWidth
                      label="Division"
                      id="Division"
                      value={docContent?.divisionName || ""}
                      disabled
                    />
                  </Box>
                  <Box
                    sx={{
                      width: 480,
                      maxWidth: "100%",
                      marginTop: "25px",
                    }}
                  >
                    <TextField
                      fullWidth
                      label="Function"
                      id="Function"
                      value={docContent?.functionName || ""}
                      disabled
                    />
                  </Box>
                </div>

                <div
                  className="my-10"
                  style={{ borderTopWidth: "2px", marginTop: "45px" }}
                ></div>
                <div
                  className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-24 w-full custom_margin"
                  style={{ marginTop: "0" }}
                >
                  <Box
                    sx={{
                      display: "flex",
                      flexWrap: "wrap",
                      width: 480,
                      maxWidth: "100%",
                      marginTop: "25px",
                    }}
                  >
                    <FormControl
                      fullWidth
                      sx={{ m: 1 }}
                      error={!!errors?.projectName}
                    >
                      <InputLabel htmlFor="projectName">
                        Document Name *
                      </InputLabel>
                      <OutlinedInput
                        id="projectName"
                        name="projectName"
                        value={documentState.projectName}
                        onChange={handleChange}
                        label="Document Name *"
                      />
                      {!!errors.projectName && (
                        <FormHelperText>{errors?.projectName}</FormHelperText>
                      )}
                    </FormControl>
                  </Box>
                  <Box
                    sx={{
                      display: "flex",
                      flexWrap: "wrap",
                      marginTop: "25px",
                    }}
                  >
                    <FormControl
                      fullWidth
                      sx={{ m: 1 }}
                      error={!!errors.projectDescription}
                    >
                      <InputLabel htmlFor="projectDescription">
                        Document Description *
                      </InputLabel>
                      <OutlinedInput
                        id="projectDescription"
                        name="projectDescription"
                        value={documentState?.projectDescription}
                        onChange={handleChange}
                        label="Document Description *"
                      />
                      {!!errors.projectDescription && (
                        <FormHelperText>
                          {errors.projectDescription}
                        </FormHelperText>
                      )}
                    </FormControl>
                  </Box>
                  <Box
                    sx={{
                      display: "flex",
                      flexWrap: "wrap",
                      marginTop: "25px",
                    }}
                  >
                    <FormControl>
                      <FormLabel
                        id="documentType"
                        style={{ color: formValid ? "inherit" : "red" }}
                      >
                        Document Type <b className="text-red">*</b>
                      </FormLabel>
                      <RadioGroup
                        row
                        aria-labelledby="documentType"
                        name="documentType"
                        value={
                          documentState.isNewDocument == null
                            ? ""
                            : documentState.isNewDocument
                              ? "New"
                              : "Existing"
                        }
                        onChange={handleRadioChange}
                      >
                        <FormControlLabel
                          value="New"
                          control={<Radio />}
                          label="New"
                        />
                        <FormControlLabel
                          value="Existing"
                          control={<Radio />}
                          label="Existing"
                        />
                      </RadioGroup>
                    </FormControl>
                  </Box>
                </div>
                <div
                  className="grid grid-cols-1 sm:grid-cols-1 md:grid-cols-1 gap-24 w-full custom_margin"
                  style={{ marginTop: "0" }}
                >
                  {documentState.isNewDocument === true && (
                    <Box
                      sx={{
                        display: "flex",
                        flexWrap: "wrap",
                        marginTop: "25px",
                      }}
                    >
                      <FormControl
                        fullWidth
                        sx={{ m: 1 }}
                        error={!!errors.reasonForNewDocument}
                      >
                        <InputLabel htmlFor="newDocumentField">
                          Reason For New Document *
                        </InputLabel>
                        <OutlinedInput
                          id="reasonForNewDocument"
                          name="reasonForNewDocument"
                          value={documentState.reasonForNewDocument}
                          onChange={handleChange}
                          label="Reason For New Document *"
                        />
                        {!!errors.reasonForNewDocument && (
                          <FormHelperText>
                            {errors.reasonForNewDocument}
                          </FormHelperText>
                        )}
                      </FormControl>
                    </Box>
                  )}
                  {documentState.isNewDocument === false && (
                    <>
                      <LocalizationProvider dateAdapter={AdapterDateFns}>
                        <FormControl
                          sx={{
                            m: 1,
                            width: 480,
                            maxWidth: "50%",
                          }}
                        >
                          <Box
                            sx={{
                              display: "flex",
                              flexWrap: "wrap",
                              marginTop: "15px",
                            }}
                          >
                            <DatePicker
                              label="Validity Expires On *"
                              value={
                                documentState.docOldValidityDate
                                  ? documentState.docOldValidityDate
                                  : new Date()
                              }
                              onChange={handleChanges}
                              minDate={new Date()} // Prevents selection of past dates
                              renderInput={(params) => (
                                <TextField fullWidth {...params} />
                              )}
                            />
                          </Box>
                        </FormControl>
                      </LocalizationProvider>
                      <Box
                        sx={{
                          display: "flex",
                          flexWrap: "wrap",
                          marginTop: "25px",
                        }}
                      >
                        <FormControl
                          fullWidth
                          sx={{ m: 1 }}
                          error={!!errors.reasonForNewDocument}
                        >
                          <InputLabel htmlFor="existingDocumentField2">
                            Reason For Change*
                          </InputLabel>
                          <OutlinedInput
                            id="reasonForNewDocument"
                            name="reasonForNewDocument"
                            value={documentState.reasonForNewDocument}
                            onChange={handleChange}
                            label="Reason For Change*"
                          />
                          {!!errors.reasonForNewDocument && (
                            <FormHelperText>
                              {errors.reasonForNewDocument}
                            </FormHelperText>
                          )}
                        </FormControl>
                      </Box>
                    </>
                  )}
                  <Box
                    sx={{
                      display: "flex",
                      flexWrap: "wrap",
                      marginTop: "25px",
                    }}
                  >
                    <FormControl
                      fullWidth
                      sx={{ m: 1 }}
                      error={!!errors.documentUrl}
                    >
                      <FormLabel id="documentType">
                        Document URL (Provide the link of SharePoint File)
                        <b className="text-red">*</b>
                      </FormLabel>

                      <OutlinedInput
                        id="documentUrl"
                        name="documentUrl"
                        value={documentState.documentUrl}
                        onChange={handleChange}
                        label="Document URL *"
                      />
                      {!!errors.documentUrl && (
                        <FormHelperText>{errors.documentUrl}</FormHelperText>
                      )}
                    </FormControl>
                  </Box>
                </div>
                <div
                  className="grid grid-cols-1 sm:grid-cols-1 md:grid-cols-1 gap-24 w-full custom_margin"
                  style={{ marginTop: "0" }}
                >
                  <Box
                    sx={{
                      display: "flex",
                      flexWrap: "wrap",
                      marginTop: "25px",
                    }}
                  >
                    <FormControl
                      fullWidth
                      sx={{ m: 1 }}
                      error={!!errors.docControllerId}
                    >
                      <FormLabel id="documentType">
                        Document Controller <b className="text-red">*</b>
                      </FormLabel>
                      <Autocomplete
                        id="docControllerId"
                        options={docController}
                        getOptionLabel={(option) => option.text}
                        value={
                          docController.find(
                            (option) =>
                              option.value === documentState.docControllerId
                          ) || null
                        }
                        onChange={(event, newValue) => {
                          handleChange({
                            target: {
                              name: "docControllerId",
                              value: newValue ? newValue.value : "",
                            },
                          });
                        }}
                        renderInput={(params) => (
                          <TextField
                            {...params}
                            error={!!errors.docControllerId}
                            helperText={errors.docControllerId}
                          />
                        )}
                      />
                    </FormControl>
                  </Box>
                </div>
                {/* <div
                  className="my-10"
                  style={{ borderTopWidth: "2px", marginTop: "40px" }}
                ></div> */}
                <div className="flex justify-between">
                  <div
                    className="flex items-center mt-24 sm:mt-0 sm:mx-8 space-x-12"
                    style={{ marginTop: "15px" }}
                  >
                    {/* <Button
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
                    </Button> */}
                  </div>
                  <div
                    className="flex items-center mt-24 sm:mt-0 sm:mx-8 space-x-12"
                    style={{ marginTop: "15px" }}
                  >
                    <div></div>
                    <ConfirmationModal
                      openSubmit={open}
                      handleCloseSubmit={handleClose}
                      title="Submit request"
                    >
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
                          style={{
                            padding: "23px",
                            backgroundColor: "red",
                          }}
                          type="submit"
                          onClick={handleSubmit}
                        >
                          Submit
                        </Button>
                      </div>
                    </ConfirmationModal>
                    <Button
                      className="whitespace-nowrap"
                      variant="contained"
                      color="secondary"
                      style={{ padding: "15px" }}
                      onClick={handleOpen}
                    >
                      Submit
                    </Button>
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
                      onClick={handelActClose}
                    >
                      Cancel
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </form>
        </>
      }
    />
  );
}

export default DocRequest;
