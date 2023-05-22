const express = require("express");
const app = express();
const port = 3001;
app.use(express.json());

app.get("/", (req, res) => {
  res.send("Hello World!");
});

let numbers = [
  {
    id: 1,
    name: "Arto Hellas",
    number: "040-123456",
  },
  {
    id: 2,
    name: "Ada Lovelace",
    number: "39-44-5323523",
  },
  {
    id: 3,
    name: "Dan Abramov",
    number: "12-43-234345",
  },
  {
    id: 4,
    name: "Mary Poppendieck",
    number: "39-23-6423122",
  },
];

app.get("/api/persons/", (req, res) => {
  res.json(numbers);
});

app.get("/info", (req, res) => {
  res.send(
    `<p> Phonebook has info for ${
      numbers.length
    } people </p><p>${new Date()}</p>`
  );
});

app.get("/api/persons/:id", (req, res) => {
  // get id
  const id = Number(req.params.id);
  // find person
  const person = numbers.find((person) => person.id === id);
  // profit
  if (person) {
    res.json(person);
  } else {
    res.status(404).end();
  }
});

app.delete("/api/persons/:id", (req, res) => {
  // get id
  const id = Number(req.params.id);
  // find person
  const person = numbers.find((person) => person.id === id);
  // inverse profit
  if (person) {
    numbers.splice(numbers.indexOf(person), 1);
    res.status(204).end();
  }
});

app.post("/api/persons", (req, res) => {
  const body = req.body;
  console.log(body);
  if (!body || !body.name || !body.number) {
    return res.status(400).json({
      error: "Name or number missing",
    });
  }
  if (numbers.find((person) => person.name === body.name)) {
    return res.status(400).json({
      error: "Name must be unique to a person",
    });
  }

  const person = {
    id: Math.floor(Math.random() * 1000000),
    name: body.name,
    number: body.number,
  };
  numbers = numbers.concat(person);
  res.json(person);
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
