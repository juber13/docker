import jwt from 'jsonwebtoken';



function generateToken(user) {
  const payload = {
    id: user.id,
    username: user.username,
  };
  const secret = process.env.USERSECREAT;
    const options = {
    expiresIn: '1h',
  };
  return jwt.sign(payload, secret, options);
}


const authMiddleware = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];
    if (!token) {   
    return res.status(401).json({ message: 'No token provided' });
    }
    try {
    const secret = process.env.USERSECREAT;
    const decoded = jwt.verify(token, secret);
    req.user = decoded;
    next();
  } catch (err) {
    return res.status(401).json({ message: 'Invalid token' });
  }
};



const first = generateToken({ id: 1, username: 'testuser' }); 
const second = authMiddleware;

console.assert(first, second)

export { generateToken, authMiddleware };

