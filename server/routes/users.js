module.exports = function(app, User) {

    // Retrieve User (All Users)
    app.get('/api/users', function(req, res){
        User.find(function(err, users) {
            if(err) return res.status(500).send({error: 'database failure'});
            res.json(users);
        });
    })

    // Retrieve User (Single User)
    app.get('/api/users/:user_id', function(req, res){
        User.findOne({_id: req.params.user_id}, function(err, user){
            if(err) return res.status(500).json({error: err});
            if(!user) {
                return res.status(404).json({error: 'user not found'});
            }
            res.json(user);
        })
    });

    // Retrieve User By Name
    app.get('/api/users/name/:name', function(req, res){
        User.find({name: req.params.name}, function(err, users){
            if(err) return res.status(500).json({error: err});
            if(users.length === 0) return res.status(404).json({error: 'user not found'});
            res.json(users);
        });
    })

    // Create User
    app.post('/api/users/regist', function(req, res) {
        User.findOne({id: req.body.id}, function(err, user) {
            if(err) return res.status(500).json({error: err});
            if(user) return res.status(403).json({error: 'this ID already used'});

            var newUser = new User();
            if(req.body.password !== req.body.password_check) {
                res.send("check your password");
                return;
            }
            
            newUser.id = req.body.id;
            newUser.name = req.body.name;
            newUser.password = req.body.password;
            
            newUser.save(function(err){
                if(err) {
                    console.error(err);
                    res.json({result: 0});
                    return;
                }
        
                res.redirect('/register_success');
            });
        });
    })

    app.post('/api/users/checkId', async function(req, res) {
        try {
            let _id = req.body.user_id;
        
            const user = await User.findOne({id: _id});
    
            if(user) {
                return res.status(403).json({status: 'existed'});
            }

            res.status(200).json({status: 'success'});
        } catch (e) {
            return res.status(500).json({status: e});
        }
        
    })

    app.post('/api/users/signUp', async function(req, res) {
        try {
            let _id = req.body.user_id;
            let _name = req.body.user_name;
            let _password = req.body.password;

            console.log(req.body);
            newUser = new User();
            newUser.id = _id;
            newUser.name = _name;
            newUser.password = _password;

            const savingNewUser = await newUser.save();

            return res.status(200).json({status: 'success'});

        } catch (e) {
            console.log(e);
            return res.status(500).json({status: e});
        }
    })

    
    // Update User
    app.put('/api/users/:user_id', function(req, res) {
        User.findById(req.params.user_id, function(err, user) {
            if(err) return res.status(500).json({ error: 'database failure' });
            if(!user) return res.status(404).json({ error: 'user not found' });

            if(req.body.name) user.name = req.body.name;

            user.save(function(err) {
                if(err) res.status(500).json({ error: 'failed to update' });
                res.json({ message: 'user update' });
            });
        });
    })

    // Delete User
    app.delete('/api/users/:user_id', function(req, res) {
        User.remove({ _id: req.params.user_id }, function(err, output) {
            if(err) return res.status(500).json({ error: "database failure" });
        })

        // if(!output.result.user_id) return res.status(404).json({ error: "user not found" });
        // res.json({ message: "user deleted" });

        res.status(204).end();
    })
}