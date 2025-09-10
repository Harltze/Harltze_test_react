import { useEffect, useState } from "react";
import AdminDasboardLayout from "../../components/layout/AdminDasboardLayout";
import { Bounce } from "react-activity";
import {
  formatCurrency,
  getCurrencySymbol,
} from "../../../utils/formatCurrency";
import { CgClose } from "react-icons/cg";
import { ProductWithQuantity, SizeAndColor } from "../../../store/cartStore";
import { useOrders } from "../../../hooks/useOrders";
import { toast } from "react-toastify";
import { errorHandler } from "../../../utils/errorHandler";
import { getShippingStatusText } from "../../../utils/getShippingValueText";
import {
  Box,
  Modal,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from "@mui/material";
import { IoMdArrowRoundBack, IoMdArrowRoundForward } from "react-icons/io";
import moment from "moment";
import SwatchComponent from "../../components/SwatchComponent";
// import { ProductInterface } from "../../../interfaces/ProductInterface";

interface CustomerInterface {
  _id: string;
  firstName: string;
  lastName: string;
  phoneNumber: string;
  email: string;
}

interface OrderHistoryDocsInterface {
  _id: string;
  address: string;
  city: string;
  comment: string;
  country: string;
  createdAt: Date;
  customerId: CustomerInterface;
  orderStatus: string;
  shippingStatus: number;
  paystackReference: string;
  products: ProductWithQuantity[];
  codeType: "discount" | "affiliate";
  code: string;
  discountPercentApplied: number;
  discountedAmount: number;
  affiliateId: string;
  affiliatePercentApplied: number;
  affiliateGets: number;
  affiliateComissionPaymentStatus: "pending" | "cashed-out" | "paid";
  companyGets: number;
  rating: number;
  shippingFee: number;
  shopDeleted: boolean;
  state: string;
  totalCost: number;
  updatedAt: Date;
}

interface PaginatedOrder {
  docs: OrderHistoryDocsInterface[];
  hasNextPage: boolean;
  hasPrevPage: boolean;
  limit: number;
  nextPage: any;
  page: number;
  pagingCounter: number;
  prevPage: any;
  totalDocs: number;
  totalPages: number;
}

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: "90%",
  bgcolor: "background.paper",
  boxShadow: 24,
  maxHeight: 400,
  overflow: "scroll",
  p: 4,
  borderRadius: 2,
};

