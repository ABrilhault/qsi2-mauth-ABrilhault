const express = require('express');
const jwt = require('jwt-simple');
const { createGroup, addMember, findAllGroups } = require('../controller/groups');
const logger = require('../logger');

const apiGroups = express.Router();


// 3. As an authenticate user, I want to create a group so that I could be a group admin.
apiGroups.post('/', (req, res) =>
  !req.body.title
    ? res.status(400).send({
        success: false,
        message: 'Group title is required'
      })
    : createGroup(req.body, req.user.id)
        .then(group => {
            logger.info(`api group.id: ${group.id}`)
            const tokeng = jwt.encode({ id: group.id }, process.env.JWT_SECRET);
            return res.status(200).send({
            success: true,
            token: `JWT ${tokeng}`,
            groups: group,
            message: 'group created'
            });
        })
        .catch(err => {
          logger.error(`💥 Failed to create group : ${err.stack}`);
          return res.status(500).send({
            success: false,
            message: `${err.name} : ${err.message}`
          });
        })
);


// 4. As a group admin, I want to add or delete user so that I could make my group grow.
apiGroups.put('/members', (req, res) =>
  !req.body.email && !req.body.groupId
    ? res.status(400).send({
        success: false,
        message: 'Member email and group id are required'
      })
    : addMember(req.body, req.user.id)
        .then(() => {
            res.status(200).send({
            success: true,
            message: 'Member added to group'
            });
        })
        .catch(err => {
          logger.error(`💥 Failed to add member to group : ${err.stack}`);
          return res.status(500).send({
            success: false,
            message: `${err.name} : ${err.message}`
          });
        })
);


// 5. As a group member, I want to get a list of all 
// so that I could list most recent posts
apiGroups.get('/', (req, res) =>
    findAllGroups()
    .then(groups => {
        logger.info(`groups length : ${groups.length}`)
        return res.status(200).send({
            success: true,
            groups,
            message: 'List of all groups'});
        })
    .catch(err => {
        logger.error(`💥 Failed to retrieve all groups : ${err.stack}`);
        return res.status(500).send({
          success: false,
          message: `${err.name} : ${err.message}`
        });
      })
);


module.exports = { apiGroups };