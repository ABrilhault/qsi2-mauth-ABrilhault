const express = require('express');
const jwt = require('jwt-simple');
const { createGroup } = require('../controller/groups');
const logger = require('../logger');

const apiGroups = express.Router();


// As an authenticate user, I want to create a group so that I could be a group admin.
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
            profile: group,
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


module.exports = { apiGroups };