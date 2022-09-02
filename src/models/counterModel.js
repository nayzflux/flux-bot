const mongoose = require(`mongoose`);

const counterSchema = new mongoose.Schema({
    _id: String,
    seq: Number,
});

const CounterModel = mongoose.model(`Counter`, counterSchema, `counters`);

module.exports = CounterModel;