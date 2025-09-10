import { useState } from 'react'
import AdminDasboardLayout from '../../components/layout/AdminDasboardLayout'
import Products from '../../components/products/Products'
import { useNavigate } from 'react-router';
import { authStore } from '../../../store/authStore';

export default function AdminStudioList() {

  const [searchKeyword, setSearchKeyword] = useState("");

  const searchAction = () => {}

  const navigate = useNavigate();

  const userDetails = authStore(state => state.userDetails);

  return (
    <AdminDasboardLayout header='Studio' addTopPadding={false} searchPlaceholder='Search Studio' showSearch={false} searchValue={searchKeyword} setSearchValue={setSearchKeyword} searchAction={searchAction}>
      <div className='flex justify-end py-4 bg-white w-full'>
        {
          (userDetails.role == 'admin' || userDetails.role == 'marketer') && (
            <button className='bg-primary text-white px-8 py-2 font-bold rounded-md' onClick={() => {navigate("/admin/addoredit");}}>Add To Studio</button>
          )
        }
      </div>
      <div className='py-4'>
        <Products productOrStudio='studio' isAdmin={true} showPageControl={true} />
      </div>
    </AdminDasboardLayout>
  )
}
