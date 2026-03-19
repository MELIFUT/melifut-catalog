export const categoriesWithProductsQuery = `
*[_type == "category"] | order(order asc) {
  _id,
  name,
  slug,
  icon{
    asset->{url}
  },
  products[]->{
    _id,
    name,
    team,
    year,
    isRetro,
    images[]{
      asset->{url}
    }
  }
}
`;