export default function AdminOrders() {
  const { adminPendingOrders, isAdminPendingOrderLoading, shippingStatus } =
    useOrders();

  const [searchKeyword, setSearchKeyword] = useState("");
  const [isLoading, setLoading] = useState(false);

  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(20);

  const [shippingStatusLoading, setShippingStatusLoading] = useState(false);

  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");


  const [orderStatusFilter, setOrderStatusFilter] = useState(-5);

  // const [startDate, setStartDate] = useState("");
  // const [endDate, setEndDate] = useState("");

  const searchAction = () => {};

  // useEffect(() => {
  //   adminPendingOrders();
  // }, []);

  const [orderhistoryDetails, setOrderHistoryDetails] =
    useState<PaginatedOrder>({
      docs: [],
      hasNextPage: false,
      hasPrevPage: false,
      limit: 20,
      nextPage: null,
      page: 1,
      pagingCounter: 1,
      prevPage: null,
      totalDocs: 0,
      totalPages: 1,
    });

  const fetchOrderHistory = async () => {
    try {
      setLoading(true);
      const response = await adminPendingOrders(page, limit, orderStatusFilter, {startDate, endDate});
      // console.log("Fetch pending order response", response.data.result);
      console.log("Pending order", response.data.result);
      setOrderHistoryDetails(response.data.result);
    } catch (error) {
      toast.error(
        errorHandler(error, "An error occurred while fetching products.")
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrderHistory();
  }, [page, limit, orderStatusFilter]);

  // const [modalIsOpen, setIsOpen] = useState(false);
  const [isShippingStatusModalOpen, setShippingStatusModalOpen] =
    useState(false);
  // const [isUpdatingShippingStatus, setUpdatingShippingStatus] = useState(false);

  function openShippingStatusModal(order: OrderHistoryDocsInterface) {
    setShippingStatusValue(order?.shippingStatus!!);
    setProductIdToUpdate(order._id);
    setShippingStatusModalOpen(true);
  }

  function closeShippingStatusModal() {
    setShippingStatusValue(0);
    setProductIdToUpdate("");
    setShippingStatusModalOpen(false);
  }
  // function openModal() {
  //   setIsOpen(true);
  // }

  // function closeModal() {
  //   setIsOpen(false);
  // }

  // const currencySymbol = getCurrencySymbol();

  //   const fetchOrderHistory = async (page: number, limit: number) => {
  //     const response = await getOrderHistory(page, limit);

  //     setOrderHistoryDetails(response.data.result);
  //   };

  // const [productModalDetails, setProductModalDetails] =
  //   useState<ProductWithQuantity | null>(null);

  const [shippingFeeValue, setShippingStatusValue] = useState(0);
  const [productIdToUpdate, setProductIdToUpdate] = useState("");

  const handleSippingFee = (shippingFee: number) => {
    if (shippingFee < shippingFeeValue) return;
    setShippingStatusValue(shippingFee);
  };

  // const openMoreDetails = (product: ProductWithQuantity) => {
  //   setProductModalDetails(product);

  //   openModal();
  // };

  // const closeMoreDetails = () => {
  //   closeModal();
  //   setProductModalDetails(null);
  //   setShippingStatusValue(0);
  //   setProductIdToUpdate("");
  // };

  const handleShippingStatus = async () => {
    try {
      setShippingStatusLoading(true);
      const res = await shippingStatus(productIdToUpdate, shippingFeeValue);
      console.log(res.data.updatedProduct);
      const updatedOrderDetails = orderhistoryDetails.docs.map((o) => {
        if (o._id == res.data?.updatedProduct?._id) {
          o.shippingStatus = res.data?.updatedProduct?.shippingStatus;
        }
        return o;
      });
      setOrderHistoryDetails((prev) => ({
        ...prev,
        docs: updatedOrderDetails,
      }));
      closeShippingStatusModal();
      toast.success("Shipping Status Updated Successfully");
    } catch (error) {
      toast.success(
        errorHandler(
          error,
          "An error occurred while trying to update shipping status"
        )
      );
    } finally {
      setShippingStatusLoading(false);
    }
  };

  // const cancelOrder = async () => {}

  // let sliderRef = useRef<any>(null);

  // const settings = {
  //   dots: true,
  //   infinite: true,
  //   speed: 500,
  //   slidesToShow: 1,
  //   slidesToScroll: 1,
  //   nextArrow: <FaAngleRight color="black" />,
  //   prevArrow: <FaAngleLeft color="black" />,
  // };

  // let [totalAmount, setTotalAmount] = useState(0);

  // useEffect(() => {
  //   let totalQuantity = 0;

  //   if (productModalDetails) {
  //     if (productModalDetails.sizeColorQuantity!!.length > 0) {
  //       for (
  //         let i = 0;
  //         i < productModalDetails.sizeColorQuantity!!.length;
  //         i++
  //       ) {
  //         totalQuantity +=
  //           productModalDetails.sizeColorQuantity!![i].quantity!!;
  //       }
  //     }

  //     let totalAmountCalculated = productModalDetails.cost * totalQuantity;
  //     setTotalAmount(totalAmountCalculated);
  //   }
  // }, [modalIsOpen]);

  // const grandTotal = useCallback((orderHistory: OrderHistoryDocsInterface) => {
  //   let total = 0;

  //   for (let i = 0; i < orderHistory.products.length; i++) {
  //     let totalPerQuantity = 0;
  //     if (orderHistory.products[i].sizeColorQuantity!!.length > 0) {
  //       for (
  //         let j = 0;
  //         j < orderHistory.products[i].sizeColorQuantity!!.length;
  //         j++
  //       ) {
  //         totalPerQuantity +=
  //           orderHistory.products[i].cost *
  //           orderHistory.products[i].sizeColorQuantity!![j].quantity!!;
  //       }
  //       total += totalPerQuantity;
  //     }
  //   }

  //   return total;
  // }, []);

  const [isOrderWithVariationsOpen, setOrderWithVariationsOpen] =
    useState(false);
  const [orderWithVariations, setOrderWithVariations] =
    useState<OrderHistoryDocsInterface | null>(null);

  const openOrderVariantModal = (value: OrderHistoryDocsInterface) => {
    setOrderWithVariations(value);
    setOrderWithVariationsOpen(true);
  };

  const closeOrderVariantModal = () => {
    setOrderWithVariations(null);
    setOrderWithVariationsOpen(false);
  };

  // const markAsDelivered = async (orderId: string) => {
  //   const response = await adminMarkOrderAsDelivered(orderId);
  //   // console.log("Mark as delivered", response);
  //   if (response.data.status == 200) {
  //     fetchOrderHistory();
  //   }
  // };

  const [isPageModalOpen, setPageModalOpen] = useState(false);
  const [modalPageNumber, setModalPageNumber] = useState(0);
  const openModal = () => {
    setPageModalOpen(true);
  };

  const closeModal = () => {
    setPageModalOpen(false);
  };

  const prevNextPageDesign = "py-1 px-4 font-medium rounded-md border border-2";

  return (
    <AdminDasboardLayout
      header="Orders"
      searchPlaceholder="Search Products"
      showSearch={false}
      searchValue={searchKeyword}
      setSearchValue={setSearchKeyword}
      searchAction={searchAction}
    >
      <div className="mt-4">
        {/* <div className="font-bold text-[25px]">Orders</div> */}
        <div className="flex justify-between flex-col lg:flex-row items-center gap-4 my-4">
          <div className="grid grid-cols-2 md:flex gap-2 items-end">
            <div className="flex flex-col">
              <label>Start Date</label>
              <input type="date" value={startDate} onChange={(e) => {setStartDate(e.target.value); setEndDate("")}} className="border border-primary rounded-md text-primary px-4" />
            </div>
            <div className="flex flex-col">
              <label>End Date</label>
              <input type="date" value={endDate} min={startDate} onChange={(e) => {setEndDate(e.target.value)}} className="border border-primary rounded-md text-primary px-4" />
            </div>
            <button className="px-4 py-1 border border-primary text-primary bg-white rounded-md" onClick={() => {
              setStartDate("");
              setEndDate("");
              fetchOrderHistory();
            }}>Reset</button>
            <button className="px-4 py-1 bg-primary text-white rounded-md" onClick={() => {
              if(!startDate || !endDate) {
                toast.error("Start and end dates are required.");
                return;
              }
              fetchOrderHistory();
            }}>Go</button>
          </div>
          <div className="flex flex-col">
            <label>Shipping Status</label>
            <select
              className="px-4 py-1 bg-[white] border border-primary text-primary rounded-md"
              value={orderStatusFilter}
              onChange={(e) => {
                setOrderStatusFilter(parseInt(e.target.value));
              }}
            >
              <option value={-5}>All</option>
              {[0, 1, 2, 3, 4, 5, 6, 7, 8].map((v) => (
                <option value={v}>{getShippingStatusText(v)}</option>
              ))}
            </select>
          </div>
        </div>
        <div>
          <div className="flex flex-col gap-10">
            {isAdminPendingOrderLoading && (
              <Bounce size={20} className="mx-auto" />
            )}
            {!isAdminPendingOrderLoading &&
              orderhistoryDetails.docs.length == 0 && (
                <div className="text-center font-bold text-[25px]">
                  No pending order
                </div>
              )}
            <div>
              {orderhistoryDetails?.docs.length > 0 && (
                <TableContainer component={Paper}>
                  <Table sx={{ minWidth: 650 }} aria-label="simple table">
                    <TableHead>
                      <TableRow>
                        <TableCell>Affiliate Code</TableCell>
                        <TableCell>Customer Details</TableCell>
                        <TableCell>Order ID</TableCell>
                        <TableCell>Created At</TableCell>
                        <TableCell>Shipping Details</TableCell>
                        <TableCell>Order Status</TableCell>
                        <TableCell>Action</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {orderhistoryDetails?.docs?.map((row) => {
                        // const total = grandTotal(row);
                        return (
                          <TableRow
                            key={row._id}
                            sx={{
                              "&:last-child td, &:last-child th": { border: 0 },
                            }}
                          >
                            <TableCell component="th" scope="row">
                              {row.codeType == "affiliate" ? (
                                <div>Affiliate code: {row?.code}</div>
                              ) : (
                                <div>N/A</div>
                              )}
                            </TableCell>
                            <TableCell component="th" scope="row">
                              <div>
                                {row?.customerId?.firstName}{" "}
                                {row?.customerId?.lastName}
                              </div>
                              <div>{row?.customerId?.phoneNumber}</div>
                              <div>{row?.customerId?.email}</div>
                            </TableCell>
                            <TableCell component="th" scope="row">
                              <div>{row?._id}</div>
                            </TableCell>
                            <TableCell component="th" scope="row">
                              <div>{moment(row?.createdAt).format("LLLL")}</div>
                            </TableCell>
                            <TableCell component="th" scope="row">
                              <div className="flex flex-col gap-2">
                                <div>
                                  <div className="font-medium text-[10px] text-[#aaa]">
                                    Address
                                  </div>
                                  <div className="font-medium text-[18px]">
                                    {row?.address}
                                  </div>
                                </div>
                                <div className="flex gap-4">
                                  <div>
                                    <div className="font-medium text-[10px] text-[#aaa]">
                                      State
                                    </div>
                                    <div className="font-medium text-[18px]">
                                      {row?.state[0].toLocaleUpperCase() +
                                        row?.state.slice(1)}
                                    </div>
                                  </div>
                                  <div>
                                    <div className="font-medium text-[10px] text-[#aaa]">
                                      City
                                    </div>
                                    <div className="font-medium text-[18px]">
                                      {row?.city}
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </TableCell>
                            <TableCell component="th" scope="row">
                              <div>
                                <div className="font-medium text-[10px] text-[#aaa]">
                                  Shipping Status
                                </div>
                                <div className="font-medium text-[18px]">
                                  {getShippingStatusText(row.shippingStatus)}
                                </div>
                                <div className="mt-4">
                                  <button
                                    className="border border-primary text-primary font-medium px-4 py-1 rounded-md"
                                    onClick={() => {
                                      openShippingStatusModal(row);
                                    }}
                                  >
                                    Update status
                                  </button>
                                </div>
                              </div>
                            </TableCell>
                            <TableCell component="th" scope="row">
                              <button
                                onClick={() => {
                                  openOrderVariantModal(row);
                                }}
                                className="border border-primary text-primary rounded-md px-2"
                              >
                                View Variations
                              </button>
                            </TableCell>
                          </TableRow>
                        );
                      })}
                    </TableBody>
                  </Table>
                </TableContainer>
              )}
            </div>

            {/* <div></div> */}
          </div>

          {/* <Modal
            isOpen={modalIsOpen}
            onRequestClose={closeMoreDetails}
            style={{
              overlay: { zIndex: 200, backgroundColor: "rgba(0,0,0,0.8)" },
              content: {
                height: "fit-content",
                marginRight: "auto",
                marginLeft: "auto",
                marginTop: "auto",
                marginBottom: "auto",
              },
            }}
            // contentLabel="Example Modal"
          >
            <div>
              <div className="flex justify-between items-center mb-8">
                <div className="font-bold text-[25px]">
                  Order Product Detail
                </div>
                <button onClick={closeMoreDetails}>
                  <CgClose size={25} />
                </button>
              </div>
              <div className="flex gap-10 items-center p-8">
                <div className="w-full md:w-1/2">
                  <Slider ref={sliderRef} {...settings}>
                    {productModalDetails?.sizeAndColor.map((picture) => {
                      return picture.pictures.map((p) => {
                        return (
                          <div>
                            <img
                              src={p}
                              className="h-fit w-[400px] mx-auto rounded-xl"
                            />
                          </div>
                        );
                      });
                    })}
                  </Slider>
                </div>

                <div className="w-full md:w-1/2">
                  <div className="font-bold text-[25px]">
                    {productModalDetails?.productName}
                  </div>
                  <div>
                    Cost per unit: {currencySymbol}
                    {formatCurrency(productModalDetails?.cost || 0)}
                  </div>
                  <div>
                    <div>Color, Size and Quantity purchased:</div>
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                      {productModalDetails?.sizeColorQuantity
                        ?.filter((s) => s.quantity != 0)
                        .map((SCQ) => {
                          return (
                            <div className="flex gap-2 border border-primary py-2 px-4 rounded-md text-primary font-bold mt-2 justify-center">
                              <div className="text-center">
                                <div>{SCQ.color}</div>
                                <div className="text-[10px] font-thin">
                                  Color
                                </div>
                              </div>
                              <div className="text-center">
                                <div>{SCQ.size}</div>
                                <div className="text-[10px] font-thin">
                                  Size
                                </div>
                              </div>
                              <div className="text-center">
                                <div>{SCQ.quantity}</div>
                                <div className="text-[10px] font-thin">
                                  Quantity
                                </div>
                              </div>
                            </div>
                          );
                        })}
                    </div>
                  </div>
                  <div>
                    Total amount paid: {currencySymbol}
                    {formatCurrency(totalAmount)}
                  </div>
                </div>
              </div>
            </div>
          </Modal> */}
          <Modal
            open={isShippingStatusModalOpen}
            onClose={closeShippingStatusModal}
            aria-labelledby="modal-modal-title"
            aria-describedby="modal-modal-description"
          >
            <Box
              sx={{
                position: "absolute",
                top: "50%",
                left: "50%",
                transform: "translate(-50%, -50%)",
                width: 400,
                bgcolor: "background.paper",
                boxShadow: 24,
                maxHeight: 600,
                overflow: "scroll",
                p: 4,
                borderRadius: 2,
              }}
            >
              <div className="flex justify-between items-center mb-8">
                <div className="font-bold text-[25px]">
                  Update Shipping Status
                </div>
                <button onClick={closeShippingStatusModal}>
                  <CgClose size={25} />
                </button>
              </div>
              <div>
                <div>Update order status</div>
                <div className="flex flex-col gap-4 mt-4 py-4 h-[180px] overflow-y-auto">
                  <div>
                    <input
                      type="checkbox"
                      checked={shippingFeeValue >= 1}
                      onChange={() => {
                        handleSippingFee(1);
                      }}
                    />{" "}
                    Order Placed
                  </div>
                  <div>
                    <input
                      type="checkbox"
                      checked={shippingFeeValue >= 2}
                      onChange={() => {
                        handleSippingFee(2);
                      }}
                    />{" "}
                    Order Received
                  </div>
                  <div>
                    <input
                      type="checkbox"
                      checked={shippingFeeValue >= 3}
                      onChange={() => {
                        handleSippingFee(3);
                      }}
                    />{" "}
                    Order Accepted / Processing
                  </div>
                  <div>
                    <input
                      type="checkbox"
                      checked={shippingFeeValue >= 4}
                      onChange={() => {
                        handleSippingFee(4);
                      }}
                    />{" "}
                    Order Ready for Dispatch
                  </div>
                  <div>
                    <input
                      type="checkbox"
                      checked={shippingFeeValue >= 5}
                      onChange={() => {
                        handleSippingFee(5);
                      }}
                    />{" "}
                    Order Shipped
                  </div>
                  <div>
                    <input
                      type="checkbox"
                      checked={shippingFeeValue >= 6}
                      onChange={() => {
                        handleSippingFee(6);
                      }}
                    />{" "}
                    Order Out for Delivery
                  </div>
                  <div>
                    <input
                      type="checkbox"
                      checked={shippingFeeValue >= 7}
                      onChange={() => {
                        handleSippingFee(7);
                      }}
                    />{" "}
                    Order Delivered
                  </div>
                  <div>
                    <input
                      type="checkbox"
                      checked={shippingFeeValue >= 8}
                      onChange={() => {
                        handleSippingFee(8);
                      }}
                    />{" "}
                    Feedback Request
                  </div>
                </div>
                <div className="mt-8">
                  <button
                    className="bg-primary text-white rounded-md py-1 px-4 inline-block"
                    disabled={isLoading || shippingStatusLoading}
                    onClick={handleShippingStatus}
                  >
                    {shippingStatusLoading ? (
                      <Bounce color="white" />
                    ) : (
                      "Update Status"
                    )}
                  </button>
                </div>
              </div>
            </Box>
          </Modal>
        </div>
      </div>
      <div>
        <div className="flex gap-2 justify-center items-center mt-4">
          <button
            onClick={() => {
              if (orderhistoryDetails.hasPrevPage) {
                setPage(orderhistoryDetails.nextPage);
              }
            }}
            className={`${prevNextPageDesign} ${
              orderhistoryDetails.hasPrevPage
                ? "text-primary border-primary"
                : "text-primary/[0.5] border-primary/[0.5]"
            }`}
          >
            <IoMdArrowRoundBack size={25} />
          </button>
          <div className="font-medium text-[16px]">
            Page {orderhistoryDetails.page} of {orderhistoryDetails.totalPages}
            <select
              value={limit}
              onChange={(e) => {
                setLimit(parseInt(e.target.value));
              }}
              className="inline-block px-4 py-1 mx-2"
            >
              <option value={10}>10</option>
              <option value={20}>20</option>
              <option value={50}>50</option>
            </select>{" "}
            pages. (showing {orderhistoryDetails.limit} per page)
          </div>
          <button
            className={`py-1 px-4 font-medium text-primary border-primary text-[16px] text-medium`}
            onClick={openModal}
          >
            Go to Page
          </button>
          <button
            onClick={() => {
              if (orderhistoryDetails.hasNextPage) {
                setPage(orderhistoryDetails.prevPage);
              }
            }}
            className={`${prevNextPageDesign} ${
              orderhistoryDetails.hasNextPage
                ? "text-primary border-primary"
                : "text-primary/[0.5] border-primary/[0.5]"
            }`}
          >
            <IoMdArrowRoundForward size={25} />
          </button>
        </div>
      </div>
      <Modal
        open={isPageModalOpen}
        onClose={closeModal}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          <Typography>
            <div className="flex justify-between items-center mb-8">
              <div className="font-bold text-[20px]">Go to Page</div>
              <button onClick={closeModal}>
                <CgClose size={25} />
              </button>
            </div>
            <div className="flex justify-center items-center h-full">
              <div className="flex flex-col gap-2 text-center">
                <div className="font-bold text-[25px]">Go to page</div>
                <div className="text-[10px]">
                  Enter a page number between 1 and{" "}
                  {orderhistoryDetails.totalPages}
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
                      modalPageNumber > orderhistoryDetails.totalPages ||
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
          </Typography>
        </Box>
      </Modal>

      <Modal
        open={isOrderWithVariationsOpen}
        onClose={closeOrderVariantModal}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          <Typography>
            <div className="flex justify-between items-center mb-8">
              <div className="font-bold text-[25px]">Variations</div>
              <button onClick={closeOrderVariantModal}>
                <CgClose size={25} />
              </button>
            </div>

            <TableContainer component={Paper}>
              <Table sx={{ minWidth: 650 }} aria-label="simple table">
                <TableHead>
                  <TableRow>
                    <TableCell>Product Detail</TableCell>
                    <TableCell>Color</TableCell>
                    <TableCell>Size</TableCell>
                    <TableCell>SKU</TableCell>
                    <TableCell>Quantity</TableCell>
                    <TableCell>Price</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {orderWithVariations?.products.map((row) => {
                    // const total = grandTotal(row);
                    return row.sizeColorQuantity?.map((nestedRow: SizeAndColor, indexTwo) => (
                      <TableRow
                        key={`${row._id}-${indexTwo}`}
                        sx={{
                          "&:last-child td, &:last-child th": { border: 0 },
                        }}
                      >
                        <TableCell component="th" scope="row">
                          <div>{row?.productName}</div>
                          <div>
                            {row?.categories &&
                              (row as any)?.categories[0]?.name}
                          </div>
                          <div>
                            {row?.clothesCollections &&
                              (row as any)?.clothesCollections[0]?.name}
                          </div>
                        </TableCell>
                        <TableCell component="th" scope="row">
                          <div className="flex gap-2">
                            <div>
                              <SwatchComponent colorCode={nestedRow?.colorCode} />
                              {/* <div
                                style={{
                                  backgroundColor: nestedRow?.colorCode,
                                }}
                                className="h-[20px] w-[20px] rounded-full"
                              ></div> */}
                            </div>
                            <div>{nestedRow?.color}</div>
                          </div>
                        </TableCell>
                        <TableCell component="th" scope="row">
                          <div>{nestedRow?.size}</div>
                        </TableCell>
                        <TableCell component="th" scope="row">
                          <div>{nestedRow?.sku}</div>
                        </TableCell>
                        <TableCell component="th" scope="row">
                          <div>{nestedRow?.quantity}</div>
                        </TableCell>
                        <TableCell component="th" scope="row">
                          <div>
                            {getCurrencySymbol()}
                            {formatCurrency(row?.cost * nestedRow?.quantity!!)}
                          </div>
                        </TableCell>
                      </TableRow>
                    ));
                  })}
                </TableBody>
              </Table>
            </TableContainer>
            {orderWithVariations && (
              <div className="mt-4 text-right">
                {orderWithVariations.codeType == "discount" && (<div>"{orderWithVariations.code}" discount code applied.</div>)}
                {orderWithVariations.codeType == "discount" && (<div>{orderWithVariations.discountPercentApplied}% discount.</div>)}
                <div>Grand Total Paid{orderWithVariations.codeType == "discount" && (<span>"{orderWithVariations.code}" discount code applied</span>)}:</div>
                <div className="font-bold text-[20px]">
                  {getCurrencySymbol()}
                  {formatCurrency(orderWithVariations.totalCost)}
                </div>
              </div>
            )}
          </Typography>
        </Box>
      </Modal>
    </AdminDasboardLayout>
  );
}
