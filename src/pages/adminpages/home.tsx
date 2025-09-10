import { useEffect, useRef, useState } from "react";
import { useOrders } from "../../../hooks/useOrders";
import AdminDasboardLayout from "../../components/layout/AdminDasboardLayout";
import { ProductWithQuantity } from "../../../store/cartStore";
import { FaAngleLeft, FaAngleRight } from "react-icons/fa";
import { Bounce } from "react-activity";
import {
  formatCurrency,
  getCurrencySymbol,
} from "../../../utils/formatCurrency";
import { CgClose } from "react-icons/cg";
import Slider from "react-slick";
import { useProduct } from "../../../hooks/useProduct";
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
import moment from "moment";
import { getShippingStatusText } from "../../../utils/getShippingValueText";
import SwatchComponent from "../../components/SwatchComponent";
import { useProfile } from "../../../hooks/useProfile";
import { Parser } from "@json2csv/plainjs";
import { toast } from "react-toastify";
import { IoMdArrowRoundBack, IoMdArrowRoundForward } from "react-icons/io";
import { authStore } from "../../../store/authStore";

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

interface SubscriberInterface {
  _id: string;
  subscribersName: string;
  subscribersEmail: string;
  createdAt: string;
updatedAt: Date;
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

export default function AdminHome() {
  const [home, setHome] = useState({
    totalProducts: 0,
    inStock: 0,
    outOfStock: 0,
    archived: 0,
    pendingOrders: 0,
    totalSubscribers: 0,
  });

  const role = authStore(state => state.userDetails.role);

  const { adminHome, isAdminHomeLoading } = useProduct();

  const { adminOrderHistory, isAdminOrderHistoryLoading } = useOrders();

  const {getNewsLetterSubscribers} = useProfile();

  const dashboardCardStyle =
    "rounded-xl py-2 px-4 border border-solid border-2 border-primary w-full";

  const dashboardHeaderStyle = "text-[14px] text-primary font-medium";

  const dashboardCountStyle = "text-[25px] text-primary font-bold";

  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  const [isPageModalOpen, setPageModalOpen] = useState(false);
    const [modalPageNumber, setModalPageNumber] = useState(0);
    const openModal = () => {
      setPageModalOpen(true);
    };
  
    const closePageModal = () => {
      setPageModalOpen(false);
    };
  
    const prevNextPageDesign = "py-1 px-4 font-medium rounded-md border border-2";
  

  const [orderhistoryDetails, setOrderHistoryDetails] =
    useState<PaginatedOrder>({
      docs: [],
      hasNextPage: false,
      hasPrevPage: false,
      limit: 10,
      nextPage: null,
      page: 1,
      pagingCounter: 1,
      prevPage: null,
      totalDocs: 0,
      totalPages: 1,
    });

  const fetchOrderHistory = async () => {
    const response = await adminOrderHistory(page, limit);

    setOrderHistoryDetails(response.data.result);
  };

  const fetchOrderHistoryByDate = async () => {

    if(!startDate || !endDate) {
      toast.error("Start and end date is required.");
      return;
    }

    const response = await adminOrderHistory(page, limit, startDate, endDate);

    setOrderHistoryDetails(response.data.result);
  };

  const fetchAdminHome = async () => {
    const response = await adminHome();
    // console.log("Fetch admin home response", response.data.result);
    setHome(response.data.result);
  };

  useEffect(() => {
    fetchOrderHistory();
    fetchAdminHome();
  }, [page, limit]);

  const [modalIsOpen, setIsOpen] = useState(false);

  // function openModal() {
  //   setIsOpen(true);
  // }

  function closeModal() {
    setIsOpen(false);
  }

  const currencySymbol = getCurrencySymbol();

  //   const fetchOrderHistory = async (page: number, limit: number) => {
  //     const response = await getOrderHistory(page, limit);

  //     setOrderHistoryDetails(response.data.result);
  //   };

  const [productModalDetails, setProductModalDetails] =
    useState<ProductWithQuantity | null>(null);

  // const openMoreDetails = (product: ProductWithQuantity) => {
  //   setProductModalDetails(product);
  //   openModal();
  // };

  const closeMoreDetails = () => {
    closeModal();
    setProductModalDetails(null);
  };

  let sliderRef = useRef<any>(null);

  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    nextArrow: <FaAngleRight color="black" />,
    prevArrow: <FaAngleLeft color="black" />,
  };

