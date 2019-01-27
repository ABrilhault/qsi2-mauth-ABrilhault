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

module.exports = {
    createGroup
};