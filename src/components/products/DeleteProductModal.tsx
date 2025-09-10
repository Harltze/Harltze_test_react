interface Props {
    productName: string;
    productId: string;
    closeModal: (shouldDelete: boolean, id: string) => void;
}

export default function DeleteProductModal({
    productName, productId, closeModal
}: Props) {

    const yesOrNo = "w-full md:w-1/2 my-2";

  return (
    <div>
        <div className="text-center font-bold mb-4 text-[20px]">Are you sure you want to delete "{productName}"?</div>
        <div className='flex gap-2'>
            <button className={yesOrNo + " bg-[red] text-white rounded-md py-2"} onClick={() => {closeModal(true, productId)}}>Yes</button>
            <button className={yesOrNo + " bg-primary text-white rounded-md py-2"} onClick={() => {closeModal(false, "")}}>No</button>
        </div>
    </div>
  )
}
