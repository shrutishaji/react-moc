import Breadcrumbs from "@mui/material/Breadcrumbs";
import { Link, useLocation, useNavigate, useParams } from "react-router-dom";
import Typography from "@mui/material/Typography";
import FuseSvgIcon from "@fuse/core/FuseSvgIcon";
import { Button } from "@mui/material";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import { useState } from "react";
import Test from "./Test";

interface MocHeaderProps {
  activity?: string;
  reqno?: string;
  risk?: string;
  master?: string;
  type?: string;
  nothing?: string;
  verName?: string;
  name?: string;
  sidemenu?: boolean;
  setLeftSidebarOpen: (open: boolean) => void;
  leftSidebarOpen: boolean;
}

function RiskHeader(props: MocHeaderProps) {
  const {
    activity,
    reqno,
    risk,
    master,
    type,
    nothing,
    verName,
    name,
    sidemenu,
    setLeftSidebarOpen,
    leftSidebarOpen,
  } = props;
  const routeParams = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const path = location.pathname;

  const urlContainsMocOrRisk = path === "/moc" || path === "/risk";
  const [anchorEl, setAnchorEl] = useState<HTMLButtonElement | null>(null);

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleOpenNewDoc = () => {
    navigate("/moc/activity");
  };
  const handleOpenNewAsset = () => {
    navigate("/moc/assetactivity");
  };
  const handleOpenNewOrg = () => {
    navigate("/moc/orgactivity");
  };
  const handleNavigate = (type: string) => {
    let path = "/risk/transportactivity";
    switch (type) {
      case "Transport":
        path = "/risk/transportactivity";
        break;
      case "Routine":
        path = "/risk/routineactivity";
        break;
      case "NonRoutine":
        path = "/risk/nonroutineactivity";
        break;
      default:
        path = "/risk/transportactivity";
    }
    navigate(path);
  };

  const handelOpenSide = () => {
    setLeftSidebarOpen(!leftSidebarOpen);
  };

  return (
    <div
      className="flex d-sm-block flex-1 w-full items-center justify-between py-8 sm:px-10"
      style={{
        backgroundColor: Object.keys(routeParams).length !== 0 ? "" : "",
      }}
    >
      <div>
        <Breadcrumbs
          separator={<FuseSvgIcon>heroicons-solid:chevron-right</FuseSvgIcon>}
          aria-label="breadcrumb"
        >
          <Link
            className="font-medium hover:underline text-blue"
            key="1"
            color="inherit"
            to="/risk"
            style={{ textDecoration: "none" }}
          >
            Home
          </Link>
          {nothing !== "nothing" && (
            <Link
              className="font-medium text-black"
              key="2"
              to="#"
              style={{ textDecoration: "none" }}
            >
              {risk === "risk"
                ? "Risk Request"
                : master
                  ? master
                  : "MOC Requests"}
            </Link>
          )}
          {type && (
            <Typography className="font-medium" key="3" color="text.primary">
              {type}
            </Typography>
          )}
          {reqno && (
            <Typography className="font-medium" key="4" color="text.primary">
              {reqno}
            </Typography>
          )}
          {activity && (
            <Typography className="font-medium" key="5" color="text.primary">
              {activity} (v{verName})
            </Typography>
          )}
        </Breadcrumbs>

        {/* Title section */}
        {name && (
          <Typography variant="h6" className="mt-4 font-bold">
            {name}
          </Typography>
        )}

        <div className="flex sm:hidden" />
      </div>
    </div>
  );
}

export default RiskHeader;