  let [totalAmount, setTotalAmount] = useState(0);

  useEffect(() => {
    let totalQuantity = 0;

    if (productModalDetails) {
      if (productModalDetails.sizeColorQuantity!!.length > 0) {
        for (
          let i = 0;
          i < productModalDetails.sizeColorQuantity!!.length;
          i++
        ) {
          totalQuantity +=
            productModalDetails.sizeColorQuantity!![i].quantity!!;
        }
      }

      let totalAmountCalculated = productModalDetails.cost * totalQuantity;
      setTotalAmount(totalAmountCalculated);
    }
  }, [modalIsOpen]);

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

  const exportSubscribers = async () => {
      try {
  
        const subscribers = await getNewsLetterSubscribers();
  
        if(subscribers.data.subscribers.length == 0) {
          toast.error("No subscription");
          return;
        }
        
        const arrangedSubscribers = subscribers.data.subscribers.map((subscriber: SubscriberInterface) => {
          const value: any = {};
          value["Name"] = subscriber.subscribersName;
          value["Email"] = subscriber.subscribersEmail;
          value["Date Subscribed"] = moment(subscriber.createdAt).format("LLLL");
          return value;
        });
  
        const opts = {};
        const parser = new Parser(opts);
        const csv = parser.parse(arrangedSubscribers);
        const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
        const url = URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = url;
        link.setAttribute("download", "Newsletter subscribers.csv");
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      } catch (error) {
        
      }
    }

