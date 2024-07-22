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
  
  