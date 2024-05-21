export interface Product {
    _id: {
      $oid: string;
    };
    Name: string;
    Quantity: {
      $numberInt: string;
    };
    Category: string;
    Ingridients?: string[];
    Pris: {
      $numberInt: string;
    };
    Rating: {
      $numberDouble: string;
    };
    Available: boolean;
}