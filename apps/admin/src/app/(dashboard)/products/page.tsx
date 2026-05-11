import { ProductsType } from "@repo/types";
import { columns } from "./columns";
import { DataTable } from "./data-table";
import AddProductButton from "@/components/AddProductButton";

const getData = async (): Promise<ProductsType> => {
  try {
    const baseUrl = process.env.NEXT_PUBLIC_PRODUCT_SERVICE_URL;

    if (!baseUrl) {
      console.error("NEXT_PUBLIC_PRODUCT_SERVICE_URL is not defined");
      return [];
    }

    const res = await fetch(`${baseUrl}/products`, { cache: "no-store" });

    if (!res.ok) {
      const errorText = await res.text().catch(() => "No error body");
      console.error(
        `Failed to fetch products: ${res.status} ${res.statusText}. Body: ${errorText}`
      );
      return [];
    }

    const data = await res.json();
    return data;
  } catch (error) {
    console.error("Error fetching data:", error);
    return [];
  }
};

export const dynamic = "force-dynamic";

const ProductPage = async () => {
  const data = await getData();
  return (
    <div className="">
      <div className="mb-8 px-4 py-2 bg-secondary rounded-md flex justify-between items-center">
        <h1 className="font-semibold">All Products</h1>
        <div className="flex gap-2">
          {/* We can use the Sheet directly here or link to a new page if we refactor. 
                 For now, let's just make it clear.
                 Actually, since AddProduct is a Sheet, we need to import it.
                 But wait, AddProduct is a client component using Sheet.
                 We can stick it here.
             */}
          <AddProductButton />
        </div>
      </div>
      <DataTable columns={columns} data={data} />
    </div>
  );
};

export default ProductPage;
