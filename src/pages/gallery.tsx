import { useEffect, useState } from 'react';
import OtherPageHeader from '../components/OtherPageHeader'
import DefaultLayout from '../components/layout/DefaultLayout'
import { useGallery } from '../../hooks/useGallery';
import { Dots } from 'react-activity';
import Slider from "react-slick";
import { FaAngleLeft, FaAngleRight } from 'react-icons/fa6';
import Modal from "react-modal";
import { IoMdClose } from 'react-icons/io';
import { toast } from 'react-toastify';
import { errorHandler } from '../../utils/errorHandler';
import { useCMS } from '../../hooks/useCMS';
import { CMSInterface } from './adminpages/cms-settings';

export default function Gallery() {

  const [cms, setCMS] = useState<CMSInterface | null>(null);
const {getCMSRecord} = useCMS();

  const fetchCMS = async () => {
    try {
      const cmsContent = await getCMSRecord();
      setCMS(cmsContent.data.result);
      console.log(cmsContent.data.result);
    } catch (error) {
      toast.error(errorHandler(error, "Contents failed to load, kindly refresh this page..."));
    }
  }
useEffect(() => {
    fetchCMS();
  }, []);

    const { getGalleryPictures, isGetGalleryLoading } = useGallery();

    const [isSingleShowing, setSingleShowing] = useState(false);
  const [singleShowingDetails, setSingleShowingDetails] = useState<any | null>(null);

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
    const fetchGalleryPictures = async (page: number, limit: number = 10) => {
        const result = await getGalleryPictures(page, limit);
        // console.log(result.data.result);
        setGalleryPictureList(result.data.result);
    }

    useEffect(() => {
        fetchGalleryPictures(1, 10);
    }, []);

    const loadMoreGalleryPictures = async (page: number, limit: number = 10) => {
        const result = await getGalleryPictures(page, limit);
        // console.log(result.data.result);
        setGalleryPictureList({
            ...result.data.result,
            docs: [...galleryPictureList.docs, ...result.data.result.docs]
        });
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
        <DefaultLayout socialMediaLinks={cms?.socialMedia} footerLinks={cms?.footer} footerCopyright={cms?.copyrightFooter}>
            <OtherPageHeader header='Gallery' />

            <div className='grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4 py-10 px-10 xl:px-[140px]'>
                {galleryPictureList.docs.map((pic: any) => (
                    <div className='h-full m-4'>
                    <Slider
                      // ref={sliderRef}
                      {...settings}
                      className="w-full mx-auto"
                    >
                      {
                        pic.pictureURL.map((p: string) => (
                          <div className='my-auto h-auto'>
                            <img src={p} />
                          </div>
                        ))
                      }
                    </Slider>
                    <div className='flex flex-col mt-8 gap-2'>
                      <button className='text-primary font-bold' onClick={() => {
                        setSingleShowingDetails(pic);
                        setSingleShowing(true);
                      }}>View</button>
                    </div>
                  </div>
                ))}
            </div>
            <div className='text-center py-4'>
                {
                    galleryPictureList.page == galleryPictureList.totalPages ? (
                        <div>-- The End --</div>
                    ) : isGetGalleryLoading ? <Dots /> : (
                        <div>
                            <button onClick={() => {
                                if (galleryPictureList.page == galleryPictureList.totalPages) return;
                                loadMoreGalleryPictures(galleryPictureList.page + 1)
                            }}>Load More...</button>
                        </div>
                    )
                }
            </div>
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
        </DefaultLayout>
    )
}
