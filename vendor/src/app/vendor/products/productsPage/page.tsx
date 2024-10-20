"use client";
import { Button } from "@medusajs/ui";
import React, { useMemo, useState } from "react";
import { CiGrid41 } from "react-icons/ci";
import { FiDownload, FiUpload, FiSearch, FiPlus } from "react-icons/fi";
import { IoIosList } from "react-icons/io";
import useSearch from "../../../hooks/useSearch";
import AddProductForm from "../../components/addProducts/page";
import Pagination from "../../../utils/pagination";
import ProductTableView from "../../components/ProductTableView/ProductTableView";
import ProductGridView from "../../components/productGridView/ProductGridView";
import { useGetProducts } from "@/app/hooks/products/useGetProducts";
import { Loader, XMarkMini } from "@medusajs/icons";
import withAuth from "@/lib/withAuth";
import AddDiscountForm from "../../components/addDiscounts/page";
import { useRouter } from "next/navigation";

export type Product = {
  store_id: string | null;
  vendor_id: string;
  id: string;
  created_at: string;
  updated_at: string;
  deleted_at: string | null;
  title: string;
  subtitle: string;
  description: string;
  handle: string;
  is_giftcard: boolean;
  status: string;
  thumbnail: string;
  weight: number;
  length: number;
  height: number;
  width: number;
  hs_code: string;
  origin_country: string;
  mid_code: string;
  material: string;
  collection_id: string | null;
  type_id: string | null;
  discountable: boolean;
  external_id: string | null;
  metadata: any;
};

const Product = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);
  const router = useRouter();
  const [viewType, setViewType] = useState<"table" | "grid">("table");
  const [currentPage, setCurrentPage] = useState(0);
  const { data: productsData, error, isLoading } = useGetProducts();
  const pageSize = 6;
  const handleCloseModal = () => {
    setIsModalOpen(false);
  };
  let { searchQuery, setSearchQuery, filteredData } = useSearch({
    data: productsData || [],
    searchKeys: ["title", "status"],
  });

  const currentProducts = useMemo(() => {
    if (!Array.isArray(filteredData)) return [];
    const offset = currentPage * pageSize;
    const limit = Math.min(offset + pageSize, filteredData.length);
    return filteredData.slice(offset, limit);
  }, [currentPage, filteredData]);

  return (
    <>
      <div className="flex items-center justify-end flex-wrap pb-4 space-x-0 sm:space-x-4 space-y-2 sm:space-y-0 mt-4 sm:mt-0">
        <div className="relative">
          <input
            type="text"
            placeholder="Search"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="text-[13px] pl-11 py-1 border bg-transparent border-gray-300 rounded-md shadow-sm sm:w-auto focus:border-blue-500 outline-none"
          />
          <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
        </div>

        <Button variant="secondary" className="flex items-center space-x-2 px-2 py-2 bg-transparent text-[13px] text-black font-semibold rounded-lg hover:bg-gray-200 border">
          <FiUpload />
          <span>Import Products</span>
        </Button>

        <Button variant="secondary" className="flex items-center space-x-2 px-2 py-2 bg-transparent text-[13px] text-black font-semibold rounded-lg hover:bg-gray-200">
          <FiDownload />
          <span>Export Products</span>
        </Button>

        <Button
          variant="secondary"
          onClick={() => router.push("/vendor/components/addProducts")}
          className="flex items-center space-x-2 px-2 py-2 bg-transparent text-[13px] text-black font-semibold rounded-lg hover:bg-gray-200"
        >
          <FiPlus />
          New Product
        </Button>
        <div className="flex items-center space-x-2 mt-4">
          <button
            onClick={() => setViewType("table")}
            className={`text-[20px] ${
              viewType === "table" ? "text-blue-500" : "text-gray-500"
            }`}
          >
            <IoIosList />
          </button>
          <button
            onClick={() => setViewType("grid")}
            className={`text-[20px] ${
              viewType === "grid" ? "text-blue-500" : "text-gray-500"
            }`}
          >
            <CiGrid41 />
          </button>
        </div>
      </div>
      <hr className="mt-4" />
      {isLoading ? (
        <div className="flex items-center justify-center h-screen">
          <Loader />
        </div>
      ) : (
        <div className="flex flex-col gap-4">
          {filteredData.length === 0 || currentProducts.length === 0 ? (
            <div className="text-center text-gray-500 py-8">
              <p>No products created yet</p>
            </div>
          ) : viewType === "table" ? (
            <ProductTableView currentProducts={currentProducts as Product[]} />
          ) : (
            <ProductGridView currentProducts={currentProducts as Product[]} />
          )}
        </div>
      )}

      <Pagination
        currentPage={currentPage}
        setCurrentPage={setCurrentPage}
        totalItems={filteredData.length}
        data={currentProducts}
      />
    </>
  );
};

export default withAuth(Product);