  return (
    <AdminDasboardLayout header="Home" showSearch={false}>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className={`${dashboardCardStyle}`}>
          <div className={`${dashboardHeaderStyle}`}>Total Products</div>
          <div className={`${dashboardCountStyle}`}>
            {isAdminHomeLoading ? <Bounce /> : home?.totalProducts}
          </div>
        </div>

        <div className={`${dashboardCardStyle}`}>
          <div className={`${dashboardHeaderStyle}`}>In Stock</div>
          <div className={`${dashboardCountStyle}`}>
            {isAdminHomeLoading ? <Bounce /> : home?.inStock}
          </div>
        </div>

        <div className={`${dashboardCardStyle}`}>
          <div className={`${dashboardHeaderStyle}`}>Out of stock</div>
          <div className={`${dashboardCountStyle}`}>
            {isAdminHomeLoading ? <Bounce /> : home?.outOfStock}
          </div>
        </div>

        <div className={`${dashboardCardStyle}`}>
          <div className={`${dashboardHeaderStyle}`}>Studio</div>
          <div className={`${dashboardCountStyle}`}>
            {isAdminHomeLoading ? <Bounce /> : home.archived}
          </div>
        </div>

        <div className={`${dashboardCardStyle}`}>
          <div className={`${dashboardHeaderStyle}`}>Pending orders</div>
          <div className={`${dashboardCountStyle}`}>
            {isAdminHomeLoading ? <Bounce /> : home.pendingOrders}
          </div>
        </div>
        
        {role != "marketer" && <div className={`${dashboardCardStyle}`}>
          <div className={`${dashboardHeaderStyle}`}>Total subscribers</div>
          <div className={`${dashboardCountStyle}`}>
            {isAdminHomeLoading ? <Bounce /> : home.totalSubscribers}
          </div>
          <button onClick={exportSubscribers} className="text-primary underline">Export as CSV</button>
        </div>}
      </div>

      <div className="mt-10">
        <div className="flex justify-between items-center">
        <div className="font-bold text-[25px]">Transaction History</div>
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
                      fetchOrderHistoryByDate();
                    }}>Go</button>
                  </div>
        </div>
        <div>
          <div className="flex flex-col gap-10">
            {isAdminOrderHistoryLoading && (
              <Bounce size={20} className="mx-auto" />
            )}
            {!isAdminOrderHistoryLoading &&
              orderhistoryDetails.docs.length == 0 && (
                <div className="text-center font-bold text-[25px]">
                  No Order history
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
                      onClose={closePageModal}
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
            {/* <div>
              {orderhistoryDetails.docs.map((orderHistory) => {

                return (
                  <div
                    key={orderHistory._id}
                    className="p-4 rounded-xl my-10 flex flex-col md:flex-row items-center"
                    style={{ boxShadow: "rgba(0, 0, 0, 0.24) 0px 3px 8px" }}
                  >
                    <div>
                      <div className="font-medium text-[16px] mb-4">
                        <div>Products ordered</div>
                        <div className="bg-[green] text-white px-2 rounded-xl w-fit text-[10px]">
                          {orderHistory.orderStatus[0].toLocaleUpperCase() +
                            orderHistory.orderStatus.slice(1)}
                        </div>
                      </div>
                      <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-6 gap-4">
                        {orderHistory.products.map((product) => (
                          <div className="text-center">
                            <img
                              src={product.sizeAndColor[0].pictures[0]}
                              className="h-[120px] w-[120px] mx-auto rounded-md"
                            />
                            <div className="font-bold">
                              {product.productName}
                            </div>
                            <button
                              className="font-medium py-1 px-4 w-full border border-primary rounded-xl text-primary"
                              onClick={() => {
                                openMoreDetails(product);
                              }}
                            >
                              View More Details
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>
                    <div>
                      <div className="text-left md:text-right">
                        <div className="font-bold text-[20px] mb-2">
                          Shipping Details
                        </div>
                        <div className="flex flex-col gap-2">
                          <div>
                            <div className="font-medium text-[10px] text-[#aaa]">
                              State
                            </div>
                            <div className="font-medium text-[18px]">
                              {orderHistory.state[0].toLocaleUpperCase() +
                                orderHistory.state.slice(1)}
                            </div>
                          </div>
                          <div>
                            <div className="font-medium text-[10px] text-[#aaa]">
                              City
                            </div>
                            <div className="font-medium text-[18px]">
                              {orderHistory.city}
                            </div>
                          </div>
                          <div>
                            <div className="font-medium text-[10px] text-[#aaa]">
                              Address
                            </div>
                            <div className="font-medium text-[18px]">
                              {orderHistory.address}
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="text-left md:text-right mt-4">
                        <div className="font-medium text-[10px] text-[#aaa]">
                          Total
                        </div>
                        <div className="font-bold text-[20px]">
                          {currencySymbol}
                          {formatCurrency(orderHistory.totalCost)}
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div> */}
          </div>

          <Modal
            open={modalIsOpen}
            onClose={closeMoreDetails}
            aria-labelledby="modal-modal-title"
            aria-describedby="modal-modal-description"
          >
            <Box sx={style}>
              <Typography>
                <div className="flex justify-between items-center">
                  <div className="font-bold text-[25px] mb-8">
                    Order Product Detail
                  </div>
                  <button onClick={closeMoreDetails}>
                    <CgClose size={25} />
                  </button>
                </div>
                <div className="flex gap-10 items-center p-8">
                  <div className="w-full md:w-1/2">
                    <Slider ref={sliderRef} {...settings}>
                      {productModalDetails?.sizeAndColor.map((value) => {
                        return [
                          ...value.pictures.map((pic) => (
                            <div>
                              <img
                                src={pic}
                                className="h-[400px] w-[400px] mx-auto rounded-xl"
                              />
                            </div>
                          )),
                        ];
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
                      <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4">
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
              </Typography>
            </Box>
          </Modal>
        </div>
      </div>
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
                    return row.sizeColorQuantity?.map((nestedRow) => (
                      <TableRow
                        key={row._id}
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
                <div>Grand Total Paid:</div>
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
