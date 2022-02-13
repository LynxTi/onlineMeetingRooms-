const mongoose = require('mongoose');
const crupto = require("crypto");

const { Schema } = mongoose;


const userSchema = new Schema ({
    name: {
        type: Schema.Types.String,
        required: true,
        minlength: 3
    },
    role: [{
        type: Schema.Types.String
    }],
    hashPassword: {
        type: Schema.Types.String
    }
});

const createHashPass = (password) => {
    const data = new TextEncoder().encode(password)
    const hash = crupto.createHash('sha256').update(data).digest('hex');

    return hash;
}

userSchema.virtual('password').set(function(val) {
    this.hashPassword = createHashPass(val);
});

userSchema.methods.verificationPassword = function(password) {
    const hashPass = createHashPass(password);
    const chek = hashPass === this.hashPassword;

    return chek;
}


const model = mongoose.model('user', userSchema)
module.exports = model;
