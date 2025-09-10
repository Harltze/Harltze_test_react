import { useNavigate } from "react-router";
import AdminDasboardLayout from "../../components/layout/AdminDasboardLayout";

export default function AdminNotFound() {
  
  const navigate = useNavigate();

  return (
    <AdminDasboardLayout header="Profile" showSearch={false}>
      <div className="flex flex-col gap-2 justify0center items-center h-[400px]">
        <div className="text-[200px]">404</div>
        <div>The page you've requested for is not found</div>
        <div>
          <button className="px-8 py-1 rounded-md border border-primary text-primary" onClick={() => {navigate(-1)}}>Go back</button>
        </div>
      </div>
    </AdminDasboardLayout>
  );
}
