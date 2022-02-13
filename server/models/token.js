const mongoose = require('mongoose');

const { Schema } = mongoose;


const tokenSchema = new Schema ({
    userId: {
        type: Schema.Types.ObjectId, ref: 'user',
        required: true
    },
    refrehToken: {
        type: Schema.Types.String,
        required: true
    }
});

const model = mongoose.model('user', tokenSchema)
module.exports = model;
