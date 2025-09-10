import DefaultLayout from "../components/layout/DefaultLayout";
import { useNavigate, useParams } from "react-router";
import { useEffect, useRef, useState } from "react";
import Slider from "react-slick";
import { FaAngleLeft, FaAngleRight } from "react-icons/fa";
import { useProduct } from "../../hooks/useProduct";
import { Bounce } from "react-activity";
import {
  CategoryInterface,
  ProductInterface,
} from "../../interfaces/ProductInterface";
import { formatCurrency, getCurrencySymbol } from "../../utils/formatCurrency";
// import { cartStore } from "../../store/cartStore";
import { toast } from "react-toastify";
import { errorHandler } from "../../utils/errorHandler";
// import CopyToClipboard from "react-copy-to-clipboard";
// import { authStore } from "../../store/authStore";
import { useCMS } from "../../hooks/useCMS";
import { useBringBack } from "../../hooks/useBringBack";
import { CMSInterface } from "./adminpages/cms-settings";
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Box,
  Modal,
  Typography,
} from "@mui/material";
import { IoIosArrowDown } from "react-icons/io";
import { IoClose } from "react-icons/io5";
import SizeChart from "../components/SizeChart";
import SwatchComponent from "../components/SwatchComponent";
import DOMPurify from 'dompurify';

interface SizeAndQuantity {
  size: string;
  quantityAvailable: number;
}

interface SizeAndColor {
  _id?: string;
  sizes: SizeAndQuantity[];
  color: string;
  colorCode: string;
  pictures: string[];
}

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

