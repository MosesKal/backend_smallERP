const express = require("express");
const db = require("../models/");
var bcrypt = require("bcryptjs");

const route = express.Router();

route.post("/register", async (req, res, next) => {
  const { email, password, prenom, nom, telephone } = req.body;

  const exists = await db.User.findOne({ where: { email: `${email}` } });

  if (exists) {
    res.send("Exist");
    return;
  }

  bcrypt.genSalt(10, (err, salt) => {
    if (err) {
      console.error(err);
      res.send("Error");
      return;
    }
    bcrypt.hash(`${password}`, salt, (err, hash) => {
      if (err) {
        console.error(err);
        res.send("Error");
        return;
      }

      db.User.create({
        prenom: `${prenom}`,
        nom: `${nom}`,
        email: `${email}`,
        telephone: `${telephone}`,
        password: hash,
      })
        .then(() => {
          console.log("Admin user created successfully.");
          res.send("User created successfully");
        })
        .catch((err) => {
          console.error("Failed to create admin user:", err);
          res.send("Failed to create admin user");
        });
    });
  });
});

route.get("/users", async (req, res, next) => {
  try {
    const users = await db.User.findAll({});
    res.send(users);
  } catch (e) {
    res.status(500).send(e);
  }
});

route.get("/users/:id", async (req, res, next) => {
  const userId = req.params.id;

  const user = await db.User.findByPk(userId);

  if (user === null) {
    res.status(500);
  } else {
    res.send(user);
  }
});

route.patch("/users/:id", async (req, res, next) => {
  const userId = req.params.id;

  await db.User.update(req.body, {
    where: {
      id: userId,
    },
  });
  res.send("Updated!");
});

route.delete("/users/:id", async (req, res, next) => {
  const userId = req.params.id;

  await db.User.destroy({
    where: {
      id: userId,
    },
  });
  res.send("Deleted!");
});

module.exports = route;
