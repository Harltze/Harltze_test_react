import { useState } from "react";
import AdminDasboardLayout from "../../../components/layout/AdminDasboardLayout";
import { toast } from "react-toastify";
import { useDiscount } from '../../../../hooks/useDiscount'

export default function CreateDiscount() {
  const [discountCode, setDiscountCode] = useState("");
  // const [discountType, setDiscountType] = useState("");
  const [discountAmountOrPercent, setDiscountAmountOrPercent] = useState(0);
  const [discountForProductsAbove, setDiscountForProductsAbove] = useState(0);
  const [expiryDate, setExpiryDate] = useState("");

  const {createDiscount} = useDiscount();

  const handleCreateDiscountList = async () => {
    try {
        await createDiscount({
            discountCode,
            discountAmountOrPercent,
            discountForProductsAbove,
            expiryDate
        });
        toast.success("Discount created");
    } catch (error) {
        toast.error("An error occurred while trying to create discount code.");
    }
  }

  return (
    <AdminDasboardLayout header="Create Discount" showSearch={false}>
      <div className="flex flex-col gap-8">
        <div className="flex flex-col">
          <label>Discount Code</label>
          <input
            className="border border-2 border-solid border-primary py-2 px-4 rounded-md"
            value={discountCode}
            onChange={(e) => {
              if(e.target.value == " ") return;
              setDiscountCode(e.target.value);
            }}
          />
        </div>
        {/* <div className="flex flex-col">
          <label>Discount Type</label>
          <select
            className="border border-2 border-solid border-primary py-2 px-4 rounded-md"
            value={discountType}
            onChange={(e) => {
              setDiscountType(e.target.value);
            }}>
            <option>Select discount type...</option>
            <option value="percent">Percent</option>
            <option value="value">Amount</option>
          </select>
        </div> */}
        <div className="flex flex-col">
          <label>Discount Percent</label>
          <input
          type="number"
            className="border border-2 border-solid border-primary py-2 px-4 rounded-md"
            value={discountAmountOrPercent}
            onChange={(e) => {
              setDiscountAmountOrPercent(parseInt(e.target.value));
            }}
          />
        </div>
        <div className="flex flex-col">
          <label>Discount for products {">="} to</label>
          <input
          type="number"
            className="border border-2 border-solid border-primary py-2 px-4 rounded-md"
            value={discountForProductsAbove}
            onChange={(e) => {
              setDiscountForProductsAbove(parseInt(e.target.value));
            }}
          />
        </div>
        <div className="flex flex-col">
          <label>Expiry Date</label>
          <input
          type="date"
            className="border border-2 border-solid border-primary py-2 px-4 rounded-md"
            value={expiryDate}
            onChange={(e) => {
              setExpiryDate(e.target.value);
            }}
          />
        </div>
        <button className='bg-primary border-none rounded-md py-2 text-white' onClick={handleCreateDiscountList}>Create Discount</button>
      </div>
    </AdminDasboardLayout>
  );
}
