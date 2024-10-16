import { useState, useEffect, SetStateAction } from "react";
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
import { postNewJob } from "../../api/jobs";
import getAllLocations from "../../api/locations";
import {
  Location as LocationType,
  Client as ClientType,
} from "../../types/locations";

const InputEntry = () => {
  const today = moment();
  const startOfDay = moment().startOf("day").add(9, "hours");
  const endOfDay = moment().startOf("day").add(9, "hours").add(8, "hours");

  const [date, setDate] = useState<Moment | null>(today);
  const [start, setStart] = useState<Moment | null>(startOfDay);
  const [end, setEnd] = useState<Moment | null>(endOfDay);
  const [clientsList, setClientsList] = useState<Client[]>([]);
  const [activeClient, setActiveClient] = useState<number | "">("");
  const [locationsList, setLocationsList] = useState<LocationInfo[]>([]);
  const [activeLocation, setActiveLocation] = useState<number | "">("");
  const [saveDisabled, setSaveDisabled] = useState<boolean>(true);
  const [duration, setDuration] = useState<number>(0);
  const [fullLocationsList, setFullLocationsList] = useState<LocationType[]>(
    []
  );

  useEffect(() => {
    async function getClients() {
      const clients = await getAllClients();
      setClientsList(clients);
    }
    async function getLocations() {
      const locations = await getAllLocations();
      setFullLocationsList(locations);
    }

    getClients();
    getLocations();
  }, []);

  useEffect(() => {
    handleSaveDisabled();
  }, [start, end, activeClient, activeLocation]);

  useEffect(() => {
    setStart(
      startOfDay
        ?.date(date?.date() as number)
        ?.month(date?.month() as number)
        ?.year(date?.year() as number) as SetStateAction<moment.Moment | null>
    );

    setEnd(
      endOfDay
        ?.date(date?.date() as number)
        ?.month(date?.month() as number)
        ?.year(date?.year() as number) as SetStateAction<moment.Moment | null>
    );
  }, [date]);

  useEffect(() => {
    setDuration(moment.duration(end?.diff(start)).asHours());
  }, [start, end]);

  useEffect(() => {
    if (activeClient !== "") {
      const filteredLocationsList = fullLocationsList.filter(
        (location: LocationType) => {
          return location.clients.some(
            (client: ClientType) =>
              client.id === clientsList[activeClient].id && client.active
          );
        }
      );

      setLocationsList(filteredLocationsList);
    } else {
      setLocationsList([]);
    }
  }, [activeClient]);

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

  const handleSaveClick = () => {
    const activeClientObject = clientsList[activeClient as number];
    const activeLocationObject = locationsList[activeLocation as number];

    postNewJob({
      date,
      start,
      end,
      duration,
      client: { id: activeClientObject.id, name: activeClientObject.name },
      location: {
        id: activeLocationObject.id,
        name: activeLocationObject.name,
      },
    });
  };

  const handleClientChange = (event: SelectChangeEvent) => {
    setActiveLocation("");
    const selectedClient = event.target.value as unknown as number;

    setActiveClient(selectedClient);
    setLocationsList(clientsList[selectedClient]?.locationInfo);
  };

  const handleLocationChange = (event: SelectChangeEvent) => {
    setActiveLocation(event.target.value as unknown as number);
  };

  const handleSaveDisabled = () => {
    let tempDisabled = false;

    tempDisabled = [
      end?.isBefore(start),
      activeClient === "",
      activeLocation === "",
    ].includes(true);

    setSaveDisabled(tempDisabled);
  };

  const RenderMenuOptions = (optionsList: Client[] | LocationInfo[]) => {
    const options = optionsList
      .filter((option) => option.active)
      .map((option: LocationInfo | Client, index: number) => {
        return (
          <MenuItem key={`${option.name}-${index}`} value={index}>
            {option.name}
          </MenuItem>
        );
      });

    options.unshift(
      <MenuItem value={""}>
        <em>None</em>
      </MenuItem>
    );

    return options;
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
          value={duration}
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
          <Button disabled={saveDisabled} onClick={handleSaveClick}>
            Save
          </Button>
        </ButtonGroup>
      </TableCell>
    </TableRow>
  );
};

export default InputEntry;
