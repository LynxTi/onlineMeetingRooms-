const getKey = require('./getKey');
const jwt = require('jsonwebtoken');
const moment = require('moment');
const uniqid = require('uniqid');

const userModel = require('../models/user');
const tokenModel = require('../models/token');

const login = async (login, password) => {
    const doc = await userModel.findOne({name: login});
    // Проверка на наличия Юзера с таким логином
    if (!doc) {
        return {status: 'Unknow user'};
    }

    const chekPasword = doc.verificationPassword(password);
    
    // Проверка пароля
    if (!chekPasword) {
        return {status: 'invalid password'}
    }
    const payload = {login: doc.name, id: doc.id}

    const accesstoken = await createAccessToken(payload);
    const refreshToken = await createRefreshToken(accesstoken);
    
    return {status: 'logged in' , accesstoken, refreshToken}
}

const createAccessToken = async (payload) => {
    const now = moment();
    const privKey = await getKey.getPrivateKey();

    const exp = now.add(5, 'm');
    // payload.exp = exp;
    console.log('payload.exp: ', payload.exp);


    const token = await jwt.sign(payload, privKey, {algorithm: 'RS256'});

    return token;
}

const chekAndDecode = async (token) => {
    const pubKey = await getKey.getPublickKey();
    const rezalt = await jwt.verify(token, pubKey, {algorithm: ['RS256']});

    if (!rezalt) {
        return {status: 'invalid token'}
    }
      
    return {status: 'ok', payload: rezalt};
}

const createRefreshToken = async (accessToken) => {
    const refreshToken = uniqid();
    console.log('refreshToken: ' + refreshToken);
    await tokenModel.create({refreshToken, accessToken});

    return refreshToken;
}

const updateTokens = async (accessToken, refreshToken) => {
    const rezalt = await chekAndDecode(accessToken);

    if (rezalt.status !== 'ok'){
        console.log('status ne ok');
        return rezalt.status;
    }

    const {payload} = rezalt;
    delete(payload.exp);

    tokenModel.findOneAndDelete({refreshToken});

    const newAccessToken = await createAccessToken(payload);              
    const newRefreshToken = await createRefreshToken(newAccessToken);

    console.log( rezalt.status, payload,  newAccessToken,  newRefreshToken);
    
    return {status: rezalt.status, payload, accessToken: newAccessToken, refreshToken: newRefreshToken}
}

module.exports = {
    login,   
    updateTokens
};