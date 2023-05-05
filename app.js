import bodyParser from 'body-parser';
import express from 'express';
import mongoose from 'mongoose';
import _ from 'lodash';

const app = express();
const url = 'mongodb://localhost:27017';
const dbName = 'PizzaShop';

mongoose.connect(url + '/' + dbName);

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('public'));
app.use(express.static('node_modules'));

app.set('view engine', 'ejs');

const pizzaSchema = new mongoose.Schema({
  name: String,
  restaurent: String,
  img: String,
  price: String,
});
const pizzaModel = mongoose.model('Pizza', pizzaSchema);

const cartSchema = new mongoose.Schema({
  pizza: pizzaSchema,
  quantity: Number,
});
const cartModel = mongoose.model('CartItem', cartSchema);

app.get('/', async (_, res) => {
  let pizzas = await pizzaModel.find();
  res.render('index', { pizzas: pizzas });
});

app.get('/cart', async (_, res) => {
  let cartItems = await cartModel.find();
  res.render('cart', { cartItems: cartItems });
});

app.get('/updatecart', async (req, res) => {
  let { _id, quantity } = req.query;
  let totalItems = 0;
  let totalPrice = 0;
  let item = await cartModel.findByIdAndUpdate(
    { _id: _id },
    { quantity: quantity }
  );
  let cart = await cartModel.find();
  cart.forEach(item => {
    totalItems += item.quantity;
    totalPrice += item.pizza.price * item.quantity;
  });
  res.send({ totalItems, totalPrice });
});

app.get('/addtocart', async (req, res) => {
  let _id = req.query._id;
  let pizza = await pizzaModel.findById(_id);
  let cartItem = await cartModel.find({ 'pizza._id': _id });
  cartItem = cartItem[0];
  if (!cartItem) {
    cartItem = new cartModel({ pizza: pizza, quantity: 1 });
    cartItem.save();
  } else {
    cartItem.quantity++;
    cartItem.save();
    console.log(cartItem);
  }
  res.send();
});

app.listen(3000, () => {
  console.log('Listening at port 3000');
});
