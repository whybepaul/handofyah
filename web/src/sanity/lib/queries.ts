// All products (active, sorted by name)
export const PRODUCTS_QUERY = `*[_type == "product" && status == "active"] | order(name asc) {
  _id, name, slug, price, images, subscriptionEligible,
  category->{ name, slug }
}`

// Products filtered by category slug
export const PRODUCTS_BY_CATEGORY_QUERY = `*[_type == "product" && status == "active" && category->slug.current == $category] | order(name asc) {
  _id, name, slug, price, images, subscriptionEligible,
  category->{ name, slug }
}`

// Up to 3 featured products for the homepage
export const FEATURED_PRODUCTS_QUERY = `*[_type == "product" && status == "active" && featured == true][0..2] {
  _id, name, slug, price, images,
  category->{ name, slug }
}`

// Single product by slug with full detail
export const PRODUCT_BY_SLUG_QUERY = `*[_type == "product" && slug.current == $slug && status == "active"][0] {
  _id, name, slug, price, description, usageInstructions, images, subscriptionEligible,
  category->{ name, slug },
  ingredients[]->{ _id, name, slug, benefits }
}`

// All categories sorted by display order
export const CATEGORIES_QUERY = `*[_type == "category"] | order(order asc) {
  _id, name, slug, description
}`

// Single category by slug
export const CATEGORY_BY_SLUG_QUERY = `*[_type == "category" && slug.current == $slug][0] {
  _id, name, slug, description
}`

// All journal posts sorted newest first
export const JOURNAL_POSTS_QUERY = `*[_type == "journalPost"] | order(publishedAt desc) {
  _id, title, slug, featuredImage, excerpt, publishedAt,
  category->{ name, slug }
}`

// Single journal post by slug
export const JOURNAL_POST_BY_SLUG_QUERY = `*[_type == "journalPost" && slug.current == $slug][0] {
  _id, title, slug, featuredImage, body, excerpt, publishedAt, seo,
  category->{ name, slug }
}`

// Most recent 2 journal posts for widgets/previews
export const RECENT_JOURNAL_POSTS_QUERY = `*[_type == "journalPost"] | order(publishedAt desc)[0..1] {
  _id, title, slug, featuredImage, excerpt, publishedAt
}`

// All learn articles sorted by creation date descending
export const LEARN_ARTICLES_QUERY = `*[_type == "learnArticle"] | order(_createdAt desc) {
  _id, title, slug, featuredImage
}`

// Single learn article by slug with related products
export const LEARN_ARTICLE_BY_SLUG_QUERY = `*[_type == "learnArticle" && slug.current == $slug][0] {
  _id, title, slug, featuredImage, body, seo,
  relatedProducts[]->{ _id, name, slug, price, images, category->{ name, slug } }
}`

// All ingredients sorted alphabetically
export const INGREDIENTS_QUERY = `*[_type == "ingredient"] | order(name asc) {
  _id, name, slug, benefits
}`

// Single ingredient by slug with reverse-lookup of products containing it
export const INGREDIENT_BY_SLUG_QUERY = `*[_type == "ingredient" && slug.current == $slug][0] {
  _id, name, slug, description, benefits,
  "products": *[_type == "product" && references(^._id) && status == "active"] {
    _id, name, slug, price, images, category->{ name, slug }
  }
}`

// Generic CMS page by slug
export const PAGE_BY_SLUG_QUERY = `*[_type == "page" && slug.current == $slug][0] {
  _id, title, slug, body, seo
}`

// Slug arrays for static path generation
export const ALL_PRODUCT_SLUGS_QUERY = `*[_type == "product" && status == "active"].slug.current`
export const ALL_JOURNAL_SLUGS_QUERY = `*[_type == "journalPost"].slug.current`
export const ALL_LEARN_SLUGS_QUERY = `*[_type == "learnArticle"].slug.current`
export const ALL_INGREDIENT_SLUGS_QUERY = `*[_type == "ingredient"].slug.current`
