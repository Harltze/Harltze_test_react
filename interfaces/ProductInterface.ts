import SizeChart from "../src/components/SizeChart";

interface SizeAndQuantity {
  size: string;
  quantityAvailable: number;
  sku: string;
}

interface SizeAndColor {
    _id?: string;
    sizes: SizeAndQuantity[];
    color: string;
    colorCode: string;
    quantity?: number;
    pictures: string[];
}

export interface ClotheCollectionInterface {
    _id: string;
    name: string;
    slug: string;
    type: string;
    createdAt?: Date;
    updatedAt?: Date;
  }

export interface CategoryInterface {
    _id: string;
    name: string;
    slug: string;
    clotheCollection: ClotheCollectionInterface;
    type: string;
    createdAt?: Date;
    updatedAt?: Date;
  }

export interface SizeChart {
  title: string;
  xs: string;
  s: string;
  m: string;
  l: string;
  xl: string;
  xxl: string;
}

  export interface ProductInterface {
    _id?: string;
    productName: string;
    description: string;
    productOrStudio?: "product" | "studio";
    // pictures: string[];
    cost: number;
    forType: string[];
    totalRequiredCravings?: number;
    stockStatus: string;
    sizeAndColor: SizeAndColor[];
    clothesCollections: string[] | CategoryInterface[];
    categories: string[] | CategoryInterface[];
    productStatus: string;
    isAdmin?: boolean;
    sizeChart?: SizeChart[];
    refreshProducts?: (value: number) => void;
    createdAt?: Date;
    updatedAt?: Date;
}