const mongoose = require(`mongoose`);
const CounterModel = require("./counterModel");

const rewardSchema = new mongoose.Schema(
    {
        guildId: {
            type: String,
            required: true
        },
        level: {
            type: Number,
            required: true
        },
        roleId: {
            type: String,
            required: true
        },
        createdAt: {
            type: Date,
            required: false,
            default: new Date()
        }
    }
);

rewardSchema.pre("save", async function (next) {
    let doc = this;
    const counter = await CounterModel.findByIdAndUpdate({ "_id": "reward" }, { "$inc": { "seq": 1 } });
    doc._id = counter.seq;
    next();
});

const RewardModel = mongoose.model(`Reward`, rewardSchema, `rewards`);

module.exports = RewardModel;