import { authRoles } from "src/app/auth";
import Location from "./Location";
import Error404Page from "src/app/main/404/Error404Page";
import { decryptFeature } from "src/app/main/sign-in/tabs/featureEncryption";

const storedFeature = decryptFeature();
const feature = storedFeature ? storedFeature : [];

const LocationConfig = {
  settings: {
    layout: {},
  },
  auth: authRoles.onlyGuest,
  routes: [
    {
      path: feature.includes("MST") ? "/masters/location" : "404",
      element: feature.includes("MST") ? <Location /> : <Error404Page />,
    },
  ],
};
export default LocationConfig;
