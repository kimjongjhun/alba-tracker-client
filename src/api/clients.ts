import axios from "axios";
import { Client } from "../types/clients";
import { url } from ".";

const getAllClients = async (): Promise<Client[]> => {
  return await axios({
    method: "get",
    url: `${url}/clients/all`,
  }).then((res) => {
    return res.data.data;
  });
};

export default getAllClients;
