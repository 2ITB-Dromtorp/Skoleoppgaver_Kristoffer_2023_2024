require('dotenv').config()

const express = require('express')
const app = express()
const port = process.env.PORT || 8080
const http = require("http");
const { MongoClient } = require('mongodb');
const url = process.env.URL
const server = http.createServer(app);
const cors = require("cors")
const jwt = require('jsonwebtoken');

const Joi = require('joi');

const productSchema = Joi.object({
  _id: Joi.string().required(),
  Name: Joi.string().required(),
  Quantity: Joi.number().required(),
  Ingredients: Joi.array().items(Joi.string()).required(),
  Price: Joi.number().required(),
  Rating: Joi.number().required(),
  Available: Joi.boolean().required()
});

const orderSchema = Joi.object({
  OrderID: Joi.number().required(),
  OrderMethod: Joi.string().required(),
  PersonName: Joi.string().required(),
  DeliveryDate: Joi.string().required(),
  Products: Joi.array().items(
    Joi.object({
      ProductID: Joi.string().required(),
      Quantity: Joi.number().required(),
      Price: Joi.number().required()
    })
  ).required()
});

// User schema
const userSchema = Joi.object({
  Email: Joi.string().email().required(),
  FirstName: Joi.string().required(),
  LastName: Joi.string().required(),
  Admin: Joi.boolean().required(),
  Password: Joi.string().required(),
  Orders: Joi.array().items(Joi.string()),
  ShoppingCart: Joi.array().items(
    Joi.object({
      ProductID: Joi.string().required(),
      Quantity: Joi.number().required(),
      Price: Joi.number().required()
    })
  )
});

app.use(express.json())

app.use(cors())

function authenticateToken(req, res, next) {
  const token = req.headers['authorization'];

  if (!token) {
    return res.status(401).json({ error: 'Ingen token funnet' });
  }

  jwt.verify(token.split(' ')[1], 'testtoken', (err, user) => {
    if (err) {
      if (err.name === 'TokenExpiredError') {
        return res.status(401).json({ error: 'Token er utløpt' });
      }
      return res.status(403).json({ error: 'Ugyldig token' });
    }
    req.user = user;
    next();
  });
}

server.listen(port, async () => {
  console.log(`Example app listening on port ${port}`)

  try {
    const mongodb = new MongoClient(url);
    await mongodb.connect();
    console.log("Connected to MongoDB");

    const databaseName = "Proveeksamen_Kantine";
    const ProductsString = "Products";
    const OrdersString = "Orders"
    const UsersString = "Users"

    const database = mongodb.db(databaseName);
    const Products = database.collection(ProductsString);
    const Orders = database.collection(OrdersString);
    const Users = database.collection(UsersString);

    app.post('/login', async (req, res) => {
      try {
        const { email, password } = req.body;

        if (!email || !password) {
          return res.status(400).json({ error: "Email og passord er påkrevd" });
        }

        const user = await Users.findOne({ Email: email });
        if (!user) {
          return res.status(401).json({ error: "Bruker finnes ikke" });
        }

        const tokenPayload = {
          userdata: user
        };

        const token = jwt.sign(tokenPayload, "testToken", { expiresIn: '2h' });

        res.json({ token: token });
      } catch (error) {
        console.error("Login failed:", error);
        res.status(500).json({ error: error });
      }
    })

    app.get('/get-products', async (req, res) => {
      try {
        const productCursor = Products.find();
        const products = await productCursor.toArray();
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

    app.post('/add-to-shoppingcart', authenticateToken, async (req, res) => {
      try {
        const { productID, quantity } = req.body;
        console.log("test")

        console.log(req.user.userdata)


        if (!ObjectId.isValid(productID)) {
          return res.status(400).json({ error: 'Invalid product ID' });
        }

        const product = await Products.findOne({ _id: new ObjectId(productID) });

        if (!product) {
          return res.status(404).json({ error: 'Product not found' });
        }

        const user = await Users.findOne({ _id: new ObjectId(req.user.userdata._id) });

        if (!user) {
          return res.status(404).json({ error: 'User not found' });
        }

        const shoppingCartItem = {
          ProductID: productID,
          Quantity: quantity,
          Price: product.Price
        };

        await Users.updateOne(
          { _id: new ObjectId(user._id) },
          { $push: { ShoppingCart: shoppingCartItem } }
        );

        res.json({ message: 'Product added to shopping cart' });
      } catch (error) {
        console.error("Error adding to shopping cart:", error);
        res.status(500).send(error);
      }
    })

    app.put('/add-order', async (req, res) => {

    })

  } catch (error) {
    console.log("database error:", error)
  }
})
