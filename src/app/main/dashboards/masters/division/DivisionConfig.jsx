import { authRoles } from "src/app/auth";
import Division from "./Division";
import Error404Page from "src/app/main/404/Error404Page";

const storedFeature = localStorage.getItem("features");
const feature = storedFeature ? storedFeature : [];

const DivisionConfig = {
  settings: {
    layout: {},
  },
  auth: authRoles.onlyGuest,
  routes: [
    {
      path: feature.includes("MST") ? "/masters/division" : "404",
      element: feature.includes("MST") ? <Division /> : <Error404Page />,
    },
  ],
};
export default DivisionConfig;
