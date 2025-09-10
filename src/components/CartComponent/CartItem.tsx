import { FaPencil } from "react-icons/fa6";
import { FaTrash } from "react-icons/fa";
import { cartStore, ProductWithQuantity, SizeAndColor } from "../../../store/cartStore";
import CartColorSizeAndQuantity from "./CartColorSizeAndQuantity";
import { formatCurrency, getCurrencySymbol } from "../../../utils/formatCurrency";
// import Modal from 'react-modal';
// import { useState } from "react";
// import EditItemModal from "./EditItemModal";
import { Link } from "react-router";

export default function CartItem({ cart }: { cart: ProductWithQuantity }) {

    let totalQuantity = 0;

    if(cart.sizeColorQuantity!!.length > 0) {
        for(let i = 0; i < cart.sizeColorQuantity!!.length; i++) {
            totalQuantity += cart.sizeColorQuantity!![i].quantity!!;
        }
    }

    let totalAmount = cart.cost * totalQuantity;

    const csq: SizeAndColor[] = cart?.sizeColorQuantity!!;

    const removeCartItem = cartStore(state => state.removeProduct);

  //   const [modalIsOpen, setIsOpen] = useState(false);

  // function openModal() {
  //   setIsOpen(true);
  // }

  // function closeModal() {
  //   setIsOpen(false);
  // }

  const currencySymbol = getCurrencySymbol();

  return (
    <div className="rounded-xl px-4 md:px-8 py-4" style={{ boxShadow: "rgba(0, 0, 0, 0.24) 0px 3px 8px" }}>
      <div className="flex flex-col md:flex-row justify-between">
        <div className="flex gap-4 items-center">
          <img
            src={csq[0]?.pictures[0]}
            className="h-[120px] w-[120px] rounded-md"
          />
          <div>
            <div className="font-bold text-[20px]">{cart.productName}</div>
            <div>
                <div>Cost per unit:</div>
            <div className="font-medium text-[20px]">{currencySymbol}{formatCurrency(cart.cost)}</div>
            </div>
          </div>
        </div>
        <div className="flex flex-col gap-4 justify-center items-start my-4 md:my-0 md:items-end">
            <div className="flex gap-4">
                <Link to={`/product/${cart._id}`}>
                    <FaPencil size={25} className="text-primary" />
                </Link>
                <button onClick={() => {removeCartItem(cart._id!!)}}>
                    <FaTrash size={25} color={"red"} />
                </button>
            </div>
            <div className="text-left md:text-right">
                <div>Total:</div>
                <div className="font-medium text-[20px]">{currencySymbol}{formatCurrency(totalAmount)}</div>
            </div>
        </div>
      </div>
      <div className="mt-4">
        <div>Size, color and quantity selected</div>
        {/* {cart.sizeColorQuantity?.filter(s => s.quantity != 0).length == 0 && (
            <button className="flex gap-2 items-center my-2 py-1 px-4 bg-primary text-white rounded-xl" onClick={openModal}><div>Click to edit quantity</div><FaPlus /></button>
        )} */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {cart.sizeColorQuantity?.map((SQC, index) => (
            <CartColorSizeAndQuantity
              color={SQC.color}
              colorCode={SQC.colorCode}
              pictures={SQC.pictures}
              quantity={SQC.quantity}
              size={SQC.size}
              productId={cart._id!!}
              key={index}
            />
          ))}
        </div>
      </div>

          {/* <Modal
            isOpen={modalIsOpen}
            onRequestClose={closeModal}
            style={{overlay: {zIndex: 200}}}
            // contentLabel="Example Modal"
          >
            <EditItemModal product={cart} closeModal={closeModal} />
          </Modal> */}
    </div>
  );
}
