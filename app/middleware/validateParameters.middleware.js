export default (req, res, next) => {
  const {baseUrl} = req
  const {phoneNumber, contact, password} = req.body
  if(phoneNumber && phoneNumber.length !== 10 || contact && contact.length !==10){
    return res.status(400).send({
      message: 'Phone number has to be 10 digits'
  });
  }

  if(baseUrl === '/api/v1/auth'){
    if(!password){
      return res.status(400).send({
        message: 'Password is required'
    });
  }
  }


  next();
};