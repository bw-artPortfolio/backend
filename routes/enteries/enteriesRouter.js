const express = require('express');
const router = express.Router();

const jwt = require('jsonwebtoken');
const secrets = require('../../config/secrets');

const postModel = require('./enteriesModel');




router.get('/posts', async (req, res) => {
    try {
        const posts = await postModel.findAll();
        res.status(200).json(posts);
    }
    catch {
        res.status(500).json({errorMessage: "There was a problem getting the data"})
    }
})


router.get('/posts/:id', async (req, res) => {
    const {id} = req.params;
    try {
        const post = await postModel.findBy({id}); 
            if(post) {
                res.status(200).json(post);
            }
            else {
                res.status(404).json({message:'post not found'});
            }  
    }
    catch {
        res.status(500).json({errorMessage: "There was a problem getting the data"})
    }
})



router.put('/posts/:id', checkCreds, async (req, res) => {

    const {id} = req.params;
    const changes = req.body;
    const usernameId = req.user.username_id;

    if(changes.id || changes.username_id) {
        res.status(403).json({errorMessage: "Not allowed to change ids" })
    }

    if(!changes.description && !changes.imgURL && !changes.title && !changes.category && !timestamp) {
        res.status(400).json({errorMessage: "No field to update"})
    }

    try {
        const post = await postModel.findBy({id})

        if(post) {
            if(post.username_id === usernameId) {
                try {
                    const modifiedPost = await postModel.update({id}, changes)
                    if(modifiedPost) {
                        res.status(200).json(modifiedPost)
                    }
                    else {
                        res.status(500).json({errorMessage: 'post to update not found'});                    
                    }
                }
                catch {
                    res.status(500).json({errorMessage: "There was a problem updating the post"});
                }
            }
            else {
                res.status(403).json("errorMessage: Not allowed to update")
            }
        }
        else {
            res.status(404).json({errorMessage: 'Post not found'});                    
        }
    }
    catch {
        res.status(500).json({message: "There was a problem finding the post"});
    }
    
})

router.post('/posts', validatePostInfo, checkCreds, async (req, res) => {
    const post = {
        username_id: req.user.username_id,
        imgURL: req.body.imgURL,
        description: req.body.description,
        title: req.body.title,
        category: req.body.category,
        timestamp: req.body.timestamp,
        votes: 0 
    }

    try {
        const newPost = await postModel.add(post, 'id');
        res.status(201).json({newPost});
    }
    catch {
        res.status(500).json({"errorMessage": "Encountered issue adding your post"})
    }
})


router.delete('/posts/:id', checkCreds, async (req, res) => {
    
    const {id} = req.params;
    const usernameId = req.user.username_id;

    try {
        const post = await postModel.findBy({id})

        if (post) {
            if(post.username_id === usernameId) {
                try {
                    const count = await postModel.remove({id})
                    if(count>0) {
                        res.status(200).json({message: `${count} post(s) deleted`})
                    }
                    else {
                        res.status(500).json({errorMessage: 'Post does not exist'});                    
                    }
                }
                catch {
                    res.status(500).json({errorMessage: "Encountered issue deleting the post"});
                }
            }
            else {
                res.status(403).json("errorMessage: Unable to delete")
            }
        }
        else {
            res.status(404).json({errorMessage: 'Post does not exist'});                    
        }
    }
    catch {
        res.status(500).json({message: "There was a problem finding the post"});
    }
        
    
});

router.put('/posts/votes/:id', checkCreds, async (req, res) => {
    const {id} = req.params;
    const votes = req.body;

    if(votes) {
        try {
            modifiedPost = await postModel.update({id}, votes)
            if(modifiedPost) {
                res.status(200).json({newCount: modifiedPost.votes});
            }
            else {
                res.status(404).json({message: 'Post does not exist'});
            }
        }
        catch {
            res.status(500).json({message: "Unable to update post"});
        }
    }

    else {
        res.status(400).json({message: 'Error'});
    }

    
})


//Middleware to validate if post info is existing
function validatePostInfo(req, res, next) {
    const post = req.body;
    if(post.description && post.imgURL && post.title && post.category && post.timestamp) {
        next();
    }
    else {
        res.status(422).json({"errorMessage": "Missing post info"});
    }
}

//Middleware to check if user is logged in
function checkCreds(req, res, next) {
    const token = req.headers.authorization;

    if(token) {
        jwt.verify(token, secrets.jwtSecret, (err, decodedToken) => {
            if(err) {
                res.status(401).json({ message: 'Invalid Credentials' });
            }
            else {
                req.user = {username_id: decodedToken.username_id, username: decodedToken.username }
                next();
            }
        })
    }
    else {
        res.status(400).json({ message: 'No token provided' });
    }
}

module.exports = router;