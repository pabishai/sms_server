import bcrypt from 'bcrypt';

export const generateHash = (password) => {
    return bcrypt.hashSync(password, bcrypt.genSaltSync(8));
};

export const validPassword = (password, hashedPassword) => {
    return bcrypt.compareSync(password, hashedPassword);
};