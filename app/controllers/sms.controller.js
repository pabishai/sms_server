import models from '../models';
import {dbFindOrCreateContact} from './contacts.controller'

const { sms } = models;

export const createSms = async (req, res) => {
    const {to, message } = req.body;
    const {id} = req.currentUser;

    // create contact if it doent exist
    const [toContact, created] = await getContactId(to,id);

    const sms = await dbCreateSms({
        sender: id,
        receiver: toContact.id,
        message: message,
        status: 'draft'
    });
    return res.status(201).send({
        message: 'Successfully created message',
        sms
    });
}

export const updateSms = async (req, res) => {
    const {id} = req.params;
    const {message, to} = req.body;
    const params = {}

    const [sms] = await dbFindSms({id});

    if(!sms) {
        return res.status(404).send({
            message: 'SMS may have beeen deleted',
            sms
        });
    }

    if(to) {
        const [toContact, created] = await getContactId(to,req.currentUser.id);
        params.receiver = toContact.id;
    }

    if(message) {
        params.message = message;
    }

    await dbUpdateSms(params, {
        id
    });

    return res.status(200).send({
        message: 'SMS successfully updated'
    }); 
}

export const deleteSms = async (req, res) => {
    const {id} = req.params;

    const [sms] = await dbFindSms({id});

    if(!sms){
        return res.status(404).send({
            message: 'SMS not found',
            sms
        });
    }

    await sms.destroy({
        where:{
            id
        }
    })

    return res.status(404).send({
        message: 'SMS deleted successfully',
        sms
    });
}

export const findSms = async (req, res) => {
    const {sender, receiver} = req.query;
    const {id} = req.params
    const params = {}

    if(sender){
        params.sender = sender;
    }

    if(receiver){
        params.receiver = receiver
    }

    if(id){
        params.id = id
    }


    const sms = await dbFindSms(params)

    return res.status(200).send({
        message: 'Retrieved your messages',
        sms
    });
}

// Get id of contact to send to
const getContactId = async (phoneNumber, userId) => {
    return await dbFindOrCreateContact({
        phoneNumber,
        userId
    }, {});
}

const dbCreateSms = async (params) => {
    return await sms.create(params)
}

const dbUpdateSms = async (params, queryParams) => {
    return await sms.update(params, {
        where: queryParams
    })
}

// sequelize function to find sms messages
export const dbFindSms = async params => {
    return await sms.findAll({
        where: {...params},
        raw: true
    });
}