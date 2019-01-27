const omit = require('lodash.omit');
const { Users, Groups } = require('../model');
const logger = require('../logger');

const createGroup = ({title, description, metadatas}, id) =>
    Groups.create({
        title,
        description: description || '',
        metadatas: metadatas || '',
        owner_id: id
    }).then(group =>
        group
);


const addMember = ({email, groupId}, id) =>
    Groups.findOne({
        where: {
           id: groupId 
        }
    }).then(group => {
        logger.info(`idGroup : ${groupId}`);
        logger.info(`id : ${id}`);
        if(group.owner_id != id) {
            return reject(new Error('UNAUTHORIZED OPERATION : User is not the owner of the group'));
        }
        Users.findOne({
            where: {
              email
            }
          }).then(user => {
            logger.info(`member id : ${user.id}`);
            group.addUsers(user);
        //   }).then(group, user => resolve(`User ${user.id} added to group ${group.title}`))
    // });
    })});

    
const findAllGroups = () => {
    logger.info(`findAllGroups`);
    return Groups.findAll().then(groups => groups);
}


module.exports = {
    createGroup,
    addMember,
    findAllGroups
};