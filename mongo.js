// this is a test file for testing out mongoose and mongoDB

// to use this, run the following command:
// node mongo.js <password> <name> <number>
// this will add user to the database
// node mongo.js <password>
// this will print all users in the database

const mongoose = require("mongoose");

if (process.argv.length < 3) {
  console.log(
    "Please provide a password as an argument like this: node mongo.js <password>"
  );
  process.exit(1);
}

const password = process.argv[2];

const url = `mongodb+srv://testeri:${password}@testcluster.vbh9dqx.mongodb.net/numbers?retryWrites=true&w=majority`;

mongoose.set("strictQuery", false);
mongoose.connect(url);

const numberSchema = new mongoose.Schema({
  name: String,
  number: String,
});

const Number = mongoose.model("Number", numberSchema);

if (process.argv.length === 3) {
  Number.find({}).then((result) => {
    console.log("phonebook:");
    result.forEach((number) => {
      console.log(`${number.name} ${number.number}`);
    });
    mongoose.connection.close();
  });
} else {
  const name = process.argv[3];
  const number = process.argv[4];

  const NewNumber = new Number({
    name: name,
    number: number,
  });

  NewNumber.save()
    .then((result) => {
      console.log(`added ${name} number ${number} to phonebook`);
      mongoose.connection.close();
    })
    .catch((error) => {
      console.log(`Something went wrong: ${error}`);
    });
}
