const mongoose = require(`mongoose`);
const CounterModel = require("./counterModel");

const configSchema = new mongoose.Schema({
    _id: {
        type: Number,
        required: false
    },
    guildId: {
        type: String,
        required: true
    },
    logs: {
        channelId: {
            type: String,
            required: false,
            default: null
        },
        enabled: {
            type: Boolean,
            required: false,
            default: false
        }
    },
    autorole: {
        roleId: {
            type: String,
            required: false,
            default: null
        },
        enabled: {
            type: Boolean,
            required: false,
            default: false
        }
    },
    captcha: {
        channelId: {
            type: String,
            required: false,
            default: null
        },
        roleId: {
            type: String,
            required: false,
            default: null
        },
        enabled: {
            type: Boolean,
            required: false,
            default: false
        }
    },
    messages: {
        join: {
            channelId: {
                type: String,
                required: false,
                default: null
            },
            content: {
                type: String,
                required: false,
                default: null
            },
            enabled: {
                type: Boolean,
                required: false,
                default: false
            }
        },
        leave: {
            channelId: {
                type: String,
                required: false,
                default: null
            },
            content: {
                type: String,
                required: false,
                default: null
            },
            enabled: {
                type: Boolean,
                required: false,
                default: false
            }
        },
    },
    privateRoom: {
        channelId: {
            type: String,
            required: false,
            default: null
        },
        enabled: {
            type: Boolean,
            required: false,
            default: false
        }
    },
    automod: {
        text: {
            policy: {
                type: String,
                required: false,
                default: `NORMAL`
            },
            enabled: {
                type: Boolean,
                required: false,
                default: false
            }
        },
        image: {
            policy: {
                type: String,
                required: false,
                default: `NORMAL`
            },
            enabled: {
                type: Boolean,
                required: false,
                default: false
            }
        },
        spam: {
            enabled: {
                type: Boolean,
                required: false,
                default: false
            }
        },
        flood: {
            enabled: {
                type: Boolean,
                required: false,
                default: false
            }
        },
        phising: {
            enabled: {
                type: Boolean,
                required: false,
                default: false
            }
        },
    },
    createdAt: {
        type: Date,
        required: false,
        default: new Date()
    }
});

configSchema.pre("save", async function (next) {
    let doc = this;
    const counter = await CounterModel.findByIdAndUpdate({ "_id": "config" }, { "$inc": { "seq": 1 } });
    doc._id = counter.seq;
    next();
});

const ConfigModel = mongoose.model(`Config`, configSchema, `configurations`);

module.exports = ConfigModel;