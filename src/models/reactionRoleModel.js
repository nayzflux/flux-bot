const mongoose = require(`mongoose`);
const CounterModel = require("./counterModel");

const reactionRoleSchema = new mongoose.Schema({
    _id: {
        type: Number,
        required: false
    },
    guildId: {
        type: String,
        required: true
    },
    channelId: {
        type: String,
        required: true
    },
    messageId: {
        type: String,
        required: true
    },
    roleId: {
        type: String,
        required: true
    },
    emoji: {
        type: String,
        required: true
    },
    createdAt: {
        type: Date,
        required: false,
        default: new Date()
    }
});

reactionRoleSchema.pre("save", async function (next) {
    let doc = this;
    const counter = await CounterModel.findByIdAndUpdate({ "_id": "reaction-role" }, { "$inc": { "seq": 1 } });
    if (counter) {
        doc._id = counter.seq;
    } else {
        await CounterModel.create({ _id: "reaction-role", seq: 1 });
        doc._id = 0;
    }
    next();
});

const ReactionRoleModel = mongoose.model(`ReactionRole`, reactionRoleSchema, `reaction-roles`);

module.exports = ReactionRoleModel;