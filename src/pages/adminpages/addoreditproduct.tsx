import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import AdminDasboardLayout from "../../components/layout/AdminDasboardLayout";
import { useCategory } from "../../../hooks/useCategory";
import { useClothesCollection } from "../../../hooks/useClothesCollections";
import { toast } from "react-toastify";
import { v4 } from "uuid";
import { IoClose } from "react-icons/io5";
import { useFileUpload } from "../../../hooks/useFileUploads";
import { useProduct } from "../../../hooks/useProduct";
import { Bounce } from "react-activity";
import { errorHandler } from "../../../utils/errorHandler";
import { useLocation } from "react-router";
import Joi from "joi";
// import { AiFillCloseCircle } from "react-icons/ai";
import { FaTrash } from "react-icons/fa";
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
import ReactQuill from "react-quill";
import { CgClose } from "react-icons/cg";
import { authStore } from "../../../store/authStore";

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

interface SizeAndQuantity {
  size: string;
  quantityAvailable: number;
  sku: string;
}

interface SizeAndColor {
  _id: string;
  sizes: SizeAndQuantity[];
  color: string;
  colorCode: string;
  // quantityAvailable: number;
  pictures: string[];
}

interface CollectionInterface {
  _id: string;
  name: string;
  type: string;
  slug: string;
  createdAt: Date;
  updatedAt: Date;
}

interface CategoryInterface {
  _id: string;
  name: string;
  clotheCollection: string;
  type: string;
  slug: string;
  createdAt: Date;
  updatedAt: Date;
}

interface SizesArrayInterface {
  title: string;
  xs: string;
  s: string;
  m: string;
  l: string;
  xl: string;
  xxl: string;
}

const useQuery = () => {
  return new URLSearchParams(useLocation().search);
};

