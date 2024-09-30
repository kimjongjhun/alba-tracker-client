import { useState, useEffect } from "react";
import { AdapterMoment } from "@mui/x-date-pickers/AdapterMoment";
import Button from "@mui/material/Button";
import ButtonGroup from "@mui/material/ButtonGroup";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import FormControl from "@mui/material/FormControl";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import MenuItem from "@mui/material/MenuItem";
import moment, { Moment } from "moment";
import { InputAdornment, OutlinedInput } from "@mui/material";
import Select, { SelectChangeEvent } from "@mui/material/Select";
import TableCell from "@mui/material/TableCell";
import TableRow from "@mui/material/TableRow";
import { TimePicker } from "@mui/x-date-pickers/TimePicker";
import getAllClients from "../../api/clients";
import { Client, LocationInfo } from "../../types/clients";

const today = moment();
const startOfDay = moment().startOf("day").add(9, "hours");
const endOfDay = moment().startOf("day").add(9, "hours").add(8, "hours");

const InputEntry = () => {
  const [date, setDate] = useState<Moment | null>(today);
  const [start, setStart] = useState<Moment | null>(startOfDay);
  const [end, setEnd] = useState<Moment | null>(endOfDay);
  const [clientsList, setClientsList] = useState<Client[]>([]);
  const [activeClient, setActiveClient] = useState<number | "">("");
  const [locationsList, setLocationsList] = useState<LocationInfo[] | "">("");
  const [activeLocation, setActiveLocation] = useState<number | "">("");

  useEffect(() => {
    async function getClients() {
      const clients = await getAllClients();
      setClientsList(clients);
    }

    getClients();
  }, []);

  const handleDateChange = (newDate: Moment | null) => {
    setDate(newDate);
  };

  const handleHoursChange = ({
    time,
    type,
  }: {
    time: Moment | null;
    type: string;
  }) => {
    switch (type) {
      case "start":
        setStart(time);
        break;

      default:
        setEnd(time);
        break;
    }
  };

  const handleOnResetClick = () => {
    setDate(today);
    setStart(startOfDay);
    setEnd(endOfDay);
    setActiveClient("");
    setActiveLocation("");
  };

  const handleClientChange = (event: SelectChangeEvent) => {
    setActiveLocation("");
    const selectedClient = event.target.value as unknown as number;

    setActiveClient(selectedClient);
    setLocationsList(clientsList[selectedClient].locationInfo);
  };

  const handleLocationChange = (event: SelectChangeEvent) => {
    setActiveLocation(event.target.value as unknown as number);
  };

  const RenderMenuOptions = (optionsList: Client[] | LocationInfo[]) => {
    return optionsList
      .filter((option) => option.active)
      .map((option: LocationInfo | Client, index: number) => {
        return (
          <MenuItem key={`${option.name}-${index}`} value={index}>
            {option.name}
          </MenuItem>
        );
      });
  };

  return (
    <TableRow>
      <TableCell>
        <LocalizationProvider dateAdapter={AdapterMoment}>
          <DatePicker value={date} onChange={handleDateChange} />
        </LocalizationProvider>
      </TableCell>
      <TableCell>
        <FormControl fullWidth>
          <Select
            value={activeClient as unknown as string}
            onChange={handleClientChange}
          >
            {clientsList && RenderMenuOptions(clientsList)}
          </Select>
        </FormControl>
      </TableCell>
      <TableCell>
        <LocalizationProvider dateAdapter={AdapterMoment}>
          <TimePicker
            onChange={(time) => handleHoursChange({ time, type: "start" })}
            format="hh:mm a"
            value={start}
          />
        </LocalizationProvider>
      </TableCell>
      <TableCell>
        <LocalizationProvider dateAdapter={AdapterMoment}>
          <TimePicker
            onChange={(time) => handleHoursChange({ time, type: "end" })}
            format="hh:mm a"
            value={end}
          />
        </LocalizationProvider>
      </TableCell>
      <TableCell>
        <OutlinedInput
          endAdornment={<InputAdornment position={"end"}>hrs</InputAdornment>}
          value={moment.duration(end?.diff(start)).asHours()}
        />
      </TableCell>
      <TableCell>
        <FormControl fullWidth>
          <Select
            value={activeLocation as unknown as string}
            onChange={handleLocationChange}
          >
            {locationsList && RenderMenuOptions(locationsList)}
          </Select>
        </FormControl>
      </TableCell>
      <TableCell>
        <ButtonGroup variant={"outlined"} size={"large"}>
          <Button onClick={handleOnResetClick} color={"error"}>
            Reset
          </Button>
          <Button disabled={end?.isBefore(start)}>Save</Button>
        </ButtonGroup>
      </TableCell>
    </TableRow>
  );
};

export default InputEntry;
