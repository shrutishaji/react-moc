import * as React from "react";
import Box from "@mui/material/Box";
import Drawer from "@mui/material/Drawer";
import Divider from "@mui/material/Divider";
import Button from "../../../../../common/Button";
import {
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  SelectChangeEvent,
} from "@mui/material";
import Tab from "@mui/material/Tab";
import Tabs from "@mui/material/Tabs";

import create from "zustand";
import { SeverityRatingTable } from "./SeverityRatingTable";
import { PotentialRatingTable } from "./PotentialRating";
import { ResidualRatingTable } from "./ResidualRating";
// import Noise from "./severity/Noise";
// import TableComponent from "./TableComponent";

interface SubCategoryState {
  subCategory: string;
  setSubCategory: (subCategory: string) => void;
}

export const useSubCategoryStore = create<SubCategoryState>((set) => ({
  subCategory: subCategoryList.health,
  setSubCategory: (subCategory) => set({ subCategory }),
}));

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

enum hazardTypeList {
  "ChemicalRisk" = "ChemicalRisk",
  "ChronicPhysicalRisk" = "ChronicPhysicalRisk",
  "ShortTermPhysicalRisk" = "ShortTermPhysicalRisk",
  "BiologicalRisk" = "BiologicalRisk",
  "ErgonomicRisk" = "ErgonomicRisk",
  "PsychoSocialRisk" = "PsychoSocialRisk",
  "AccidentalPhysicalRisk" = "AccidentalPhysicalRisk",
}

export enum subCategoryList {
  "health" = "health",
  "safety" = "safety",
}

const displaySubCategory = {
  [subCategoryList.health]:
    "Qualitative assessment of the chemical risks to health",
  [subCategoryList.safety]:
    "Qualitative assessment of the chemical risks to safety",
};

function CustomTabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
    </div>
  );
}

function a11yProps(index: number) {
  return {
    id: `simple-tab-${index}`,
    "aria-controls": `simple-tabpanel-${index}`,
  };
}
export default function TemporaryDrawer({
  hazardType,
}: {
  hazardType: string;
}) {
  const [open, setOpen] = React.useState(false);
  const [severityRating, setSeverityRating] = React.useState<number | null>(null);
  const [potentialRating, setPotentialRating] = React.useState<number | null>(null);
  const [residualRating, setResidualRating] = React.useState<number | null>(null);

  const toggleDrawer = (newOpen: boolean) => () => {
    setOpen(newOpen);
  };

  return (
    <div>
      <Button variant="approve" type="button" onClick={toggleDrawer(true)}>
        View Rating Calculator
      </Button>
      <Drawer anchor="right" open={open} onClose={toggleDrawer(false)}>
        <DrawerList 
          toggleDrawer={toggleDrawer} 
          hazardType={hazardType}
          severityRating={severityRating}
          setSeverityRating={setSeverityRating}
          potentialRating={potentialRating}
          setPotentialRating={setPotentialRating}
          residualRating={residualRating}
          setResidualRating={setResidualRating}
        />
      </Drawer>
    </div>
  );
}

const DrawerList = ({
  toggleDrawer,
  hazardType,
  severityRating,
  setSeverityRating,
  potentialRating,
  setPotentialRating,
  residualRating,
  setResidualRating,
}: {
  toggleDrawer: (newOpen: boolean) => () => void;
  hazardType: string;
  severityRating: number | null;
  setSeverityRating: (rating: number | null) => void;
  potentialRating: number | null;
  setPotentialRating: (rating: number | null) => void;
  residualRating: number | null;
  setResidualRating: (rating: number | null) => void;
}) => {
  const [value, setValue] = React.useState(0);
  const { subCategory, setSubCategory } = useSubCategoryStore();

  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    setValue(newValue);
  };

  const handleSubCategoryChange = (event: SelectChangeEvent<string>) => {
    setSubCategory(event.target.value as string);
  };

  return (
    <Box sx={{ width: 800 }} className="p-10" role="presentation">
      <h2 className="bg-blue-500 text-white py-10 px-5">
        Assessment of {hazardType}
      </h2>
      <Divider />
      <FormControl fullWidth margin="normal">
        <InputLabel id="subCategory-label">Subcategory</InputLabel>
        <Select
          labelId="subCategory-label"
          value={subCategory}
          onChange={handleSubCategoryChange}
          label="Subcategory"
        >
          {Object.entries(subCategoryList).map(([key, value]) => (
            <MenuItem key={key} value={key}>
              {displaySubCategory[value]}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
      <Tabs
        value={value}
        onChange={handleChange}
        indicatorColor="secondary"
        textColor="inherit"
        variant="scrollable"
        scrollButtons={false}
        aria-label="basic tabs example"
        className="w-full mt-10 px-10 -mx-4 min-h-40 mb-10"
        classes={{
          indicator:
            "flex justify-center bg-transparent border-b-3 border-red-500 w-full h-full",
        }}
      >
        <Tab label="Severity rating G" {...a11yProps(0)} />
        <Tab
          label="Potential exposure probability rating P"
          {...a11yProps(1)}
        />
        <Tab
          label="Residual potential exposure probability rating P’"
          {...a11yProps(2)}
        />
      </Tabs>
      <CustomTabPanel value={value} index={0}>
        <SeverityRatingTable severityRating={severityRating} setSeverityRating={setSeverityRating} />
      </CustomTabPanel>
      <CustomTabPanel value={value} index={1}>
        <PotentialRatingTable potentialRating={potentialRating} setPotentialRating={setPotentialRating} />
      </CustomTabPanel>
      <CustomTabPanel value={value} index={2}>
        <ResidualRatingTable residualRating={residualRating} setResidualRating={setResidualRating} />
      </CustomTabPanel>
    </Box>
  );
};
