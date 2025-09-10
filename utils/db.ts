import { images } from "@/constants/imagesMap";
import { ImageURISource } from "react-native";

export interface Products {
  _id: string;
  shopId: Shops;
  pictures: string[];
  stockStatus: string;
  customerQrCode: string;
  cost: number;
  productName: string;
  description: string;
  averageRating: number;
  categories: any[];
}

export interface ForYou {
  id: number;
  name: string;
  description: string;
  picture: string;
  cost: number;
  dishImages: ImageURISource[];
  shopName: string;
  shopImages: ImageURISource[];
  shopLogo: ImageURISource;
}

export interface MealCategory {
  _id: string;
  name: string;
  slug: string;
}

// export const forYou: ForYou[] = [
//   {
//     id: 1,
//     name: "Egusi Soup",
//     description:
//       "Want to swallow something heavy? Here is agusi soup with fufu. I hope you enjoy it.",
//     picture:
//       "https://www.shutterstock.com/image-photo/grilled-meat-steak-on-stainless-600nw-2203020861.jpg",
//     cost: 4000,
//     dishImages: [require("@/assets/images/EGUSI-soup.jpg")],
//     shopName: "Chicken Republic",
//     shopImages: [
//       require("@/assets/images/ChickenRepublic.jpg"),
//       require("@/assets/images/ChickenRepublic.webp"),
//     ],
//     shopLogo: require("@/assets/images/Chicken_Republic_Logo.png"),
//   },
//   {
//     id: 2,
//     name: "Fried Rice",
//     description:
//       "You prefer fried rice? We have our specially made fried rice, just for you",
//     picture:
//       "https://www.shutterstock.com/image-photo/grilled-meat-steak-on-stainless-600nw-2203020861.jpg",
//     cost: 9000,
//     dishImages: [
//       require("@/assets/images/friedrice1.jpg"),
//       require("@/assets/images/friedrice2.jpeg"),
//       require("@/assets/images/Easy-Fried.jpg"),
//     ],
//     shopName: "Chicken Republic",
//     shopImages: [
//       require("@/assets/images/ChickenRepublic.jpg"),
//       require("@/assets/images/ChickenRepublic.webp"),
//     ],
//     shopLogo: require("@/assets/images/Chicken_Republic_Logo.png"),
//   },
//   {
//     id: 3,
//     name: "Rice And Stew",
//     description: "Hot rice and stew for you",
//     picture:
//       "https://www.shutterstock.com/image-photo/grilled-meat-steak-on-stainless-600nw-2203020861.jpg",
//     cost: 4500,
//     dishImages: [
//       require("@/assets/images/riceandstew1.jpg"),
//       require("@/assets/images/riceandstew2.jpeg"),
//     ],
//     shopName: "Chicken Republic",
//     shopImages: [
//       require("@/assets/images/ChickenRepublic.jpg"),
//       require("@/assets/images/ChickenRepublic.webp"),
//     ],
//     shopLogo: require("@/assets/images/Chicken_Republic_Logo.png"),
//   },
//   {
//     id: 4,
//     name: "Meat Pie",
//     description: "Do you love meat pie? You can purchase some",
//     picture:
//       "https://www.shutterstock.com/image-photo/grilled-meat-steak-on-stainless-600nw-2203020861.jpg",
//     cost: 1200,
//     dishImages: [
//       require("@/assets/images/meatpie1.jpg"),
//       require("@/assets/images/meatpie2.png"),
//       require("@/assets/images/meatpie3.jpg"),
//     ],
//     shopName: "KFC",
//     shopImages: [
//       require("@/assets/images/kfc.jpg"),
//       require("@/assets/images/kfcstore2.jpg"),
//     ],
//     shopLogo: require("@/assets/images/kfclogo.webp"),
//   },
//   {
//     id: 5,
//     name: "Grilled Meat",
//     description: "Nice grilled meat for you",
//     picture:
//       "https://www.shutterstock.com/image-photo/grilled-meat-steak-on-stainless-600nw-2203020861.jpg",
//     cost: 3000,
//     dishImages: [
//       require("@/assets/images/grilled-flank-steak.jpg"),
//       require("@/assets/images/grilled-meat-steak.webp"),
//     ],
//     shopName: "KFC",
//     shopImages: [
//       require("@/assets/images/kfc.jpg"),
//       require("@/assets/images/kfcstore2.jpg"),
//     ],
//     shopLogo: require("@/assets/images/kfclogo.webp"),
//   },
// ];

export interface Shops {
  _id: string;
  shopName: string;
  shopLogo: string;
  shopAddress: string;
  shopStatus: string;
  shopPictures?: string[];
  shopUniqueId?: string;
  phoneNumber?: string;
  email?: string;
  country?: string;
  state?: string;
  city?: string;
  verifiedBusiness?: boolean;
  shopLocationOnMap?: object;
}

// export const shops: Shops[] = [
//   {
//     id: 1,
//     shopName: "KFC",
//     location: "25 Udo Umana Road",
//     logo: images.shop.kfc.logo,
//     shopImages: images.shop.kfc.shopImages,
//     picture:
//       "https://www.shutterstock.com/image-photo/grilled-meat-steak-on-stainless-600nw-2203020861.jpg",
//   },
//   {
//     id: 2,
//     shopName: "Chicken Republic",
//     location: "Opposite Ibom Plaza",
//     logo: images.shop.chickenRepublic.logo,
//     shopImages: images.shop.chickenRepublic.shopImages,
//     picture:
//       "https://www.shutterstock.com/image-photo/grilled-meat-steak-on-stainless-600nw-2203020861.jpg",
//   },
// ];
