import { useEffect, useState } from 'react'
import AdminDasboardLayout from '../../components/layout/AdminDasboardLayout'
import Products from '../../components/products/Products'
import { useNavigate } from 'react-router';
import { authStore } from '../../../store/authStore';
import { CategoryInterface } from '../../../interfaces/ProductInterface';
import { useCategory } from '../../../hooks/useCategory';
import { useClothesCollection } from '../../../hooks/useClothesCollections';

export default function AdminProducts() {

  const [searchKeyword, setSearchKeyword] = useState("");

  const searchAction = () => {}

  const navigate = useNavigate();

  const userDetails = authStore(state => state.userDetails);

  const newSearchParams = new URLSearchParams(location.search);

  const [allCategories, setAllCategories] = useState<CategoryInterface[]>([]);
    const [allClothesCollections, setAllClothesCollections] = useState<
      CategoryInterface[]
    >([]);
  
    const { getAllCategoriesWithAtLeastOneProduct } = useCategory();
    const { getAllCollectionsWithAtLeastOneProduct } = useClothesCollection();
  
    const fetchCategories = async () => {
      const res2 = await getAllCollectionsWithAtLeastOneProduct();
      const response = await getAllCategoriesWithAtLeastOneProduct(newSearchParams.get("clothescollections") || "");
      setAllCategories(response.data.result.filter((value: any) => value?.clotheCollection?.type == "product"));
      setAllClothesCollections(res2.data.result.filter((value: any) => value?.type == "product"));
    };
  
    useEffect(() => {
      fetchCategories();
    }, [newSearchParams.get("clothescollections"), newSearchParams.get("categories")]);

  return (
    <AdminDasboardLayout header='Products' addTopPadding={false} searchPlaceholder='Search Products' showSearch={false} searchValue={searchKeyword} setSearchValue={setSearchKeyword} searchAction={searchAction}>
      <div className='flex justify-between py-4 sticky top-0 bg-white w-full'>
        <div className='flex gap-2'>
          <div className='flex flex-col'>
            <label>Collection</label>
            <select className="px-4 py-2 rounded-md" value={newSearchParams.get("clothescollections") || "all"} onChange={(e) => {
                newSearchParams.set("clothescollections", e.target.value);
                if (location.pathname.includes("studio")) {
                  // If on the studio page, navigate to studio with the new query
                  navigate(`/admin/studio?${newSearchParams.toString()}`);
                } else {
                  // From any other page, navigate to products with the new query
                  navigate(`/admin/products?${newSearchParams.toString()}`);
                }
              }}>
                <option value={""}>All</option>
              {allClothesCollections?.map((value) => (
              <option value={value?._id}>{value?.name}</option>
            ))}
            </select>
          </div>
          <div className='flex flex-col'>
            <label>Category</label>
            <select className="px-4 py-2 rounded-md" value={newSearchParams.get("clothescollections") || "all"} onChange={(e) => {
                newSearchParams.set("clothescollections", e.target.value);
                if (location.pathname.includes("studio")) {
                  // If on the studio page, navigate to studio with the new query
                  navigate(`/admin/studio?${newSearchParams.toString()}`);
                } else {
                  // From any other page, navigate to products with the new query
                  navigate(`/admin/products?${newSearchParams.toString()}`);
                }
              }}>
              {allCategories?.map((value) => (
              <option value={value?._id}>{value?.name}</option>
            ))}
            </select>
          </div>
        </div>
        {
          (userDetails.role == 'admin' || userDetails.role == 'marketer') && (
            <button className='bg-primary text-white px-8 py-2 font-bold rounded-md' onClick={() => {navigate("/admin/addoredit");}}>Add Product</button>
          )
        }
      </div>
      <div className='py-4'>
        <Products productOrStudio='product' isAdmin={true} showPageControl={true} />
      </div>
    </AdminDasboardLayout>
  )
}
