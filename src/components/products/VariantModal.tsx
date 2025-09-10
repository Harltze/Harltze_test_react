import {
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from "@mui/material";
import SwatchComponent from "../SwatchComponent";

interface SizeAndQuantity {
  size: string;
  quantityAvailable: number;
  sku: string;
}

interface SizeAndColor {
  _id?: string;
  sizes: SizeAndQuantity[];
  color: string;
  colorCode: string;
  // quantityAvailable: number;
  pictures: string[];
}

interface Props {
  variants: SizeAndColor[];
}

export default function VariantModal({ variants }: Props) {
  return (
    <div>
      <TableContainer component={Paper}>
        <Table sx={{ minWidth: 650 }} aria-label="simple table">
          <TableHead>
            <TableRow>
              <TableCell>Colour</TableCell>
              <TableCell>Colour Code</TableCell>
              <TableCell>Size</TableCell>
              <TableCell>SKU</TableCell>
              <TableCell>Quantity Available</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {variants?.map((row, index) =>
              row.sizes.map((s, index2) => (
                <TableRow
                  key={`${index}-${index2}`}
                  sx={{
                    "&:last-child td, &:last-child th": { border: 0 },
                  }}
                >
                  <TableCell component="th" scope="row">
                    <div>{row?.color}</div>
                  </TableCell>
                  <TableCell component="th" scope="row">
                    <SwatchComponent colorCode={row?.colorCode} />
                    {/* <div
                      className="h-[20px] w-[20px] rounded-full"
                      style={{ backgroundColor: row.colorCode }}
                    ></div> */}
                  </TableCell>
                  <TableCell component="th" scope="row">
                    <div className="grid grid-cols-4 gap-2">
                      <div>{s?.size}</div>
                    </div>
                  </TableCell>
                  <TableCell component="th" scope="row">
                    <div className="grid grid-cols-4 gap-2">
                      <div>{s?.sku}</div>
                    </div>
                  </TableCell>
                  <TableCell component="th" scope="row">
                    <div>{s?.quantityAvailable}</div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </TableContainer>
    </div>
  );
}