export default function SingleStudioProduct() {
  // const isInCart = cartStore((state) => state.isInCart);

  // const cart = cartStore((state) => state.cart);

  const { createBringBack } = useBringBack();

  const [productDetails, setProductDetails] = useState<ProductInterface | null>(
    null
  );

  const [cravingsCount, setCravingsCount] = useState(0);

  // const [similarProducts, setSimilarProducts] = useState<ProductInterface[]>([]);

  const [pictures, setPictures] = useState<string[]>([]);

  const [SQCList, setSQCList] = useState<SizeAndColor[]>([]);

  const navigate = useNavigate();

  const [choosenSQC, setChoosenSQC] = useState<SizeAndColor | null>(null);

  const [chosenSize, setChosenSize] = useState("");

  const [isSizeModalShowing, setIsSizeModalShowing] = useState(false);

  const openSizeModal = () => {
    setIsSizeModalShowing(true);
  };

  const closeSizeModal = () => {
    setIsSizeModalShowing(false);
  };

  // const [isCopied, setCopied] = useState(false);

  const { id } = useParams();

  const { getProductById, isSingleProductLoading } = useProduct();

  // const userDetails = authStore((state) => state.userDetails);

  const fetchSingleProduct = async () => {
    try {
      const response = await getProductById(id!!);

      const productDetails: ProductInterface = response.data?.result;
      // const similarProducts: ProductInterface[] = response.data?.similarProducts;
      setCravingsCount(response.data.cravingsCount);
      if (productDetails.stockStatus != "archived") {
        navigate(`/studio/${id!!}`);
        return;
      }

      console.log(productDetails);
      setProductDetails(productDetails);

      // setSimilarProducts(similarProducts);
      let pics: string[] = productDetails.sizeAndColor[0].pictures;

      // for (let i = 0; i < productDetails.sizeAndColor.length; i++) {
      //   pics = [...pics, ...productDetails.sizeAndColor[i].pictures];
      // }

      setPictures(pics);
      setChoosenSQC(productDetails.sizeAndColor[0]);
      // const inCart = isInCart(id!!);

      // if(inCart) {

      //   setSQCList(productDetails.sizeAndColor.map((s: SizeAndColor) => {
      //     const findProduct = cart.find((cart) => cart._id == id!!)?.sizeColorQuantity!!
      //     const findSQC = findProduct.find((v) => v.color == s.color && v.colorCode == s.colorCode);

      //     if(findSQC) {
      //       s.quantity = findSQC.quantity;
      //       s.size = findSQC.size;
      //     } else {
      //       s.quantity = 0;
      //       s.size = "";
      //     }
      //     return s;
      //   }));

      //   const value = cart.find((cart) => cart._id == id!!)?.sizeColorQuantity!!;
      //   setSQCList(value);
      // } else {

      // }

      setSQCList(productDetails.sizeAndColor);
    } catch (error) {
      toast.error(
        errorHandler(error, "An error occurred while trying to fetch product")
      );
    }
  };

  const handleCartSQC = (sqc: SizeAndColor) => {
    setPictures(sqc.pictures);
    const value = SQCList.find(
      (sqcValue: SizeAndColor) =>
        sqc.color == sqcValue.color && sqc.colorCode == sqc.colorCode
    );
    if (!value) {
      toast.error("Variation not found");
      return;
    }
    setChoosenSQC(value);
  };

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
    fetchSingleProduct();
    fetchCMS();
  }, []);

  let sliderRef = useRef<any>(null);

  const requestBringBack = async () => {
    try {
      if (!choosenSQC) {
        toast.error("Kindly choose a color and size");
        return;
      }

      if (!chosenSize) {
        toast.error("Kindly choose a size");
        return;
      }

      await createBringBack({
        productId: productDetails?._id!!,
        color: choosenSQC.color,
        colorCode: choosenSQC.colorCode,
        size: chosenSize,
      });

      toast.success("Cravings requested successfully");

      await fetchSingleProduct();
    } catch (error) {
      toast.error(
        errorHandler(
          error,
          "Contents failed to load, kindly refresh this page..."
        )
      );
    }
  };

  // const addToCart = cartStore((state) => state.addToCart);

  // const updateProductVariation = cartStore(
  //   (state) => state.updateProductVariation
  // );

  // const removeProduct = cartStore((state) => state.removeProduct);

  // const isProductInCart = useMemo(() => {
  //   return isInCart(id!!);
  // }, [cart]);

  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    nextArrow: <FaAngleRight color="black" />,
    prevArrow: <FaAngleLeft color="black" />,
  };

  // const copyToClipboard = () => {
  //   navigator.clipboard
  //     .writeText(window.location.href)
  //     .then(() => {
  //       toast.success("Text copied to clipboard!");
  //     })
  //     .catch((_err) => {
  //       toast.error("Couldn't copy text to clipboard!");
  //     });
  // };

  const currencySymbol = getCurrencySymbol();

  return (
    <div>
      <DefaultLayout
        socialMediaLinks={cms?.socialMedia}
        footerLinks={cms?.footer}
        footerCopyright={cms?.copyrightFooter}
      >
        {isSingleProductLoading && (
          <div className="text-center h-[calc(100vh-65px)] w-full flex justify-center items-center">
            <Bounce />
          </div>
        )}
        {productDetails && (
          <>
            <div className="mx-10 xl:mx-[140px] my-10 flex flex-col md:flex-row gap-10 items-center">
              <div className="w-full md:w-1/2">
                <Slider ref={sliderRef} {...settings}>
                  {pictures.map((picture) => (
                    <div>
                      <img
                        src={picture}
                        className="h-[280px] w-fit mx-auto rounded-xl"
                      />
                    </div>
                  ))}
                </Slider>
              </div>
              <div className="w-full md:w-1/2 flex flex-col gap-2">
                <div>
                  <div className="mb-2 font-bold">Choose color</div>
                  <div className="grid grid-cols-3 md:grid-cols-4 lg:grid-cols-6">
                    {SQCList.map((SQC: SizeAndColor) => (
                      <div
                        className="flex flex-col items-center"
                        onClick={() => {
                          handleCartSQC(SQC);
                        }}
                      >
                        <div
                          className={`flex justify-center items-center inline-block h-[50px] w-[50px] mx-auto ${
                            choosenSQC?.color == SQC.color &&
                            choosenSQC.colorCode == SQC.colorCode
                              ? "border border-2 border-[blue] rounded-full"
                              : ""
                          }`}
                        >
                          <SwatchComponent colorCode={SQC.colorCode} height="40px" width="40px" />
                          {/* <div
                            className={`h-[40px] w-[40px] border border-2 border-[black] rounded-full mx-auto`}
                            style={{
                              backgroundColor: `${SQC.colorCode.toLocaleLowerCase()}`,
                            }}
                          ></div> */}
                        </div>
                        <button
                          className={`text-center text-[14px] w-fit px-2 py-1`}
                        >
                          {SQC.color}
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
                    <div className="font-bold text-[20px] md:text-[30px] flex justify-between items-center">
                                    <div>{productDetails?.productName}</div>
                                  </div>
                <div>
                  {productDetails &&
                    (productDetails?.categories as CategoryInterface[]).map(
                      (c) => (
                        <div className="bg-[#ccc] px-2 text-black inline-block rounded-xl text-[16px] font-bold">
                          {c.name}
                        </div>
                      )
                    )}
                </div>

                {/* <div>
                <div className="flex gap-2">
                  {productDetails &&
                    productDetails?.sizeAndColor.map((s) => (
                      <div className="px-4 py-1 text-primary inline-block text-[14px] rounded-xl font-bold border border-primary border border-2 border-solid border-primary">
                        {s.color} ({s.size})
                      </div>
                    ))}
                </div>
              </div> */}
                {/* <div className="font-bold text-[35px] flex justify-between items-center">
                <div>{productDetails?.productName}</div>
                <button onClick={copyToClipboard}>
                  <FaShareAlt className="text-primary" size={20} />
                </button>
              </div> */}
                <div>
                  <div className="font-bold flex items-start gap-4 text-[25px]">
                    <div className="ribbon text-[10px] !sm:text-[16px] !md:text-[28px] !lg:text-[24px]">
                      PREMIUM EDITION
                    </div>
                    <div className="text-[18px] md:text-[24px] font-bold text-right">
                      {currencySymbol}
                      {formatCurrency(productDetails?.cost as number)}
                    </div>
                  </div>
                  {choosenSQC && (
                    <div className="flex justify-between items-center rounded-md p-4 gap-4">
                      <div className="w-1/2">
                        <label>Size: </label>
                        <div>
                          <select
                            className="px-2 py-2 w-full"
                            value={chosenSize}
                            onChange={(e) => {
                              setChosenSize(e.target.value);
                            }}
                          >
                            <option value="">Select size...</option>
                            {choosenSQC.sizes.map((s) => (
                              <option value={s.size}>{s.size}</option>
                            ))}
                          </select>
                        </div>
                      </div>
                      <div className={`flex flex-col gap-4 mt-4 w-1/2`}>
                        {cravingsCount ==
                        productDetails?.totalRequiredCravings ? (
                          <div className="w-full py-2 px-4 border border-primary text-primary rounded-md font-bold">
                            Crave Unlocked
                          </div>
                        ) : (
                          <button
                            onClick={requestBringBack}
                            className="w-full py-2 px-4 bg-primary text-white rounded-md font-bold"
                            disabled={
                              cravingsCount ==
                              productDetails?.totalRequiredCravings
                            }
                          >
                            Crave this
                          </button>
                        )}
                      </div>
                    </div>
                  )}
                </div>
                <div>
                  {cravingsCount == productDetails?.totalRequiredCravings ? (
                    <div className="border border-primary text-primary text-center my-2 py-2 rounded-md">
                      Craved into existence
                    </div>
                  ) : (
                    <div className="border border-primary text-primary text-center my-2 py-2 rounded-md">
                      {cravingsCount} / {productDetails?.totalRequiredCravings}{" "}
                      Craves to Unlock
                    </div>
                  )}
                </div>
              </div>
            </div>

            <div className="mx-10 xl:mx-[140px] my-20">
              <button
                onClick={openSizeModal}
                className="text-primary underline font-bold inline-block my-4"
              >
                Size chart
              </button>
              <Modal
                open={isSizeModalShowing}
                onClose={closeSizeModal}
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description"
              >
                <Box sx={style}>
                  <Typography
                    id="modal-modal-title"
                    variant="h6"
                    component="h2"
                  >
                    <div className="flex justify-between items-center">
                      <div>Size Chart</div>
                      <IoClose onClick={closeSizeModal} />
                    </div>
                  </Typography>
                  <Typography
                    id="modal-modal-description"
                    height={400}
                    overflow={"scroll"}
                    sx={{ mt: 2 }}
                  >
                    <SizeChart sizeChart={productDetails?.sizeChart!!} />
                  </Typography>
                </Box>
              </Modal>
              <Accordion defaultExpanded>
                <AccordionSummary
                  expandIcon={<IoIosArrowDown />}
                  aria-controls="panel2-content"
                  id="panel2-header"
                >
                  <Typography component="span" fontWeight={"bold"}>
                    <div className="font-bold">Description</div>
                  </Typography>
                </AccordionSummary>
                <AccordionDetails>
                  <Typography>
                    <div
                      className="prose"
                    dangerouslySetInnerHTML={{
                      __html: DOMPurify.sanitize(productDetails?.description),
                    }}
                    />
                  </Typography>
                </AccordionDetails>
              </Accordion>
            </div>
          </>
        )}
        {/* <div>
        <div className="font-bold text-[24px] text-center mb-4">Similar Products</div>
        <div className="scroll-container">
            {
              similarProducts.map((similarProduct) => (
                  <div className="scroll-item">
                    <ProductCard
                    categories={similarProduct?.categories!!}
                    cost={similarProduct?.cost!!}
                    description={similarProduct?.description!!}
                    productName={similarProduct?.productName!!}
                    sizeAndColor={similarProduct?.sizeAndColor!!}
                    stockStatus={similarProduct?.stockStatus!!}
                    _id={similarProduct?._id!!}
                    forType={similarProduct?.forType!!}
                    productStatus={similarProduct?.productStatus!!}
                    isAdmin={false}
                    />
                  </div>
              
              ))
            }
        </div>
      </div> */}
      </DefaultLayout>
    </div>
  );
}
