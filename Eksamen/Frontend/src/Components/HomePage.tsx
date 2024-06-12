import { FormControl, InputLabel, MenuItem, Select } from '@mui/material';
import Button from '@mui/material/Button';
import { useState } from 'react';

export default function HomePage() {

    const [age] = useState(10);
    
    return (
        <>
            <p className="">Home page</p>
            <Button variant="contained">Hello world</Button>
            <FormControl fullWidth>
            <InputLabel id="demo-simple-select-label">Age</InputLabel>
            <Select
                labelId="demo-simple-select-label"
                id="demo-simple-select"
                value={age}
                label="Age"
            >
                <MenuItem value={10}>Ten</MenuItem>
                <MenuItem value={20}>Twenty</MenuItem>
                <MenuItem value={30}>Thirty</MenuItem>
            </Select>
            </FormControl>
        </>
    );
}
