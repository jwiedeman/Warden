const config = require('config.json');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const crypto = require("crypto");
const sendEmail = require('_helpers/send-email');
const db = require('_helpers/db');
const Role = require('_helpers/role');

module.exports = {
    
   
    
    createItem,
    verifyEmail,
    forgotPassword,
    validateResetToken,
    resetPassword,
    getAll,
    getById,
    create,
    update,
    delete: _delete
};



    

// CRUD
async function createItem(params, origin) {
    // validate
    console.log('createItem')
    // validate
    if (await db.Warden.findOne({ name: params.name })) {
        throw 'Item "' + params.name + '" is already added to the DB';
    }
    const account = new db.Warden(params);

    // save account
    await account.save();

    return basicDetails(account);
}



async function update(id, params) {
    const account = await getDbItemById(id);
   
    
    // copy params to account and save
    Object.assign(account, params);
    
    await account.save();

    return basicDetails(account);
}


async function _delete(id) {
    const account = await getDbItemById(id);
    await account.remove();
}





async function verifyEmail({ token }) {
    const account = await db.Warden.findOne({ verificationToken: token });

    if (!account) throw 'Verification failed';

    account.verified = Date.now();
    account.verificationToken = undefined;
    await account.save();
}

async function forgotPassword({ email }, origin) {
    const account = await db.Warden.findOne({ email });

    // always return ok response to prevent email enumeration
    if (!account) return;

    // create reset token that expires after 24 hours
    account.resetToken = {
        token: randomTokenString(),
        expires: new Date(Date.now() + 24*60*60*1000)
    };
    await account.save();

    // send email
    await sendPasswordResetEmail(account, origin);
}

async function validateResetToken({ token }) {
    const account = await db.Warden.findOne({
        'resetToken.token': token,
        'resetToken.expires': { $gt: Date.now() }
    });

    if (!account) throw 'Invalid token';
}

async function resetPassword({ token, password }) {
    const account = await db.Warden.findOne({
        'resetToken.token': token,
        'resetToken.expires': { $gt: Date.now() }
    });

    if (!account) throw 'Invalid token';

    // update password and remove reset token
    account.passwordHash = hash(password);
    account.passwordReset = Date.now();
    account.resetToken = undefined;
    await account.save();
}

async function getAll() {
    const accounts = await db.Warden.find();
    return accounts.map(x => basicDetails(x));
}

async function getById(id) {
    const account = await getDbItemById(id);
    return basicDetails(account);
}

async function create(params) {
    // validate
    if (await db.Warden.findOne({ email: params.email })) {
        throw 'Email "' + params.email + '" is already registered';
    }

    const account = new db.Warden(params);
    account.verified = Date.now();

    // hash password
    account.passwordHash = hash(params.password);

    // save account
    await account.save();

    return basicDetails(account);
}


async function _delete(id) {
    const account = await getDbItemById(id);
    await account.remove();
}

// helper functions

async function getDbItemById(id) {
    if (!db.isValidId(id)) throw 'Warden not found';
    const account = await db.Warden.findById(id);
    if (!account) throw 'Warden not found';
    return account;
}



async function getRefreshToken(token) {
    const refreshToken = await db.RefreshToken.findOne({ token }).populate('account');
    if (!refreshToken || !refreshToken.isActive) throw 'Invalid token';
    return refreshToken;
}

function hash(password) {
    return bcrypt.hashSync(password, 10);
}

function generateJwtToken(account) {
    // create a jwt token containing the account id that expires in 15 minutes
    return jwt.sign({ sub: account.id, id: account.id }, config.secret, { expiresIn: '15m' });
}

function generateRefreshToken(account, ipAddress) {
    // create a refresh token that expires in 7 days
    return new db.RefreshToken({
        account: account.id,
        token: randomTokenString(),
        expires: new Date(Date.now() + 7*24*60*60*1000),
        createdByIp: ipAddress
    });
}

function randomTokenString() {
    return crypto.randomBytes(40).toString('hex');
}

function basicDetails(account) {
    const { id, title, name, lastName, email, role, created, updated, isVerified } = account;
    return { id, title, name, lastName, email, role, created, updated, isVerified };
}

