import { generateJWTToken } from '../utils/jwt';
import { generateHash, validPassword} from '../utils/hash';
import models from '../models';
import {Op} from 'sequelize'

const { User } = models;

// create or signin a new user
export const authenticateUser = async (req, res) => {
    const {contact, password} = req.body;
    const [user, created] = await User.findOrCreate({
        where:{
            contact
        },
        defaults: {
            password: generateHash(password)
        },
        raw: true
    });

    if(!created && validPassword(password, user.password)){
        // Generate user token
        const token = generateJWTToken(user);

        return res.status(200).send({
            message: 'Succesfully logged in user',
            token
        });
    }

    // Generate user token
    const token = generateJWTToken(user);

    return res.status(201).send({
        message: 'User successfully registered',
        token
    });
}

export const deleteUser = async (req,res) => {
    const { id } = req.currentUser;
    const user = await User.findByPk(id)
    if(!user){
        return res.status(400).send({
            message: 'Record does not exist'
        });       
    }
    return res.status(200).send({
        message: 'Succesfully deleted user'
    });
}

export const updateUser = async (req, res) => {
    const { id } = req.currentUser;
    const {contact, password} = req.body;

    const params = {};

    const user = await User.findByPk(id);
    if(!user){
        return res.status(400).send({
            message: 'Record does not exist'
        });       
    }

    
    if(contact){
        const existingContact = await User.findOne({
            where:{
                contact,
                id: {
                    [Op.ne]: id,
                }
            }
        });

        if(existingContact){
            return res.status(400).send({
                message: 'User with that contact exists'
            });    
        }

        params.contact = contact
    }

    if(password){
        params.password = generateHash(password);
    }

    
    await User.update(params,{
        where: {
            id
        }
    })
    return res.status(200).send({
        message: 'Succesfully updated user'
    });
}