const express = require('express');
const mongoose = require('mongoose');
const requireAuth = require('../middlewares/requireAuth');
const Game = mongoose.model('Game');
const router = express.Router();
const conn = mongoose.connection;

//router.use(requireAuth);

router.get('/games', async (req, res) => {
    const games = await Game.find();
    console.log('getting the games', games);
    res.send(games);
});

router.get('/gameTopicList', async (req, res) => {
    const { gameId } = req.query;
    console.log('node gameTopicList id: ', gameId);
    const games = await Game.findOne({_id: gameId});
    console.log('getting the games topics: ', games);
    res.send(games);
});

router.post('/game', async (req , res) => {
    const { title } = req.body;

    if(!title) {
        return res.status(422).send({ error: 'you must provide a title'});
    }

    try {
        console.log('the title is: ' , title);
        const game = new Game({ title });
        await game.save();
        res.send(game);
    } catch(err) {
        return res.status(422).send({ error: err.message});
    }
    
})

router.put('/addgameTopic' , async (req , res) => {
    const { topicTitle, gameId } = req.body;
    const topicInfo = { title: topicTitle, content: ''};

    try {
        console.log('the topicTitle is: ' , topicTitle, gameId);
        Game.findOneAndUpdate({_id: gameId}, { $push: { topics: topicInfo  } }, {new: true}, function(err, gameTopics) {
            console.log('getting addgameTopic new topics: ', gameTopics);
            res.send(gameTopics);
        });
    } 
    catch(err) {
        return res.status(420).send({ error: err.message});
    }
});

router.put('/editTopicNotes' , async (req , res) => {
    const { gameId, title, content } = req.body;
    console.log('the topic content is: ' , gameId , title, content);
    try {
        Game.findOneAndUpdate({'topics.title': title}, { $set: { 'topics.$.content': content} } , {new: true}, function(err, gameTopicNotes) {
            console.log('getting editTopicNotes changed topics: ', gameTopicNotes);
            res.send(gameTopicNotes);
        });

        /*Game.findOne({_id: gameId }).then(doc => {
            topic = doc.topics[title](title);
            
            console.log('mongooose log: ' , topic)
            topic["content"] = content;
            doc.save();
          
            //sent respnse to client
          }).catch(err => {
            console.log('Oh! Dark')
          });*/
    } 
    catch(err) {
        return res.status(420).send({ error: err.message});
    }
})

router.delete('/deleteGame' , async (req , res) => {
    const { gameId } = req.body;
    console.log('id to delete: ' , gameId);
    try {
        Game.findOneAndDelete({_id: gameId}, {rawResult: false}, function(err, games) {
            console.log('getting new docs after delete ', games);
            res.send(games);
        });

        /*Game.findOne({_id: gameId }).then(doc => {
            topic = doc.topics[title](title);
            
            console.log('mongooose log: ' , topic)
            topic["content"] = content;
            doc.save();
          
            //sent respnse to client
          }).catch(err => {
            console.log('Oh! Dark')
          });*/
    } 
    catch(err) {
        return res.status(420).send({ error: err.message});
    }
});

router.delete('/deleteGameTopic' , (req, res) => {
    const { gameId, title } = req.body;
    console.log('id to delete: ' , gameId);
    try {
        Game.findOneAndUpdate({'topics.title': title}, { $pull: { topics: { title: title}} }, {new: true}, function(err, gameTopic) {
            console.log('getting hanged topics after pull: ', gameTopic);
            res.send(gameTopic);
        });

    } 
    catch(err) {
        return res.status(420).send({ error: err.message});
    }
});

module.exports = router;