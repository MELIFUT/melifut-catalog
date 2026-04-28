export const revalidate = 60;

import { client } from "@/lib/sanity";
import Catalog from "@/components/Catalog";
import { categoriesWithProductsQuery } from "@/lib/queries";

export default async function Home() {
  const categories = await client.fetch(categoriesWithProductsQuery);

  return (
    <main className="pt-[200px] p-6">
      <Catalog categories={categories} />
    </main>
  );
}
