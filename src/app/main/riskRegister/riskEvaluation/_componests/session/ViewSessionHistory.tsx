import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Avatar,
  Box,
  Card,
  CardContent,
  CardHeader,
  Chip,
  Icon,
  Popper,
  Typography,
} from "@mui/material";
import CommonModal from "../../../common/CommonModal";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { SessionList } from "../../../helpers/type";
import {
  SessionRequestStatus,
  SessionStatusDisplayNames,
} from "../../../helpers/enum";
import dayjs from "dayjs";
import React from "react";

const ViewSessionHistory = ({
  open,
  handleClose,
  sessionList,
}: {
  open: boolean;
  handleClose: () => void;
  sessionList: SessionList[];
}) => {
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  //   console.log(sessionList, "sessionList");
  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(anchorEl ? null : event.currentTarget);
  };
  const sessionLength = sessionList.length;
  const sessionListordered = [...sessionList].reverse();
  const popopen = Boolean(anchorEl);
  const id = popopen ? "simple-popper" : undefined;
  return (
    <CommonModal title="Session History" open={open} handleClose={handleClose}>
      <div>
        {sessionListordered.map((session, index) => (
          <Accordion defaultExpanded={index === 0}>
            <AccordionSummary
              expandIcon={<ExpandMoreIcon />}
              aria-controls="panel1-content"
              id="panel1-header"
              sx={{ backgroundColor: "#f5f5f5" }}
            >
              <div className="flex flex-row w-full justify-between">
                <Typography className="font-medium">
                  Session {sessionLength - index}
                </Typography>
                {session.isActive && (
                  <Chip
                    size="small"
                    className="px-10"
                    //   variant="outlined"
                    color="info"
                    label={SessionStatusDisplayNames[session.status]}
                  />
                )}
                {session.isExpired && (
                  <Chip
                    size="small"
                    className="px-10"
                    //   variant="outlined"
                    color="error"
                    label="Expired"
                  />
                )}
                {session.isSessionEnded && (
                  <Chip
                    size="small"
                    className="px-10"
                    //   variant="outlined"
                    color="success"
                    label="Session Ended"
                  />
                )}
              </div>
              <span className="font-normal text-sm">
                Started by {session.startedByStaffName} on{" "}
                {dayjs(session.startedAt).format("MMM DD, YYYY HH:mm")}
              </span>
            </AccordionSummary>
            <AccordionDetails>
              <div className="grid grid-cols-1 sm:grid-cols-2">
                {session.teamList.map((team, index) => (
                  <Card className="shadow-0">
                    <CardHeader
                      avatar={
                        <Icon fontSize="large" className="text-blue-500">
                          person
                        </Icon>
                      }
                      title={
                        <div>
                          {team.staffName}
                          {team.comments && (
                            <>
                              <Icon
                                className="text-blue-700 ml-10 text-lg cursor-pointer"
                                aria-describedby={
                                  team.staffId.toString() +
                                  session.id.toString()
                                }
                                onClick={handleClick}
                              >
                                chat
                              </Icon>

                              <Popper
                                id={
                                  team.staffId.toString() +
                                  session.id.toString()
                                }
                                open={popopen}
                                anchorEl={anchorEl}
                              >
                                <Box
                                  sx={{
                                    border: 1,
                                    p: 1,
                                    bgcolor: "background.paper",
                                  }}
                                >
                                  <p className="text-gray-800 text-sm font-normal">
                                    {team.comments}
                                  </p>
                                </Box>
                              </Popper>
                            </>
                          )}
                        </div>
                      }
                      subheader={
                        <div>
                          {SessionRequestStatus[team.approvalStatus]}
                          {team.updatedAt && (
                            <span>
                              {" "}
                              on{" "}
                              {dayjs(team.updatedAt).format(
                                "MMM DD, YYYY HH:mm"
                              )}
                            </span>
                          )}
                        </div>
                      }
                    />
                    {session.isSessionEnded && (
                      <CardContent>
                        <div className="flex flex-row font-normal text-md mx-10">
                          <span className="text-gray-500 mr-2 font-medium">
                            Session ending comment:
                          </span>
                          {session.comments}
                        </div>
                        <div className="font-normal  text-sm mx-10">
                          Session ended on{" "}
                          {dayjs(session.endedAt).format("MMM DD, YYYY HH:mm")}
                        </div>
                      </CardContent>
                    )}
                  </Card>
                ))}
              </div>
            </AccordionDetails>
          </Accordion>
        ))}
      </div>
    </CommonModal>
  );
};

export default ViewSessionHistory;
