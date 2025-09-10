import { useState, useEffect } from 'react'
import AdminDasboardLayout from '../../components/layout/AdminDasboardLayout';
import { useGallery } from "../../../hooks/useGallery";
import { Dots } from 'react-activity';
import { useFileUpload } from '../../../hooks/useFileUploads';
import { toast } from 'react-toastify';
import { errorHandler } from '../../../utils/errorHandler';
import Slider from "react-slick";
import { FaAngleLeft, FaAngleRight } from 'react-icons/fa6';
import { CgClose } from 'react-icons/cg';
import Modal from "react-modal";
import { IoMdArrowRoundBack, IoMdArrowRoundForward, IoMdClose } from 'react-icons/io';

export default function AdminGallery({ showPageControl = true }: { showPageControl: boolean }) {

  const [galleryPictureTab, setGalleryPictureTab] = useState("list"); // List, form

  // const [galleryPictureToEdit, setGalleryPictureToEdit] = useState("");

  const [_imagePreviews, setImagePreviews] = useState<string[]>([]);
  // const [imageForUpdates, setImageForUpdates] = useState<string[]>([]);
  const [imageFiles, setImageFiles] = useState<FileList | null>(null);
  const [pictureTitle, setPictureTitle] = useState("");

  const [isSingleShowing, setSingleShowing] = useState(false);
  const [singleShowingDetails, setSingleShowingDetails] = useState<any | null>(null);

  const { uploadFile, isFileUploadLoading } = useFileUpload();

  const [galleryPictureList, setGalleryPictureList] = useState({
    docs: [],
    hasNextPage: false,
    hasPrevPage: false,
    limit: 10,
    nextPage: null,
    page: 1,
    pagingCounter: 1,
    prevPage: null,
    totalDocs: 0,
    totalPages: 1
  });

  const [isPageModalOpen, setPageModalOpen] = useState(false);
  const [modalPageNumber, setModalPageNumber] = useState(0);
  const openModal = () => {
    setPageModalOpen(true);
  };

  const closeModal = () => {
    setPageModalOpen(false);
  };

  const prevNextPageDesign = "py-1 px-4 font-medium rounded-md border border-2";

  const { createGalleryPicture, getGalleryPictures, isGetGalleryLoading, isCreateGalleryLoading, deleteGalleryPicture, isDeleteGalleryLoading } = useGallery();

  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;

    if (files) {
      const imageUrls: string[] = Array.from(files).map((file) =>
        URL.createObjectURL(file)
      );
      setImagePreviews(imageUrls); // Create preview URLs for selected images
      setImageFiles(files);
    }
  };

  const uploadImages = async () => {
    const uploads: string[] = [];
    if (imageFiles != null) {
      const fileArray = Array.from(imageFiles);

      for (let i = 0; i < fileArray.length; i++) {
        const response = await uploadFile(fileArray[i]);
        uploads.push(response.data.result.fileUrl);
      }

      return uploads;
    }
  }

  const fetchGalleryPictures = async (page: number, limit: number = 10) => {
    const result = await getGalleryPictures(page, limit);
    setGalleryPictureList(result.data.result);
  }

  useEffect(() => {
    fetchGalleryPictures(1, 10);
  }, []);

  const uploadGalleryPictures = async () => {

    const fileUploadResponse = await uploadImages() as string[];

    if (fileUploadResponse.length == 0) {
      toast.error("No file chosen for uploads");
      return;
    }

    const createImageResponse = await createGalleryPicture(fileUploadResponse, pictureTitle);

    if (createImageResponse.data.status == 201) {
      toast.success("Gallery picture uploaded successfully");
      setPictureTitle("");
      setImageFiles(null);
      setGalleryPictureTab("list");
    } else {
      toast.error(errorHandler(createImageResponse.data.error));
    }
  }

  // let sliderRef = useRef<any>(null);

  const deleteAPic = async (id: string) => {
    const response = await deleteGalleryPicture(id);
    if (response.data.status == 200) {
      toast.success("Image deleted successfully");
      fetchGalleryPictures(galleryPictureList.page, galleryPictureList.limit);
    } else {
      toast.error(errorHandler(response.data.error));
    }
  }

  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    // responsive: [
    //   {
    //     breakpoint: 1024,
    //     settings: {
    //       slidesToShow: 4,
    //       slidesToScroll: 1,
    //     },
    //   },
    //   {
    //     breakpoint: 600,
    //     settings: {
    //       slidesToShow: 3,
    //       slidesToScroll: 1,
    //     },
    //   },
    //   {
    //     breakpoint: 480,
    //     settings: {
    //       slidesToShow: 2,
    //       slidesToScroll: 1,
    //     },
    //   },
    // ],
    nextArrow: <FaAngleRight color="black" />,
    prevArrow: <FaAngleLeft color="black" />,
  };

  return (
    <AdminDasboardLayout header='Gallery' showSearch={false}>
      <div>
        {isDeleteGalleryLoading && <Dots size={25} />}
        {galleryPictureTab == "list" && <div>
          <div className='text-right my-4'>
            <button className='bg-primary py-2 px-4 rounded-md text-white font-medium' onClick={() => { setGalleryPictureTab("form") }}>Add Gallery Picture</button>
          </div>
          {isGetGalleryLoading && <Dots />}
          {(!isGetGalleryLoading && galleryPictureList?.docs.length == 0) ? (
            <div className='text-center font-bold text-xl'>
              No gallery picture, kindly upload one
            </div>
          ) : (
            <div>
              <div className='grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-8'>
                {
                  galleryPictureList.docs.map((pictureDetails: any) => {
                    return (
                      <div className='h-full m-4'>
                        <Slider
                          // ref={sliderRef}
                          {...settings}
                          className="w-full mx-auto"
                        >
                          {
                            pictureDetails.pictureURL.map((p: string) => (
                              <div className='my-auto h-auto'>
                                <img src={p} className='mx-auto' />
                              </div>
                            ))
                          }
                        </Slider>
                        <div className='flex flex-col mt-8 gap-2'>
                          <button className='text-primary font-bold' onClick={() => {
                            setSingleShowingDetails(pictureDetails);
                            setSingleShowing(true);
                          }}>View</button>
                          <button className='text-[red] font-bold' onClick={() => { deleteAPic(pictureDetails._id) }}>Delete</button>
                        </div>
                      </div>
                    );
                  })
                }
              </div>
              {
                showPageControl && (
                  <div>
                    <div className="flex gap-2 justify-center items-center mt-4">
                      <button onClick={() => {
                        if (galleryPictureList.hasPrevPage) {
                          fetchGalleryPictures(galleryPictureList.page - 1);
                        }
                      }} className={`${prevNextPageDesign} ${galleryPictureList.hasPrevPage ? "text-primary border-primary" : "text-primary/[0.5] border-primary/[0.5]"}`}><IoMdArrowRoundBack size={25} /></button>
                      <div className="font-medium text-[16px]">Page {galleryPictureList.page} of {galleryPictureList.totalPages} (showing {galleryPictureList.limit} per page)</div>
                      <button className={`py-1 px-4 font-medium text-primary border-primary text-[16px] text-medium`} onClick={openModal}>Go to Page</button>
                      <button onClick={() => {
                        if (galleryPictureList.hasNextPage) {
                          fetchGalleryPictures(galleryPictureList.page + 1);
                        }
                      }} className={`${prevNextPageDesign} ${galleryPictureList.hasNextPage ? "text-primary border-primary" : "text-primary/[0.5] border-primary/[0.5]"}`}><IoMdArrowRoundForward size={25} /></button>
                    </div>
                  </div>
                )
              }
              <Modal
                isOpen={isSingleShowing}
                style={{ overlay: { zIndex: 200 }, content: { width: "90%", height: "90%", top: "50%", left: "50%", transform: "translate(-50%, -50%)" } }}
                onRequestClose={() => {
                  setSingleShowing(false);
                  setSingleShowingDetails(null);
                }}
              >
                <div className='text-right'>
                  <button onClick={() => {
                  setSingleShowing(false);
                  setSingleShowingDetails(null);
                }}><IoMdClose size={25} /></button>
                </div>
                <div className='p-4 flex justify-center items-center'>
                  <Slider
                    // ref={sliderRef}
                    {...settings}
                    className="w-full mx-auto"
                  >
                    {
                      singleShowingDetails?.pictureURL!!.map((p: string) => (
                        <div className='flex justify-center items-center'>
                          <img src={p} className='mx-auto' />
                        </div>
                      ))
                    }
                  </Slider>
                </div>
                  <div className='mt-10 text-center font-bold text-xl'>{singleShowingDetails?.title}</div>
              </Modal>
              <Modal
                isOpen={isPageModalOpen}
                style={{ overlay: { zIndex: 200 }, content: { width: "400px", height: "250px", top: "50%", left: "50%", transform: "translate(-50%, -50%)" } }}
                onRequestClose={closeModal}
              >
                <div>
                  <div className="text-right">
                    <button onClick={closeModal}><CgClose size={25} /></button>
                  </div>
                  <div className="flex justify-center items-center h-full">
                    <div className="flex flex-col gap-2 text-center">
                      <div className="font-bold text-[25px]">Go to page</div>
                      <div className="text-[10px]">Enter a page number between 1 and {galleryPictureList.totalPages}</div>
                      <div><input type="number" className="border border-2 border-primary py-1 px-2 rounded-md" placeholder={`Enter a page number`} value={modalPageNumber} onChange={(e) => { setModalPageNumber(parseInt(e.target.value)) }} /></div>
                      <button
                        className="bg-primary text-white font-medium px-4 py-1 rounded-md"
                        onClick={() => {
                          if (modalPageNumber > galleryPictureList.totalPages || modalPageNumber < 1) {
                            toast.error("Invalid page number");
                            return;
                          }
                          fetchGalleryPictures(modalPageNumber);
                          setModalPageNumber(0);
                          closeModal();
                        }}
                      >Go</button>
                    </div>
                  </div>
                </div>
              </Modal>
            </div>
          )}
        </div>}

        {
          galleryPictureTab == "form" && (
            <div className='flex flex-col gap-8 text-center justify-center items-center'>
              <div>
                <button onClick={() => {setGalleryPictureTab("list")}} className='text-blue self-left'>Back</button>
              </div>
              <div className="flex flex-col w-full md:w-1/2">
                <label className="text-[14px]">Product Name</label>
                <input
                  type="text"
                  value={pictureTitle}
                  onChange={(e) => {
                    setPictureTitle(e.target.value);
                  }}
                  placeholder="E.g T-shirts"
                  className="border border-2 border-solid border-primary py-2 px-4 rounded-md"
                />
              </div>
              <div>
                <label
                  className="text-[14px] bg-[#eee] py-4 px-8 w-fit text-black rounded-md"
                  htmlFor="pictures"
                >
                  Choose Pictures (Min 2)
                </label>
                <input
                  id="pictures"
                  type="file"
                  className="hidden"
                  onChange={handleImageChange}
                  multiple
                  accept="image/jpeg, image/png, image/gif, image/svg+xml"
                />
              </div>
              <div>
                <button
                  className="text-white bg-primary py-2 px-8 rounded-xl font-bold"
                  onClick={uploadGalleryPictures} disabled={isFileUploadLoading || isCreateGalleryLoading}
                >{isFileUploadLoading || isCreateGalleryLoading ? <Dots /> : "Upload"}</button>
              </div>
            </div>
          )
        }
      </div>
    </AdminDasboardLayout>
  )
}
