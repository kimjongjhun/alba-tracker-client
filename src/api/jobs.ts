import axios from "axios";
import { url } from ".";
import { Moment } from "moment";

interface newJobDetails {
  date: Moment | null;
  start: Moment | null;
  end: Moment | null;
  duration: number;
  client: clientDetails;
  location: locationDetails;
}

interface clientDetails {
  id: string;
  name: string;
}

interface locationDetails {
  id: string;
  name: string;
}

const postNewJob = async (newJob: newJobDetails) => {
  return await axios({
    method: "post",
    url: `${url}/jobs/new`,
    data: newJob,
  }).then((res) => {
    return res.data.data;
  });
};

export { postNewJob };
