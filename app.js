/**
 * TODO: Create and configure your Express.js application in here.
 *       You must name the variable that contains your Express.js
 *       application "app" because that is what is exported at the
 *       bottom of the file.
 */

const express = require("express");
const app = express();

const models = require("./models");

const cookieParser = require("cookie-parser");
const cSurf = require("csurf");
app.use(cookieParser());
const csurfProtection = cSurf({cookie: true});
const decoded = express.urlencoded({extended:false});
app.use(decoded);



app.set("view engine", "pug");

app.get("/", async (req, res) => {
  let people = await models.People.findAll({
    include: models.HairColor
  })
  let personArray = [];
  for(let person of people) {
    let dude = {
      firstName: person.dataValues.firstName,
      lastName: person.dataValues.lastName,
      age: person.dataValues.age,
      biography: person.dataValues.biography,
      hairColor: person.dataValues.HairColor.dataValues.color
    }

    personArray.push(dude);
  }
  res.render("index", {personArray})
});

app.get("/new-person", csurfProtection, async (req, res) => {
  let hairColors = await models.HairColor.findAll();
  // for(let haircolor of haircolors) {
  //   let hairColorsData = {};
  //   hairColorsData["id"] = haircolor.dataValues.id
  //   hairColorsData["color"] = haircolor.dataValues.color;
  //   hairColorData.push(hairColorsData);
  // }
  res.render("new-person", {hairColors, csrfToken: req.csrfToken()});
});

app.post("/new-person", csurfProtection, async (req, res, next) => {
  try{
    await models.People.create({
      firstName: req.body.firstName,
      lastName: req.body.lastName,
      age: req.body.age,
      biography: req.body.biography,
      hairColorId: req.body.hairColorId
    })
    res.redirect("/")
  } catch(err) {
    if(!req.body._csrf) {
      res.status(403).end();
    }
    if(!req.body.firstName || !req.body.lastName || !req.body.hairColorId) {
      res.status(500).end()
    }
    // next(err);
  }

})

const port = 8081;

app.listen(port, ()=> console.log(`listening on port ${port}`));



/* Do not change this export. The tests depend on it. */
try {
  exports.app = app;
} catch(e) {
  exports.app = null;
}
