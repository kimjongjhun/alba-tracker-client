import { useState } from "react";
import { AdapterMoment } from "@mui/x-date-pickers/AdapterMoment";
import Button from "@mui/material/Button";
import ButtonGroup from "@mui/material/ButtonGroup";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import FormControl from "@mui/material/FormControl";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import MenuItem from "@mui/material/MenuItem";
import moment, { Moment } from "moment";
import Select, { SelectChangeEvent } from "@mui/material/Select";
import TableCell from "@mui/material/TableCell";
import TableRow from "@mui/material/TableRow";
import { TimePicker } from "@mui/x-date-pickers/TimePicker";

const today = moment();
const startOfDay = moment().startOf("day").add(9, "hours");
const endOfDay = moment().startOf("day").add(9, "hours").add(8, "hours");

const InputEntry = () => {
  const [date, setDate] = useState<Moment | null>(today);
  const [start, setStart] = useState<Moment | null>(startOfDay);
  const [end, setEnd] = useState<Moment | null>(endOfDay);

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
  };

  const handleClientChange = () => {};

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
            id="demo-simple-select"
            value={10}
            onChange={handleClientChange}
          >
            <MenuItem value={10}>Ten</MenuItem>
            <MenuItem value={20}>Twenty</MenuItem>
            <MenuItem value={30}>Thirty</MenuItem>
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
        <FormControl fullWidth>
          <Select id="demo-simple-select" value={10} onChange={() => {}}>
            <MenuItem value={10}>Ten</MenuItem>
            <MenuItem value={20}>Twenty</MenuItem>
            <MenuItem value={30}>Thirty</MenuItem>
          </Select>
        </FormControl>
      </TableCell>
      <TableCell>
        <ButtonGroup variant={"outlined"}>
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
