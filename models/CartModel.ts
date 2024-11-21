export interface Product {
    _id: string;
    name: string;
    price: number;
    image_1: string;
    stock: number;
  }
  
  export interface CartItem {
    productId: Product;
    quantity: number;
  }
  
  export interface CartResponse {
    _id: string;
    userId: string;
    items: CartItem[];
    createdAt: string;
    updatedAt: string;
  }
  