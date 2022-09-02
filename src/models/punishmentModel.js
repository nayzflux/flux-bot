const mongoose = require(`mongoose`);
const CounterModel = require("./counterModel");

const punishmentSchema = new mongoose.Schema(
    {
        guildId: {
            type: String,
            required: true
        },
        threshold: {
            type: Number,
            required: true
        },
        action: {
            type: String,
            required: true
        },
        actionDuration: {
            type: Number,
            default: -1
        },
        createdAt: {
            type: Date,
            required: false,
            default: Date.now()
        }
    }
);

punishmentSchema.pre("save", async function (next) {
    let doc = this;
    const counter = await CounterModel.findByIdAndUpdate({ "_id": "punishment" }, { "$inc": { "seq": 1 } });
    doc._id = counter.seq;
    next();
});

const PunishmentModel = mongoose.model(`Punishment`, punishmentSchema, `punishments`);

module.exports = PunishmentModel;