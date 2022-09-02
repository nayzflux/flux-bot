const mongoose = require(`mongoose`);
const CounterModel = require("./counterModel");

const levelSchema = new mongoose.Schema({
    _id: {
        type: Number,
        required: false
    },
    guildId: {
        type: String,
        required: true
    },
    userId: {
        type: String,
        required: true
    },
    level: {
        type: Number,
        required: false,
        default: 0
    },
    xp: {
        type: Number,
        required: false,
        default: 0
    },
    createdAt: {
        type: Date,
        required: false,
        default: new Date()
    }
});

levelSchema.pre("save", async function (next) {
    let doc = this;
    const counter = await CounterModel.findByIdAndUpdate({ "_id": "level" }, { "$inc": { "seq": 1 } });
    doc._id = counter.seq;
    next();
});

const LevelModel = mongoose.model(`Level`, levelSchema, `levels`);

module.exports = LevelModel;