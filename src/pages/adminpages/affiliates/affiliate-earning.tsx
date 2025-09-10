import { useEffect, useState } from "react";
import { useAffiliate } from "../../../../hooks/useAffiliate";
import AdminDasboardLayout from "../../../components/layout/AdminDasboardLayout";
import { toast } from "react-toastify";
import { errorHandler } from "../../../../utils/errorHandler";
import {
  formatCurrency,
  getCurrencySymbol,
} from "../../../../utils/formatCurrency";
import {
  Box,
  Modal,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from "@mui/material";
import Paper from "@mui/material/Paper";
import moment from "moment";
import { IoMdArrowRoundBack, IoMdArrowRoundForward } from "react-icons/io";
import { CgClose } from "react-icons/cg";

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 400,
  borderRadius: "8px",
  bgcolor: "background.paper",
  // border: '2px solid #000',
  boxShadow: 24,
  p: 4,
};

interface CashoutHistoryInterface {
  _id: string;
  adminId: string;
  ordersCashedOutOn: string[];
  paymentStatus: "pending" | "paid";
  amountCashedOut: number;
  createdAt: Date;
  updatedAt: Date;
}

interface PaginatedCashoutHistoryInterface {
  docs: CashoutHistoryInterface[];
  page: number;
  limit: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
  pagingCounter: number;
  totalDocs: number;
  totalPages: number;
}

