require('dotenv').config()

const express = require('express')
const app = express()
const port = process.env.PORT || 8080
const http = require("http");
const { MongoClient, ObjectId } = require('mongodb');
const url = process.env.URL
const server = http.createServer(app);
const cors = require("cors")
const jwt = require('jsonwebtoken');

const Joi = require('joi');

const productSchema = Joi.object({
  Name: Joi.string().required(),
  Quantity: Joi.number().required(),
  Price: Joi.number().required(),
  Category: Joi.string().required(),
  Rating: Joi.number(),
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
      Price: Joi.number().required(),
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

  jwt.verify(token.split(' ')[1], 'token', (err, user) => {
    if (err) {
      if (err.name === 'TokenExpiredError') {
        return res.status(401).json({ error: 'Token er utløpt' });
      }
      return res.status(403).json({ error: err });
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

        const token = jwt.sign(tokenPayload, "token", { expiresIn: '2h' });

        res.json({ token: token });
      } catch (error) {
        console.error("Login failed:", error);
        res.status(500).json({ error: error });
      }
    })

    app.post('/upload-json-database', async (req, res) => {
      try {
        const { JSONstring } = req.body

        console.log(JSONstring)

        const ProductJSON = JSON.parse(JSONstring)
        for (const products of ProductJSON) {

          const newProduct = {
            Name: products.Name,
            Quantity: products.Quantity.$numberInt,
            Category: products.Category,
            Price: products.Price.$numberInt,
            Rating: products.Rating.$numberDouble,
            Available: products.Available,
          }

          const { error } = productSchema.validate(newProduct);
          if (error) {
            return res.status(400).json({ error: error.details[0].message });
          }

          await Products.insertOne(newProduct);
        }

      } catch (error) {
        console.error("Upload failed", error);
        res.status(500).json({ error: error });
      }
    })

    app.get('/get-products', async (req, res) => {
      try {
        const productCursor = Products.find();
        const products = await productCursor.toArray();
        res.send(products);
      } catch (error) {
        console.error("Error getting products:", error);
        res.status(500).send(error);
      }
    })


    app.get('/get-user-data', authenticateToken, async (req, res) => {
      try {
        const userID = req.user.userdata._id

        const userdata = await Users.findOne({ _id: new ObjectId(userID) })

        if (!userdata) {
          return res.status(404).json({ error: 'User not found' });
        }

        res.send(userdata);
      } catch (error) {
        console.error("Error getting user data:", error);
        res.status(500).send(error);
      }
    })

    app.get('/get-user-orders', authenticateToken, async (req, res) => {
      try {
        const userID = req.user.userdata._id;

        const user = await Users.findOne({ _id: new ObjectId(userID) });
        if (!user) {
          return res.status(404).json({ error: 'User not found' });
        }

        const orderIDs = user.Orders || [];
        const orders = await Orders.find({ OrderID: { $in: orderIDs } }).toArray();

        res.send(orders);
      } catch (error) {
        console.error("Error getting user orders:", error);
        res.status(500).send(error);
      }
    });


    app.post('/add-to-shoppingcart', authenticateToken, async (req, res) => {
      try {
        const { id, quantity } = req.body;

        if (!ObjectId.isValid(id)) {
          return res.status(400).json({ error: 'Invalid product ID' });
        }

        const product = await Products.findOne({ _id: new ObjectId(id) });

        if (!product) {
          return res.status(404).json({ error: 'Product not found' });
        }

        const user = await Users.findOne({ _id: new ObjectId(req.user.userdata._id) });

        if (!user) {
          return res.status(404).json({ error: 'User not found' });
        }

        const shoppingCartItem = {
          ProductID: id,
          Quantity: quantity,
          Price: product.Price,
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

    app.post('/remove-from-cart', authenticateToken, async (req, res) => {
      try {
        const { id } = req.body;

        if (!ObjectId.isValid(id)) {
          return res.status(400).json({ error: 'Invalid product ID' });
        }

        const product = await Products.findOne({ _id: new ObjectId(id) });

        if (!product) {
          return res.status(404).json({ error: 'Product not found' });
        }

        const user = await Users.findOne({ _id: new ObjectId(req.user.userdata._id) });

        if (!user) {
          return res.status(404).json({ error: 'User not found' });
        }
        await Users.updateOne(
          { _id: new ObjectId(user._id) },
          { $pull: { ShoppingCart: { ProductID: id } } }
        );

        res.json({ message: 'Product removed from shopping cart' });
      } catch (error) {
        console.error("Error removing to shopping cart:", error);
        res.status(500).send(error);
      }
    })

    app.post('/remove-order', authenticateToken, async (req, res) => {
      try {
        const { id, products } = req.body;


        Orders.deleteOne({ _id: new ObjectId(id) })

        for (const product of products) {
          await Products.updateOne(
            { _id: new ObjectId(product.ProductID) },
            { $inc: { Quantity: product.Quantity } }
          );
        }

        const user = await Users.findOne({ _id: new ObjectId(req.user.userdata._id) });

        if (!user) {
          return res.status(404).json({ error: 'User not found' });
        }
        await Users.updateOne(
          { _id: new ObjectId(user._id) },
          { $set: { Orders: [] } }
        );


        res.send({ message: 'removed order' });
      } catch (error) {
        console.error("Error removing to shopping cart:", error);
        res.status(500).send(error);
      }
    })

    app.post('/add-order', authenticateToken, async (req, res) => {
      try {
        const { Cartproducts, DeliveryDate, OrderMethod } = req.body

        const userID = req.user.userdata._id;
        const user = await Users.findOne({ _id: new ObjectId(userID) });
        if (!user) {
          return res.status(404).json({ error: 'User not found' });
        }

        const order = {
          OrderID: Date.now(),
          OrderMethod,
          PersonName: `${user.FirstName} ${user.LastName}`,
          DeliveryDate,
          Products: Cartproducts,
        };

        const { error } = orderSchema.validate(order);
        if (error) {
          return res.status(400).json({ error: error.details[0].message });
        }

        await Users.updateOne(
          { _id: new ObjectId(userID) },
          { $push: { Orders: order.OrderID }, $set: { ShoppingCart: [] } },
        );

        await Orders.insertOne(order);

        for (const product of Cartproducts) {
          await Products.updateOne(
            { _id: new ObjectId(product.ProductID) },
            { $inc: { Quantity: -product.Quantity } }
          );

          const updatedProduct = await Products.findOne({ _id: new ObjectId(product.ProductID) });
          if (updatedProduct && updatedProduct.Quantity <= 0) {
            await Products.updateOne(
              { _id: new ObjectId(product.ProductID) },
              { $set: { Available: false } }
            );
          }
        }

        res.json({ message: 'Order placed successfully' });

      } catch (error) {
        console.error(error);
        res.status(500).send(error);
      }

    })

  } catch (error) {
    console.log("database error:", error)
  }
})
