const mongoose = require("mongoose");
const Tour = require("../models/Tour");
require("dotenv").config();

const tours = [
  { id: 1, name: "Карпати", img: "https://picsum.photos/200", price: 3000, freePlaces: 5, maxPlaces: 20 },
  { id: 2, name: "Одеса", img: "https://picsum.photos/201", price: 2500, freePlaces: 2, maxPlaces: 15 },
  { id: 3, name: "Київ", img: "https://picsum.photos/202", price: 3500, freePlaces: 16, maxPlaces: 40 },
  { id: 4, name: "Карпати", img: "https://picsum.photos/200", price: 3000, freePlaces: 5, maxPlaces: 20 },
  { id: 5, name: "Одеса", img: "https://picsum.photos/201", price: 2500, freePlaces: 2, maxPlaces: 15 },
  { id: 6, name: "Київ", img: "https://picsum.photos/202", price: 3500, freePlaces: 16, maxPlaces: 40 }
];

mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
}).then(async () => {
  await Tour.deleteMany({});
  await Tour.insertMany(tours);
  console.log("Data seeded");
  process.exit();
});
