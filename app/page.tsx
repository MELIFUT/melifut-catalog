import { client } from "@/lib/sanity";
import Catalog from "@/components/Catalog";
import { categoriesWithProductsQuery } from "@/lib/queries";

export const revalidate = 60;

export default async function Home() {
  const categories = await client.fetch(
    categoriesWithProductsQuery,
    {},
    { next: { revalidate: 60 } }
  );

  return (
    <div className="pt-[220px]">
      <Catalog categories={categories} />
    </div>
  );
}
