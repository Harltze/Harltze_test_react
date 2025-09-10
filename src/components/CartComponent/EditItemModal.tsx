// import { CgClose } from "react-icons/cg";
import { ProductWithQuantity } from "../../../store/cartStore";
// import { cartStore, ProductWithQuantity } from "../../../store/cartStore";
// import { FaMinus, FaPlus } from "react-icons/fa";
// import { IoMdRefresh } from "react-icons/io";

interface Props {
  product?: ProductWithQuantity;
  closeModal?: () => void;
}

export default function EditItemModal(_props: Props) {
  return (
    <div>Norin</div>
  );
}

// export default function EditItemModal({
//   product,
//   closeModal,
// }: {
//   product: ProductWithQuantity;
//   closeModal: () => void;
// }) {
//   const modifyProductQuantity = cartStore((state) => state.modifyQuantity);

//   const increaseDecreaseResetButtonsClassValue =
//     "w-1/2 border border-2 border-primary rounded-md flex justify-center items-center text-[20px] font-bold text-primary px-4 py-1";

//   return (
//     <div>
//       <div className="flex justify-between items-center">
//         <div className="font-bold text-[25px]">Edit Item Quantity</div>
//         <button onClick={closeModal}>
//           <CgClose size={25} />
//         </button>
//       </div>
//       <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-10 justify-center items-center h-full my-8">
//         {product.sizeColorQuantity?.map((s) => {
//           return (
//             <div className="flex flex-col items-center gap-1 font-bold text-[20px]">
//               <div>Quantity: {s.quantity}</div>
//               <div className="flex gap-4 font-normal text-[18px]">
//                 <div>Color: {s.color}</div>
//                 <div>Size: {s.size}</div>
//               </div>
//               <div className="flex gap-2 w-full">
//                 <button
//                   className={increaseDecreaseResetButtonsClassValue}
//                   onClick={() => {
//                     modifyProductQuantity(
//                       product._id!!,
//                       s.size,
//                       s.color,
//                       "decrease"
//                     );
//                   }}
//                 >
//                   <FaMinus />
//                 </button>
//                 <button
//                   className={increaseDecreaseResetButtonsClassValue}
//                   onClick={() => {
//                     modifyProductQuantity(
//                       product._id!!,
//                       s.size,
//                       s.color,
//                       "increase"
//                     );
//                   }}
//                 >
//                   <FaPlus />
//                 </button>
//                 <button
//                   className={increaseDecreaseResetButtonsClassValue}
//                   onClick={() => {
//                     modifyProductQuantity(
//                       product._id!!,
//                       s.size,
//                       s.color,
//                       "reset"
//                     );
//                   }}
//                 >
//                   <IoMdRefresh />
//                 </button>
//               </div>
//             </div>
//           );
//         })}
//       </div>
//       <div className="text-center mt-4">
//         <button
//           className="bg-primary text-white py-2 px-8 rounded-xl font-bold text-[20px]"
//           onClick={closeModal}
//         >
//           Done
//         </button>
//       </div>
//     </div>
//   );
// }
