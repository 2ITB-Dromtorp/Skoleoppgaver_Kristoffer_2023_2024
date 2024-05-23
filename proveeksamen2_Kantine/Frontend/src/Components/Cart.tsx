import { useEffect, useState } from "react";
import { User, ShoppingCartItem, Product } from "../utils/types";
import axios from "axios";
import { Button, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography } from "@mui/material";
import RemoveShoppingCartIcon from '@mui/icons-material/RemoveShoppingCart';
import PaymentModal from './PaymentModal';

export default function Cart() {
    const [cartData, setCartData] = useState<User | null>(null);
    const [products, setProducts] = useState<Product[]>([]);
    const [total, setTotal] = useState<number>(0);
    const [modalOpen, setModalOpen] = useState(false);

    const fetchProducts = async () => {
        try {
            const response = await axios.get<Product[]>('/api/get-products');
            setProducts(response.data);
        } catch (error) {
            console.log(error);
        }
    };

    const handleRemoveItem = async (id: string) => {
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

            await axios.post('/api/remove-from-cart', { id }, config);
            await fetchUserData();
        } catch (error) {
            console.log(error);
        }
    }

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

            const response = await axios.get<User>('/api/get-user-data', config);
            setCartData(response.data);
        } catch (error) {
            console.log(error)
        }
    };

    useEffect(() => {
        const fetchData = async () => {
            await fetchProducts();
            await fetchUserData();
        };

        fetchData();
    }, []);

    useEffect(() => {
        if (cartData) {
            const newTotal = cartData.ShoppingCart.reduce((acc, item) => acc + item.Quantity * item.Price, 0);
            setTotal(newTotal);
        }
    }, [cartData]);

    const getProduct = (productId: string): Product | null => {
        const product = products.find(p => p._id === productId);
        return product ? product : null;
    };

    const calculateTotal = (): number => {
        if (cartData) {
            return cartData.ShoppingCart.reduce((acc, item) => acc + item.Quantity * item.Price, 0);
        }
        return 0;
    };

    const handleOpenModal = () => {
        const updatedTotal = calculateTotal();
        setTotal(updatedTotal);
        setModalOpen(true);
    };

    const handleCloseModal = () => {
        setModalOpen(false);
    };

    return (
        <>
            {cartData && (
                <div className="cartcontainer">
                    <Typography variant="h4" gutterBottom>Handlekurv</Typography>
                    <TableContainer component={Paper}>
                        <Table>
                            <TableHead>
                                <TableRow>
                                    <TableCell>Produkt</TableCell>
                                    <TableCell align="right">Mengde</TableCell>
                                    <TableCell align="right">Pris</TableCell>
                                    <TableCell align="right">Totalt</TableCell>
                                    <TableCell align="right">Fjern</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {cartData?.ShoppingCart.map((item: ShoppingCartItem) => (
                                    <TableRow key={item.ProductID}>
                                        <TableCell>{getProduct(item.ProductID)?.Name}</TableCell>
                                        <TableCell align="right">{item.Quantity}</TableCell>
                                        <TableCell align="right">{item.Price} Kr</TableCell>
                                        <TableCell align="right">{item.Price * item.Quantity} Kr</TableCell>
                                        <TableCell align="right">
                                            <Button onClick={() => handleRemoveItem(item.ProductID)} variant="contained">
                                                <RemoveShoppingCartIcon />
                                            </Button>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </TableContainer>
                    <Typography variant="h6" align="center">
                        Total: {total} Kr
                    </Typography>
                    <Button variant="contained" color="primary" onClick={handleOpenModal} disabled={cartData.ShoppingCart.length <= 0} style={{ marginTop: '20px' }}>
                        Bestill
                    </Button>
                </div>
            )}
            <PaymentModal open={modalOpen} handleClose={handleCloseModal} total={total} cartItems={cartData?.ShoppingCart}  />
        </>
    );
}
