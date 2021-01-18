module.exports = function(app, User, UserFriend) {

    app.get('/', function(req, res) {
        // session 정보에서 isLogined가 true라면 로그아웃 보이기
        if(req.session.isLogined) {
            res.render('index', {name:req.session.user.name});
        }
        // session 정보에서 isLogined가 false라면 로그인 보이기
        else {
            res.render('index', {name:null});
        }
    })

    // Login View
    app.get('/login', function(req, res) {
        if(req.session.isLogined) {
            res.redirect('/');
        }
        else {
            res.render('login');
        }
    })

    // Registration View
    app.get('/register', function(req, res) {
        res.render('register');
    })

    // Registration Success View
    app.get('/register_success', function(req, res) {
        res.render('register_success');
    })

    // Process Login
    app.post('/process/login', function(req, res) {
        if(req.session.isLogined) {
            res.redirect('/');
        }
        else {
            var paramId = req.body.id;
            var paramPw = req.body.password;

            var result = User.findOne({ "id": paramId, "password": paramPw }, function(err, user){
                if(err) return res.status(500).json({error: err});
                if(!user) {
                    return res.status(404).json({error: 'user not found'});
                }
                
                req.session.isLogined = true;
                req.session.userId = paramId;
                req.session.user = user;

                req.session.save(function() {
                    res.redirect('/');
                });
                
            });
        }
    })

    // Logout View
    app.get('/logout', function(req, res) {
        if(req.session.isLogined) {
            req.session.destroy();
        }
        res.redirect('/');
    })

    // Add Friend View
    app.get('/add_friend', function(req, res) {
        
        var _user_id = req.session.user.id;
        UserFriend.find({user_id: _user_id, accepted: false}, function(err, sentUserFriends) {
            if(err) return res.status(500).json({error: err});
            var _sentFriendRequestList = sentUserFriends;

            UserFriend.find({friend_id: _user_id, accepted: false}, function(err, receivedUserFriends){
                if(err) return res.status(500).json({error: err});
                var _receivedFriendRequestList = receivedUserFriends;
                res.render(
                    'add_friend', 
                    {
                        sentFriendRequestListSize: _sentFriendRequestList.length, 
                        sentFriendRequestList: _sentFriendRequestList,
                        receivedFriendRequestListSize: _receivedFriendRequestList.length,
                        receivedFriendRequestList: _receivedFriendRequestList,
                    }
                );
            });
        });
    })

    app.get('/friend_list', function(req, res) {

        var user_id = req.session.user.id;
        UserFriend.find({user_id: user_id, accepted: true}, function(err, userFriends) {
            if(err) return res.status(500).json({error: err});
            var friendList = userFriends;
            res.render('friend_list', {friendListSize: friendList.length, friendList: friendList});
        });
    })
}