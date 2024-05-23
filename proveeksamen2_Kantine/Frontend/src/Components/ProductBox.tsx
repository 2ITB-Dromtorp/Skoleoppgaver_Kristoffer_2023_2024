import { Product } from '../utils/types';
import { Card, CardMedia, CardContent, Typography, Rating as MuiRating, CardActions, Grid } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { getImage } from '../utils/getImage';

import './ProductBox.css';

export default function ProductBox({ _id, Name, Quantity, Price, Rating }: Product) {
    const imageUrl = getImage(Name);

    const navigate = useNavigate();

    const handleClick = () => {
        navigate(`/product/${_id}`);
    };

    return (
        <Grid item>
            <Card onClick={handleClick} className="product-card">
                <CardMedia
                    component="img"
                    style={{ objectFit: 'cover'}}
                    className='product-image'
                    image={imageUrl}
                    alt={Name}
                />

                <CardContent className="content">
                    <Typography gutterBottom variant="h5" component="div">
                        {Name}
                    </Typography>
                    <MuiRating value={Rating} precision={0.1} readOnly />
                    <Typography variant="body2" color="text.secondary">
                        {Quantity} stk
                    </Typography>

                </CardContent>
                <CardActions className="actions">
                    <Typography variant="body1" color="text.primary">
                        {Price} Kr
                    </Typography>
                </CardActions>
            </Card>
        </Grid>
    );
}
