import { useEffect, useState } from "react";
import AdminDasboardLayout from "../../components/layout/AdminDasboardLayout";
import {
  CategoryInterface,
  ClotheCollectionInterface,
} from "../../../interfaces/ProductInterface";
import { useCategory } from "../../../hooks/useCategory";
import { toast } from "react-toastify";
import { errorHandler } from "../../../utils/errorHandler";
import { Bounce } from "react-activity";
import { IoMdArrowRoundBack } from "react-icons/io";
import { useClothesCollection } from "../../../hooks/useClothesCollections";
import {
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from "@mui/material";
import moment from "moment";

export default function AdminCategories() {
  const [idToEdit, setIdToEdit] = useState("");
  const [tabValue, setTabvalue] = useState("list");

  const [allCategories, setAllCategories] = useState<CategoryInterface[]>([]);
  const [allClothesCollections, setAllClothesCollections] = useState<
    ClotheCollectionInterface[]
  >([]);

  const [categoryName, setCategoryName] = useState("");
  const [productOrStudio, setProductOrStudio] = useState("");
  const [selectedCollectionId, setSelectedCollectionId] = useState("");

  const {
    getAllCategories,
    addNewCategory,
    deleteCategory,
    isAddCategoryLoading,
    isCategoriesLoading,
    isUpdateCategoryLoading,
    updateCategory,
  } = useCategory();

  const { getAllCollections } = useClothesCollection();

  const fetchCategories = async () => {
    const response = await getAllCategories();
    console.log(response.data.result);
    setAllCategories(response.data.result);
  };

  const fetchCollections = async () => {
    try {
      const response = await getAllCollections(productOrStudio);
      setAllClothesCollections(response.data.result);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, [tabValue]);

  useEffect(() => {
    fetchCollections();
  }, [productOrStudio]);

  useEffect(() => {
    fetchCollections();
  }, []);

  const addOrEditCategory = async () => {
    if (idToEdit) {
      const response = await updateCategory(
        categoryName,
        selectedCollectionId,
        idToEdit
      );
      if (response.data.status == 200) {
        toast.success("Category updated successfully");
        setCategoryName("");
        setTabvalue("list");
        fetchCategories();
      } else {
        console.log(response);
        toast.error(errorHandler(response.error));
      }
    } else {
      const response = await addNewCategory(
        categoryName,
        selectedCollectionId,
        productOrStudio
      );
      if (response.data.status == 201) {
        toast.success("New category added successfully");
        setCategoryName("");
        setTabvalue("list");
        fetchCategories();
      } else {
        toast.error(errorHandler(response.error));
      }
    }
  };

  const deleteCategoryButton = async (categoryId: string) => {
    const response = await deleteCategory(categoryId);

    if (response.data.status == 200) {
      toast.success("Category deleted successfully");
      fetchCategories();
    } else {
      toast.error(errorHandler(response.error));
    }
  };

  return (
    <AdminDasboardLayout
      header={
        tabValue == "list"
          ? "Categories"
          : idToEdit
          ? "Update Category"
          : "Add Category"
      }
      showSearch={false}
    >
      <div>
        {tabValue == "list" && (
          <div className="text-right my-4">
            <button
              className="bg-primary py-2 px-4 rounded-md text-white font-medium"
              onClick={() => {
                setTabvalue("form");
                setIdToEdit("");
                setCategoryName("");
              }}
            >
              Add new category
            </button>
          </div>
        )}

        {tabValue == "form" && (
          <div className="my-4">
            <button
              onClick={() => {
                setTabvalue("list");
                setIdToEdit("");
                setCategoryName("");
              }}
              className="flex gap-2 items-center"
            >
              <IoMdArrowRoundBack /> Back
            </button>
          </div>
        )}

        {isCategoriesLoading && <Bounce />}
        {tabValue == "list" && (
          <div>
            {allCategories?.length == 0 ? (
              <div>
                <div className="font-bold text-[25px] text-center">
                  No Category Added
                </div>
              </div>
            ) : (
              <div>
                <TableContainer component={Paper}>
                  <Table sx={{ minWidth: 650 }} aria-label="simple table">
                    <TableHead>
                      <TableRow>
                        <TableCell>Name</TableCell>
                        <TableCell>Collection</TableCell>
                        <TableCell>Type</TableCell>
                        <TableCell>Action</TableCell>
                        <TableCell>Action</TableCell>
                        <TableCell>Created At</TableCell>
                        <TableCell>Updated At</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {allCategories.map((row) => (
                        <TableRow
                          key={row._id}
                          sx={{
                            "&:last-child td, &:last-child th": { border: 0 },
                          }}
                        >
                          <TableCell component="th" scope="row">
                            <div>{row?.name}</div>
                          </TableCell>
                          <TableCell component="th" scope="row">
                            <div>{row?.clotheCollection?.name}</div>
                          </TableCell>
                          <TableCell component="th" scope="row">
                            <div>{row.type}</div>
                          </TableCell>
                          <TableCell component="th" scope="row">
                            <button
                              className="rounded-md text-primary font-medium w-1/2"
                              onClick={() => {
                                setIdToEdit(row?._id);
                                setCategoryName(row?.name);
                                setTabvalue("form");
                              }}
                            >
                              Edit
                            </button>
                          </TableCell>
                          <TableCell component="th" scope="row">
                            <button
                              className="rounded-md text-[red] font-medium w-1/2"
                              onClick={() => {
                                deleteCategoryButton(row?._id);
                              }}
                            >
                              Delete
                            </button>
                          </TableCell>
                          <TableCell component="th" scope="row">
                            <div>{moment(row?.createdAt).format("LLLL")}</div>
                          </TableCell>
                          <TableCell component="th" scope="row">
                            <div>{moment(row?.updatedAt).format("LLLL")}</div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
                {/* {allCategories?.map((c) => (
                  <div className="text-center p-4 border border-2 border-solid border-[rgba(0,0,0,0.2)] rounded-xl flex flex-col justify-between">
                    <div className="font-medium text-[20px]">{c.name}</div>
                    <div className="text-[14px] font-bold bg-[green] text-white rounded-md px-2 w-fit mx-auto mt-2">
                      {c.type.toLocaleUpperCase()}
                    </div>
                    <div className="flex gap-2 mt-4">
                      <button
                        className="rounded-md text-primary font-medium w-1/2"
                        onClick={() => {
                          setIdToEdit(c._id);
                          setCategoryName(c.name);
                          setTabvalue("form");
                        }}
                      >
                        Edit
                      </button>
                      <button
                        className="rounded-md text-[red] font-medium w-1/2"
                        onClick={() => {
                          deleteCategoryButton(c._id);
                        }}
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                ))} */}
              </div>
            )}
          </div>
        )}

        {tabValue == "form" && (
          <div className="w-full h-[60vh] flex justify-center items-center">
            <div>
              <div className="mb-2">
                <div className=" mb-2 text-center font-bold text-[20px]">
                  {idToEdit ? "Update" : "Create new"} category
                </div>
                <input
                  value={categoryName}
                  onChange={(e) => {
                    setCategoryName(e.target.value);
                  }}
                  placeholder="Enter a category name"
                  className="py-1 px-2 w-full border border-2 border-primary rounded-md"
                />
              </div>
              {!idToEdit && (
                <>
                  <div>
                    <label>Product Or Studio</label>
                    <div>
                      <input
                        type="radio"
                        name="productorstudio"
                        value={"product"}
                        onChange={(e) => {
                          setProductOrStudio(e.target.value);
                        }}
                        checked={productOrStudio == "product"}
                      />{" "}
                      Product
                    </div>
                    <div>
                      <input
                        type="radio"
                        name="productorstudio"
                        value={"studio"}
                        onChange={(e) => {
                          setProductOrStudio(e.target.value);
                        }}
                        checked={productOrStudio == "studio"}
                      />{" "}
                      Studio
                    </div>
                  </div>
                  {productOrStudio && (
                    <div>
                      <label>Select {productOrStudio} collection</label>
                      <select
                        className="w-full p-2 mb-4"
                        value={selectedCollectionId}
                        onChange={(e) => {
                          setSelectedCollectionId(e.target.value);
                        }}
                      >
                        <option value={""}>Select collection...</option>
                        {allClothesCollections?.map((c) => (
                          <option value={c?._id}>{c?.name}</option>
                        ))}
                      </select>
                    </div>
                  )}
                </>
              )}
              <button
                onClick={addOrEditCategory}
                className="bg-primary text-white px-4 py-1 rounded-md w-full font-medium"
                disabled={isAddCategoryLoading || isUpdateCategoryLoading}
              >
                {isAddCategoryLoading || isUpdateCategoryLoading ? (
                  <Bounce />
                ) : idToEdit ? (
                  "Update"
                ) : (
                  "Create"
                )}{" "}
                Category
              </button>
            </div>
          </div>
        )}
      </div>
    </AdminDasboardLayout>
  );
}
