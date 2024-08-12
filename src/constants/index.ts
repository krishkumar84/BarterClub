export const headerLinks = [
    {
      label: 'Home',
      route: '/',
    },
    {
      label: 'Create Event',
      route: '/events/create',
    },
    {
      label: 'My Profile',
      route: '/profile',
    },
  ]

  export enum Condition {
    New = 'new',
    Old = 'old'
  }
  
  export enum ProductType {
    Product = 'product',
    Service = 'service'
  }
  
  export enum DeliveryMethod {
    Free = 'free',
    INR = 'INR',
    BarterPoints = 'Barter points'
  }
  
  
  export const productDefaultValues = {
    clerkId: '',
    userId: '',
    title: '',
    description: '',
    condition: Condition.New, 
    type: ProductType.Product,
    availableQty: 0,
    deliveryTime: 1,
    category: '',
    price: 0,
    gst: 0,
    rating: 3,
    delivery: DeliveryMethod.Free, 
    images: [] as string[],
    video: null
  };
  
const dev = process.env.NODE_ENV !== 'production';

export const config = {
  apiUrl: dev 
    // ? 'https://potential-space-succotash-5j7wgv6jpp6f7575-3000.app.github.dev'
    ? 'http://localhost:3000'
    : 'https://barter-club.vercel.app',
};

  