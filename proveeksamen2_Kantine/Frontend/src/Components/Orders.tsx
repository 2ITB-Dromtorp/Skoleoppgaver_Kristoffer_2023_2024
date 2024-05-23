import { useEffect, useState } from "react";
import axios from "axios";
import { Product, Order, OrderProduct } from "../utils/types";
import { Button, Card, CardActions, CardContent, Grid, Typography } from "@mui/material";

export default function OrderPage() {
    const [userOrders, setUserOrders] = useState<Order[] | null>([]);
    const [products, setProducts] = useState<Product[]>([]);

    const fetchProducts = async () => {
        try {
            const response = await axios.get<Product[]>('/api/get-products');
            setProducts(response.data);
        } catch (error) {
            console.log(error);
        }
    };


    const fetchUserData = async () => {
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

            const response = await axios.get<Order[]>('/api/get-user-orders',config);
            setUserOrders(response.data);
        } catch (error) {
            console.log(error)
        }
    };

    const HandleRemoveOrder = async (productID: string, products: OrderProduct[]) => {
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

            await axios.post('/api/remove-order', {id: productID, products: products} ,config)

            fetchProducts();
            fetchUserData();
        } catch (error) {
            console.log(error)
        }
    }

    useEffect(() => {
        fetchProducts();
        fetchUserData();
    }, []);

    const getProduct = (productId: string): Product | null => {
        const product = products.find(p => p._id === productId);
        return product ? product : null;
    };

    return (
        <Grid container spacing={3}>
            {userOrders && userOrders.map(order => (
            <Grid item>
            <Card>
                <CardContent className="content">
                    <Typography gutterBottom variant="h5" component="div">
                        Leverings ID: {order.OrderID}
                    </Typography>

                    <Typography gutterBottom variant="h5" component="div">
                        Levering om {order.DeliveryDate}
                    </Typography>

                    {order.Products.map(product => {
                        const productDetails = getProduct(product.ProductID);
                        return (
                            <div key={product.ProductID}>
                                <Typography variant="body1">
                                    Produkt: {productDetails ? productDetails.Name : "Ukjent produkt"}
                                </Typography>
                                <Typography variant="body2">
                                    Mengde: {product.Quantity}
                                </Typography>
                                <Typography variant="body2">
                                    Pris: {product.Price} Kr
                                </Typography>
                            </div>
                        );
                    })
                    }

                </CardContent>
                <CardActions className="actions">
                    <Button onClick={() => HandleRemoveOrder(order._id, order.Products)}>Avlys</Button>
                </CardActions>
            </Card>
        </Grid>
        ))}
        </Grid>

    )
}