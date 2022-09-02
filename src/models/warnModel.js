const mongoose = require(`mongoose`);
const CounterModel = require("./counterModel");

const warnSchema = new mongoose.Schema({
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
    moderatorId: {
        type: String,
        required: true
    },
    reason: {
        type: String,
        required: true
    },
    createdAt: {
        type: Date,
        required: false,
        default: new Date()
    }
});

warnSchema.pre("save", async function (next) {
    let doc = this;
    const counter = await CounterModel.findByIdAndUpdate({ "_id": "sanction" }, { "$inc": { "seq": 1 } });
    doc._id = counter.seq;
    next();
});

const WarnModel = mongoose.model(`Warn`, warnSchema, `warnings`);

module.exports = WarnModel;