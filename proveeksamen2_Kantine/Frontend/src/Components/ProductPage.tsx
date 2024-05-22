import axios from "axios";
import { useEffect, useState } from "react";
import { Product } from "../utils/types";
import { useParams } from "react-router-dom";
import { Button, CircularProgress, Grid, Typography } from "@mui/material";
import { getImage } from '../utils/getImage';

export default function ProductPage() {
    const { id } = useParams<{ id: string }>();
    const [products, setProducts] = useState<Product[]>([]);
    const [image, setImage] = useState<string | undefined>();
    const [quantity, setQuantity] = useState(1);
    const [currentProduct, setCurrentProduct] = useState<Product>();

    const fetchProducts = async () => {
        try {
            const response = await axios.get<Product[]>('/api/get-products');
            setProducts(response.data);

        } catch (error) {
            console.log(error)
        }
    };

    const addToShoppingCart = async () => {
        try {
            const token = localStorage.getItem('token');
            if (!token) {
                throw new Error('Token not found');
            }
            const config = {
                headers: {
                    Authorization: token
                }
            };

            const product = {
                id: currentProduct?._id,
                quanity: quantity
            }

            await axios.post('/api/add-to-shoppingcart', product, config)
        } catch (error) {
            console.log(error)
        }
    }

    useEffect(() => {
        fetchProducts();
    }, []);

    useEffect(() => {
        if (products.length > 0) {
            setCurrentProduct(products.find(product => product._id === id));
        }
    }, [id, products]);

    useEffect(() => {
        if (currentProduct) {
            setImage(getImage(currentProduct.Name));
        }
    }, [currentProduct]);


    return (
        <div>
            {currentProduct ? (
                <Grid container spacing={3}>
                    <Grid item xs={12} md={6}>
                        <img src={image} alt={currentProduct.Name} style={{ maxWidth: "100%" }} />
                    </Grid>
                    <Grid item xs={12} md={6}>
                        <Typography variant="h4">{currentProduct.Name}</Typography>
                        <Typography variant="body1">Quantity: {currentProduct.Quantity}</Typography>
                        <Typography variant="body1">Price: {currentProduct.Price} Kr</Typography>
                        {/* Add more details as needed */}
                        <Button variant="contained" color="primary" onClick={addToShoppingCart}>
                            Legg til Handlevogn
                        </Button>
                    </Grid>
                </Grid>
            ) : (
                <CircularProgress />
            )}
        </div>
    )
}