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
import { withStyles } from "@mui/styles";
import Radio from "@mui/material/Radio";
import RadioGroup from "@mui/material/RadioGroup";
import {
  Backdrop,
  Modal,
  Select,
  MenuItem,
  ListItemText,
  FormHelperText,
  Badge,
  Typography,
  Fade,
  Button,
} from "@mui/material";
import MocHeader from "../../MocHeader";

import { DateTimePicker } from "@mui/x-date-pickers/DateTimePicker";
import { LocalizationProvider, DatePicker } from "@mui/x-date-pickers";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";

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
import DocumentModal from "../../common_modal/documentModal";
import DeleteModal from "../../common_modal/delete_modal/DeleteModal";
import GuideLines from "../../common_modal/GuideLines";

function AssetRequest() {
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
  const StyledBadge = withStyles((theme) => ({
    Badge: {
      right: 0,
      top: 5,
      border: `2px solid ${theme.palette.background.paper}`,
      padding: "0 4px",
      backgroundColor: "#000", // Adjust background color to match the image
      color: "white",
    },
  }))(Badge);
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
    overflow: "auto",
  });

  const [docContent, setDocContent] = useState([]);
  const [mockType, setMockType] = useState([]);
  const [expenseNature, setExpenseNature] = useState([]);
  const [expenseType, setExpenseType] = useState([]);
  const [purchaseCat, setPurchaseCat] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const [docController, setDocController] = useState([]);
  const [open, setOpen] = useState(false);
  const [deletes, setDeletes] = useState(false);
  const handleClose = () => setOpen(false);
  const [openDocModal, setOpenDocModal] = useState(false);
  const [listDocument, setListDocument] = useState([]);
  const routeParams = useParams();
  const navigate = useNavigate();
  const [docId, setDocId] = useState("");
  const [docToken, setDocToken] = useState("");

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
  const handleOpenDocModal = () => {
    setSelectedFile({
      ...selectedFile,
      name: "",
      descritpion: "",
    });
    setOpenDocModal(true);
    if (selectedFile.documentId === "") {
      const newGuid = uuidv4();
      setSelectedFile({
        ...selectedFile,
        documentId: newGuid,
      });
    }
  };

  const [documentState, setDocumentState] = useState({
    type: 1,
    projectValue: "",
    expenseNature: 2,
    expenseType: 3,
    purchaseCategory: 2,
    projectName: "",
    projectDescription: "",
    documentId: "",
  });

  const [openDrawer, setOpenDrawer] = useState(false);
  const [selectedDocument, setSelectedDocument] = useState(null);
  const [selectedFile, setSelectedFile] = useState({
    name: "",
    descritpion: "",
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
      .then((response) => {});
  };

  const handelDetailDoc = (doc) => {
    setSelectedDocument(doc);
    setFileDetails(true);
    setDocumenDowToken(doc.token);
  };

  const handleOpenDocModalClose = () => {
    setOpenDocModal(false);
    setOpenDrawer(false);
    setFileDetails(false);
  };

  const toggleDrawer = (open) => () => {
    setOpenDrawer(open);
  };

  const handelFileDiscriptionChange = (event) => {
    const { name, value } = event.target;
    setSelectedFile({
      ...selectedFile,
      [name]: value,
    });
  };

  const handleChange = (event) => {
    const { name, value } = event.target;
    if (
      name == "projectValue" ||
      name == "projectName" ||
      name == "projectDescription"
    ) {
      setDocumentState({
        ...documentState,
        [name]: value.trimStart(),
      });
    } else {
      setDocumentState({
        ...documentState,
        [name]: value,
      });
    }

    if (!!errors[name]) {
      setErrors({ ...errors, [name]: "" });
    }
  };

  const handelFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setFileUrl(url);
      setFileName(file.name);
    }
    const newGuid = uuidv4();
    const fileNameWithoutExtension = e.target.files[0].name
      .split(".")
      .slice(0, -1)
      .join(".");
    const fileType = e.target.files[0].type.startsWith("image/")
      ? e.target.files[0].type?.split("/")[1]
      : e.target.files[0].type.type;
    setSelectedFile({
      ...selectedFile,
      name: fileNameWithoutExtension,

      type: fileType,
      document: e.target.files[0],
      documentType: "ChangeRequest",
      documentId: selectedFile?.documentId,
      changeRequestToken: null,
    });
  };
  const [errors, setErrors] = useState({});

  const validate = () => {
    let tempErrors = {};

    if (!documentState.projectName)
      tempErrors.projectName = "Project Name is required";
    if (!documentState.projectDescription)
      tempErrors.projectDescription = "Project Descrpition Name is required";
    if (!documentState.projectValue) {
      tempErrors.projectValue = "Project Value is required";
    }
    if (documentState.projectValue?.length >= 14) {
      tempErrors.projectValue = "Project Value maximum length is 14 charcters";
    }
    if (!documentState.type) tempErrors.type = "Type is required";

    if (!documentState.expenseNature)
      tempErrors.expenseNature = "Expense Nature is required";

    if (!documentState.purchaseCategory)
      tempErrors.purchaseCategory = "Purchase Category is required";

    if (!documentState.expenseType)
      tempErrors.expenseType = "Expense Type is required";

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
    if (!validate()) {
      setOpen(false);
    } else {
      setOpen(true);
    }
  };

  const handelActClose = () => {
    navigate("/moc");
  };
  const handleSubmitDocument = () => {
    // Validation: If file-related fields are empty

    if (
      !selectedFile.name.trim() ||
      // !selectedFile.type.trim() ||
      !selectedFile.document ||
      !selectedFile.documentType.trim() ||
      !selectedFile.documentId.trim()
    ) {
      toast.error("Please select your file.");
      handleOpenDocModalClose();
      setSelectedFile({
        ...selectedFile,
        name: "",
        descritpion: "",
      });
      return;
    }

    // Validation: If description field is empty
    if (!selectedFile.descritpion.trim()) {
      toast.error("Please add a description.");
      handleOpenDocModalClose();
      setSelectedFile({
        ...selectedFile,
        name: "",
        descritpion: "",
      });
      return;
    }
    const formData = new FormData();
    formData.append("name", selectedFile.name);
    formData.append("descritpion", selectedFile.descritpion);
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
        console.log(response.data);
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
                descritpion: "",
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

    const updatedDocumentState = {
      ...documentState,
      documentId: selectedFile.documentId,
    };

    apiAuth
      .post("/ChangeRequest/Create", updatedDocumentState)
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
          toast?.success("Successfully Created");
          setIsLoading(false);
          setTimeout(() => {
            navigate("/moc");
          }, 1000);
          setOpen(false);
        }
      })
      .catch((error) => {
        setIsLoading(false);

        setOpen(true);
        toast?.success("Some Error Occured");
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

  useEffect(() => {
    if (Object.keys(docContent).length !== 0) {
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
        type: 1,
        expenseNature: 2,
        expenseType: 3,
        purchaseCategory: 2,
        documentId: selectedFile.documentId,
        documentStatus: 2,
        documentType: "Activity",
        requestDate: formatDate(docContent?.requestDate),
      });
    }
  }, [docContent]);

  const [openGuide, SetOpenGuide] = useState(false);
  const handelGuideOpen = () => {
    SetOpenGuide(true);
  };
  const handelGuideClose = () => {
    SetOpenGuide(false);
  };

  if (isLoading) {
    return <FuseLoading />;
  }

  return (
    <FusePageCarded
      header={<MocHeader />}
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
          <DocumentModal
            open={openDocModal}
            selectedDocument={selectedDocument}
            selectedFile={selectedFile}
            fileDetails={fileDetails}
            setFileDetails={setFileDetails}
            openDrawer={openDrawer}
            setOpenDrawer={setOpenDrawer}
            handleModalClose={handleOpenDocModalClose}
            listDocument={listDocument}
            toggleDrawer={toggleDrawer}
            handelDetailDoc={handelDetailDoc}
            handelFileDiscriptionChange={handelFileDiscriptionChange}
            handelFileChange={handelFileChange}
            handleSubmitDocument={handleSubmitDocument}
            formatDate={formatDate}
            handleDownload={handleDownload}
            handleDelete={handleDelete}
          />
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
                      New Technical MOC Request
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
                  style={{ marginTop: "0", justifyContent: "space-between" }}
                  className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-24 w-full custom_margin"
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
                      value={docContent.requestNo || ""}
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
                      value={docContent.siteInChargeName || ""}
                      disabled
                    />
                  </Box>
                </div>
                <div
                  style={{ marginTop: "0", justifyContent: "space-between" }}
                  className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-24 w-full custom_margin"
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
                      value={docContent.siteName || ""}
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
                      value={docContent.divisionName || ""}
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
                      value={docContent.functionName || ""}
                      disabled
                    />
                  </Box>
                </div>

                <div
                  className="mt-25px"
                  style={{ borderTopWidth: "2px" }}
                ></div>

                <div
                  style={{ marginTop: "0" }}
                  className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-24 w-full custom_margin "
                >
                  <FormControl
                    sx={{
                      width: 480,
                      maxWidth: "100%",
                      marginTop: "25px",
                    }}
                  >
                    <FormLabel
                      className="font-medium text-14"
                      component="legend"
                      error={!!errors.type}
                    >
                      Type*
                    </FormLabel>
                    <Select
                      variant="outlined"
                      name="type"
                      value={documentState.type}
                      onChange={handleChange}
                    >
                      {mockType
                        .filter(
                          (option) =>
                            option.text !== "Org" && option.text !== "Document"
                        )
                        .map((option) => (
                          <MenuItem key={option.value} value={option.value}>
                            {option.text}
                          </MenuItem>
                        ))}
                    </Select>
                    {!!errors.type && (
                      <FormHelperText>{errors.type}</FormHelperText>
                    )}
                  </FormControl>

                  <Box
                    sx={{
                      width: 480,
                      maxWidth: "100%",
                      marginTop: "25px",
                    }}
                    error={!!errors.projectValue}
                  >
                    <FormLabel
                      className={`font-medium text-14 ${!!errors.projectValue ? "text-red" : ""}`}
                      component="legend"
                    >
                      Project Value *
                    </FormLabel>
                    <TextField
                      fullWidth
                      id="Division"
                      name="projectValue"
                      value={documentState.projectValue || ""}
                      onChange={(e) => {
                        const value = e.target.value;
                        if (/^\d*$/.test(value)) {
                          handleChange(e); // Only call handleChange if the input is a valid number
                        }
                      }}
                    />
                    {!!errors.projectValue && (
                      <FormHelperText className="text-red">
                        {errors.projectValue}
                      </FormHelperText>
                    )}
                  </Box>
                  <FormControl
                    sx={{
                      width: 480,
                      maxWidth: "100%",
                      marginTop: "25px",
                    }}
                    error={!!errors.expenseNature}
                  >
                    <FormLabel
                      className="font-medium text-14"
                      component="legend"
                    >
                      Expense nature*
                    </FormLabel>
                    <Select
                      variant="outlined"
                      name="expenseNature"
                      onChange={handleChange}
                      value={documentState.expenseNature}
                    >
                      {expenseNature.map((option) => (
                        <MenuItem key={option.id} value={option.value}>
                          {option.text}
                        </MenuItem>
                      ))}
                    </Select>
                    {!!errors.expenseNature && (
                      <FormHelperText>{errors.expenseNature}</FormHelperText>
                    )}
                  </FormControl>
                </div>
                <div
                  style={{ marginTop: "0" }}
                  className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-24 w-full custom_margin"
                >
                  <FormControl
                    sx={{
                      width: 480,
                      maxWidth: "100%",
                      marginTop: "25px",
                    }}
                  >
                    <FormLabel
                      className="font-medium text-14"
                      component="legend"
                      error={!!errors.expenseType}
                    >
                      Expense Type*
                    </FormLabel>
                    <Select
                      variant="outlined"
                      name="expenseType"
                      onChange={handleChange}
                      value={documentState.expenseType}
                    >
                      {expenseType.map((option) => (
                        <MenuItem key={option.id} value={option.value}>
                          {option.text}
                        </MenuItem>
                      ))}
                    </Select>
                    {!!errors.expenseType && (
                      <FormHelperText>{errors.expenseType}</FormHelperText>
                    )}
                  </FormControl>
                  <FormControl
                    sx={{
                      width: 480,
                      maxWidth: "100%",
                      marginTop: "25px",
                    }}
                  >
                    <FormLabel
                      className="font-medium text-14"
                      component="legend"
                      error={!!errors.purchaseCategory}
                    >
                      Purchase Category nature*
                    </FormLabel>
                    <Select
                      variant="outlined"
                      name="purchaseCategory"
                      value={documentState.purchaseCategory}
                      onChange={handleChange}
                    >
                      {purchaseCat.map((option) => (
                        <MenuItem key={option.id} value={option.value}>
                          {option.text}
                        </MenuItem>
                      ))}
                    </Select>
                    {!!errors.purchaseCategory && (
                      <FormHelperText>{errors.purchaseCategory}</FormHelperText>
                    )}
                  </FormControl>
                </div>
                <div
                  className="mt-25px"
                  style={{ borderTopWidth: "2px" }}
                ></div>
                <div
                  style={{ marginTop: "0" }}
                  className="grid grid-cols-1 gap-24 w-full custom_margin"
                >
                  <Box
                    sx={{
                      display: "flex",
                      flexDirection: "column",
                      marginTop: "25px",
                    }}
                  >
                    <FormControl
                      fullWidth
                      sx={{ m: 1 }}
                      error={!!errors.projectName}
                    >
                      <InputLabel htmlFor="projectName">
                        Project Name *
                      </InputLabel>
                      <OutlinedInput
                        id="projectName"
                        name="projectName"
                        value={documentState.projectName}
                        onChange={handleChange}
                        label="Project Name *"
                      />
                      {!!errors.projectName && (
                        <FormHelperText>{errors.projectName}</FormHelperText>
                      )}
                    </FormControl>
                  </Box>
                  <Box
                    sx={{
                      display: "flex",
                      flexDirection: "column",
                      // marginTop: "25px",
                    }}
                  >
                    <FormControl
                      fullWidth
                      sx={{ m: 1 }}
                      error={!!errors.projectDescription}
                    >
                      <InputLabel htmlFor="projectDescription">
                        Project Description *
                      </InputLabel>
                      <OutlinedInput
                        id="projectDescription"
                        name="projectDescription"
                        value={documentState.projectDescription}
                        onChange={handleChange}
                        label="Project Description *"
                        multiline
                        rows={4}
                      />
                      {!!errors.projectDescription && (
                        <FormHelperText>
                          {errors.projectDescription}
                        </FormHelperText>
                      )}
                    </FormControl>
                  </Box>
                </div>

                <div
                  className="mt-25px"
                  style={{ borderTopWidth: "2px", marginBottom: "20px" }}
                ></div>
                <div className="flex justify-between">
                  <div
                    className="flex items-center mt-24 sm:mt-0 sm:mx-8 space-x-12"
                    style={{ marginTop: "15px" }}
                  >
                    <StyledBadge
                      badgeContent={
                        listDocument?.length
                        // ? listDocument.length : CountApprove
                      }
                    >
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
                            heroicons-solid:upload
                          </FuseSvgIcon>
                        }
                        onClick={handleOpenDocModal}
                      >
                        Document
                      </Button>
                    </StyledBadge>
                  </div>
                  <div
                    className="flex items-center mt-24 sm:mt-0 sm:mx-8 space-x-12"
                    style={{ marginTop: "15px" }}
                  >
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
                    <Button
                      className="whitespace-nowrap"
                      variant="contained"
                      color="secondary"
                      style={{ padding: "15px" }}
                      onClick={handleOpen}
                    >
                      Submit for Approval
                    </Button>

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

                    <DeleteModal
                      openDelete={deletes}
                      handleCloseDelete={handleCloseDelete}
                      title=""
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
                    </DeleteModal>
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

export default AssetRequest;
