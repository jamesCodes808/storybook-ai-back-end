const jwt = require('jsonwebtoken');
const jwksClient = require('jwks-rsa');

function verifyUser(request, response, next) {

    function valid(err, user) {
        request.user = user;
        next();
    }

    try {
        const token = request.headers.authorization.split(' ')[1];
        jwt.verify(token, getKey, {}, valid);
    } catch (error) {
        console.error(error);
        next('Not Authorized');
    }
}

const client = jwksClient({
    jwksUri: process.env.JWKS_URI,
});

function getKey(header, callback) {
    client.getSigningKey(header.kid, function (err, key) {
        const signingKey = key.publicKey || key.rsaPublicKey;
        callback(null, signingKey);
    });
}

module.exports = verifyUser;
