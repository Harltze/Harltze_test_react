import OtherPageHeader from "../components/OtherPageHeader";
import DefaultLayout from "../components/layout/DefaultLayout";
import { useNavigate, useSearchParams } from "react-router";
import { FaAngleLeft, FaAngleRight } from "react-icons/fa";
import { useEffect, useRef, useState } from "react";
import Slider from "react-slick";
import { useCategory } from "../../hooks/useCategory";
import { CategoryInterface } from "../../interfaces/ProductInterface";
import { errorHandler } from "../../utils/errorHandler";
import { toast } from "react-toastify";
import { useCMS } from "../../hooks/useCMS";
import { CMSInterface } from "./adminpages/cms-settings";
import { useClothesCollection } from "../../hooks/useClothesCollections";
import CustomerProducts from "../components/products/CustomerProducts";

// const useQuery = () => {
//   return new URLSearchParams(useLocation().search);
// };

export default function OurProducts() {
  const [cms, setCMS] = useState<CMSInterface | null>(null);
  const { getCMSRecord } = useCMS();
  const [searchParams, _setSearchParams] = useSearchParams();

  // const navigate = useNavigate();

  // const query = useQuery();

  const navigate = useNavigate();

  const newSearchParams = new URLSearchParams(location.search);

  const fetchCMS = async () => {
    try {
      const cmsContent = await getCMSRecord();
      setCMS(cmsContent.data.result);
      console.log(cmsContent.data.result);
    } catch (error) {
      toast.error(
        errorHandler(
          error,
          "Contents failed to load, kindly refresh this page..."
        )
      );
    }
  };
  useEffect(() => {
    fetchCMS();
  }, []);

  let sliderRef = useRef<any>(null);

  const [allCategories, setAllCategories] = useState<CategoryInterface[]>([]);
  const [allClothesCollections, setAllClothesCollections] = useState<
    CategoryInterface[]
  >([]);

  const { getAllCategoriesWithAtLeastOneProduct } = useCategory();
  const { getAllCollectionsWithAtLeastOneProduct } = useClothesCollection();

  const fetchCategories = async () => {
    const res2 = await getAllCollectionsWithAtLeastOneProduct();
    const response = await getAllCategoriesWithAtLeastOneProduct(newSearchParams.get("clothescollections") || "");
    setAllClothesCollections(res2.data.result.filter((value: any) => value?.type == "product"));
    setAllCategories(response.data.result.filter((value: any) => value?.clotheCollection?.type == "product"));
  };

  useEffect(() => {
    fetchCategories();
  }, [newSearchParams.get("clothescollections"), newSearchParams.get("categories")]);

  useEffect(() => {
    // This effect will run whenever the search parameters change.
    // It's the perfect place to fetch data based on the query.
    if (searchParams) {
      console.log(`Searching for products with value: ${searchParams}`);
      // Call your API or filtering logic here
      // fetchProducts(searchValue);
    } else {
      console.log("No search value provided. Displaying all products.");
      // Fetch all products or show a default state
      // fetchAllProducts();
    }
  }, [searchParams]);

  // const loc = useLocation();

  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 4,
    slidesToScroll: 1,
    responsive: [
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 4,
          slidesToScroll: 1,
        },
      },
      {
        breakpoint: 600,
        settings: {
          slidesToShow: 3,
          slidesToScroll: 1,
        },
      },
      {
        breakpoint: 480,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 1,
        },
      },
    ],
    nextArrow: <FaAngleRight color="black" />,
    prevArrow: <FaAngleLeft color="black" />,
  };

  // const setAndLoadQuery = (value: SetAndLoadQuery[]) => {
  //   value.forEach(v => params.set(v.key, v.value));
  //   navigate(`/products?${params.toString()}`);
  // }

  return (
    <DefaultLayout
      socialMediaLinks={cms?.socialMedia}
      footerLinks={cms?.footer}
      footerCopyright={cms?.copyrightFooter}
    >
      <OtherPageHeader header="Products" />

      {allClothesCollections.length > 0 && (
        <div className="text-end w-[85%] lg:w-[90%] mx-auto">
          <label>Filter collections: </label>
          <select className="px-4 py-2 rounded-md" value={searchParams.get("clothescollections") || "all"} onChange={(e) => {
                newSearchParams.set("clothescollections", e.target.value);
                if (location.pathname.includes("studio")) {
                  // If on the studio page, navigate to studio with the new query
                  navigate(`/studio?${newSearchParams.toString()}`);
                } else {
                  // From any other page, navigate to products with the new query
                  navigate(`/products?${newSearchParams.toString()}`);
                }
              }}>
            {/* <option value="all">All</option> */}
            {allClothesCollections?.map((value) => (
              <option value={value?._id}>{value?.name}</option>
            ))}
          </select>
        </div>
      )}

      <div className="flex w-full gap-1 xl:gap-4 py-10 items-center">
        <Slider
          ref={sliderRef}
          {...settings}
          className="w-[85%] lg:w-[90%] mx-auto"
        >
          <button
            onClick={() => {
              newSearchParams.set("category", "all");
              if (location.pathname.includes("studio")) {
                // If on the studio page, navigate to studio with the new query
                navigate(`/studio?${newSearchParams.toString()}`);
              } else {
                // From any other page, navigate to products with the new query
                navigate(`/products?${newSearchParams.toString()}`);
              }
            }}
            key={0}
          >
            {/* <div className="px-1 md:px-2 xl:px-4 bg-white">
              <div
                className={`justify-center text-center items-center flex gap-4 font-bold w-full py-4 rounded-lg ${
                  searchParams.get("category") == "all" ||
                  !query.get("category")
                    ? "text-white bg-primary"
                    : "text-primary bg-[#eee]"
                }`}
              >
                All
              </div>
            </div> */}
          </button>
          {allCategories.map((cat, index: number) => (
            <button
              onClick={() => {
                newSearchParams.set("category", cat._id);
                if (location.pathname.includes("studio")) {
                  // If on the studio page, navigate to studio with the new query
                  navigate(`/studio?${newSearchParams.toString()}`);
                } else {
                  // From any other page, navigate to products with the new query
                  navigate(`/products?${newSearchParams.toString()}`);
                }
              }}
              key={index + 1}
            >
              <div className="px-1 md:px-2 xl:px-4 bg-white">
                <div
                  className={`justify-center text-center items-center flex gap-4 font-bold w-full py-4 rounded-lg ${
                    searchParams.get("category") == cat._id
                      ? "text-white bg-primary"
                      : "text-primary bg-[#eee]"
                  }`}
                >
                  {/* <cat.icon /> */}
                  {cat.name[0].toLocaleUpperCase() + cat.name.slice(1)}
                </div>
              </div>
            </button>
          ))}
        </Slider>
      </div>

      <div className="mx-10 xl:mx-[140px] my-10">
        <CustomerProducts
          showPageControl={true}
          category={
            searchParams.get("category")
              ? searchParams.get("category")!!
              : "all"
          }
          query={searchParams.get("query") ? searchParams.get("query")!! : ""}
          isAdmin={false}
          productOrStudio={"product"}
        />
      </div>
    </DefaultLayout>
  );
}
