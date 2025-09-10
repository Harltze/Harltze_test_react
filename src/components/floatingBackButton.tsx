import { MdKeyboardArrowLeft } from "react-icons/md";
import { useNavigate } from 'react-router';

export default function FloatingBackButton() {

    const navigate = useNavigate();

  return (
    <div className='absolute top-0 left-0 w-full bg-white py-4 px-2 font-bold'>
        <button onClick={() => {navigate(-1)}} className="flex items-center"><MdKeyboardArrowLeft /> Back</button>
    </div>
  )
}
