import MaxWidthWrapper from '@/components/MaxWidthWrapper'
import ProductReel from '@/components/ProductReel'
import { PRODUCT_CATEGORIES } from '@/config'
import { config } from '@/constants/index'

const apiUrl = config.apiUrl;

type Param = string | string[] | undefined

interface ProductsPageProps {
  searchParams: { [key: string]: Param }
  posts: any[] 
  totalPages: number
}

const parse = (param: Param) => {
  return typeof param === 'string' ? param : undefined
}

const ProductsPage = async ({
  searchParams
}: ProductsPageProps) => {
  const sort = parse(searchParams.sort)
  const category = parse(searchParams.category)

  const label = PRODUCT_CATEGORIES.find(
    ({ value }) => value === category
  )?.label
  const queryParam = parse(searchParams.query) || ''
  const limitParam = parse(searchParams.limit) || '10'
  const pageParam = parse(searchParams.page) || '1'
  const categoryParam = parse(searchParams.category) || ''

  // Server-side fetch
  const response = await fetch(`${apiUrl}/api/products?` + new URLSearchParams({
    query: queryParam,
    limit: limitParam,
    page: pageParam,
    category: categoryParam
  }), {
    cache: 'no-store' 
  })

  if (!response.ok) {
    // Handle error
    console.error('Error fetching posts:', response.statusText)
    return (
      <MaxWidthWrapper>
        <p>Error loading posts</p>
      </MaxWidthWrapper>
    )
  }

  const data = await response.json()
  const posts = data.data
  const totalPages = data.totalPages
  console.log(posts)

  return (
    <MaxWidthWrapper>
      <ProductReel
        data={posts?.data}
        emptyTitle="No Events Found"
        emptyStateSubtext="Come back later"
        collectionType="All_Posts"
        limit={6}
        page={pageParam}
        totalPages={totalPages}
      />
    </MaxWidthWrapper>
  )
}

export default ProductsPage