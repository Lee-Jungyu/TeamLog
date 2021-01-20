module.exports = function(app, User, UserFriend) {

    // Retrieve UserFriend (All UserFriends)
     app.get('/api/userFriends', function(req, res){
        UserFriend.find(function(err, users) {
            if(err) return res.status(500).send({error: 'database failure'});
            res.json(users);
        });
    })

    // Send User Friend Request
    app.post('/api/userFriends/request', function(req, res) {
        var userFriend = new UserFriend();
        var _user_id = req.session.user.id;
        var _friend_id = req.body.friend_id;
        UserFriend.findOne({user_id: _user_id, friend_id: _friend_id}, function(err, userFriend){
            if(err) return res.status(500).json({error: err});
            if(userFriend) return res.status(403).json({error: 'already send request'});
        })

        User.findOne({id: _friend_id}, function(err, friend) {
            if(err) return res.status(500).json({error: err});
            if(!friend) return res.status(404).json({error: 'user not found'});

            var newUserFriend = new UserFriend();
            newUserFriend.user_id = _user_id;
            newUserFriend.friend_id = _friend_id;
            newUserFriend.accepted = false;

            newUserFriend.save(function(err){
                if(err) {
                    console.error(err);
                    res.json({result: 0});
                    return;
                }
                
                console.log('send request');
                res.redirect('/add_friend');
            });
        });
    })

    // Cancle User Friend Request
    app.post('/api/userFriends/request/cancle', function(req, res) {
        var _friend_id = req.body.friend_id;
        var _user_id = req.session.user.id;

        UserFriend.remove({ user_id: _user_id, friend_id: _friend_id }, function(err, output) {
            if(err) return res.status(500).json({ error: "database failure" });
            res.redirect('/add_friend');
        });
    })

    // Send User Friend Response (Accept)
    app.post('/api/userFriends/response/accept', function(req, res) {
        var _friend_id = req.body.friend_id;
        var _user_id = req.session.user.id;

        UserFriend.findOne({user_id: _friend_id, friend_id: _user_id}, function(err, userFriend) {
            if(err) return res.status(500).send({error: 'database failure'});

            userFriend.accepted = true;
            userFriend.save(function(err){
                if(err) return res.status(500).json({error: err});

                userFriend.accepted = true;

                newUserFriend.save(function(err) {
                    if(err) return res.status(500).json({error: err});
                    res.redirect('/add_friend');
                });
            });
        });
    })

    // Send User Friend Response (Reject)
    app.post('/api/userFriends/response/reject', function(req, res) {
        var _friend_id = req.body.friend_id;
        var _user_id = req.session.user.id;

        UserFriend.remove({ user_id: _friend_id, friend_id: _user_id }, function(err, output) {
            if(err) return res.status(500).json({ error: "database failure" });
            res.redirect('/add_friend');
        });
    })

    // Remove Friend
    app.post('/api/userFriends/remove', function(req, res) {
        var _friend_id = req.body.friend_id;
        var _user_id = req.session.user.id;

        console.log(_user_id);
        console.log(_friend_id);
        UserFriend.remove({ user_id: _user_id, friend_id: _friend_id }, function(err, output1) {
            if(err) return res.status(500).json({ error: "database failure" });
            
            UserFriend.remove({ user_id: _friend_id, friend_id: _user_id}, function(err, output2) {
                if(err) return res.status(500).json({ error: "database failure" });
            
                res.redirect('/friend_list');
            })
            
        });
    })

}