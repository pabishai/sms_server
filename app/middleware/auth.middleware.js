import {decodeJWTToken} from '../utils/jwt';

export default (req, res, next) => {
  const token = req.headers.authorization;
  if (token) {
		const tokenArray = token.split(' ');
		const decodedToken = decodeJWTToken(tokenArray[1], res);

    if (!decodedToken)
    return res.status(401)
        .send({message: 'Sorry, token is invalid'});
		
		if(Date.now() > decodedToken.iat){
			return res.status(401)
			.send({message: 'Expired token'});
		}

    const {payload} = decodedToken;
		req.currentUser = payload;
    next();
    } else {
    return res.status(401)
        .send({message: 'Please provide an auth token'});
    }
};