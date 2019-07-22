import models from '../models';
import {dbFindOrCreateContact} from './contacts.controller';
import {Op} from 'sequelize';

const { sms } = models;

export const createSms = async (req, res) => {
    const {to, message } = req.body;
    const {contact, id} = req.currentUser;

    // Get sender contact id
    const [senderContact, smsCreated] = await getContactId(contact, id);

    // create contact if it doent exist
    const [toContact, created] = await getContactId(to,id);

    if(senderContact.id === toContact.id) {
        return res.status(201).send({
            message: 'You cannot send a meesage to yourself',
            sms
        });
    }

    const sms = await dbCreateSms({
        sender: senderContact.id,
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
    const {id, sent, received, unread} = req.params

    const {originalUrl} = req

    const {currentUser} = req;

    // Get sender contact id
    const [myContact, smsCreated] = await getContactId(currentUser.contact, currentUser.id);

    let params = {
        [Op.or]: {
            receiver: myContact.id,
            sender: myContact.id
        }
    };


    if(sent){
        params = {
            sender: myContact.id,  
        }
    }

    if(received){
        params = {
            receiver: myContact.id,  
        }
    }

    if(unread){
        params = {
            receiver: myContact.id,
            status: 'sent'
        }
    }


    if(id){
        params = {id};
    }


    const sms = await dbFindSms(params)

    return res.status(200).send({
        message: 'Retrieved your messages',
        sms
    });
}

export const readSMS = async (req, res) => {
    const {id} = req.params;
    const {currentUser} = req;
    const params = {
        receiver: currentUser.id
    };
    if(id){
        params.id = id;
    }

    await dbUpdateSms({status: 'read'}, params)

    return res.status(200).send({
        message: 'Retrieved your messages'
    });
}

export const sendSMS = async (req, res) => {
    const {id} = req.params;
    const {currentUser} = req;
    
    const params = {
        receiver: currentUser.id
    };

    if(id){
        params.id = id;
    }

    await dbUpdateSms({status: 'sent'}, {id});

    return res.status(200).send({
        message: 'Retrieved your messages'
    });
}

export const unreadSMS = async (req, res) => {
    const {id} = req.currentUser;

    const unreadSMS = await dbFindSms({
        receiver: id,
        status: 'sent'
    })

    return res.status(200).send({
        message: 'Unread messages',
        unreadSMS
    })

}

// Get id of contact to send to
const getContactId = async (phoneNumber, userId) => {
    console.log(phoneNumber);
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