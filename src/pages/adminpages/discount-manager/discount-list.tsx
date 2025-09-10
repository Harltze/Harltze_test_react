import { useEffect, useState } from 'react'
import AdminDasboardLayout from '../../../components/layout/AdminDasboardLayout'
import { useDiscount } from '../../../../hooks/useDiscount'
import { useNavigate } from 'react-router';
import { toast } from 'react-toastify';
import moment from "moment";
import { formatCurrency, getCurrencySymbol } from '../../../../utils/formatCurrency';
import { Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from '@mui/material';

interface DiscountInterface {
  _id: string;
  discountCode: string;
  discountType: string;
  discountForProductsAbove: number;
  expiryDate: Date;
  createdAt: Date;
  updatedAt: Date;
}

export default function DiscountList() {

  const navigate = useNavigate();

  const {listDiscount} = useDiscount();

  const [discountCodes, setDiscountCodes] = useState<DiscountInterface[]>([]);

  const currencySymbol = getCurrencySymbol();

  const fetchDiscounts = async () => {
    try {
      const discountCodes = await listDiscount();
      console.log(discountCodes.data);
      setDiscountCodes(discountCodes.data.result);
    } catch (error) {
      toast.error("An error occurred");
    }
  }

  useEffect(() => {
    fetchDiscounts();
  }, []);

  return (
    <AdminDasboardLayout header='Discount List' showSearch={false}>
        <div className='text-right mb-4'>
          <button onClick={() => {navigate("/admin/discounts/new")}} className='bg-primary text-white px-6 py-2 rounded-md'>Create Discount</button>
        </div>
        <div>
          <TableContainer component={Paper}>
                            <Table sx={{ minWidth: 650 }} aria-label="simple table">
                              <TableHead>
                                <TableRow>
                                  <TableCell>Discount codes</TableCell>
                                  <TableCell>For products above</TableCell>
                                  <TableCell>Expiry Date</TableCell>
                                  <TableCell>Created At</TableCell>
                                  <TableCell>Updated At</TableCell>
                                </TableRow>
                              </TableHead>
                              <TableBody>
                                {discountCodes?.map((row) => (
                                  <TableRow
                                    key={row._id}
                                    sx={{
                                      "&:last-child td, &:last-child th": { border: 0 },
                                    }}
                                  >
                                    <TableCell
                                      component="th"
                                      scope="row"
                                      className="w-[200px]"
                                    >
                                      <div>{row?.discountCode}</div>
                                    </TableCell>
                                    <TableCell component="th" scope="row">
                                      <div>{currencySymbol}{formatCurrency(row?.discountForProductsAbove)}</div>
                                    </TableCell>
                                    <TableCell component="th" scope="row">
                                      <div>{moment(row?.expiryDate).format("LL")}</div>
                                    </TableCell>
                                    <TableCell>
                                      {moment(row.createdAt).format("LL")}
                                    </TableCell>
                                    <TableCell>
                                      {moment(row.updatedAt).format("LL")}
                                    </TableCell>
                                  </TableRow>
                                ))}
                              </TableBody>
                            </Table>
                          </TableContainer>
        </div>
        {/* <div className='grid grid-cols-1 md:grid-cols-2 gap-2 lg:grid-cols-3'>
          {
            discountCodes.map((d: any) => (
              <div className='border p-4 rounded-xl'>
                <div>Discount Code: {d?.discountCode}</div>
                <div>Discount Type: {d?.discountType}</div>
                <div>Discount for products above: {currencySymbol}{formatCurrency(d?.discountForProductsAbove)}</div>
                <div>Expiry Date: {moment(d?.expiryDate).format("LL")}</div>
              </div>
            ))
          }
        </div> */}
    </AdminDasboardLayout>
  )
}
