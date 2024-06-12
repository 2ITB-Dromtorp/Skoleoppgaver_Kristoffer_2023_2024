import { Button } from "@mui/material";

import { CloudUpload } from '@mui/icons-material';
import { useState } from "react";
import axios from "axios";

export default function AdminPage() {
    const [file, setFile] = useState<File | null>(null);
    const [JSONstring, setJSONstring] = useState("")

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) {
            setFile(e.target.files[0]);
        }
    };

    const handleUpload = async () => {
        if (file) {
            try {
                const fileReader = new FileReader();
                fileReader.readAsText(file, "UTF-8");
                fileReader.onload = (event) => {
                    if (event.target) {
                        setJSONstring(event.target.result as string)
                    }
                }

                await axios.post('/api/upload-json-database', { JSONstring: JSONstring })
            } catch (error) {
                console.log(error)
            }
        } else {
            console.log("loading")
        }

    }

    return (<>
        <input type="file" onChange={handleFileChange}></input>
        <CloudUpload />
        <Button onClick={handleUpload}>
            Upload JSON file to MongoDB
        </Button>

    </>)
}