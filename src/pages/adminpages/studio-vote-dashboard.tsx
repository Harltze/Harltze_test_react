import { useEffect, useState } from "react";
import AdminDasboardLayout from "../../components/layout/AdminDasboardLayout";
import { toast } from "react-toastify";
import { errorHandler } from "../../../utils/errorHandler";
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
import { useBringBack } from "../../../hooks/useBringBack";
import { useClothesCollection } from "../../../hooks/useClothesCollections";
import { useCategory } from "../../../hooks/useCategory";
import {
  CategoryInterface,
  ProductInterface,
} from "../../../interfaces/ProductInterface";
import { Bounce } from "react-activity";
import { Parser } from "@json2csv/plainjs";

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

interface CustomerInterface {
  firstName: string;
  lastName: string;
  email: string;
}

interface BringBackInterface {
  _id: string;
  productId: ProductInterface;
  customerId: CustomerInterface;
  categories: CategoryInterface[];
  clothesCollections: CategoryInterface[];
  color: string;
  colorCode: string;
  size: string;
  createdAt: Date;
  updatedAt: Date;
}

interface PaginatedBringBackHistoryInterface {
  docs: BringBackInterface[];
  page: number;
  limit: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
  pagingCounter: number;
  totalDocs: number;
  totalPages: number;
}

