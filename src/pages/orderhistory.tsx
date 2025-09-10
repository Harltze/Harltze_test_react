import { useEffect, useRef, useState } from "react";
import { ProductWithQuantity } from "../../store/cartStore";
import OtherPageHeader from "../components/OtherPageHeader";
import DefaultLayout from "../components/layout/DefaultLayout";
import { formatCurrency, getCurrencySymbol } from "../../utils/formatCurrency";
import { useOrders } from "../../hooks/useOrders";
import { Bounce } from "react-activity";
import Slider from "react-slick";
import { FaAngleLeft, FaAngleRight } from "react-icons/fa";
import { CgClose } from "react-icons/cg";
import { toast } from "react-toastify";
import { errorHandler } from "../../utils/errorHandler";
import { useCMS } from "../../hooks/useCMS";
import { CMSInterface } from "./adminpages/cms-settings";
import { getShippingStatusText } from "../../utils/getShippingValueText";
import {
  Box,
  Typography,
  Modal,
  Paper,
  TableContainer,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
} from "@mui/material";
import moment from "moment";
import SwatchComponent from "../components/SwatchComponent";

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

interface OrderHistoryInterfaceInterface {
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
  width: 400,
  bgcolor: "background.paper",
  boxShadow: 24,
  p: 4,
  borderRadius: 2,
};

export default function OrderHistory() {
  // const navigate = useNavigate();

  const [cms, setCMS] = useState<CMSInterface | null>(null);
  const { getCMSRecord } = useCMS();

  const fetchCMS = async () => {
    try {
      const cmsContent = await getCMSRecord();
      setCMS(cmsContent.data.result);
      console.log(cmsContent.data.result);
    } catch (error) {
      toast.error(
        errorHandler(
          error,
          "Contents failed to load, kindly refresh this page..."
        )
      );
    }
  };
  useEffect(() => {
    fetchCMS();
  }, []);

  const [orderhistoryDetails, setOrderHistoryDetails] =
    useState<OrderHistoryInterfaceInterface>({
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

  const [modalIsOpen, setIsOpen] = useState(false);

  const [isShippingFeeShowing, setShippingFeeShowing] = useState(false);
  const [shippingFeeValue, setShippingFeeValue] = useState(0);

  // const openShippingHistoryModal = (shippingFee: number) => {
  //   setShippingFeeValue(shippingFee);
  //   setShippingFeeShowing(true);
  // };

  const closeShippingHistoryModal = () => {
    setShippingFeeValue(0);
    setShippingFeeShowing(false);
  };

  // function openModal() {
  //   setIsOpen(true);
  // }

  function closeModal() {
    setIsOpen(false);
  }

  const currencySymbol = getCurrencySymbol();

  const { getOrderHistory, isOrderHistoryLoading } = useOrders();

  const fetchOrderHistory = async (page: number, limit: number) => {
    const response = await getOrderHistory(page, limit);

    // console.log(response.data.result);

    setOrderHistoryDetails(response.data.result);
  };

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

  useEffect(() => {
    fetchOrderHistory(1, 10);
  }, []);

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

  return (
    <DefaultLayout
      socialMediaLinks={cms?.socialMedia}
      footerLinks={cms?.footer}
      footerCopyright={cms?.copyrightFooter}
    >
      <OtherPageHeader header="Order history" />
      <Modal
        open={isShippingFeeShowing}
        onClose={closeShippingHistoryModal}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
        // contentLabel="Example Modal"
      >
        <Box sx={style}>
          <Typography>
            <ShippingStatusModal
              shippingFeeValue={shippingFeeValue}
              closeShippingStatusModal={closeShippingHistoryModal}
            />
          </Typography>
        </Box>
      </Modal>
      <section
        // id="about"
        className="flex flex-col gap-10 py-10 px-10 xl:px-[140px] min-h-[70vh]"
      >
        <div className="flex flex-col gap-10">
          {isOrderHistoryLoading && <Bounce size={20} className="mx-auto" />}
          {!isOrderHistoryLoading && orderhistoryDetails.docs.length == 0 && (
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
                        {/* <TableCell>Customer Details</TableCell> */}
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
                            {/* <TableCell component="th" scope="row">
                              <div>
                                {row?.customerId?.firstName}{" "}
                                {row?.customerId?.lastName}
                              </div>
                              <div>{row?.customerId?.phoneNumber}</div>
                              <div>{row?.customerId?.email}</div>
                            </TableCell> */}
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
        </div>

        <Modal
          open={modalIsOpen}
          onClose={closeMoreDetails}
          aria-labelledby="modal-modal-title"
          aria-describedby="modal-modal-description"
          // contentLabel="Example Modal"
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
                    {productModalDetails?.sizeColorQuantity?.map((picture) => {
                      return picture.pictures.map((p) => {
                        return (
                          <div>
                            <img
                              src={p}
                              className="h-[400px] w-[400px] mx-auto rounded-xl"
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
      </section>
      <Modal
        open={isOrderWithVariationsOpen}
        onClose={closeOrderVariantModal}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box
          sx={{
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
          }}
        >
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
                              <SwatchComponent
                                colorCode={nestedRow?.colorCode}
                              />
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
    </DefaultLayout>
  );
}

const ShippingStatusModal = ({
  shippingFeeValue,
  closeShippingStatusModal,
}: {
  shippingFeeValue: number;
  closeShippingStatusModal: () => void;
}) => {
  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <div className="font-bold text-[25px]">Update Shipping Status</div>
        <button onClick={closeShippingStatusModal}>
          <CgClose size={25} />
        </button>
      </div>
      <div>
        <div>Update order status</div>
        <div className="flex flex-col gap-4 mt-4 py-4 h-[180px] overflow-y-auto">
          <div>
            <input type="checkbox" checked={shippingFeeValue >= 1} /> Order
            Placed
          </div>
          <div>
            <input type="checkbox" checked={shippingFeeValue >= 2} /> Order
            Received
          </div>
          <div>
            <input type="checkbox" checked={shippingFeeValue >= 3} /> Order
            Accepted / Processing
          </div>
          <div>
            <input type="checkbox" checked={shippingFeeValue >= 4} /> Order
            Ready for Dispatch
          </div>
          <div>
            <input type="checkbox" checked={shippingFeeValue >= 5} /> Order
            Shipped
          </div>
          <div>
            <input type="checkbox" checked={shippingFeeValue >= 6} /> Order Out
            for Delivery
          </div>
          <div>
            <input type="checkbox" checked={shippingFeeValue >= 7} /> Order
            Delivered
          </div>
          <div>
            <input type="checkbox" checked={shippingFeeValue >= 8} /> Feedback
            Request
          </div>
        </div>
      </div>
    </div>
  );
};
