info = {};
let id = 0;
let category_value = "";
var counter = 1000;
init();

//By using script!= `const object = ${JSON.stringify(restaurants)};` recommended in the discord server by SAM HASSKINS i was able to retrive the object from pug
if (document.getElementById("refresh")) {
  document.getElementById("refresh").addEventListener("click", function (e) {
    var name = document.getElementById("name");
    var min = document.getElementById("min");
    var delivery = document.getElementById("delivery");
    let mins = min.value;
    let names = name.value;
    let deliverys = delivery.value;
    //Error checking if field is blank
    if (
      mins == null ||
      mins == "" ||
      delivery == null ||
      delivery == "" ||
      name == null ||
      name == ""
    ) {
      alert("one or more field is blank");
    } else if (isNaN(mins) || isNaN(deliverys)) {
      // error checking if field is not a number
      alert("Please put a number in either the delivery fee or min order");
    } else {
      //else add to it
      info["min_order"] = mins;
      info["name"] = names;
      info["delivery_fee"] = deliverys;
      send();
      get();
    }
  });
}

//The init function has the purpose of rendering
function init() {
  if (!document.getElementById("refresh")) {
    document.getElementById("menucategories").innerHTML =
      getCategoryHTML(object);
    document.getElementById("menudish").innerHTML = getMenuHTML(object);
  }
}

//grab the category button and check if it exist
if (document.getElementById("cate")) {
  document.getElementById("cate").addEventListener("click", function (e) {
    let boolean = 0;
    var category = document.getElementById("se");
    var cate = document.getElementById("category");
    category_value = cate.value;
    object.menu[category_value] = {};
    init();
    //This for loop goes through all the categories to check if one exists
    for (let i = 0; i < category.length; i++) {
      if (category[i].value == category_value) {
        alert("YOU CAN NOT HAVE DUPLICATES");
        boolean = 1;
      }
    }
    //If there is no duplicates then create the category
    if (boolean == 0) {
      category.options[category.options.length] = new Option(category_value);
    }
    //reset to null
    cate.value = "";
  });
}

if (document.getElementById("item")) {
  document.getElementById("item").addEventListener("click", function (e) {
    var name = document.getElementById("itemName");
    var description = document.getElementById("itemDes");
    var price = document.getElementById("itemPrice");
    var selected = document.getElementById("se");
    // If there is an existign category slected add to the object.menu of the selected object
    if (selected[0] != undefined) {
      object.menu[selected.options[selected.selectedIndex].value][counter] = {
        name: name.value,
        description: description.value,
        price: price.value,
      };
    } else {
      alert("THERE IS NO CATEGORY SELECTED");
    }
    //reset to null and update counter
    name.value = "";
    description.value = "";
    price.value = "";
    counter++;
    //re-render
    init();
  });
}

if (document.getElementById("save")) {
  document.getElementById("save").addEventListener("click", function (e) {
    //if save button clicked confrim and send over to server
    alert("CHANGES MADE SUCESFULLY");
    sendObject();
  });
}

function send() {
  let req = new XMLHttpRequest();
  req.onreadystatechange = function () {
    if (this.readyState == 4 && this.status == 200) {
    }
  };
  //send post request to server
  req.open("POST", `/info`);
  req.setRequestHeader("Content-Type", "application/json");
  req.send(JSON.stringify(info));
}

function get() {
  //get request for id in order to redirect
  let req = new XMLHttpRequest();
  req.onreadystatechange = function () {
    if (this.readyState == 4 && this.status == 200) {
      id = JSON.parse(req.responseText);
      console.log(id);
      window.location.href = "http://localhost:3000/restaurants/" + id;
    }
  };
  req.open("GET", "http://localhost:3000/id");
  req.send();
}

//Using profs a2 basecode to render items
function getCategoryHTML(object) {
  let menu = object.menu;
  let result = "<b>Categories<b><br>";
  Object.keys(menu).forEach((key) => {
    result += `<a href="#${key}">${key}</a><br>`;
  });
  return result;
}

function getMenuHTML(object) {
  let menu = object.menu;
  console.log(menu);
  let result = "";
  //For each category in the menu
  Object.keys(menu).forEach((key) => {
    result += `<b>${key}</b><a name="${key}"></a><br>`;
    //For each menu item in the category
    Object.keys(menu[key]).forEach((id) => {
      item = menu[key][id];
      result += `${item.name} (\$${item.price}) <br>`;
      result += item.description + "<br><br>";
    });
  });
  return result;
}

//Post request to server
function sendObject() {
  let req = new XMLHttpRequest();
  req.onreadystatechange = function () {
    if (this.readyState == 4 && this.status == 200) {
    }
  };

  req.open("PUT", `/object`);
  req.setRequestHeader("Content-Type", "application/json");
  req.send(JSON.stringify(object));
}
