import FusePageSimple from "@fuse/core/FusePageSimple";
import FuseSvgIcon from "@fuse/core/FuseSvgIcon";
import { Button, FormControlLabel, InputLabel, Switch } from "@mui/material";
import React from "react";
import { useState } from "react";
import { useRef } from "react";
import Accordion from "@mui/material/Accordion";
import AccordionSummary from "@mui/material/AccordionSummary";
import AccordionDetails from "@mui/material/AccordionDetails";
import Typography from "@mui/material/Typography";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { List, ListItem, Divider } from "@mui/material";
import { useEffect } from "react";
import { apiAuth } from "src/utils/http";
import MocHeader from "../../moc/MocHeader";

const Access = () => {
  const pageLayout = useRef(null);
  const [leftSidebarOpen, setLeftSidebarOpen] = useState(true);
  const [activeRole, setActiveRole] = useState("Admin");
  const [roleList, setRoleList] = useState([]);
  const [roleIdList, setRoleIdList] = useState([]);
  const [allExpanded, setAllExpanded] = useState(false);
  const [expandedAccordions, setExpandedAccordions] = useState([]);

  const handleToggleAll = () => {
    if (allExpanded) {
      setExpandedAccordions([]);
    } else {
      const allAccordionIds = roleIdList
        .filter((item) => item.parentId === 0)
        .map((item) => item.featureId);
      setExpandedAccordions(allAccordionIds);
    }
    setAllExpanded(!allExpanded);
  };

  const handleAccordionChange = (accordionId) => {
    const currentIndex = expandedAccordions.indexOf(accordionId);
    const newExpandedAccordions = [...expandedAccordions];

    if (currentIndex === -1) {
      newExpandedAccordions.push(accordionId);
    } else {
      newExpandedAccordions.splice(currentIndex, 1);
    }

    setExpandedAccordions(newExpandedAccordions);
  };

  function getRecords() {
    apiAuth.get(`/Role/List`).then((resp) => {
      setRoleList(resp.data.data);
      apiAuth
        .get(`/RoleFeature/List?roleId=${resp.data.data[0].roleId}`)
        .then((resp) => {
          setRoleIdList(resp.data.data);
        });
    });
  }

  useEffect(() => {
    getRecords();
  }, []);

  const handelRole = (role) => {
    setActiveRole(role.name);
    apiAuth.get(`/RoleFeature/List?roleId=${role.roleId}`).then((resp) => {
      setRoleIdList(resp.data.data);
    });
  };

  const handleSwitchChange = (featureId, roleId, isActive) => {
    const updatedList = roleIdList.map((item) =>
      item.featureId === featureId ? { ...item, isActive: !isActive } : item
    );
    setRoleIdList(updatedList);

    apiAuth
      .post("/RoleFeature/Create", {
        featureId: featureId,
        roleId: roleId,
        // isActive: !isActive,
      })
      .then((response) => {
        console.log("API response:", response.data);
      });
  };
  return (
    <>
      <div
        style={{ backgroundColor: "white", borderBottom: "4px solid #ededed" }}
      >
        <MocHeader />{" "}
        <div
          style={{
            marginLeft: "30px",
            marginRight: "30px",
            marginBottom: "30px",
          }}
        >
          <div className="flex d-flex flex-col justify-between flex-wrap task_form_area sm:flex-row w-full sm:w-auto items-center space-y-16 sm:space-y-0 sm:space-x-16">
            <InputLabel
              id="category-select-label"
              style={{ fontSize: "xx-large", color: "black" }}
            >
              <b>Access</b>
            </InputLabel>
          </div>
        </div>
      </div>
      <FusePageSimple
        content={
          <div style={{ width: "100%" }}>
            <div
              style={{
                backgroundColor: "white",
                borderBottom: "4px solid #ededed",
              }}
            >
              {" "}
              <div
                style={{
                  marginLeft: "30px",
                  marginRight: "30px",
                  marginBottom: "30px",
                }}
              >
                <div className="flex d-flex pt-5 flex-col justify-between flex-wrap task_form_area sm:flex-row w-full sm:w-auto items-center space-y-16 sm:space-y-0 sm:space-x-16">
                  <InputLabel
                    id="category-select-label"
                    style={{
                      fontSize: "x-large",
                      color: "black",
                      paddingTop: "10px",
                    }}
                  >
                    <b>Feature</b>
                  </InputLabel>
                  <div
                    className="flex justify-end"
                    style={{ marginTop: "10px" }}
                  >
                    <FormControlLabel
                      control={
                        <Switch
                          checked={allExpanded}
                          onChange={handleToggleAll}
                        />
                      }
                    />
                    <span style={{ paddingTop: "8px" }}>Open All</span>
                  </div>
                </div>
              </div>
            </div>
            <div style={{ margin: "20px" }}>
              {roleIdList
                .filter((item) => item.parentId === 0)
                .map((accordionItem) => (
                  <Accordion
                    key={accordionItem.featureId}
                    style={{
                      marginTop: "15px",
                      borderRadius: "10px",
                      padding: "15px",
                    }}
                    expanded={expandedAccordions.includes(
                      accordionItem.featureId
                    )}
                    onChange={() =>
                      handleAccordionChange(accordionItem.featureId)
                    }
                  >
                    <AccordionSummary
                      expandIcon={<ExpandMoreIcon />}
                      aria-controls="panel1a-content"
                      id="panel1a-header"
                    >
                      <Typography>{accordionItem.feature}</Typography>
                    </AccordionSummary>
                    <AccordionDetails>
                      <List>
                        {roleIdList
                          .filter(
                            (item) => item.parentId === accordionItem.featureId
                          )
                          .map((detailItem) => (
                            <div key={detailItem.featureId}>
                              <ListItem>
                                <span className="sec_name">
                                  {detailItem.feature}
                                </span>
                                <FormControlLabel
                                  control={
                                    <Switch
                                      defaultChecked={detailItem.isActive}
                                      onChange={() =>
                                        handleSwitchChange(
                                          detailItem.featureId,
                                          detailItem.roleId,
                                          detailItem.isActive
                                        )
                                      }
                                    />
                                  }
                                  label=""
                                  labelPlacement="end"
                                />
                              </ListItem>
                              <Divider />
                            </div>
                          ))}
                      </List>
                    </AccordionDetails>
                  </Accordion>
                ))}
            </div>
          </div>
        }
        leftSidebarWidth={400}
        leftSidebarOpen={leftSidebarOpen}
        leftSidebarContent={
          <div style={{ backgroundColor: "white" }}>
            <div
              className="py-10"
              style={{ marginTop: "60px", marginLeft: "30px" }}
            >
              <div className="mx-6 text-3xl font-bold tracking-tighter">
                Role
              </div>
              <div style={{ marginTop: "25px" }}>
                <ul className="mx-6 mt-3 side-nav-s fuse-vertical-navigation-item-title-wrapper">
                  {roleList.map((role) => (
                    <li
                      key={role.name}
                      className={`text-lg font-semibold flex rounded-1xl fuse-vertical-navigation-item cursor-pointer p-2`}
                      onClick={() => handelRole(role)}
                      style={{
                        padding: "14px",
                        backgroundColor:
                          activeRole === role.name
                            ? "lightgray"
                            : "transparent",
                      }}
                    >
                      <span>{role.name}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        }
        scroll="content"
        ref={pageLayout}
      />
    </>
  );
};

export default Access;
