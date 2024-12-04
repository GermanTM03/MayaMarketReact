// src/models/Product.ts
export interface Product {
    _id: string;
    userId: string;
    name: string;
    categories: string;
    image_1: string;
    image_2: string;
    image_3: string;
    stock: number;
    price: number;
    quantity: number;
    size: string;
    status: string;
    createdAt: string;
    updatedAt: string;
  }
  