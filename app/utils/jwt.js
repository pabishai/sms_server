import jwt from 'jsonwebtoken';

export const generateJWTToken = (user, res) => {
  try {
    const payload = {
      id: user.id,
      contact: user.contact
    };
    console.log(payload)
    const token = jwt.sign(payload, process.env.JWT_SECRET_KEY, {
      expiresIn: '7h',
    });
    console.log(token)
    return token
  } catch (error) {
    return res.status(500).send({
      message: 'Oops!. Something went wrong'
    })
  }
};

export const decodeJWTToken = (token, res) => {
  try {
    return jwt.decode(token, { complete: true });
  } catch (error) {
    return res.status(401).send({message: 'Invalid token'});
  }
};