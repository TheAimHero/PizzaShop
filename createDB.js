import mongoose from 'mongoose';

const url = 'mongodb://localhost:27017';
const pizzaUrl =
  'https://forkify-api.herokuapp.com/api/v2/recipes?search=pizza';
const dbName = 'PizzaShop';

mongoose.connect(url + '/' + dbName);

const pizzaSchema = new mongoose.Schema({
  name: String,
  restaurent: String,
  img: String,
  price: Number,
});

function randomInRange(min, max) {
  let num = Math.trunc(Math.random() * (max - min) + min);
  return num;
}

const pizzaModel = mongoose.model('Pizza', pizzaSchema);

async function makeDB() {
  let req = await fetch(pizzaUrl);
  let json = await req.json();
  let data = json.data.recipes;
  let price;
  data.forEach(obj => {
    price = randomInRange(100, 1000);
    let pizza = new pizzaModel({
      name: obj.title,
      restaurent: obj.publisher,
      img: obj.image_url,
      price: price,
    });
    pizza.save();
  });
}

await makeDB();
