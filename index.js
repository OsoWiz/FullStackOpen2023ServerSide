require("dotenv").config();
const express = require("express");
const Pnumber = require("./models/number");
const app = express();
const cors = require("cors");
var morgan = require("morgan");
const port = process.env.PORT || 3001;
app.use(cors());
app.use(express.json());
app.use(express.static("build"));

const morganPlus = morgan(function (tokens, req, res) {
  let data = [];
  if (req.method === "POST") {
    data = data.concat(JSON.stringify(req.body));
  }
  return [
    tokens.method(req, res),
    tokens.url(req, res),
    tokens.status(req, res),
    tokens.res(req, res, "content-length"),
    "-",
    tokens["response-time"](req, res),
    "ms",
    data,
  ].join(" ");
});

const errorHandler = (error, req, res, next) => {
  console.log(error.message);
  if (error.name === "CastError") {
    return res.status(400).send({ error: "malformatted id" });
  }
  next(error);
};

const unknownEndpoint = (req, res) => {
  res.status(404).send({ error: "unknown endpoint" });
};

app.use(morganPlus);

app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.get("/api/persons/", (req, res, next) => {
  Pnumber.find({})
    .then((result) => {
      res.json(result);
    })
    .catch((error) => {
      next(error);
    });
});

app.get("/info", (req, res, next) => {
  Pnumber.countDocuments({})
    .then((result) => {
      res.send(
        `<p>Phonebook has info for ${result} people</p><p>${new Date()}</p>`
      );
    })
    .catch((error) => {
      next(error);
    });
});

app.get("/api/persons/:id", (req, res, next) => {
  Pnumber.findById(req.params.id)
    .then((result) => {
      res.json(result);
    })
    .catch((error) => {
      next(error);
    });
});

// updation. Is that even a word?
app.put("/api/persons/:id", (req, res, next) => {
  const body = req.body;
  const pnumber = {
    name: body.name,
    number: body.number,
  };
  Pnumber.findByIdAndUpdate(req.params.id, pnumber, { new: true })
    .then((updatedPerson) => {
      res.json(updatedPerson);
    })
    .catch((error) => {
      next(error);
    });
});

app.delete("/api/persons/:id", (req, res, next) => {
  // get id
  Pnumber.findByIdAndRemove(req.params.id)
    .then((result) => {
      res.status(204).end();
    })
    .catch((error) => {
      next(error);
    });
});

app.post("/api/persons", (req, res, next) => {
  const body = req.body;
  // console.log(body);
  if (!body || !body.name || !body.number) {
    next(error);
  }

  const person = new Pnumber({
    name: body.name,
    number: body.number,
  });

  person.save().then((savedPerson) => {
    res.json(savedPerson);
  });
});

// unkown endpoint and errorhandler must be the last middleware
app.use(unknownEndpoint);
app.use(errorHandler);

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
