import Breadcrumbs from "@mui/material/Breadcrumbs";
import { Link, useNavigate, useParams } from "react-router-dom";
import Typography from "@mui/material/Typography";
import FuseSvgIcon from "@fuse/core/FuseSvgIcon";
import { Button } from "@mui/material";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import { useState } from "react";

/**
 * The DemoHeader component.
 */
function MocHeader(props) {
  const { activity, reqno } = props;
  const routeParams = useParams();
  const navigate = useNavigate();

  const [anchorEl, setAnchorEl] = useState(null);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleOpenNewDoc = () => {
    navigate("/moc/activity");
  };

  return (
    <div
      className="flex space-y-12 sm:space-y-0 flex-1 w-full items-center justify-between py-8 sm:py-16 px-16 md:px-24"
      style={{
        backgroundColor: Object.keys(routeParams).length !== 0 ? "white" : "",
      }}
    >
      <div>
        <Breadcrumbs
          separator={
            <FuseSvgIcon size={20}>heroicons-solid:chevron-right</FuseSvgIcon>
          }
          aria-label="breadcrumb"
        >
          <Link
            className="font-medium hover:underline"
            key="1"
            color="inherit"
            to="/dashboards/project"
            style={{ textDecoration: "none" }}
          >
            Home
          </Link>

          <Link
            className="font-medium"
            key="3"
            color="text.primary"
            to="/moc"
            style={{ textDecoration: "none" }}
          >
            MOC Requests
          </Link>
          {reqno && (
            <Typography className="font-medium" key="3" color="text.primary">
              {reqno}
            </Typography>
          )}

          {activity && (
            <Typography className="font-medium" key="3" color="text.primary">
              {activity}
            </Typography>
          )}

          <Menu
            anchorEl={anchorEl}
            open={Boolean(anchorEl)}
            onClose={handleOpenNewDoc}
          >
            <MenuItem>Technical </MenuItem>
            <MenuItem onClick={handleOpenNewDoc}>Document</MenuItem>
            <MenuItem>Organisation</MenuItem>
          </Menu>
        </Breadcrumbs>

        <div className="flex sm:hidden" />
      </div>
      <div style={{ justifyContent: "end" }}>
        {" "}
        {Object.keys(routeParams).length === 0 && (
          <Button
            className=""
            variant="contained"
            color="secondary"
            onClick={handleClick}
          >
            <FuseSvgIcon size={20}>heroicons-outline:plus</FuseSvgIcon>
            <span className="mx-4 sm:mx-8">Initiate New MOC Request</span>
          </Button>
        )}
      </div>
    </div>
  );
}

export default MocHeader;
