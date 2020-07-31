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

app.get("/", (req, res) => {
  res.send("hello");
});

app.get("/new-person", csurfProtection, async (req, res) => {
  let haircolors = await models.HairColor.findAll();
  let hairColorData = [];
  for(let haircolor of haircolors) {
    let hairColorsData = {};
    hairColorsData["id"] = haircolor.dataValues.id
    hairColorsData["color"] = haircolor.dataValues.color;
    hairColorData.push(hairColorsData);
  }
  res.render("new-person", {hairColorData, csrfToken: req.csrfToken()});
});

app.post("/new-person", async (req, res) => {
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
