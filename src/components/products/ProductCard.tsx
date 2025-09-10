import { useState } from "react";
import { CategoryInterface, ProductInterface } from "../../../interfaces/ProductInterface";
import { Link, useNavigate } from "react-router";
import { formatCurrency, getCurrencySymbol } from "../../../utils/formatCurrency";
// import { cartStore } from "../../../store/cartStore";
import {Box, Modal} from "@mui/material";
import DeleteProductModal from "./DeleteProductModal";
import { authStore } from "../../../store/authStore";
import { CopyToClipboard } from 'react-copy-to-clipboard';
import { useProduct } from "../../../hooks/useProduct";
import { toast } from "react-toastify";
import SwatchComponent from "../SwatchComponent";
// import {trimText} from "../../../utils/trimText";

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 400,
  bgcolor: "background.paper",
  boxShadow: 24,
  borderRadius: 1,
  p: 4,
};

export default function ProductCard({
  _id,
  productName,
  // description,
  categories,
  sizeAndColor,
  cost,
  isAdmin,
  productStatus,
  // forType,
  stockStatus,
  refreshProducts
}: ProductInterface) {
  // const [isHovered, setHovered] = useState(false);

  const navigate = useNavigate();

  // const cart = cartStore(state => state.cart);
  // const addToCart = cartStore(state => state.addToCart);
  // const removeProduct = cartStore(state => state.removeProduct);
  // const isInCart = cartStore(state => state.isInCart);

  // const isProductInCart = useMemo(() => {
  //   return isInCart(_id!!);
  // }, [cart]);

  const currencySymbol = getCurrencySymbol();


  const [isCopied, setCopied] = useState(false);

  const userDetails = authStore(state => state.userDetails);

  const [prodToDelete, setProdToDelete] = useState("");
  

  const {deleteProduct} = useProduct();
  
    const [isDeleteModalOpen, setDeleteModalOpen] = useState(false);
  
    const closeDeleteModal = async (shouldDelete: boolean, id?: string) => {
      if (shouldDelete) {
        await deleteProduct(id!!);
        toast.success("Product deleted successfully");
        refreshProducts!!(1);
      }
      setDeleteModalOpen(false);
    };

const openModal = (id: string) => {
  setProdToDelete(id);
    setDeleteModalOpen!!(true);
  };


  return (
    <div
      className="flex flex-col gap-2 border border-2 border-white hover:border-[#eee] border-solid p-2 rounded-xl justify-between relative" style={{
        boxShadow: "4px 4px 4px 3px #000000"
      }}
      // onMouseEnter={() => {
      //   setHovered(true);
      // }}
      // onMouseLeave={() => {
      //   setHovered(false);
      // }}
    >
      {(isAdmin == true && productStatus != "published") && (
        <div className="draft-ribbon ribbon-top-right"><span>{productStatus?.replace(/-/g, " ").toLocaleUpperCase()}</span></div>
    )}
      <div
        className="w-full flex justify-center items-center text-center"
        onClick={() => {
          if (userDetails.role == 'admin' || userDetails.role == 'marketer') {
            navigate(`/admin/addoredit?id=${_id}`);
          } else {
            navigate(`/product/${_id}`);
          }
        }}
      >
        <img src={sizeAndColor[0]?.pictures[0]} alt={productName} className="w-fit h-fit mx-auto inline-block rounded-md" />
      </div>
      <div className="flex flex-col gap-2">
        <div className="text-center">
          {(categories as CategoryInterface[]).map((c) => (
            <div className="bg-[#ccc] px-2 text-black inline-block rounded-xl text-[14px] font-bold">
              {c.name}
            </div>
          ))}
        </div>
        <div>
          <div className="flex gap-2 w-fit mx-auto">
            {sizeAndColor?.map((s) => (
              <SwatchComponent colorCode={s?.colorCode} />
              // <div className="h-[20px] w-[20px] rounded-full mx-auto border border-2 border-[black]" style={{backgroundColor: s.colorCode}}></div>
            ))}
          </div>
        </div>
        <div
          className="font-bold text-[20px] text-center"
          onClick={() => {
            if (userDetails.role == 'admin' || userDetails.role == 'marketer') {
              navigate(`/admin/addoredit?id=${_id}`);
            }  else {
              navigate(`/product/${_id}`);
            }
          }}
        >
          {productName}
        </div>
        {/* <p>{trimText(description, 35)}</p> */}
        <div className="text-center">
          <div className="text-[14px]">Cost:</div>
          <div className="font-bold">{currencySymbol}{formatCurrency(cost)}</div>
        </div>

          {(userDetails.role == 'admin') && (
            <button onClick={() => {navigate(`/admin/cravings-summary?productid=${_id}`)}} className="border border-2 border-solid border-primary text-primary w-full text-center py-2 rounded-xl font-bold">
            View Cravings
          </button>
          )}
        {(userDetails.role == 'admin' || userDetails.role == 'marketer') ? (
          <div className={`flex flex-col gap-2`}>
          <button onClick={() => {navigate(`/admin/addoredit?id=${_id}`)}} className="border border-2 border-solid border-primary text-primary w-full text-center py-2 rounded-xl font-bold">
            Edit
          </button>
          {userDetails.role == 'admin' && <button
            onClick={() => {openModal(_id!!)}}
            className="border border-2 border-solid border-[red] text-[red] w-full text-center py-2 rounded-xl font-bold"
          >
            Delete
          </button>}
        </div>
        ) : (
          <div
            className={`opacity-1 flex flex-col gap-2`}
          >
            {/* {isProductInCart ? (
              <button className="bg-primary text-white w-full text-center py-2 rounded-xl font-bold" onClick={() => {removeProduct(_id!!)}}>
              Remove from Cart
            </button>
            ) : (
              <button className="bg-primary text-white w-full text-center py-2 rounded-xl font-bold" onClick={() => {addToCart({
                _id,
                productName,
                description,
                pictures,
                categories,
                sizeAndColor,
                cost,
                forType,
                stockStatus
              })}}>
                Add to Cart
            </button>
            ) } */}
            
            <Link
              to={(stockStatus == "archived") ? `/studio/${_id}` : `/product/${_id}`}
              className="border border-2 border-solid border-primary text-primary w-full text-center py-2 rounded-xl font-bold"
            >
              View
            </Link>
          </div>
        )}
        {
          userDetails.role == "affiliate" && (
            <CopyToClipboard
              text={`${window?.location?.origin}/product/${_id}?affiliatecode=${userDetails?.affiliateCode}`}
              onCopy={() => {
                setCopied(true);
                setTimeout(() => setCopied(false), 2000);
              }}
            >
              <button
                className="border border-2 border-solid border-primary text-primary w-full text-center py-2 rounded-xl font-bold"
              >{isCopied ? "Copied" : "Copy Link"}</button>
            </CopyToClipboard>
          )
        }
      </div>
      <Modal
      aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
        open={isDeleteModalOpen!!}
        onClose={() => {closeDeleteModal!!(false, "")}}
      >
        <Box sx={style}>
          <DeleteProductModal productName={productName} productId={prodToDelete} closeModal={closeDeleteModal!!} />
        </Box>
      </Modal>
    </div>
  );
}
