import { useEffect, useState } from "react";
import { useMarketer } from "../../../../hooks/useMarketers";
import AdminDasboardLayout from "../../../components/layout/AdminDasboardLayout";
import { Link, useNavigate } from "react-router";
import {
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from "@mui/material";
import { IoMdArrowRoundBack, IoMdArrowRoundForward } from "react-icons/io";
import { toast } from "react-toastify";
import { errorHandler } from "../../../../utils/errorHandler";
import { Bounce } from "react-activity";
import { useProfile } from "../../../../hooks/useProfile";

export default function MarketersList() {
  const { marketerList } = useMarketer();

  const [limit, setLimit] = useState(20);

  const [isLoading, setLoading] = useState(false);

  const [affiliateListPaginated, setAffiliateListPaginated] = useState({
    docs: [],
    page: 1,
    limit: 10,
    totalPages: 1,
    hasPrevPage: false,
    hasNextPage: false,
  });

  const navigate = useNavigate();

  const {requestAutoPasswordReset} = useProfile();
    
      const passwordResetButton = async (userId: string) => {
        try {
          await requestAutoPasswordReset(userId);
        } catch (error) {
          toast.error(errorHandler(error, "An error occurred while trying to reset password"));
        }
      }

  const fetchMarketers = async (page: number) => {
    try {
      setLoading(true);
      const result = await marketerList(page, limit);

      console.log(result.data);
      setAffiliateListPaginated(result.data?.result);
    } catch (error) {
      toast.error(errorHandler(error, "An error occurred"));
    } finally {
      setLoading(false);
    }
  };

  const prevNextPageDesign = "py-1 px-4 font-medium rounded-md border border-2";

  useEffect(() => {
    fetchMarketers(1);
  }, []);

  useEffect(() => {
    fetchMarketers(affiliateListPaginated.page);
  }, [limit]);

  return (
    <AdminDasboardLayout header="Marketers" showSearch={false}>
      <div className="mb-4 text-right">
        <button
          onClick={() => {
            navigate("/admin/marketer/new");
          }}
          className="bg-primary text-white px-6 py-2 rounded-md"
        >
          Add Marketer
        </button>
      </div>
      {affiliateListPaginated.docs.length > 0 ? (
        <Paper sx={{ width: "100%", overflow: "hidden" }}>
          <TableContainer sx={{ maxHeight: 440 }}>
            <Table stickyHeader aria-label="sticky table">
              <TableHead>
                <TableRow>
                  <TableCell>S/N</TableCell>
                  <TableCell>Profile Picture</TableCell>
                  <TableCell>Full Name</TableCell>
                  <TableCell>Email</TableCell>
                  <TableCell>Phone Number</TableCell>
                  <TableCell>Action</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {affiliateListPaginated.docs.map(
                  (value: any, index: number) => (
                    <TableRow>
                      <TableCell>{index + 1}</TableCell>
                      <TableCell>
                        <img
                          src={
                            value.profilePicture
                              ? value.profilePicture
                              : "/avatar.png"
                          }
                          className="h-[40px] w-[40px] rounded-full"
                        />
                      </TableCell>
                      <TableCell>
                        {value?.firstName} {value?.lastName}
                      </TableCell>
                      <TableCell>{value.email}</TableCell>
                      <TableCell>{value.phoneNumber}</TableCell>
                      <TableCell>
                        <div className="flex flex-col gap-2">
                          <div className="gap-2 flex">
                            <button className="bg-[#ccc] w-[40%] text-[black] rounded-md py-1 px-4">
                              View
                            </button>
                            <button onClick={() => {passwordResetButton(value._id)}} className="bg-[#ccc] w-[60%] text-[black] rounded-md py-1 px-4">
                              Reset Password
                            </button>
                          </div>
                          <div className="flex items-stretch gap-2">
                              <Link to={`/admin/marketer/new?id=${value._id}`} className="bg-[#ccc] w-[40%] text-[black] rounded-md py-1 px-4">
                                Edit
                              </Link>
                              <button className="bg-[red] text-[white] w-[60%] rounded-md py-1 px-4">
                              Delete
                            </button>
                          </div>
                        </div>
                      </TableCell>
                    </TableRow>
                  )
                )}
              </TableBody>
            </Table>
          </TableContainer>
        </Paper>
      ) : isLoading ? (
        <div className="text-center">
          <Bounce color="black" className="mx-auto inline-block" />
        </div>
      ) : (
        <div className="h-[400px] flex flex-col text-center justify-center items-center">
          <div>No Marketer Added</div>
          <button
            onClick={() => {
              navigate("/admin/marketer/new");
            }}
            className="bg-[#ccc] px-6 py-2 rounded-md"
          >
            Add Marketer
          </button>
        </div>
      )}

      {affiliateListPaginated.docs.length > 0 && isLoading == false && (
        <div>
          <div className="flex gap-2 justify-center items-center mt-4">
            <button
              onClick={() => {
                if (affiliateListPaginated.hasPrevPage) {
                  fetchMarketers(affiliateListPaginated.page - 1);
                }
              }}
              className={`${prevNextPageDesign} ${
                affiliateListPaginated.hasPrevPage
                  ? "text-primary border-primary"
                  : "text-primary/[0.5] border-primary/[0.5]"
              }`}
            >
              <IoMdArrowRoundBack size={25} />
            </button>
            <div className="font-medium text-[16px]">
              Page {affiliateListPaginated.page} of{" "}
              {affiliateListPaginated.totalPages} (showing
              <select
                className="px-8 mx-2 inline-block"
                value={limit}
                onChange={(e) => {
                  setLimit(parseInt(e.target.value));
                }}
              >
                <option value={10}>10</option>
                <option value={20}>20</option>
                <option value={50}>50</option>
              </select>
              per page)
            </div>
            {/* <button className={`py-1 px-4 font-medium text-primary border-primary text-[16px] text-medium`} onClick={openModal}>Go to Page</button> */}
            <div></div>
            <button
              onClick={() => {
                if (affiliateListPaginated.hasNextPage) {
                  fetchMarketers(affiliateListPaginated.page + 1);
                }
              }}
              className={`${prevNextPageDesign} ${
                affiliateListPaginated.hasNextPage
                  ? "text-primary border-primary"
                  : "text-primary/[0.5] border-primary/[0.5]"
              }`}
            >
              <IoMdArrowRoundForward size={25} />
            </button>
          </div>
        </div>
      )}
    </AdminDasboardLayout>
  );
}
