import { authRoles } from "src/app/auth";
import RiskMatrix from "./RiskMatrix";
import Error404Page from "src/app/main/404/Error404Page";

const storedFeature = localStorage.getItem("features");
const feature = storedFeature ? storedFeature : [];

const RiskMatrixConfig = {
  settings: {
    layout: {},
  },
  auth: authRoles.onlyGuest,
  routes: [
    {
      path: feature.includes("MST") ? "/masters/riskmatrix" : "404",
      element: feature.includes("MST") ? <RiskMatrix /> : <Error404Page />,
    },
  ],
};
export default RiskMatrixConfig;
