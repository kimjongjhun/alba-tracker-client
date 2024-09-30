import Grid from "@mui/material/Grid2";
import Paper from "@mui/material/Paper";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableFooter from "@mui/material/TableFooter";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";

import InputEntry from "../InputEntry/InputEntry";

const EntriesTable = () => {
  const tableHeaders = [
    "Date",
    "Client",
    "Start",
    "End",
    "Number of Hours",
    "Location",
    "Actions",
  ];

  const RenderTableHeaders = () => {
    return tableHeaders.map((header) => {
      return <TableCell key={header}>{header}</TableCell>;
    });
  };

  return (
    <Grid container spacing={1}>
      <Grid size={{ xs: 12, md: 8 }} offset={{ xs: 0, md: 2 }}>
        <TableContainer component={Paper}>
          <Table size={"small"}>
            <TableHead>
              <TableRow>
                <RenderTableHeaders />
              </TableRow>
            </TableHead>
            <TableBody>
              <InputEntry />
              <TableRow></TableRow>
            </TableBody>
            <TableFooter>
              <TableRow></TableRow>
            </TableFooter>
          </Table>
        </TableContainer>
      </Grid>
    </Grid>
  );
};

export default EntriesTable;
