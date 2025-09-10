import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from "@mui/material";
import Paper from "@mui/material/Paper";
import { SizeChart } from "../../interfaces/ProductInterface";

export default function SizeChartModal({
  sizeChart,
}: {
  sizeChart: SizeChart[];
}) {
  console.log("sizeChart", sizeChart);
  return (
    <div>
      <div>
        <TableContainer component={Paper}>
          <Table sx={{ width: "100%" }} aria-label="simple table">
            <TableHead>
              <TableRow>
                <TableCell>Title</TableCell>
                <TableCell>XS</TableCell>
                <TableCell>S</TableCell>
                <TableCell>M</TableCell>
                <TableCell>L</TableCell>
                <TableCell>XL</TableCell>
                <TableCell>XXL</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {sizeChart.map((row, index) => (
                  <TableRow
                    key={index}
                    sx={{
                      "&:last-child td, &:last-child th": { border: 0 },
                    }}
                  >
                    <TableCell component="th" scope="row">
                        {row.title}
                    </TableCell>
                    <TableCell component="th" scope="row">
                      {row?.xs}
                    </TableCell>
                    <TableCell component="th" scope="row">
                      {row?.s}
                    </TableCell>
                    <TableCell component="th" scope="row">
                      {row?.m}
                    </TableCell>
                    <TableCell component="th" scope="row">
                      {row?.l}
                    </TableCell>
                    <TableCell component="th" scope="row">
                      {row?.xl}
                    </TableCell>
                    <TableCell component="th" scope="row">
                      {row?.xxl}
                    </TableCell>
                  </TableRow>
                ))}
            </TableBody>
          </Table>
        </TableContainer>
      </div>
    </div>
  );
}
