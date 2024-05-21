require('dotenv').config()

const express = require('express')
const app = express()
const port = process.env.PORT || 8080
const http = require("http");
const { MongoClient } = require('mongodb');
const url = process.env.URL
const server = http.createServer(app);
const cors = require("cors")

//const Joi = require('joi');

app.use(express.json())

app.use(cors())

server.listen(port, async () => {
    console.log(`Example app listening on port ${port}`)

    try {
      const mongodb = new MongoClient(url);
      await mongodb.connect();
      console.log("Connected to MongoDB");
  
      const databaseName = "Proveeksamen_Kantine";
      const ProductsString = "Products";
      const OrdersString = "Orders"
  
      const database = mongodb.db(databaseName);
      const Products = database.collection(ProductsString);
      const Orders = database.collection(OrdersString)

      app.get('/get-products', async (req, res) => {
        try {
          const productCursor = Products.find();
          const products = await productCursor.toArray();
          console.log("test")
          res.send(products);
        } catch (error) {
          console.error("Error getting equipment:", error);
          res.status(500).send(error);
        }
      })

      app.get('/get-orders', async (req, res) => {
        try {
          const orderCursor = Orders.find();
          const order = await orderCursor.toArray();
          res.send(order);
        } catch (error) {
          console.error("Error getting equipment:", error);
          res.status(500).send(error);
        }
      })

    } catch(error) {
      console.log("database error:", error)
    }
})
