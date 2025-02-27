import jwt from 'jsonwebtoken'

const generateToken = (userId, res) => {
    // create token and set expiry
    const token = jwt.sign({userId}, process.env.JWT_SECRET, {
        expiresIn: "7d"
    });
    
    // send cookies
    res.cookie("jwt", token, {
        maxAge: 7*24*60*60*1000, // in ms
        httpOnly: true, // no XSS attacks, i.e. cross-site
        sameSite: "strict", // CSRF prenevts cross-site request forgery attacks
        secure: process.env.NODE_ENV !== "development" // if dev then http, if pro then https 
    });

    return token;
};

export default generateToken