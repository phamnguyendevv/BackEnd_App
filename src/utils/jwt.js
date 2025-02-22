require('dotenv').config()
const jwt = require('jsonwebtoken');
// privatekey tao co dinh 



const generateTokenToken = async (payload, privateKey) => {
    try {
        const Token = await jwt.sign(payload, privateKey, {
            expiresIn: '30s',
        });
        return Token
    } catch (error) {
        throw error;
    }
}


const refreshToken = async (payload, privateKey) => {
    try {
        const Token = await jwt.sign(payload, privateKey, {
            expiresIn: '365 days',
        });
        return Token
    } catch (error) {
        throw error;
    }
}


const createTokenPair = async (payload, privateKey) => {
    const { user_id, verify, exp } = payload
    if (exp) {
        payload = { user_id, verify, exp }
        try {
            const accessToken = await jwt.sign({ user_id, verify }, privateKey, {
                algorithm: 'HS256',
                expiresIn: '365 days',
            });
            const refreshToken = await jwt.sign(payload, privateKey, {
                algorithm: 'HS256',

            });
            return { accessToken, refreshToken };
        } catch (error) {
            console.log('error create token pair', error)
            throw error;
        }
    } else {
        payload = { user_id, verify }
        try {
            const accessToken = await jwt.sign(payload, privateKey, {
                expiresIn: '3 days',
            });
            const refreshToken = await jwt.sign(payload, privateKey, {
                expiresIn: '365 days',
            });
            return { accessToken, refreshToken };
        } catch (error) {
            throw error;
        }
    }

}



const verifyToken = async (token, publicKey) => {
    return new Promise((resolve, reject) => {
        jwt.verify(token, publicKey, (err, decoded) => {
            if (err) {
                reject(err);
            } else {
                resolve(decoded);
            }
        });
    });
};

module.exports = {
    createTokenPair,
    verifyToken,
    generateTokenToken,
    refreshToken

}
