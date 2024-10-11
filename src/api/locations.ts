import axios from "axios";
import { Location } from "../types/locations";
import { url } from ".";

const getAllLocations = async (): Promise<Location[]> => {
  const fullLocationsList = await axios({
    method: "get",
    url: `${url}/locations/all`,
  }).then((res) => {
    return res.data.data;
  });

  return fullLocationsList;
};

export default getAllLocations;
