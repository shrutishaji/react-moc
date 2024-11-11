import { Box, Button, Icon, Paper, Popover, Typography } from "@mui/material";
import InfoSection from "./InfoSection";
import RiskSection from "./RiskSection";
import ControlMeasures from "./ControlMeasures";
import TaskApprovalHistory from "./TaskAppovalHistory";
import ButtonRisk from "../../common/Button";
import { useState } from "react";
import SendForRevision from "./SendForRevision";
import AddComment from "./AddComment";
import { TaskPopupType } from "../../helpers/enum";
import VersionHistory from "./VersionHistory";
interface RiskItemProps {
  label: string;
  value: string;
}

const priskItems: RiskItemProps[] = [
  { label: "Time", value: "10" },
  { label: "Frequency", value: "<day" },
  { label: "Frequency Scoring", value: "10" },
  { label: "Likelyhood Scoring", value: "23" },
  { label: "Severity Scoring", value: "12" },
];

const rriskItems: RiskItemProps[] = [
  { label: "Time", value: "20" },
  { label: "Frequency", value: "<week" },
  { label: "Frequency Scoring", value: "14" },
  { label: "Likelyhood Scoring", value: "23" },
  { label: "Severity Scoring", value: "15" },
];
const TaskDetailsCard = () => {
  const [anchorEl, setAnchorEl] = useState<HTMLButtonElement | null>(null);
  const [openRevision, setOpenRevision] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [isVersionOpen, setIsVersionOpen] = useState(false);
  const [popupType, setPopupType] = useState(0);
  const handleRevision = () => {
    setOpenRevision(!openRevision);
  };

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const open = Boolean(anchorEl);
  const id = open ? "simple-popover" : undefined;

  return (
    <Paper className="flex flex-col p-10 mt-10">
      <header className="flex gap-10 mb-10 justify-between items-center w-full">
        <h2 className="text-base font-semibold text-zinc-800">
          {"CMS009327"}:
        </h2>
        <div className="flex gap-10">
          <button
            aria-describedby={id}
            onClick={handleClick}
            className="flex gap-2 w-full items-center mb-4 self-stretch px-10 py-5 my-auto text-sm font-medium text-blue-700 whitespace-nowrap rounded bg-blue-700 bg-opacity-10"
          >
            <Icon>menu</Icon>
            <span className="ml-4 self-stretch my-auto">Actions</span>
          </button>
          <Popover
            id={id}
            open={open}
            anchorEl={anchorEl}
            onClose={handleClose}
            anchorOrigin={{
              vertical: "bottom",
              horizontal: "left",
            }}
          >
            <Typography className="p-5">
              <button
                onClick={() => {
                  setIsOpen(true);
                  setPopupType(TaskPopupType.Audit);
                }}
                className="flex gap-2  w-full mb-4 mt-5 items-center self-stretch px-10 py-5 my-auto text-sm font-medium text-blue-700 whitespace-nowrap rounded bg-blue-700 bg-opacity-10"
              >
                <Icon>add</Icon>
                <span className="ml-4 self-stretch my-auto">Audits</span>
              </button>
              <button className="flex gap-2 w-full items-center mb-4 self-stretch px-10 py-5 my-auto text-sm font-medium text-blue-700 whitespace-nowrap rounded bg-blue-700 bg-opacity-10">
                <Icon>edit</Icon>
                <span className="ml-4 self-stretch my-auto">Edit</span>
              </button>
              <button
                onClick={() => {
                  setIsOpen(true);
                  setPopupType(TaskPopupType.Delete);
                }}
                className="flex gap-2 w-full items-center mb-4 self-stretch px-10 py-5 my-auto text-sm font-medium text-blue-700 whitespace-nowrap rounded bg-blue-700 bg-opacity-10"
              >
                <Icon>delete</Icon>
                <span className="ml-4 self-stretch my-auto">Delete</span>
              </button>
              <button
                onClick={() => setIsVersionOpen(true)}
                className="flex gap-2 w-full items-center mb-4 self-stretch px-10 py-5 my-auto text-sm font-medium text-blue-700 whitespace-nowrap rounded bg-blue-700 bg-opacity-10"
              >
                <Icon>history</Icon>
                <span className="self-stretch my-auto">Versions</span>
              </button>
            </Typography>
          </Popover>
          <VersionHistory isOpen={isVersionOpen} setIsOpen={setIsVersionOpen} />
        </div>
      </header>
      <hr className="w-full border border-solid border-neutral-200" />
      <article
        className="flex flex-col px-6 bg-white rounded-lg"
        style={{ maxHeight: "75vh", overflowY: "auto" }}
      >
        <div className="flex flex-col mt-5">
          <InfoSection />
          <RiskSection riskItems={priskItems} title="Potential Risk" />
          <hr className="mt-8 w-full border border-solid border-neutral-200" />
          <RiskSection riskItems={rriskItems} title="Residual Risk" />
          <hr className="mt-8 w-full border border-solid border-neutral-200" />
          <ControlMeasures />

          <hr className="mt-8 w-full border border-solid border-neutral-200" />
          <TaskApprovalHistory />
        </div>
      </article>
      <div className="px-20 flex flex-row justify-center gap-10 mt-20">
        <ButtonRisk onClick={handleRevision} variant="reject" type="button">
          Send For Revision
        </ButtonRisk>
        <SendForRevision
          openRevision={openRevision}
          handleRevision={handleRevision}
        />
        <ButtonRisk
          onClick={() => {
            setIsOpen(true);
            setPopupType(TaskPopupType.Approve);
          }}
          variant="approve"
          type="button"
        >
          Approve
        </ButtonRisk>
        <AddComment
          openComment={isOpen}
          handleComment={() => setIsOpen(false)}
          popupType={popupType}
        />
      </div>
    </Paper>
  );
};
export default TaskDetailsCard;
