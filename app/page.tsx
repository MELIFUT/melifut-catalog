export const revalidate = 60;

import { client } from "@/lib/sanity";
import Catalog from "@/components/Catalog";
import { categoriesWithProductsQuery } from "@/lib/queries";

export default async function Home() {
  const categories = await client.fetch(categoriesWithProductsQuery);

  return (
    <div className="pt-[180px]">
      <Catalog categories={categories} />
    </div>
  );
}
