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

app.use(morganPlus);

app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.get("/api/persons/", (req, res) => {
  Pnumber.find({}).then((result) => {
    res.json(result);
  });
});

// app.get("/info", (req, res) => {
//   res.send(
//     `<p> Phonebook has info for ${
//       numbers.length
//     } people </p><p>${new Date()}</p>`
//   );
// });

app.get("/api/persons/:id", (req, res) => {
  Pnumber.findById(req.params.id).then((result) => {
    res.json(result);
  });
});

// updation. Is that even a word?
app.put("/api/persons/:id", (req, res) => {
  // get id
  const id = Number(req.params.id);
  // find person
  const person = numbers.find((person) => person.id === id);
  // profit
  if (person) {
    person.number = req.body.number;
    res.json(person);
  } else {
    res.status(404).end();
  }
});

app.delete("/api/persons/:id", (req, res) => {
  // get id
  const id = Number(req.params.id);
  Pnumber.findByIdAndRemove(id)
    .then((result) => {
      res.status(204).end();
    })
    .catch((error) => {
      console.log(`Deletion failed: ${error}`);
      res.status(400).end();
    });
});

app.post("/api/persons", (req, res) => {
  const body = req.body;
  // console.log(body);
  if (!body || !body.name || !body.number) {
    return res.status(400).json({
      error: "Name or number missing",
    });
  }

  const person = new Pnumber({
    name: body.name,
    number: body.number,
  });

  person.save().then((savedPerson) => {
    res.json(savedPerson);
  });
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
