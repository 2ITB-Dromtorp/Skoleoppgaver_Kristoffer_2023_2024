export interface Product {
  _id: string;
  Name: string;
  Quantity: number;
  Category: string;
  Ingridients?: string[];
  Price: number;
  Rating: number;
  Available: boolean;
}

export interface User {
  Email: string;
  FirstName: string;
  LastName: string;
  Admin: boolean;
  Password: string;
  Orders: string[];
  ShoppingCart: ShoppingCartItem[];
}

interface ShoppingCartItem {
  ProductID: string;
  Quantity: number;
  Price: number;
}

export interface DecodedToken {
  userdata: User;
  exp: number;
}