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


const addMember = ({ email, groupId }, id) =>
  Groups.findOne({
    where: {
      id: groupId
    }
  })
    .then(
      group =>
        new Promise((resolve, reject) => {
          logger.debug(`idGroup : ${groupId}`);
          logger.debug(`id : ${id}`);
          if (group.owner_id != id) {
            return reject(
              new Error(
                'UNAUTHORIZED OPERATION : User is not the owner of the group'
              )
            );
          }
          return resolve(group);
        })
    )
    .then(group =>

    // Avoid to create nested then ... otherwise you replace a callback hell by a promise hell

      Promise.all(
        Users.findOne({
          where: {
            email
          }
        }),
        group
      )
    )
    .then((user, group) => {
      logger.debug(`member id : ${user.id}`);
      return Promise.all(user, group.addUsers(user));
    })
    .then((user, group) => [
      user.get({ plain: true }),
      group.get({ plain: true })
    ]);

    
const findAllGroups = () => {
    logger.debug(`findAllGroups`);
    // return Groups.findAll().then(groups => groups);
    return Groups.findAll().then(groups => groups.map( group => group.get({plain : true})));
}


module.exports = {
    createGroup,
    addMember,
    findAllGroups
};