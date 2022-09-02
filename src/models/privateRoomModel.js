const mongoose = require(`mongoose`);
const CounterModel = require("./counterModel");

const privateRoomSchema = new mongoose.Schema(
    {
        guildId: {
            type: String,
            required: true
        },
        channelId: {
            type: String,
            required: true
        }
    }
);

privateRoomSchema.pre("save", async function (next) {
    let doc = this;
    const counter = await CounterModel.findByIdAndUpdate({ "_id": "private-room" }, { "$inc": { "seq": 1 } });
    doc._id = counter.seq;
    next();
});

const PrivateRoomModel = mongoose.model(`PrivateRoom`, privateRoomSchema, `private-rooms`);

module.exports = PrivateRoomModel;