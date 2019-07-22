import models from '../models';

const { Contact } = models;

export const createContact = async (req, res, next) => {
    const {phoneNumber, name}  = req.body;
    const { id } = req.currentUser

    const [contact, created] = await dbFindOrCreateContact( {
        phoneNumber,
        userId: id
    },{
        name: name ? name : null
    });

    if(!created && contact) {
        res.status(400).send({
            message: `${phoneNumber} already exists in your contacts`,
        });
    }
    return res.status(201).send({
        message: 'Contact successfully created'
    })

}

export const editContact = async (req, res, next) => {
    const {number} = req.params
    const {phoneNumber, name} = req.body;
    const {id} = req.currentUser;
    
    const params = {phoneNumber: number, userId: id};

    const updateParams = {}

    // Find if number you want to update exists in your contacts
    const contact = await dbFindContacts(params);

    if(!number) {
        return res.status(400).send({
            message: 'Please input the number to edit'
        });  
    }

    if(!contact.length){
        return res.status(404).send({
            message: `${number} does not exist in your contacts`
        });  
    }

    if(phoneNumber && phoneNumber !== number){
        // Find if the new number you want to change it to exists
        const [contact] = await dbFindContacts({phoneNumber, userId:id});
        if(contact){
            return res.status(400).send({
                message: `${phoneNumber} already exists in your contacts`
            });  
        }
        updateParams.phoneNumber = phoneNumber
    }

    if(name){
        updateParams.name = name;
    }

    const updatedRows = await dbUpdateContact(updateParams, params)
    
    return res.status(200).send({
        message: `${updatedRows} contact(s) were successfully updated`
    });
}

export const findContacts = async (req, res, next) => {
    const {number} = req.params;
    const {phoneNumber, name} = req.query

    const filterNumber = number ? number : phoneNumber
    let params = {
        userId: req.currentUser.id
    };

    if(name){
        params.name = name;
    }

    if(filterNumber) {
       params.phoneNumber = filterNumber;
    }

    const contacts = await dbFindContacts(params);

    if(!contacts.length){
        if(!name && !filterNumber){
            return res.status(404).send({
                message: 'You have no contacts'
            }); 
        } 
    }
    return res.status(200).send({
        message: `${contacts.length} contact(s) retrieved`,
        contacts
    });
}

export const deleteContact = async (req, res, next) => {
    const {id} = req.params;
    const {contact} = req.currentUser;

    const [contactToDelete] = await dbFindContacts({id})

    if(!contactToDelete){
        return res.status(404).send({
            message: 'Contact does not exist'
        });  
    }

    if(contactToDelete.phoneNumber == contact){
        return res.status(400).send({
            message: 'Cannot delete your own contact'
        });
    }

    await Contact.destroy({
        where: {id: id}
    })

    return res.status(200).send({
        message: 'successfully deleted',
        contact: contactToDelete
    }); 
}

// sequelize function to find contact
export const dbFindContacts = async params => {
    return await Contact.findAll({
        where: {...params},
        raw: true
    });
}

// sequelize function to update contact
export const dbUpdateContact = async (updateParams, findParams) => {
    return await Contact.update(updateParams, {
        where: findParams
    });
}


// sequelize function to find or create contacts
export const dbFindOrCreateContact = async (queryParams, defaultParams) => {
    return await Contact.findOrCreate({
        where: queryParams,
        defaults: defaultParams,
        raw: true
    })
}

