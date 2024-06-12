import axios from "axios";
import { ChangeEvent, useEffect, useState } from "react";
import { Product } from "../utils/types";
import { useNavigate, useParams } from "react-router-dom";
import { Button, CircularProgress, Grid, Typography, IconButton, TextField } from "@mui/material";
import { getImage } from '../utils/getImage';
import { Add, Remove } from '@mui/icons-material';

import './ProductPage.css'
import { getDescription } from "../utils/getDescription";

export default function ProductPage() {
    const { id } = useParams<{ id: string }>();
    const [products, setProducts] = useState<Product[]>([]);
    const [image, setImage] = useState<string | undefined>();
    const [quantity, setQuantity] = useState(1);
    const [currentProduct, setCurrentProduct] = useState<Product>();

    const navigate = useNavigate();

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
                return;
            }
            const config = {
                headers: {
                    Authorization: token
                }
            };

            await axios.post('/api/add-to-shoppingcart', { id: currentProduct?._id, quantity: quantity }, config)

            navigate('/cart');
        } catch (error) {
            console.log(error)
        }
    }

    const incrementQuantity = () => {
        setQuantity(quantity + 1);
    };

    const decrementQuantity = () => {
        if (quantity > 1) {
            setQuantity(quantity - 1);
        }
    };

    const handleChangeQuantity = (event: ChangeEvent<HTMLInputElement>) => {
        const value = parseInt(event.target.value, 10);
        if (!isNaN(value)) {
            setQuantity(value);
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
        <div className="product-container">
            {currentProduct ? (
                <Grid container spacing={7} className="product-content">
                    <Grid item className="image-container">
                        <img src={image} alt={currentProduct.Name} className="product-image" />
                    </Grid>
                    <Grid item className="details-container">
                        <div>
                            <Typography variant="h4">{currentProduct.Name}</Typography>

                            <Typography variant="h6">{getDescription(currentProduct.Name)}</Typography>
                        </div>

                        <div className="ingridients">
                            {currentProduct.Ingridients && currentProduct.Ingridients.length > 0 ? (
                                currentProduct.Ingridients.map((ingredient, index) => (
                                    <p key={index}>{ingredient}</p>
                                ))
                            ) : (
                                <p></p>
                            )}
                        </div>

                        <Typography variant="body1">{currentProduct.Quantity} stk</Typography>
                        <Typography variant="h6">{currentProduct.Price * quantity} Kr</Typography>

                        <div className="quantity-container">
                            <IconButton onClick={decrementQuantity} disabled={quantity === 1}>
                                <Remove />
                            </IconButton>
                            <TextField
                                type="number"
                                value={quantity}
                                onChange={handleChangeQuantity}
                                size="small"
                            />
                            <IconButton onClick={incrementQuantity} disabled={quantity >= currentProduct.Quantity}>
                                <Add />
                            </IconButton>
                        </div>
                        <Button variant="contained" color="primary" onClick={addToShoppingCart} style={{ marginTop: '20px' }}>
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
