const express = require("express");
const pug = require("pug");
const fs = require("fs");
let app = express();
//requried all things need and the express aplication

let restaurants = {};
let json_restaur;
let news = [];
let id = -1;
let namer = "";
//Set it up so it will satstically work in the public folder
app.use(express.static("public"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

function json_restaurants() {
  //Function for json request
  let arr = [];
  for (let i in restaurants) {
    arr.push(restaurants[i].id);
  }
  json_restaur = { restaurants: arr };
}

fs.readdir("./restaurants", (err, files) => {
  if (err) return err;
  for (let i = 0; i < files.length; i++) {
    // Require the json data from the restaurants direcorty.
    id++;
    let restaurantData = require("./restaurants/" + files[i]);
    restaurants[restaurantData.name] = restaurantData;
  }

  app.listen(3000);
});

//Start adding route handlers here
app.route(["/home", "/"]).get((req, res) => {
  res.statusCode = 200;
  res.send(pug.renderFile("./home.pug", {}));
  res.end();
});

//for the addrestaurants query run the new.pug
app.route(["/addrestaurants"]).get((req, res) => {
  res.statusCode = 200;
  res.send(pug.renderFile("./new.pug", {}));
  res.end();
});

//get request for the new ids
app.route(["/id"]).get((req, res) => {
  res.status(200).send(id.toString());
  res.end();
});

app.route(["/restaurants"]).get((req, res) => {
  //Checks if a json or HTNL request
  if (req.get("Accept") === "application/json") {
    json_restaurants();
    res.send(json_restaur);
  } else {
    //render the browsering page here
    res.statusCode = 200;
    res.send(
      pug.renderFile("./browser.pug", {
        restaurants: restaurants,
      })
    );
  }

  res.end();
});

//Grabs the newly and adds updates restarunt object and updates the current restaurant
app.put("/object", (request, response) => {
  if (request.get("Accept") === "application/json") {
    response.send(restaurants);
  }
  response.statusCode = 200;
  if (response.statusCode == 200) {
    restaurants[request.body.name] = request.body;
  } else {
    response.statusCode = 404;
  }
});

app.put("/object", (request, response) => {});

//This is for the names value and price
app.post("/info", (request, response) => {
  let temp = request.body;
  id++;
  temp["id"] = id;
  temp["menu"] = {};
  restaurants[temp.name] = temp;
  console.log(restaurants);
});
//Send its to the correct parameter of the restauyrnt
app.route(["/restaurants/:id"]).get((req, res) => {
  if (req.get("Accept") === "application/json") {
    let temper = req.params.id;
    //Itarte to redirect to the desired restaurant
    for (let i in restaurants) {
      if (restaurants[i].id == temper) {
        namer = i;
      }
    }
    let key = restaurants[namer];
    res.send(key);
  } else {
    let temper = req.params.id;
    //Itarte to redirect to the desired restaurant
    for (let i in restaurants) {
      if (restaurants[i].id == temper) {
        namer = i;
      }
    }
    let key = restaurants[namer];
    console.log(key);
    //Send an individual restaurant into the pug file to display menu and items etc.
    res.send(
      pug.renderFile("./load.pug", {
        restaurants: key,
      })
    );
  }

  res.end();
});

console.log("Server listening at http://localhost:3000");
