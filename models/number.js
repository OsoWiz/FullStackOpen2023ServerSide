const mongoose = require("mongoose");

const uri = process.env.MONGODB_URI;

mongoose.set("strictQuery", false);
mongoose
  .connect(uri)
  .then((result) => {
    console.log("connected to MongoDB");
  })
  .catch((error) => {
    console.log(`Something went wrong: ${error}`);
  });

const numberSchema = new mongoose.Schema({
  name: { type: String, minLength: 3, required: true },
  number: {
    type: String,
    validate: {
      validator: function (v) {
        return v.length >= 8 && /\d{2,3}-\d+/.test(v);
      },
    },
    required: [true, "Phone number required!"],
  },
});

numberSchema.set("toJSON", {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString();
    delete returnedObject._id;
    delete returnedObject.__v;
    console.log(returnedObject);
  },
});

module.exports = mongoose.model("Pnumber", numberSchema);
