import DefaultLayout from "../components/layout/DefaultLayout";
import { Link } from "react-router";
// import Products from "../components/products/Products";
// import ContactComponent from "../components/Contact.tsx";
import HeroComponent from "../components/HeroComponent.tsx";
import AnimateOnScroll from "react-animate-on-scroll";
import { CategoryInterface } from "../../interfaces/ProductInterface.ts";
import { useEffect, useState } from "react";
import { useCategory } from "../../hooks/useCategory.ts";
import PremiumEditionBanner from "../components/PremiumEditionBanner.tsx";
import { CMSInterface } from "./adminpages/cms-settings.tsx";
import { useCMS } from "../../hooks/useCMS.ts";
import { toast } from "react-toastify";
import { errorHandler } from "../../utils/errorHandler.ts";
// import PromotionBanner from "../components/PromotionBanner.tsx";
import CustomerProducts from "../components/products/CustomerProducts.tsx";

export default function Home() {
  const [cms, setCMS] = useState<CMSInterface | null>(null);
  const [allCategories, setAllCategories] = useState<CategoryInterface[]>([]);

  const [productLength, setProductLength] = useState(0);

  const { getAllCategoriesWithAtLeastOneProduct } = useCategory();

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

  const fetchCategories = async () => {
    const response = await getAllCategoriesWithAtLeastOneProduct();
    // console.log(response.data.result);
    setAllCategories(response.data.result);
  };

  useEffect(() => {
    fetchCategories();
    fetchCMS();
  }, []);

  return (
    <DefaultLayout socialMediaLinks={cms?.socialMedia} footerLinks={cms?.footer} footerCopyright={cms?.copyrightFooter}>
      <main>
        <HeroComponent  hero={cms?.hero} />
        <PremiumEditionBanner premiumBanner={cms?.premiumBanner!!} />

        <section id="products" className="py-10 px-10 xl:px-[140px]">
          <div className="text-center text-[25px] md:text-[35px] mb-10">
            New Products for you
          </div>
          <div className="products">
            <CustomerProducts limit={8} isAdmin={false} productOrStudio="product" showPageControl={false} setFetchedProductLength={setProductLength} />
            {
              productLength > 0 && (
              <div className="w-full text-center mt-8">
                <Link to={"/products?category=all"} className="text-primary border border-2 font-bold border-primary px-8 py-2 rounded-xl text-primary">
                  See more products
                </Link>
              </div>
              )
            }
          </div>
        </section>

        <AnimateOnScroll animateIn="fadeInUp">
          <section className="py-10 px-10 xl:px-[140px]">
            <div className="text-center font-bold text-[20px] md:text-[35px] mb-10 text-primary">
              Collections/Categories
            </div>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
              {allCategories.map((cat) => (
                <Link to={`/products?category=${cat._id}`}>
                  <div className="justify-center items-center flex gap-4 font-bold w-full py-4 text-primary rounded-lg bg-[#eee]">
                    {/* <cat.icon /> */}
                    {cat.name[0].toLocaleUpperCase() + cat.name.slice(1)}
                  </div>
                </Link>
              ))}
            </div>
          </section>
        </AnimateOnScroll>

        {/* <ContactComponent /> */}
      </main>
    </DefaultLayout>
  );
}
