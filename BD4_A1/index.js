let express = require('express');
let cors = require('cors');
let sqlite3 = require('sqlite3');
let { open } = require('sqlite');

let app = express();
let PORT = process.env.PORT || 3000;
app.use(cors());
app.use(express.json());

let db;

(async () => {
  db = await open({
    filename: 'BD4_A1/database.sqlite',
    driver: sqlite3.Database,
  });
})();

async function fetchAllRestaurants() {
  let query = 'SELECT * FROM restaurants';
  let response = await db.all(query, []);
  return { restaurants: response };
}

app.get('/restaurants', async (req, res) => {
  try {
    let result = await fetchAllRestaurants();
    if (result.restaurants.length === 0) {
      return res.status(404).json({ message: 'No restaurants found' });
    }
    res.status(200).json(result);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});

async function fetchSpecificRestaurant(id) {
  let query = 'SELECT * FROM restaurants WHERE id = ?';
  let response = await db.get(query, [id]);
  return { restaurant: response };
}

app.get('/restaurants/details/:id', async (req, res) => {
  let id = req.params.id;
  try {
    let result = await fetchSpecificRestaurant(id);
    if (result === undefined) {
      return res
        .status(404)
        .json({ message: 'No restaurants found of this id: ' + id });
    }
    res.status(200).json(result);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});

async function fetchRestaurantsByCuisine(cuisine) {
  let query = 'SELECT * FROM restaurants WHERE cuisine = ?';
  let response = await db.get(query, [cuisine]);
  return { restaurants: response };
}

app.get('/restaurants/cuisine/:cuisine', async (req, res) => {
  let cuisine = req.params.cuisine;
  try {
    let result = await fetchRestaurantsByCuisine(cuisine);
    if (result === undefined) {
      return res
        .status(404)
        .json({ message: 'No restaurants found of this cuisine: ' + cuisine });
    }
    res.status(200).json(result);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});

async function fetchRestaurantsBasedonFilters(
  isVeg,
  hasOutdoorSeating,
  isLuxury
) {
  let query =
    'SELECT * FROM restaurants WHERE isVeg = ? OR hasOutdoorSeating = ? OR isLuxury = ?';
  let response = await db.get(query, [isVeg, hasOutdoorSeating, isLuxury]);
  return { restaurants: response };
}

app.get('/restaurants/filter', async (req, res) => {
  let isVeg = req.query.isVeg;
  let hasOutdoorSeating = req.query.hasOutdoorSeating;
  let isLuxury = req.query.isLuxury;
  try {
    let result = await fetchRestaurantsBasedonFilters(
      isVeg,
      hasOutdoorSeating,
      isLuxury
    );
    if (result === undefined) {
      return res.status(404).json({ message: 'No restaurants found.' });
    }
    res.status(200).json(result);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});

async function fetchRestaurantsSortedbyRating() {
  let query = 'SELECT * FROM restaurants ORDER BY rating DESC';
  let response = await db.all(query, []);
  return { restaurants: response };
}

app.get('/restaurants/sort-by-rating', async (req, res) => {
  try {
    let result = await fetchRestaurantsSortedbyRating();
    if (result.restaurants.length === 0) {
      return res.status(404).json({ message: 'No restaurants found.' });
    }
    res.status(200).json(result);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});

async function getAllDishes() {
  let query = 'SELECT * FROM dishes';
  let response = await db.all(query, []);
  return { dishes: response };
}

app.get('/dishes', async (req, res) => {
  try {
    let result = await getAllDishes();
    if (result.dishes.length === 0) {
      return res.status(404).json({ message: 'No dishes found.' });
    }
    res.status(200).json(result);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});

async function getDishbyId(id) {
  let query = 'SELECT * FROM dishes WHERE id = ?';
  let response = await db.get(query, [id]);
  return { dishes: response };
}

app.get('/dishes/details/:id', async (req, res) => {
  let id = req.params.id;
  try {
    let result = await getDishbyId(id);
    if (result === undefined) {
      return res
        .status(404)
        .json({ message: 'No dishes found of this id: ' + id });
    }
    res.status(200).json(result);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});

async function getDishesbyFilter(isVeg) {
  let query = 'SELECT * FROM dishes WHERE isVeg = ?';
  let response = await db.all(query, isVeg);
  return { dishes: response };
}

app.get('/dishes/filter', async (req, res) => {
  let isVeg = req.query.isVeg;
  try {
    let result = await getDishesbyFilter(isVeg);
    if (result.dishes.length === 0) {
      return res.status(404).json({ message: 'No dishes found. ' });
    }
    res.status(200).json(result);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});

async function getDishesSortedbyPrice() {
  let query = 'SELECT * FROM dishes ORDER BY price';
  let response = await db.all(query, []);
  return { dishes: response };
}

app.get('/dishes/sort-by-price', async (req, res) => {
  try {
    let result = await getDishesSortedbyPrice();
    if (result.dishes.length === 0) {
      return res.status(404).json({ message: 'No dishes found. ' });
    }
    res.status(200).json(result);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});

app.listen(PORT, () => console.log('Server running on port 3000'));
