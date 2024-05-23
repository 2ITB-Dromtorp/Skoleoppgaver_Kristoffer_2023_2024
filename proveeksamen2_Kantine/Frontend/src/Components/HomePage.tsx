import axios from 'axios';
import { useEffect, useState } from 'react';
import { Product } from '../utils/types';
import ProductBox from './ProductBox';
import { CircularProgress, Grid, Typography } from '@mui/material';


export default function HomePage() {
    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState<boolean>(true);

    const fetchProducts = async () => {
        try {
            const response = await axios.get<Product[]>('/api/get-products');
            setProducts(response.data);
            setLoading(false);
        } catch (error) {
            console.log(error)
        }
    };

    useEffect(() => {
        fetchProducts();
    }, []);

    return (
        <>
            <Typography gutterBottom variant="h3" component="div">
                Mat
            </Typography>

            <Grid container spacing={3}>

                {loading ? (
                    <CircularProgress />
                ) : (
                    products
                        .filter(product => product.Category === "Mat" && product.Available !== false)
                        .map(product => (
                            <ProductBox
                                key={product.Name}
                                _id={product._id}
                                Name={product.Name}
                                Quantity={product.Quantity}
                                Category={product.Category}
                                Price={product.Price}
                                Rating={product.Rating}
                                Available={false}
                            />
                        ))
                )}
            </Grid>

            <Typography gutterBottom variant="h3" component="div">
                Drikker
            </Typography>
            <Grid container spacing={3}>


                {loading ? (
                    <CircularProgress />
                ) : (
                    products
                        .filter(product => product.Category === "Drikke" && product.Available !== false)
                        .map(product => (
                            <ProductBox
                                key={product.Name}
                                _id={product._id}
                                Name={product.Name}
                                Quantity={product.Quantity}
                                Category={product.Category}
                                Price={product.Price}
                                Rating={product.Rating}
                                Available={false}
                            />
                        ))
                )}

            </Grid>

        </>
    );
}