export default function AdminAddOrEdit() {
  const [productName, setProductName] = useState("");
  const [description, setDescription] = useState("");
  const [cost, setCost] = useState<number>(0);
  const [categories, setCategories] = useState<string[]>([]);
  const [clothesCollections, setClothesCollections] = useState<string[]>([]);
  const [forType, setForType] = useState<string[]>([]);
  const [sizes, setSizes] = useState<SizeAndQuantity[]>([]);
  const [sizeInput, setSizeInput] = useState("");
  const [isNumericSize, setNumericSize] = useState(false);
  const [color, setColor] = useState("");
  const [quantityAvailable, setQuantityAvailable] = useState<number>(0);
  const [sizeAndColor, setSizeAndColor] = useState<SizeAndColor[]>([]);
  const [colorCode, setColorCode] = useState<string>("");
  const [imagePreviews, setImagePreviews] = useState<string[]>([]);
  const [imageForUpdates, setImageForUpdates] = useState<string[]>([]);
  const [stockStatus, setStockStatus] = useState("in-stock");
  const [isPreviewModalOpen, setPreviewModalOpen] = useState(false);
  const [picToPreview, setPicToPreview] = useState("");
  const [totalRequiredCravings, setTotalRequiredCravings] = useState(0);
  const [sku, setSku] = useState("");

      const [sizesArray, setSizesArray] = useState<SizesArrayInterface[]>([]);

    const [title, setTitle] = useState("");
    const [xs, setXs] = useState("");
    const [s, setS] = useState("");
    const [m, setM] = useState("");
    const [l, setL] = useState("");
    const [xl, setXl] = useState("");
    const [xxl, setXxl] = useState("");

  const openPreviewModal = (pictureUrl: string) => {
    setPicToPreview(pictureUrl);
    setPreviewModalOpen(true);
  };

  const closePreviewModal = () => {
    setPicToPreview("");
    setPreviewModalOpen(false);
  };

  const {
    uploadProduct,
    isUploadProductsLoading,
    getProductById,
    isSingleProductLoading,
    editProduct,
    isEditProductsLoading,
    checkIfSKUIsAlreadyUsed,
  } = useProduct();

  // const [imageFiles, setImageFiles] = useState<File[]>([]);

  const toggleForType = (val: string) => {
    if (forType.includes(val)) {
      setForType(forType.filter((s) => s != val));
    } else {
      setForType(forType.concat(val));
    }
  };

  const addToSizeChart = () => {

    if(!title) {
      toast.error("Title is required!");
      return;
    }

    const duplicate = sizesArray.find(s => s.title == title);

    if(duplicate) {
      toast.error("Duplicate size title deteted");
      return;
    }

    setSizesArray((prev) => ([
      ...prev,
      {title, xs, s, m, l, xl, xxl}
    ]));
    setTitle("");
    setXs("");
    setS("");
    setM("");
    setL("");
    setXl("");
    setXxl("");
  }

  const removeFromSizeChart = (title: string) => {
    setSizesArray((prev) => prev.filter(value => value.title != title));
  }

  const userDetails = authStore((state) => state.userDetails);

  const query = useQuery();

  const editableId = query.get("id");

  const { uploadFile, isFileUploadLoading } = useFileUpload();

  const { getAllCategories } = useCategory();
  const { getAllCollections } = useClothesCollection();

  const [allCategories, setAllCategories] = useState<CategoryInterface[]>([]);
  const [allCollections, setAllCollections] = useState<CollectionInterface[]>(
    []
  );

  const fetchCategories = async () => {
    const res = await getAllCollections();
    setAllCollections(res.data.result);
    // setAllCategories(response.data.result);
  };

  const addSize = async () => {
    try {
      if (!sizeInput || !quantityAvailable) {
        toast.error("Size and quantity are required");
        return;
      }

      if (!sku) {
        toast.error("SKU is required");
        return;
      }

      const v = await checkIfSKUIsAlreadyUsed(sku);

      const variationSku = sizes.map((v) => v.sku);
      console.log(v);
      console.log(variationSku, sku);
      if (v.data.result || variationSku.includes(sku)) {
        toast.error("SKU is already used");
        return;
      }

      const duplicateSize = sizes.find(
        (value: SizeAndQuantity) => value.size == sizeInput
      );
      if (duplicateSize) {
        toast.error(
          "Size already exists in list of sizes for the current variation"
        );
        return;
      }
      const updatedSize = [
        { size: sizeInput, quantityAvailable, sku },
        ...sizes,
      ];
      setSizes(updatedSize);
      setSizeInput("");
      setSku("");
      setQuantityAvailable(0);
    } catch (error) {
      toast.error(
        errorHandler(
          error,
          "An error occurred while trying to add/update variant."
        )
      );
    }
  };

  const removeSize = (size: string) => {
    const updatedSize = sizes.filter((value) => value.size != size);
    setSizes(updatedSize);
  };

  useEffect(() => {
    fetchCategories();

    if (editableId) {
      const editableProduct = async () => {
        const response = await getProductById(editableId);

        const productDetails = response.data.result;

        console.log("productDetails", productDetails);

        setProductName(productDetails.productName);
        setDescription(productDetails.description);
        setCost(productDetails.cost / 100);
        setCategories(productDetails.categories.map((c: any) => c?._id));
        setClothesCollections(
          productDetails?.clothesCollections?.map((c: any) => c?._id)
        );
        setForType(productDetails.forType);
        setTotalRequiredCravings(productDetails.totalRequiredCravings);
        setImageForUpdates(productDetails.pictures);
        setSizeAndColor(
          productDetails.sizeAndColor.map((s: SizeAndColor) => ({
            sizes: s.sizes,
            color: s.color,
            colorCode: s.colorCode,
            pictures: s.pictures,
            // quantityAvailable: s.quantityAvailable,
          }))
        );
        setStockStatus(productDetails.stockStatus);
      };
      editableProduct();
    }
  }, []);

  const removeImage = (imageUrl: string) => {
    const updatedPreviewImages = imagePreviews.filter(
      (p: string) => p != imageUrl
    );
    setImagePreviews(updatedPreviewImages);
  };

  const quillRef = useRef(null);

  const modules = useMemo(
    () => ({
      toolbar: [
        [{ header: [1, 2, 3, 4, 5, 6, false] }], // Headers
        ["bold", "italic", "underline", "strike"], // Inline formatting
        ["blockquote", "code-block"], // Block formatting
        [{ list: "ordered" }, { list: "bullet" }], // Lists
        [{ script: "sub" }, { script: "super" }], // Subscript/Superscript
        [{ indent: "-1" }, { indent: "+1" }], // Indentation
        [{ direction: "rtl" }], // Text direction
        [{ size: ["small", false, "large", "huge"] }], // Font size
        [{ color: [] }, { background: [] }], // Text color and background
        [{ font: [] }], // Font family
        [{ align: [] }], // Text alignment
        // ['link', 'image', 'video'], // Embeds
        ["clean"], // Remove formatting
      ],
      // You can add other modules like 'syntax' for code highlighting, etc.
    }),
    []
  );

  // Define the formats that the editor will support
  // This should match the formats enabled by your modules
  const formats = [
    "header",
    "bold",
    "italic",
    "underline",
    "strike",
    "blockquote",
    "list",
    "bullet",
    "indent",
    "link",
    "image",
    "video",
    "code-block",
    "script",
    "direction",
    "size",
    "color",
    "background",
    "font",
    "align",
    "clean",
  ];

  const addSizeAndColor = () => {
    const { error } = Joi.object({
      sizes: Joi.array()
        .items({
          size: Joi.string().required(),
          quantityAvailable: Joi.number().required(),
          sku: Joi.string().required(),
        })
        .min(1)
        .required()
        .messages({
          "array.empty": "Sizes can not be empty",
        }),
      color: Joi.string().required().messages({
        "string.empty": "Color can not be empty",
      }),
      colorCode: Joi.string().required().messages({
        "string.empty": "Color code can not be empty",
      }),
      imageForUpdates: Joi.array().min(2).required().messages({
        "array.empty": "Image can not be empty",
        "array.min": "Kindly upload at least two or more images",
      }),
    }).validate({
      sizes,
      color,
      colorCode,
      imageForUpdates: imagePreviews,
    });

    console.log("imageForUpdates", imageForUpdates);

    if (error) {
      toast.error(error.message);
      return;
    }



    // if (!size || !color || !colorCode || quantityAvailable == 0 || imageForUpdates.length == 0) {
    //   toast.error("Size and color values are required!");
    //   return;
    // }

    setSizeAndColor(
      sizeAndColor.concat({
        _id: v4(),
        sizes,
        color: color.toLocaleUpperCase(),
        colorCode,
        // quantityAvailable,
        pictures: imagePreviews,
      })
    );
    // setSize("");
    setColor("");
    setColorCode("");
    setQuantityAvailable(0);
    setImageForUpdates([]);
    setImagePreviews([]);
  };

  const removeColor = (id: string) => {
    setSizeAndColor(sizeAndColor.filter((s) => s._id != id));
  };

  const toggleCategory = useCallback(
    (id: string) => {
      // if (categories.includes(id)) {
      //   setCategories(categories.filter((c) => c != id));
      // } else {
      //   setCategories(categories.concat(id));
      // }
      setCategories([id]);
    },
    [categories, allCategories]
  );

  const toggleCollection = useCallback(
    (id: string) => {
      // if (clothesCollections.includes(id)) {
      //   setClothesCollections(clothesCollections.filter((c) => c != id));
      // } else {
      //   setClothesCollections(clothesCollections.concat(id));
      // }
      setClothesCollections([id]);
    },
    [clothesCollections, allCollections]
  );

  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    try {
      const files = e.target.files;

      if (files) {
        const imageUrls: Promise<any>[] = Array.from(files).map(
          async (file) => {
            // URL.createObjectURL(file)
            return (await uploadFile(file)).data.result.fileUrl;
          }
        );
        const allFilesUploaded = await Promise.all(imageUrls);
        setImagePreviews([...imagePreviews, ...allFilesUploaded]); // Create preview URLs for selected images
      }
    } catch (error) {
      toast.error("An error occurred while trying to upload pictures");
    }
  };

  // const uploadImages = async () => {
  //   const uploads: string[] = [];
  //   if (imageFiles != null) {
  //     const fileArray = Array.from(imageFiles);

  //     for (let i = 0; i < fileArray.length; i++) {
  //       const response = await uploadFile(fileArray[i]);
  //       uploads.push(response.data.result.fileUrl);
  //     }

  //     return uploads;
  //   }
  // };

  const publishProduct = async (productStatus: string) => {
    try {
      // let uploads: string[] = [];

      // if (imageFiles) {
      //   const fileArray = Array.from(imageFiles).length;
      //   if (fileArray >= 2) {
      //     uploads = (await uploadImages()) as string[];
      //   } else {
      //     toast.error("You have to upload at least two product images");
      //   }
      // }

      if (editableId) {
        const response = await editProduct({
          _id: editableId,
          productName,
          description,
          cost,
          forType,
          stockStatus,
          totalRequiredCravings,
          clothesCollections,
          sizeAndColor: sizeAndColor.map((s) => ({
            sizes: s.sizes.map((v) => ({
              size: v.size,
              quantityAvailable: v.quantityAvailable,
              sku: v.sku,
            })),
            color: s.color,
            colorCode: s.colorCode,
            pictures: s.pictures,
            // quantityAvailable: s.quantityAvailable,
          })),
          categories,
          productStatus,
          sizeChart: sizesArray
        });

        if (response.data.status == 200) {
          toast.success("Product Updated Successfully");
        } else {
          toast.error(errorHandler(response.data.error));
        }
      } else {
        // const uploads = await uploadImages();

        const response = await uploadProduct({
          productName,
          description,
          cost,
          forType,
          clothesCollections,
          stockStatus,
          totalRequiredCravings,
          // sizeAndColor: sizeAndColor.map((s: SizeAndColor) => ({
          //   sizes: s.sizes,
          //   color: s.color,
          //   colorCode: s.colorCode,
          //   pictures: s.pictures,
          //   // quantityAvailable: s.quantityAvailable,
          // })),
          sizeAndColor: sizeAndColor.map((s) => ({
            sizes: s.sizes.map((v) => ({
              size: v.size,
              quantityAvailable: v.quantityAvailable,
              sku: v.sku,
            })),
            color: s.color,
            colorCode: s.colorCode,
            pictures: s.pictures,
            // quantityAvailable: s.quantityAvailable,
          })),
          categories,
          productStatus,
          sizeChart: sizesArray
        });

        if (response.data.status == 201) {
          toast.success("Product Uploaded Successfully");
          setProductName("");
          setDescription("");
          setStockStatus("");
          setCost(0);
          setTotalRequiredCravings(0);
          setCategories([]);
          setForType([]);
          setImagePreviews([]);
          setImageForUpdates([]);
          setSizeAndColor([]);
          setSizes([]);
          setSizesArray([]);
        } else {
          toast.error(errorHandler(response.data.error));
        }
      }
    } catch (error) {
      console.log(error);
      toast.error(
        errorHandler(error, "An error occurred while uploading product")
      );
    }
  };

  const fetchCategoriesForCollection = async () => {
    try {
      if (clothesCollections[0]) {
        const response = await getAllCategories(clothesCollections[0]);
        setAllCategories(response.data.result);
      } else {
        setAllCategories([]);
      }
    } catch (error) {
      toast.error(errorHandler(error));
    }
  };

  useEffect(() => {
    fetchCategoriesForCollection();
  }, [clothesCollections]);

  const collectionType = useMemo(() => {
    setCategories([]);
    return allCollections?.find((c) => c._id == clothesCollections[0])?.type;
  }, [clothesCollections]);

  return (
    <AdminDasboardLayout
      header={editableId ? "Update product" : " Add Product"}
      showSearch={false}
    >
      {isSingleProductLoading && (
        <div className="text-center">
          <Bounce color="black" size={25} />
        </div>
      )}

      <Modal
        open={isPreviewModalOpen}
        onClose={closePreviewModal}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          <Typography id="modal-modal-title" variant="h6" component="h2">
            <div className="flex justify-between items-center">
              <div>Image</div>
              <IoClose onClick={closePreviewModal} />
            </div>
          </Typography>
          <Typography id="modal-modal-description" sx={{ mt: 2 }}>
            <img src={picToPreview} className="rounded-[8px]" />
          </Typography>
        </Box>
      </Modal>

      <div className="flex flex-col md:flex-row gap-10 mb-10">
        <div className="w-full flex flex-col gap-4">
          <div className="font-bold text-[20px]">Product Details</div>
          <div className="flex flex-col">
            <label className="text-[14px]">Product Name</label>
            <input
              type="text"
              value={productName}
              onChange={(e) => {
                setProductName(e.target.value);
              }}
              placeholder="E.g T-shirt"
              className="border border-2 border-solid border-primary py-2 px-4 rounded-md"
            />
          </div>

          <div className="flex flex-col">
            <label className="text-[14px]">Description</label>
            <ReactQuill
              ref={quillRef}
              theme="snow" // 'snow' is a clean, modern theme, 'bubble' is another option
              value={description} // The HTML content to display in the editor
              onChange={setDescription} // Callback for content changes
              modules={modules} // Toolbar and other functionality
              formats={formats} // Allowed content formats
              placeholder="Start typing your content here..."
              className={"h-64 mb-10 rounded-md"} // Set a height for the editor and add margin-bottom
            />
            {/* <textarea
              value={description}
              onChange={(e) => {
                setDescription(e.target.value);
              }}
              placeholder="E.g Here is a really nice product"
              className="border border-2 border-solid border-primary py-2 px-4 rounded-md"
            /> */}
          </div>

          {collectionType == "product" && (
            <div className="flex flex-col mt-20">
              <label className="text-[14px]">Stock Status</label>
              <div>
                <input
                  type="radio"
                  checked={stockStatus == "in-stock"}
                  onClick={() => {
                    setStockStatus("in-stock");
                  }}
                />{" "}
                In stock
              </div>
              <div>
                <input
                  type="radio"
                  checked={stockStatus == "out-of-stock"}
                  onClick={() => {
                    setStockStatus("out-of-stock");
                  }}
                />{" "}
                Out of stock
              </div>
            </div>
          )}

          <div
            className={`flex flex-col ${
              !collectionType || collectionType == "studio" ? "mt-20" : ""
            }`}
          >
            <label className="text-[14px]">Cost</label>
            <input
              type="number"
              value={cost}
              min={0}
              onChange={(e) => {
                setCost(parseFloat(e.target.value));
              }}
              placeholder="E.g johndoe@gmail.com"
              className="border border-2 border-solid border-primary py-2 px-4 rounded-md"
            />
          </div>
          <div className="mb-4">
            <div className="font-bold text-[20px]">Collections (optional)</div>
            {allCollections.length == 0 && (
              <div className="text-center my-4">No collection added</div>
            )}
            <div>
              <select
                value={
                  clothesCollections.length == 1 ? clothesCollections[0] : ""
                }
                className="border border-2 border-solid border-primary py-2 px-4 rounded-md"
                onChange={(e) => {
                  toggleCollection(e.target.value);
                }}
              >
                <option value="">Select collection...</option>
                {allCollections.map((c, index) => (
                  <option key={index} value={c._id}>
                    {c.name} ({c.type} collection)
                  </option>
                ))}
              </select>
            </div>
          </div>
          <div className="mb-4">
            <div className="font-bold text-[20px]">Categories</div>

            <div>
              <select
                className="border border-2 border-solid border-primary py-2 px-4 rounded-md"
                value={categories.length == 1 ? categories[0] : ""}
                onChange={(e) => {
                  toggleCategory(e.target.value);
                }}
              >
                <option value="">Select category...</option>
                {allCategories.map((c, index) => (
                  <option key={index} value={c._id}>
                    {c.name}
                  </option>
                ))}
              </select>
            </div>
          </div>
          {collectionType == "studio" && (
            <div className="mb-4">
              <div className="flex flex-col">
                <small>Total Cravings required</small>
                <input
                  className={`border border-2 border-solid border-primary py-2 px-4 rounded-md w-full`}
                  type="number"
                  value={totalRequiredCravings}
                  onChange={(e) => {
                    setTotalRequiredCravings(parseInt(e.target.value));
                  }}
                />
              </div>
            </div>
          )}
        </div>
        <div className="w-full flex flex-col gap-4">
          <div>
            <div className="font-bold text-[20px]">Product Type</div>
            <div>
              <div>
                <input
                  type="checkbox"
                  checked={forType.includes("men")}
                  onChange={() => {
                    toggleForType("men");
                  }}
                />{" "}
                For men
              </div>
              <div>
                <input
                  type="checkbox"
                  checked={forType.includes("women")}
                  onChange={() => {
                    toggleForType("women");
                  }}
                />{" "}
                For women
              </div>
            </div>
          </div>

          <div className="font-bold text-[20px]">Product variations</div>

          <div className="flex flex-col">
            <label className="text-[14px]">Color</label>
            <input
              type="text"
              value={color}
              onChange={(e) => {
                setColor(e.target.value);
              }}
              placeholder="E.g black"
              className="border border-2 border-solid border-primary py-2 px-4 rounded-md"
            />
          </div>

          <div className="flex flex-col">
            <label className="text-[14px]">Color Code</label>
            <input
              type="text"
              value={colorCode}
              onChange={(e) => {
                setColorCode(e.target.value);
              }}
              placeholder="E.g #000000"
              className="border border-2 border-solid border-primary py-2 px-4 rounded-md"
            />
          </div>

          <div>
            <div>
              {sizes.length == 0 && (
                <div className="text-center">No size added</div>
              )}
              {sizes.length > 0 && (
                <div className="grid grid-cols-2 gap-2 mb-2">
                  {sizes.map((sizeValue: SizeAndQuantity) => (
                    <div className="flex gap-2 justify-between items-center bg-[#eee] p-2 rounded-md">
                      <div>
                        <div>
                          {sizeValue?.size} ({sizeValue?.quantityAvailable}{" "}
                          available)
                        </div>
                        <div>SKU: {sizeValue?.sku}</div>
                      </div>
                      <button
                        onClick={() => {
                          removeSize(sizeValue?.size);
                        }}
                      >
                        <CgClose />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
            <div className="flex gap-2">
              <input
                type="checkbox"
                checked={isNumericSize}
                onClick={() => {
                  setNumericSize(!isNumericSize);
                }}
              />
              <label className="text-[14px]">Numeric Size</label>
            </div>
            <div>
              {isNumericSize ? (
                <div>
                  <label className="text-[14px]">Size in number</label>
                  <input
                    type="text"
                    value={sizeInput}
                    onChange={(e) => {
                      setSizeInput(e.target.value);
                    }}
                    placeholder="E.g 2"
                    className="border border-2 border-solid border-primary py-2 px-4 rounded-md w-full"
                  />
                </div>
              ) : (
                <div>
                  <div>
                    <label className="text-[14px]">Size</label>
                    <select
                      value={sizeInput}
                      onChange={(e) => {
                        setSizeInput(e.target.value);
                      }}
                      className="border border-2 border-solid border-primary py-2 px-4 rounded-md w-full"
                    >
                      <option value="">Select Size</option>
                      <option value="XS">XS</option>
                      <option value="S">S</option>
                      <option value="M">M</option>
                      <option value="L">L</option>
                      <option value="XL">XL</option>
                      <option value="XXL">XXL</option>
                    </select>
                  </div>
                  <div>
                    <label>SKU Code</label>
                    <input
                      type="text"
                      value={sku}
                      onChange={(e) => {
                        setSku(e.target.value);
                      }}
                      placeholder="E.g SDE-356-24"
                      className="border border-2 border-solid border-primary py-2 px-4 rounded-md w-full"
                    />
                  </div>
                </div>
              )}
            </div>
          </div>

          <div className="flex flex-col">
            <label className="text-[14px]">Quantity available</label>
            <input
              type="number"
              min={0}
              value={quantityAvailable}
              onChange={(e) => {
                setQuantityAvailable(parseInt(e.target.value));
              }}
              placeholder="E.g 120"
              className="border border-2 border-solid border-primary py-2 px-4 rounded-md"
            />
          </div>

          <button
            className="inline-block py-1 px-4 border border-2 w-full border-primary text-primary rounded-md"
            onClick={() => {
              addSize();
            }}
          >
            Add Size and Quantity
          </button>

          <div className="flex flex-col">
            <div className="text-[14px] mb-4">Select product pictures</div>

            <label
              className="text-[14px] bg-[#eee] py-2 px-8 w-fit text-black rounded-md"
              htmlFor="pictures"
            >
              Choose Pictures (Min 2)
            </label>
            <input
              id="pictures"
              type="file"
              className="hidden"
              onChange={handleImageChange}
              multiple
              accept="image/*"
            />
            {imagePreviews.length > 0 && (
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 justify-center items-center">
                {imagePreviews.map((imageUrl: string, index: number) => (
                  <div
                    className="relative"
                    style={{
                      width: "100px",
                      height: "100px",
                      margin: "10px",
                    }}
                  >
                    {/* <AiFillCloseCircle onClick={() => {removeImage(imageUrl)}} className="absolute right-[4px] top-[-4px] z-[100]" size={25} /> */}
                    <img
                      key={index}
                      src={imageUrl}
                      className="rounded-md border border-2 p-2 bg-[#ccc] border-primary w-fit h-full mx-auto"
                      alt={`Preview ${index + 1}`}
                      onClick={() => {
                        openPreviewModal(imageUrl);
                      }}
                    />
                    <button
                      onClick={() => {
                        removeImage(imageUrl);
                      }}
                      className="border border-[red] w-full p-2 mt-2 rounded-[8px]"
                    >
                      <FaTrash color="red" className="mx-auto" />
                    </button>
                  </div>
                ))}
              </div>
            )}
            <div>
              {isFileUploadLoading && (
                <div className="mx-auto text-center">
                  <Bounce className="mx-auto" size={35} color="blue" />
                </div>
              )}
            </div>
          </div>

          <button
            onClick={addSizeAndColor}
            className="text-[14px] bg-[#eee] py-2 mt-8 px-8 w-fit text-black rounded-md"
          >
            Add Product Variation
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-2 my-4">
        {sizeAndColor?.map((val, index) => (
          <div
            key={index}
            className="p-4 rounded-lg border border-2 border-solid border-blue flex items-center justify-between"
          >
            <div>
              <div className="flex flex-col gap-4 mb-4">
                <div>
                  <div>Sizes:</div>
                  <div>{val?.sizes?.length == 0 && <div>No size set</div>}</div>
                  <div className="grid grid-cols-2 gap-2">
                    {val?.sizes?.map((s) => (
                      <span className="inline-block px-2 py-1 bg-[#eee]">
                        <div>
                          {s.size} ({s.quantityAvailable} available)
                        </div>
                        <div>{s.sku}</div>
                      </span>
                    ))}
                  </div>
                </div>
              </div>
              <div className="flex items-start gap-4 mb-4">
                <div>
                  <small>Color:</small>
                  <div className="font-bold">{val?.color}</div>
                </div>
                <div>
                  <small>Color Code:</small>
                  <div className="font-bold">{val?.colorCode}</div>
                </div>
                {/* <div>
                  <small>Size And Quantity:</small>
                  <div className="font-bold">{
                    sizes.map(v => (
                      <div className="font-bold">{v.size}</div>
                    ))
                    }</div>
                </div> */}
              </div>
              <div className="grid grid-cols-4 gap-2">
                {val?.pictures?.map((picture: string) => (
                  <img
                    src={picture}
                    onClick={() => {
                      openPreviewModal(picture);
                    }}
                    style={{
                      height: "50px",
                      width: "50px",
                      backgroundSize: "cover",
                      borderRadius: "8px",
                    }}
                  />
                ))}
              </div>
            </div>
            <button>
              <IoClose
                color="red"
                size={35}
                onClick={() => {
                  removeColor(val._id);
                }}
              />
            </button>
          </div>
        ))}
      </div>

      <div>
        {(isUploadProductsLoading || isEditProductsLoading) && (
          <div className="mx-auto text-center">
            <Bounce className="mx-auto" size={25} color="blue" />
          </div>
        )}
      </div>

      <div>
        <Paper sx={{ width: "100%", overflow: "hidden" }}>
          <TableContainer sx={{ maxHeight: 440 }}>
            <Table stickyHeader aria-label="sticky table">
              <TableHead>
                <TableRow>
                  <TableCell>Title</TableCell>
                  <TableCell>XS</TableCell>
                  <TableCell>S</TableCell>
                  <TableCell>M</TableCell>
                  <TableCell>L</TableCell>
                  <TableCell>XL</TableCell>
                  <TableCell>XXL</TableCell>
                  <TableCell>Action</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {sizesArray?.map((value, index: number) => (
                  <TableRow key={index}>
                    <TableCell>{value?.title}</TableCell>
                    <TableCell>
                      {value?.xs}
                    </TableCell>
                    <TableCell>
                      {value?.s}
                    </TableCell>
                    <TableCell>{value?.m}</TableCell>
                    <TableCell>{value?.l}</TableCell>
                    <TableCell>
                      {value?.xl}
                    </TableCell>
                    <TableCell>
                      {value?.xxl}
                    </TableCell>
                    <TableCell>
                      <button onClick={() => {removeFromSizeChart(value.title)}}>Remove</button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Paper>
        <div className="mt-10">
          <div className="grid grid-cols-4 gap-4">
            <div className="col-span-2">
              <label>Title</label>
              <input value={title} onChange={(e) => {setTitle(e.target.value)}} className="border border-primary rounded-md w-full py-1 px-2" />
            </div>
            <div>
              <label>XS</label>
              <input value={xs} onChange={(e) => {setXs(e.target.value)}} className="border border-primary rounded-md w-full py-1 px-2" />
            </div>
            <div>
              <label>S</label>
              <input value={s} onChange={(e) => {setS(e.target.value)}} className="border border-primary rounded-md w-full py-1 px-2" />
            </div>
            <div>
              <label>M</label>
              <input value={m} onChange={(e) => {setM(e.target.value)}} className="border border-primary rounded-md w-full py-1 px-2" />
            </div>
            <div>
              <label>L</label>
              <input value={l} onChange={(e) => {setL(e.target.value)}} className="border border-primary rounded-md w-full py-1 px-2" />
            </div>
            <div>
              <label>XL</label>
              <input value={xl} onChange={(e) => {setXl(e.target.value)}} className="border border-primary rounded-md w-full py-1" />
            </div>
            <div>
              <label>XXL</label>
              <input value={xxl} onChange={(e) => {setXxl(e.target.value)}} className="border border-primary rounded-md w-full py-1" />
            </div>
          </div>
          <button className="border border-2 rounded-md border-primary px-4 py-1 inline-block mt-4 text-primary" onClick={addToSizeChart}>Add Size</button>
        </div>
      </div>

      <div className="flex gap-2 justify-center mt-10 text-center">
        <button
          className="text-white bg-primary py-2 px-8 rounded-xl font-bold"
          onClick={() => {
            publishProduct("published");
          }}
        >
          {editableId
            ? "Update product"
            : `Upload Product ${
                userDetails.role != "admin" ? "for review" : ""
              }`}
        </button>
        <button
          className="text-[#333] bg-grey py-2 px-8 rounded-xl font-bold"
          onClick={() => {
            publishProduct("draft");
          }}
        >
          Save as Draft
        </button>
      </div>
    </AdminDasboardLayout>
  );
}
