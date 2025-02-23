import Paper from "@mui/material/Paper";
import { Link, useNavigate, useParams } from "react-router-dom";
import { lighten, useTheme } from "@mui/material/styles";
import Tab from "@mui/material/Tab";
import Tabs from "@mui/material/Tabs";
import Typography from "@mui/material/Typography";
import FuseSvgIcon from "@fuse/core/FuseSvgIcon";
import { Button } from "@mui/material";
import { memo, useEffect, useState } from "react";
import ReactApexChart from "react-apexcharts";
import Box from "@mui/material/Box";
import FuseLoading from "@fuse/core/FuseLoading";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import { useGetProjectDashboardWidgetsQuery } from "../../../ProjectDashboardApi";

/**
 * The GithubIssuesWidget widget.
 */
function GithubIssuesWidget() {
  const theme = useTheme();
  const [awaitRender, setAwaitRender] = useState(true);
  const [tabValue, setTabValue] = useState(0);
  const routeParams = useParams();
  const navigate = useNavigate();

  const [anchorEl, setAnchorEl] = useState(null);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleOpenNewDoc = () => {
    navigate("/moc/activity");
  };

  const { data: widgets, isLoading } = useGetProjectDashboardWidgetsQuery();
  if (isLoading) {
    return <FuseLoading />;
  }

  if (!widgets || !widgets.githubIssues) {
    return null;
  }

  const widget = widgets.githubIssues;

  const { overview, series, ranges, labels } = widget;
  const currentRange = Object.keys(ranges)[tabValue];
  const chartOptions = {
    chart: {
      fontFamily: "inherit",
      foreColor: "inherit",
      height: "100%",
      type: "line",
      toolbar: {
        show: false,
      },
      zoom: {
        enabled: false,
      },
    },
    colors: [theme.palette.primary.main, theme.palette.secondary.main],
    labels,
    dataLabels: {
      enabled: true,
      enabledOnSeries: [0],
      background: {
        borderWidth: 0,
      },
    },
    grid: {
      borderColor: theme.palette.divider,
    },
    legend: {
      show: false,
    },
    plotOptions: {
      bar: {
        columnWidth: "50%",
      },
    },
    states: {
      hover: {
        filter: {
          type: "darken",
          value: 0.75,
        },
      },
    },
    stroke: {
      width: [3, 0],
    },
    tooltip: {
      followCursor: true,
      theme: theme.palette.mode,
    },
    xaxis: {
      axisBorder: {
        show: false,
      },
      axisTicks: {
        color: theme.palette.divider,
      },
      labels: {
        style: {
          colors: theme.palette.text.secondary,
        },
      },
      tooltip: {
        enabled: false,
      },
    },
    yaxis: {
      labels: {
        offsetX: -16,
        style: {
          colors: theme.palette.text.secondary,
        },
      },
    },
  };
  useEffect(() => {
    setAwaitRender(false);
  }, []);

  if (awaitRender) {
    return null;
  }

  return (
    <Paper className="flex flex-col flex-auto p-24 shadow rounded-2xl overflow-hidden">
      <div className="flex flex-col sm:flex-row items-start justify-between">
        <Typography className="text-lg font-medium tracking-tight leading-6 truncate">
          Decision Tree
          <div>
            <Menu
              anchorEl={anchorEl}
              open={Boolean(anchorEl)}
              onClose={handleOpenNewDoc}
            >
              <MenuItem>Technical </MenuItem>
              <MenuItem onClick={handleOpenNewDoc}>Document</MenuItem>
              <MenuItem>Organisation</MenuItem>
            </Menu>
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
        </Typography>
        <div className="mt-12 sm:mt-0 sm:ml-8">
          <Tabs
            value={tabValue}
            onChange={(ev, value) => setTabValue(value)}
            indicatorColor="secondary"
            textColor="inherit"
            variant="scrollable"
            scrollButtons={false}
            className="-mx-4 min-h-40"
            classes={{
              indicator: "flex justify-center bg-transparent w-full h-full",
            }}
            TabIndicatorProps={{
              children: (
                <Box
                  sx={{ bgcolor: "text.disabled" }}
                  className="w-full h-full rounded-full opacity-20"
                />
              ),
            }}
          >
            <Tab
              className="text-14 font-semibold min-h-40 min-w-64 mx-4 px-12"
              disableRipple
              key={0}
              label="Technical MOC"
            />
            <Tab
              className="text-14 font-semibold min-h-40 min-w-64 mx-4 px-12"
              disableRipple
              key={1}
              label="Document MOC"
            />
            <Tab
              className="text-14 font-semibold min-h-40 min-w-64 mx-4 px-12"
              disableRipple
              key={2}
              label="Organization MOC"
            />
          </Tabs>
        </div>
      </div>
      <div className="flex gap-24 w-full mt-32 justify-center">
        {tabValue === 0 ? (
          <img
            className="w-2/3 mx-auto"
            src="assets/Dashboard/mocdashboardimage2.jpg"
          />
        ) : tabValue === 1 ? (
          <img className="w-2/3 mx-auto" src="assets/Dashboard/document.png" />
        ) : (
          <img className="w-2/3 mx-auto" src="assets/Dashboard/org.png" />
        )}
      </div>
    </Paper>
  );
}

export default memo(GithubIssuesWidget);
