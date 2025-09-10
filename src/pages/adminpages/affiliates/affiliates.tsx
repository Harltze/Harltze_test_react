import { useEffect, useState } from "react";
import { useAffiliate } from "../../../../hooks/useAffiliate";
import AdminDasboardLayout from "../../../components/layout/AdminDasboardLayout";
import { Link, useNavigate } from "react-router";
import {
  Box,
  Modal,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from "@mui/material";
import { IoMdArrowRoundBack, IoMdArrowRoundForward } from "react-icons/io";
import { toast } from "react-toastify";
import { errorHandler } from "../../../../utils/errorHandler";
import { Bounce } from "react-activity";
import { useCMS } from "../../../../hooks/useCMS";
import { IoClose } from "react-icons/io5";
import { useProfile } from "../../../../hooks/useProfile";

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 400,
  borderRadius: "8px",
  bgcolor: "background.paper",
  // border: '2px solid #000',
  boxShadow: 24,
  p: 4,
};

export default function AffiliatesList() {
  const { affiliateList } = useAffiliate();
  const { getCMSRecord, updateCMSRecord } = useCMS();
  const {requestAutoPasswordReset} = useProfile();

  // const [userToDelete, setUserToDelete] = useState("");
  
  const [affiliateCommissionPercentage, setAffiliateCommissionPercentage] =
    useState(0);

  const [isShowingPercentageModal, setIsShowingPercentageModal] =
    useState(false);
  const [isUpdatingPercentageModal, setIsUpdatingPercentageModal] =
    useState(false);

  const openPercentageModal = async () => {
    try {
      setIsShowingPercentageModal(true);
      const cms = await getCMSRecord();
      setAffiliateCommissionPercentage(cms.data.result.defaultAffiliatePercent);
    } catch (error) {
      toast.error(
        errorHandler(
          error,
          "Error while trying to fetch affiliate's commission percentage"
        )
      );
    }
  };

  const closePercentageModal = () => {
    setIsShowingPercentageModal(false);
    setAffiliateCommissionPercentage(0);
  };

  
    const passwordResetButton = async (userId: string) => {
      try {
        await requestAutoPasswordReset(userId);
      } catch (error) {
        toast.error(errorHandler(error, "An error occurred while trying to reset password"));
      }
    }

  const updateCommissionButton = async () => {
    try {
      setIsUpdatingPercentageModal(true);
      await updateCMSRecord("affiliate-percentage", {
        defaultAffiliatePercent: affiliateCommissionPercentage,
      });

      toast.success("Affiliate's commission percent updated");

      closePercentageModal();
    } catch (error) {
      toast.error(
        errorHandler(
          error,
          "Error while trying to update affiliate's commission percentage"
        )
      );
    } finally {
      setIsUpdatingPercentageModal(false);
    }
  };

  const [limit, setLimit] = useState(20);

  const [isLoading, setLoading] = useState(false);

  const [affiliateListPaginated, setAffiliateListPaginated] = useState({
    docs: [],
    page: 1,
    limit: 10,
    hasNextPage: false,
    hasPrevPage: false,
    totalPages: 1,
  });

  const navigate = useNavigate();

  const fetchAffiliates = async (page: number) => {
    try {
      setLoading(true);

      const result = await affiliateList(page, limit);

      console.log(result.data);
      setAffiliateListPaginated(result.data?.result);
    } catch (error) {
      toast.error(errorHandler(error, "An error occurred"));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAffiliates(1);
  }, []);

  useEffect(() => {
    fetchAffiliates(affiliateListPaginated.page);
  }, [limit]);

  const prevNextPageDesign = "py-1 px-4 font-medium rounded-md border border-2";

  return (
    <AdminDasboardLayout header="Affiliates" showSearch={false}>
      <Modal
        open={isShowingPercentageModal}
        onClose={closePercentageModal}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          <Typography id="modal-modal-title" variant="h6" component="h2">
            <div className="flex justify-between items-center">
              <div>Update Affiliate's Commission Percent</div>
              <IoClose onClick={closePercentageModal} />
            </div>
          </Typography>
          <Typography id="modal-modal-description" sx={{ mt: 2 }}>
            <div>
              <input
                type="number"
                className="border border-2 w-full border-solid border-primary py-2 px-4 rounded-md"
                value={affiliateCommissionPercentage}
                onChange={(e) => {
                  setAffiliateCommissionPercentage(parseFloat(e.target.value));
                }}
              />
            </div>
            <button
              className="mt-4 bg-primary text-white w-full py-2 rounded-md"
              onClick={updateCommissionButton}
            >
              {isUpdatingPercentageModal ? <Bounce /> : "Update"}
            </button>
          </Typography>
        </Box>
      </Modal>
      <div className="flex justify-end gap-2 mb-4 text-right">
        <button
          onClick={openPercentageModal}
          className="border border-2 border-primary text-primary px-6 py-2 rounded-md"
        >
          Update affiliate percent
        </button>
        <button
          onClick={() => {
            navigate("/admin/affiliate/new");
          }}
          className="bg-primary text-white px-6 py-2 rounded-md"
        >
          Add Affiliate
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
                          <div className="flex items-stretch gap-2">
                            {/* <button className="bg-[#ccc] w-[40%] text-[black] rounded-md py-1 px-4">
                              View
                            </button> */}
                            <button onClick={() => {passwordResetButton(value._id)}} className="bg-[#ccc] w-[60%] text-[black] rounded-md py-1 px-4">
                              Reset Password
                            </button>
                          </div>
                          <div className="flex items-stretch gap-2">
                            <Link
                              to={`/admin/affiliate/new?id=${value._id}`}
                              className="bg-[#ccc] w-[40%] text-[black] rounded-md py-1 px-4"
                            >
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
          <div>No Affiliate Added</div>
          <button
            onClick={() => {
              navigate("/admin/affiliate/new");
            }}
            className="bg-[#ccc] px-6 py-2 rounded-md"
          >
            Add Affiliate
          </button>
        </div>
      )}

      {affiliateListPaginated.docs.length > 0 && isLoading == false && (
        <div>
          <div className="flex gap-2 justify-center items-center mt-4">
            <button
              onClick={() => {
                if (affiliateListPaginated.hasPrevPage) {
                  fetchAffiliates(affiliateListPaginated.page - 1);
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
                  fetchAffiliates(affiliateListPaginated.page + 1);
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
