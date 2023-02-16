const express = require('express');
const db = require('./db');
const checkMillionDollarIdea = require('./checkMillionDollarIdea');

const apiRouter = express.Router();

apiRouter.get('/:entityType/:entityId', function(req, res, next) {
    const entityType = req.params.entityType;
    const entityId = req.params.entityId;
    const entityFromDb = db.getFromDatabaseById(entityType, entityId);

    if(!entityFromDb) {
        res.status(404).send(`${entityType} not found`);
    } else {
        res.send(entityFromDb);
    }
});

apiRouter.get('/minions/:entityId/work', function(req, res, next) {
    const entityId = req.params.entityId;
    if(isNaN(parseInt(entityId))){
       return res.status(404).send('Non-numeric minion id'); 
    }

    if(!db.getFromDatabaseById('minions', entityId)){
       return res.status(404).send('Minion not found'); 
    }
    
    const entities = db.getAllFromDatabase('work');
    const workForMinion = entities.filter(entity => entity.minionId == entityId);

    res.send(workForMinion);
});

apiRouter.get('/:entityType', function(req, res, next) {
    const entityType = req.params.entityType;
    const entities = db.getAllFromDatabase(entityType);
    res.send(entities);
})

apiRouter.put('/minions/:entityId/work/:workId', function (req, res, next) {
    const entityId = req.params.entityId;
    const workId = req.params.workId;
    const entity = req.body;

    const existingWork = db.getFromDatabaseById('work', workId);
    if(!existingWork) {
        return res.status(404).send('Work not found!');
    } 

    if(existingWork.minionId != entityId) {
        return res.status(400).send('Attempt to update another minions work!');
    } 

    const updatedWork = {
        ...existingWork,
        ...entity,
    };

    const updatedEntity = db.updateInstanceInDatabase('work', updatedWork);
    if(!updatedEntity) {
        res.status(404).send(`work not found`);
    } else {
        res.send(updatedEntity);
    }
  });

apiRouter.put('/:entityType/:entityId', function (req, res, next) {
    const entityType = req.params.entityType;
    const entityId = req.params.entityId;
    const entity = req.body;
    const updatedEntity = db.updateInstanceInDatabase(entityType, entity);
    if(!updatedEntity) {
        res.status(404).send(`${entityType} not found`);
    } else {
        res.send(updatedEntity);
    }
  });

apiRouter.post('/ideas', function (req, res, next) {
    checkMillionDollarIdea(req, res, next);
});

apiRouter.post('/minions/:minionId/work', function (req, res, next) {
    const minionId = req.params.minionId;
    const postedWork = req.body;

    const updatedEntity = db.addToDatabase('work', postedWork);
    if(!updatedEntity) {
        res.status(400).send(`work not added`);
    } else {
        res.status(201).send(updatedEntity);
    }
  });

apiRouter.post('/:entityType', function (req, res, next) {
    const entityType = req.params.entityType;
    const entity = entityType === 'meetings' ? db.createMeeting() : req.body;

    const updatedEntity = db.addToDatabase(entityType, entity);
    if(!updatedEntity) {
        res.status(400).send(`${entityType} not added`);
    } else {
        res.status(201).send(updatedEntity);
    }
  });

apiRouter.delete('/minions/:minionId/work/:entityId', function(req, res, next) {
    const minionId = req.params.minionId;
    const entityId = req.params.entityId;
    
    if(!db.deleteFromDatabasebyId('work', entityId)) {
        res.status(404).send(`work not found`);
    } else {
        res.status(204).send(`work deleted`);
    }
});

apiRouter.delete('/:entityType/:entityId', function(req, res, next) {
    const entityType = req.params.entityType;
    const entityId = req.params.entityId;

    if(!db.deleteFromDatabasebyId(entityType, entityId)) {
        res.status(404).send(`${entityType} not found`);
    } else {
        res.status(204).send(`${entityType} deleted`);
    }
});

apiRouter.delete('/:entityType', function(req, res, next) {
    const entityType = req.params.entityType;

    if(!db.deleteAllFromDatabase(entityType)) {
        res.status(400).send(`All ${entityType} could not be deleted`);
    } else {
        res.status(204).send(`${entityType} deleted`);
    }
});

apiRouter.get('/minions/:entityId/work', function(req, res, next) {
    const entityId = req.params.entityId;
    const entityFromDb = db.getAllFromDatabase('work');

    if(!entityFromDb) {
        res.status(404).send(`${entityType} not found`);
    } else {
        res.send(entityFromDb);
    }
});


module.exports = apiRouter;