export default function AdminStudioVote() {
  const { bringBackProductHistory, bringBackAllProductHistory } =
    useBringBack();
  const { getAllCategories } = useCategory();
  const { getAllCollections } = useClothesCollection();

  const [isExportLoading, setExportLoading] = useState(false);

  const newSearchParams = new URLSearchParams(location.search);

  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(20);
  const [categoryId, _setCategoryId] = useState("all");
  const [collectionId, _setCollectionId] = useState("all");
  const [_collectionList, setCollectionList] = useState<CategoryInterface[]>(
    []
  );
  const [_categoryList, setCategoryList] = useState<CategoryInterface[]>([]);
  const [bringBackHistory, setBringBackHistory] =
    useState<PaginatedBringBackHistoryInterface | null>(null);
  const [productCravingsCount, setProductCravingsCount] = useState(0);
  const [isCravingsLoading, setCravingsLoading] = useState(false);

  const [isPageModalOpen, setPageModalOpen] = useState(false);
  const [modalPageNumber, setModalPageNumber] = useState(0);
  const openModal = () => {
    setPageModalOpen(true);
  };

  const closeModal = () => {
    setPageModalOpen(false);
  };

  const fetchCategoryAndCollection = async () => {
    try {
      const categories = await getAllCategories();
      const collections = await getAllCollections();

      setCategoryList(categories.data.result);
      setCollectionList(collections.data.result);
    } catch (error) {
      toast.error(
        errorHandler(
          error,
          "An error occurred while trying to fetch collections and categories, kindly refresh."
        )
      );
    }
  };

  useEffect(() => {
    fetchCategoryAndCollection();
  }, []);

  const fetchBringBackProductHistory = async () => {
    try {
      setCravingsLoading(true);

      const response = await bringBackProductHistory(
        page,
        limit,
        newSearchParams.get("productid") || "",
        categoryId,
        collectionId
      );

      console.log("Bring back history", response.data.result);

      setBringBackHistory(response.data.result);
      setProductCravingsCount(response.data.bringBackCount);
    } catch (error) {
      toast.error(
        errorHandler(
          error,
          "An error occurred while trying to fetch payment history"
        )
      );
    } finally {
      setCravingsLoading(false);
    }
  };

  const bringBackAll = async () => {
    try {

      setExportLoading(true);

      const response = await bringBackAllProductHistory(
        newSearchParams.get("productid") || ""
      );

      console.log("Bring back history", response.data.result);

      if (response.data?.result.length == 0) {
        toast.error("No result to export");
        return;
      }

      const arrangedSubscribers = response.data.result.map((v: any) => {
        const value: any = {};
        value["Name"] = `${v.customerId?.firstName} ${v.customerId?.lastName}`;
        value["Email"] = v.customerId?.email;
        value["Product Name"] = v?.productId?.productName;
        value["Collection"] = v?.clothesCollections[0]?.name;
        value["Category"] = v?.categories[0]?.name;
        value["Color"] = v?.color;
        value["Color Code"] = v?.colorCode;
        value["Size"] = v?.size;
        value["Created At"] = moment(v.createdAt).format("LLLL");
        return value;
      });

      const opts = {};
      const parser = new Parser(opts);
      const csv = parser.parse(arrangedSubscribers);
      const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", "Cravings.csv");
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (error) {
      toast.error(
        errorHandler(
          error,
          "An error occurred while trying to fetch payment history"
        )
      );
    } finally {
      setExportLoading(false);
    }
  };

  useEffect(() => {
    fetchBringBackProductHistory();
  }, [page, limit, collectionId, categoryId]);

  const prevNextPageDesign = "py-1 px-4 font-medium rounded-md border border-2";

  return (
    <AdminDasboardLayout
      header="Studio Cravings Summary"
      searchPlaceholder="Search Products"
      showSearch={false}
    >
      <div className="mt-4">
        <div className="my-10 flex justify-between items-center">
          <div className="font-bold text-[20px]">
            {productCravingsCount} total craves
          </div>
          <div>
            <button onClick={bringBackAll} disabled={isExportLoading} className="px-4 py-2 bg-primary text-white rounded-md">{isExportLoading ? <Bounce color="white" /> :"Export as CSV"}</button>
          </div>
          {/* <div className="flex gap-4">
            <div className="flex flex-col items-start">
              <label className="font-bold text-sm">Choose Collection</label>
              <select
                value={collectionId}
                onChange={(e) => {
                  setCollectionId(e.target.value);
                }}
                className="px-10 py-2"
              >
                <option value="all">All</option>
                {collectionList.map((c) => (
                  <option value={c._id}>{c.name}</option>
                ))}
              </select>
            </div>
            <div className="flex flex-col items-start">
              <label className="font-bold text-sm">Choose Category</label>
              <select
                value={categoryId}
                onChange={(e) => {
                  setCategoryId(e.target.value);
                }}
                className="px-10 py-2"
              >
                <option value="all">All</option>
                {categoryList.map((c) => (
                  <option value={c._id}>{c.name}</option>
                ))}
              </select>
            </div>
          </div> */}
        </div>
        <div>
          {bringBackHistory && bringBackHistory?.docs.length > 0 ? (
            <div>
              <TableContainer component={Paper}>
                <Table sx={{ minWidth: 650 }} aria-label="simple table">
                  <TableHead>
                    <TableRow>
                      <TableCell>Customer Details</TableCell>
                      <TableCell>Product Details</TableCell>
                      <TableCell>Color/Color Code</TableCell>
                      <TableCell>Size</TableCell>
                      <TableCell>Created At</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {bringBackHistory.docs.map((row) => (
                      <TableRow
                        key={row._id}
                        sx={{
                          "&:last-child td, &:last-child th": { border: 0 },
                        }}
                      >
                        <TableCell component="th" scope="row">
                          <div>
                            Full Name: {row.customerId?.firstName}{" "}
                            {row.customerId?.lastName}
                          </div>
                          <div>Email: {row.customerId?.email}</div>
                        </TableCell>
                        <TableCell component="th" scope="row">
                          <div>Product Name: {row.productId?.productName}</div>
                          <div>Category: {row?.categories[0]?.name}</div>
                          <div>
                            Collection: {row?.clothesCollections[0]?.name}
                          </div>
                        </TableCell>
                        <TableCell>
                          {row.color} ({row.colorCode})
                        </TableCell>
                        <TableCell>{row.size}</TableCell>
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
                      if (bringBackHistory?.hasPrevPage) {
                        setPage(bringBackHistory?.page - 1);
                      }
                    }}
                    className={`${prevNextPageDesign} ${
                      bringBackHistory?.hasPrevPage
                        ? "text-primary border-primary"
                        : "text-primary/[0.5] border-primary/[0.5]"
                    }`}
                  >
                    <IoMdArrowRoundBack size={25} />
                  </button>
                  <div className="font-medium text-[16px]">
                    Page {bringBackHistory?.page} of{" "}
                    {bringBackHistory?.totalPages} (showing{" "}
                    <select
                      className="px-8 py-2 inline-block mx-2"
                      value={bringBackHistory?.limit}
                      onChange={(e) => {
                        setLimit(parseInt(e.target.value));
                      }}
                    >
                      <option value={10}>10</option>
                      <option value={20}>20</option>
                      <option value={50}>50</option>
                    </select>{" "}
                    per page)
                  </div>
                  <button
                    className={`py-1 px-4 font-medium text-primary border-primary text-[16px] text-medium`}
                    onClick={openModal}
                  >
                    Go to Page
                  </button>
                  <button
                    onClick={() => {
                      if (bringBackHistory?.hasNextPage) {
                        setPage(bringBackHistory?.page + 1);
                      }
                    }}
                    className={`${prevNextPageDesign} ${
                      bringBackHistory?.hasNextPage
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
                          Enter a page number between 1 and{" "}
                          {bringBackHistory.totalPages}
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
                              modalPageNumber > bringBackHistory.totalPages ||
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
          ) : isCravingsLoading ? (
            <div className="flex justify-center items-center w-full h-[200px]">
              <Bounce size={25} />
            </div>
          ) : (
            <div className="flex justify-center items-center text-center h-[400px]">
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