export default function AffiliateEarning() {
  const { affiliateOrders, cashOut } = useAffiliate();

  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(20);
  const [paymentStatus, setPaymentStatus] = useState("all");

  const prevNextPageDesign = "py-1 px-4 font-medium rounded-md border border-2";

  const [pendingCashout, setPendingCashout] = useState(0);
  const [cashedOut, setCashedOut] = useState(0);
  const [earningsHistory, setEarningsHistory] =
    useState<PaginatedCashoutHistoryInterface | null>(null);

  const fetchEarnings = async () => {
    try {
      const response = await affiliateOrders(paymentStatus, page, limit);

      console.log(response.data);

      setPendingCashout(response.data.affiliatePendingCashout);
      setCashedOut(response.data?.affiliateCashedOut);
      setEarningsHistory(response.data?.affiliateOrderHistory); // Affiliate's cashout history
    } catch (error) {
      toast.error(
        errorHandler(
          error,
          "An error occurred while trying to fetch earnings list"
        )
      );
    }
  };

  useEffect(() => {
    fetchEarnings();
  }, [paymentStatus, page, limit]);

  const applyForCashOutButton = async () => {
    try {
      await cashOut();

      toast.success("Cashout request successful");

      await fetchEarnings();
    } catch (error) {
      toast.error(
        errorHandler(
          error,
          "An error occurred while trying to fetch earnings list"
        )
      );
    }
  };

  const [isPageModalOpen, setPageModalOpen] = useState(false);
    const [modalPageNumber, setModalPageNumber] = useState(0);
    const openModal = () => {
      setPageModalOpen(true);
    };
  
    const closeModal = () => {
      setPageModalOpen(false);
    };

  return (
    <AdminDasboardLayout
      header="Earnings"
      searchPlaceholder="Search Products"
      showSearch={false}
    >
      <div className="mt-4">
        <div className="flex gap-4">
          <div className="flex flex-col gap-2 border border-2 rounded-md py-4 px-8">
            <div className="font-bold">Total Amount Made</div>
            <div className="text-[25px]">
              {getCurrencySymbol()}
              {formatCurrency(pendingCashout)}
            </div>
            <button
              className="bg-primary text-white py-1 px-4 rounded-md font-bold"
              onClick={applyForCashOutButton}
            >
              Request Cash Out
            </button>
          </div>
          <div className="flex flex-col gap-2 border border-2 rounded-md py-4 px-8">
            <div className="font-bold">Total Cash Out Requested</div>
            <div className="text-[25px]">
              {getCurrencySymbol()}
              {formatCurrency(cashedOut)}
            </div>
          </div>
        </div>
        <div className="flex justify-end items-center gap-4 my-10">
          <label className="font-bold text-[20px]">Payment Status</label>
          <select
            value={paymentStatus}
            onChange={(e) => {
              setPaymentStatus(e.target.value);
            }}
            className="px-10 py-2"
          >
            <option value="all">All</option>
            <option value="pending">Pending</option>
            <option value="paid">Paid</option>
          </select>
        </div>
        <div>
          {earningsHistory && earningsHistory?.docs.length > 0 ? (
            <div>
              <TableContainer component={Paper}>
                <Table sx={{ minWidth: 650 }} aria-label="simple table">
                  <TableHead>
                    <TableRow>
                      <TableCell>Amount Cashed Out</TableCell>
                      <TableCell>Payment Status</TableCell>
                      <TableCell>Request Date</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {earningsHistory.docs.map((row) => (
                      <TableRow
                        key={row._id}
                        sx={{
                          "&:last-child td, &:last-child th": { border: 0 },
                        }}
                      >
                        <TableCell component="th" scope="row">
                          {getCurrencySymbol()}
                          {formatCurrency(row.amountCashedOut)}
                        </TableCell>
                        <TableCell>
                          {row.paymentStatus.toLocaleUpperCase()}
                        </TableCell>
                        <TableCell>
                          {moment(row.createdAt).format("LLLL")}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
              {/* Page control starts here */}
                    <div>
                                    <div className="flex gap-2 justify-center items-center mt-4">
                                      <button
                                        onClick={() => {
                                          if (earningsHistory?.hasPrevPage) {
                                            setPage(earningsHistory?.page - 1);
                                          }
                                        }}
                                        className={`${prevNextPageDesign} ${
                                          earningsHistory?.hasPrevPage
                                            ? "text-primary border-primary"
                                            : "text-primary/[0.5] border-primary/[0.5]"
                                        }`}
                                      >
                                        <IoMdArrowRoundBack size={25} />
                                      </button>
                                      <div className="font-medium text-[16px]">
                                        Page {earningsHistory?.page} of {earningsHistory?.totalPages}{" "}
                                        (showing <select className="px-8 py-2 inline-block mx-2" value={earningsHistory?.limit} onChange={(e) => {setLimit(parseInt(e.target.value))}}>
                                            <option value={10}>10</option>
                                            <option value={20}>20</option>
                                            <option value={50}>50</option>
                                          </select> per page)
                                      </div>
                                      <button
                                        className={`py-1 px-4 font-medium text-primary border-primary text-[16px] text-medium`}
                                        onClick={openModal}
                                      >
                                        Go to Page
                                      </button>
                                      <button
                                        onClick={() => {
                                          if (earningsHistory?.hasNextPage) {
                                            setPage(earningsHistory?.page + 1);
                                          }
                                        }}
                                        className={`${prevNextPageDesign} ${
                                          earningsHistory?.hasNextPage
                                            ? "text-primary border-primary"
                                            : "text-primary/[0.5] border-primary/[0.5]"
                                        }`}
                                      >
                                        <IoMdArrowRoundForward size={25} />
                                      </button>
                                    </div>
                                  </div>
              {/* Page control ends here */}
              <Modal
                      open={isPageModalOpen}
                      aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
                      onClose={closeModal}
                    >
                      <Box sx={style}>  
                      <div>
                        <div className="text-right">
                          <button onClick={closeModal}>
                            <CgClose size={25} />
                          </button>
                        </div>
                        <div className="flex justify-center items-center h-full">
                          <div className="flex flex-col gap-2 text-center">
                            <div className="font-bold text-[25px]">Go to page</div>
                            <div className="text-[10px]">
                              Enter a page number between 1 and {earningsHistory.totalPages}
                            </div>
                            <div>
                              <input
                                type="number"
                                className="border border-2 border-primary py-1 px-2 rounded-md"
                                placeholder={`Enter a page number`}
                                value={modalPageNumber}
                                onChange={(e) => {
                                  setModalPageNumber(parseInt(e.target.value));
                                }}
                              />
                            </div>
                            <button
                              className="bg-primary text-white font-medium px-4 py-1 rounded-md"
                              onClick={() => {
                                if (
                                  modalPageNumber > earningsHistory.totalPages ||
                                  modalPageNumber < 1
                                ) {
                                  toast.error("Invalid page number");
                                  return;
                                }
                                setPage(modalPageNumber);
                                setModalPageNumber(0);
                                closeModal();
                              }}
                            >
                              Go
                            </button>
                          </div>
                        </div>
                      </div>
                      </Box>
                    </Modal>
            </div>
          ) : (
            <div className="text-center">
              <div className="text-[black] font-bold text-[35px]">
                No result
              </div>
            </div>
          )}
        </div>
      </div>
    </AdminDasboardLayout>
  );
}
