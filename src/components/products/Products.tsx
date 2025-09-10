import { useEffect, useState } from "react";
import { ProductInterface } from "../../../interfaces/ProductInterface";
import { useProduct } from "../../../hooks/useProduct";
import { Bounce } from "react-activity";
import { Link, useNavigate, useSearchParams } from "react-router";
import { IoMdArrowRoundBack, IoMdArrowRoundForward } from "react-icons/io";
import { CgClose } from "react-icons/cg";
import { toast } from "react-toastify";
import { authStore } from "../../../store/authStore";
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
import {
  formatCurrency,
  getCurrencySymbol,
} from "../../../utils/formatCurrency";
import moment from "moment";
import VariantModal from "./VariantModal";
import DeleteProductModal from "./DeleteProductModal";
import SwatchComponent from "../SwatchComponent";

interface Props {
  header?: string;
  productOrStudio: "product" | "studio";
  isAdmin: boolean;
  // products: ProductInterface[];
  limit?: number;
  category?: string;
  query?: string;
  showPageControl?: boolean;
  setFetchedProductLength?: (value: number) => void;
  isDeleteModalOpen?: boolean;
  setDeleteModalOpen?: (value: boolean) => void;
  closeDeleteModal?: (value: boolean) => void;
}

interface FetchedProductsInterface {
  docs: ProductInterface[];
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

export default function Products({
  header,
  // category,
  query,
  isAdmin,
  // limit = 20,
  productOrStudio,
  showPageControl = false,
}: Props) {
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(20);

  const [fetchedProducts, setFetchedProducts] =
    useState<FetchedProductsInterface>({
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

  const [searchParams] = useSearchParams();

  // const [currentPage, _setCurrentPage] = useState(1);

  const navigate = useNavigate();

  const userDetails = authStore((state) => state.userDetails);

  const { getProductsPaginated, isProductsPaginatedLoading } = useProduct();

  const fetchProducts = async () => {
    // console.log("category", category, "query", query);
    const response = await getProductsPaginated(
      page,
      limit,
      searchParams?.get("category") ? searchParams?.get("category")!! : "",
      query,
      isAdmin,
      productOrStudio,
      searchParams?.get("clothescollections")
        ? searchParams?.get("clothescollections")!!
        : ""
    );
    // console.log("category", category);
    console.log(response.data.result);
    setFetchedProducts(response?.data?.result);
  };

  useEffect(() => {
    fetchProducts();
  }, [searchParams, query, page, limit]);

  // useEffect(() => {
  //   console.log("value", srch.get("query"));
  //   if(srch.get("query")?.length == 0) {
  //     fetchProducts(1);
  //   }
  // }, [srch.get("query")]);

  const [variations, setVariations] = useState<SizeAndColor[]>([]);
  const [showVariationModal, setShowVariationModal] = useState(false);

  const openVariationModal = (variations: SizeAndColor[]) => {
    setVariations(variations);
    setShowVariationModal(true);
  };

  const closeVariationModal = () => {
    setShowVariationModal(false);
    setVariations([]);
  };

  const [isPageModalOpen, setPageModalOpen] = useState(false);
  const [modalPageNumber, setModalPageNumber] = useState(0);
  const openModal = () => {
    setPageModalOpen(true);
  };

  const closeModal = () => {
    setPageModalOpen(false);
  };

  const [prodToDelete, setProdToDelete] = useState("");
  const [productName, setProductName] = useState("");
  const [isDeleteModalOpen, setDeleteModalOpen] = useState(false);

  const { deleteProduct } = useProduct();

  const openDeleteModal = (id: string, productName: string) => {
    setProdToDelete(id);
    setProductName(productName);
    setDeleteModalOpen(true);
  };

  const closeDeleteModal = async (shouldDelete: boolean, id?: string) => {
    if (shouldDelete) {
      await deleteProduct(id!!);
      toast.success("Product deleted successfully");
      fetchProducts();
    }
    setDeleteModalOpen(false);
  };

  const prevNextPageDesign = "py-1 px-4 font-medium rounded-md border border-2";

  return (
    <div>
      {header && <div>{header}</div>}
      <div>
        <Modal
          open={showVariationModal}
          onClose={closeVariationModal}
          aria-labelledby="modal-modal-title"
          aria-describedby="modal-modal-description"
          // contentLabel="Example Modal"
        >
          <Box sx={style}>
            <Typography>
              <div className="flex justify-between items-center mb-8">
                <div className="font-bold text-[20px]">Variants</div>
                <button onClick={closeVariationModal}>
                  <CgClose size={25} />
                </button>
              </div>
              <div className="w-full">
                <VariantModal variants={variations} />
              </div>
            </Typography>
          </Box>
        </Modal>
        <Modal
          aria-labelledby="modal-modal-title"
          aria-describedby="modal-modal-description"
          open={isDeleteModalOpen!!}
          onClose={() => {
            closeDeleteModal!!(false, "");
          }}
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
              p: 4,
              borderRadius: 2,
            }}
          >
            <DeleteProductModal
              productName={productName}
              productId={prodToDelete}
              closeModal={closeDeleteModal!!}
            />
          </Box>
        </Modal>
        {fetchedProducts.docs.length == 0 ? (
          <div className="w-full h-full flex justify-center items-center text-center">
            {isProductsPaginatedLoading ? (
              <Bounce />
            ) : (
              <div className="font-bold text-[25px]">
                {userDetails.role == "admin" ||
                userDetails.role == "marketer" ? (
                  <div>
                    <div>No product added</div>
                    <button
                      className="bg-primary text-white px-8 py-2 font-bold rounded-md"
                      onClick={() => {
                        navigate("/admin/addoredit");
                      }}
                    >
                      Add Product
                    </button>
                  </div>
                ) : (
                  "No product added"
                )}
              </div>
            )}
          </div>
        ) : (
          <div>
            <div>
              {fetchedProducts.docs.length > 0 ? (
                <TableContainer component={Paper}>
                  <Table sx={{ minWidth: 650 }} aria-label="simple table">
                    <TableHead>
                      <TableRow>
                        <TableCell>Product Image</TableCell>
                        <TableCell>Product Name</TableCell>
                        <TableCell>Colors</TableCell>
                        <TableCell>Price</TableCell>
                        <TableCell>Variation Action</TableCell>
                        <TableCell>Action</TableCell>
                        <TableCell>Created At</TableCell>
                        <TableCell>Updated At</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {fetchedProducts?.docs?.map((row) => (
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
                            <img
                              src={row?.sizeAndColor[0]?.pictures[0]}
                              className="h-[80px] w-fit rounded-md mx-auto"
                            />
                          </TableCell>
                          <TableCell component="th" scope="row">
                            <div>{row?.productName}</div>
                          </TableCell>
                          <TableCell component="th" scope="row">
                            <div className="grid grid-cols-4 gap-2">
                              {row?.sizeAndColor.map((s) => (
                                <SwatchComponent colorCode={s?.colorCode} />
                                // <div
                                //   className="h-[20px] w-[20px] rounded-full"
                                //   style={{ backgroundColor: s?.colorCode }}
                                // ></div>
                              ))}
                            </div>
                          </TableCell>
                          <TableCell component="th" scope="row">
                            {getCurrencySymbol()}
                            {formatCurrency(row?.cost)}
                          </TableCell>
                          <TableCell component="th" scope="row">
                            <div>
                              {(productOrStudio == "studio") && (<button
                                onClick={() => {
                                  navigate(
                                    `/admin/cravings-summary?productid=${row?._id}`
                                  );
                                }}
                                className="border border-2 border-solid border-primary text-primary w-full text-center px-2 rounded-md font-bold mb-2"
                              >
                                View Cravings
                              </button>)}
                              <button
                                onClick={() => {
                                  openVariationModal(row?.sizeAndColor);
                                }}
                                className="w-full inline-block border border-primary border-2 px-4 py-1 rounded-md text-primary"
                              >
                                View
                              </button>
                            </div>
                          </TableCell>
                          <TableCell component="th" scope="row">
                            <div className="flex flex-col gap-2">
                              <Link
                                to={`/admin/addoredit?id=${row?._id}`}
                                className="w-full inline-block border border-primary border-2 px-4 py-1 rounded-md text-primary"
                              >
                                Edit
                              </Link>
                              <button
                                onClick={() => {
                                  openDeleteModal(row._id!!, row.productName);
                                }}
                                className="w-full inline-block border border-[red] border-2 px-4 py-1 rounded-md text-[red]"
                              >
                                Delete
                              </button>
                            </div>
                          </TableCell>
                          {/* <TableCell>
                                                {row.paymentStatus == "paid" ? <div className="text-center bg-[green]/[0.2] text-[green] font-bold w-fit rounded-md py-1 px-4">PAID</div> : (
                                                  <button onClick={() => {markAsPaidButton(row._id)}} className="px-8 py-2 rounded-md bg-primary text-white">Mark as paid</button>
                                                )}
                                              </TableCell> */}
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
              ) : isProductsPaginatedLoading ? (
                <div className="flex-center justify-center items-center h-[200px]">
                  <Bounce />
                </div>
              ) : (
                <div className="flex-center justify-center items-center h-[200px]">
                  No products found
                </div>
              )}

              {/* {fetchedProducts.docs.map((product: ProductInterface) => (
                <ProductCard
                  _id={product._id}
                  productName={product.productName}
                  description={product.description}
                  categories={product.categories}
                  sizeAndColor={product.sizeAndColor}
                  cost={product.cost}
                  stockStatus={product.stockStatus}
                  clothesCollections={product.clothesCollections}
                  forType={product.forType}
                  productStatus={product.productStatus}
                  isAdmin={isAdmin}
                  refreshProducts={fetchProducts}
                />
              ))} */}
            </div>
            {showPageControl && (
              <div>
                <div className="flex gap-2 justify-center items-center mt-4">
                  <button
                    onClick={() => {
                      if (fetchedProducts.hasPrevPage) {
                        setPage(fetchedProducts.nextPage);
                      }
                    }}
                    className={`${prevNextPageDesign} ${
                      fetchedProducts.hasPrevPage
                        ? "text-primary border-primary"
                        : "text-primary/[0.5] border-primary/[0.5]"
                    }`}
                  >
                    <IoMdArrowRoundBack size={25} />
                  </button>
                  <div className="font-medium text-[16px]">
                    Page {fetchedProducts.page} of {fetchedProducts.totalPages}
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
                    pages. (showing {fetchedProducts.limit} per page)
                  </div>
                  <button
                    className={`py-1 px-4 font-medium text-primary border-primary text-[16px] text-medium`}
                    onClick={openModal}
                  >
                    Go to Page
                  </button>
                  <button
                    onClick={() => {
                      if (fetchedProducts.hasNextPage) {
                        setPage(fetchedProducts.prevPage);
                      }
                    }}
                    className={`${prevNextPageDesign} ${
                      fetchedProducts.hasNextPage
                        ? "text-primary border-primary"
                        : "text-primary/[0.5] border-primary/[0.5]"
                    }`}
                  >
                    <IoMdArrowRoundForward size={25} />
                  </button>
                </div>
              </div>
            )}
          </div>
        )}
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
                  Enter a page number between 1 and {fetchedProducts.totalPages}
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
                      modalPageNumber > fetchedProducts.totalPages ||
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
    </div>
  );
}
