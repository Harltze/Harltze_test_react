// import { FaTrash } from "react-icons/fa";
import { BiTrash } from "react-icons/bi";
import { cartStore, SizeAndColor } from "../../../store/cartStore";
// import { cartStore, SizeAndColor } from "../../../store/cartStore";

interface ProductIdSizeAndColor extends SizeAndColor {
  productId: string;
}

export default function CartColorSizeAndQuantity({
  color,
  quantity,
  colorCode,
  size,
  productId
}: ProductIdSizeAndColor) {

  // const modifyProductQuantity = cartStore((state) => state.modifyQuantity);
  
  const removeProductVariation = cartStore((state) => state.removeProductVariation);

  return (
    <div className="border border-primary py-2 px-4 rounded-md">
      <div className="flex gap-2 text-primary font-bold mt-2 justify-center">
        <div className="text-center">
            <div>{color}</div>
            <div className="text-[10px] font-thin">Color</div>
        </div>
        <div className="text-center">
          <div>{size}</div>
          <div className="text-[10px] font-thin">Size</div>
        </div>
        <div className="text-center">
          <div>{quantity}</div>
          <div className="text-[10px] font-thin">Quantity</div>
        </div>
        <button className="ml-4" onClick={() => {
          removeProductVariation(productId, size, color, colorCode);
        }}><BiTrash /></button>
      </div>
      <div className="flex gap-2 mt-2">
          {/* <button className="w-1/2 border border-primary rounded-md" onClick={() => {modifyProductQuantity(
            productId, size, color, colorCode, "decrease"
          )}}>-</button>
          <button className="w-1/2 border border-primary rounded-md" onClick={() => {modifyProductQuantity(
            productId, size, color, colorCode, "increase"
          )}}>+</button> */}
          {/* <button
            className="w-1/2 border border-[red] rounded-md"
            onClick={() => {removeProductVariation(productId, size, color, colorCode)}}
          ><FaTrash size={18} color={"red"} className="mx-auto" /></button> */}
        </div>
    </div>
  );
}
