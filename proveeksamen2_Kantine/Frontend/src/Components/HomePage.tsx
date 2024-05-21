import axios from 'axios';
import { useEffect, useState } from 'react';
import { Product } from '../utils/types';



export default function HomePage() {
    const [products, setProducts] = useState<Product[]>([]);

    const fetchProducts = async () => {
        try {
            const response = await axios.get<Product[]>('/api/get-products');

            setProducts(response.data);

            console.log(response.data)
        } catch (error) {
            console.log(error)
        }
    };

    useEffect(() => {
        fetchProducts()
    });
    
    return (
        <>
            <p className="">Home page</p>

            <ul>
                {products && products.map(product => (
                <li key={product._id.$oid}>
                    {product.Name} - {product.Category}
                </li>
                ))}
            </ul>
        </>
    );
}
