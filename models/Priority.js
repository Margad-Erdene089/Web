const mongoose = require("mongoose");
const { Schema, model } = mongoose;

const prioritySchema = new Schema({
  name: { type: String, required: true },
  level: { type: Number, required: true },
});

const Priority = model("Priority", prioritySchema);

module.exports = Priority;
