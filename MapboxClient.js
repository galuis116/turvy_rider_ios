import MapboxDirectionsFactory from "@mapbox/mapbox-sdk/services/directions";

//import config from './utils/config';

const clientOptions = {
  accessToken:
    "sk.eyJ1IjoiamttaWxsYSIsImEiOiJjbGlzM3JtMmswczN5M2NxdmR2cDB3bTNuIn0.vBo7vBXjCnpxsyHAwe4jZw",
};
const directionsClient = MapboxDirectionsFactory(clientOptions);

export { directionsClient };
