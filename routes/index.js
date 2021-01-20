const schedule = require("../models/schedule");

module.exports = function(app, User, UserFriend, Schedule, ScheduleUser) {

    app.get('/', function(req, res) {
        // session 정보에서 isLogined가 true라면 로그아웃 보이기
        if(req.session.isLogined) {
            res.render('index', {user:req.session.user});
        }
        // session 정보에서 isLogined가 false라면 로그인 보이기
        else {
            res.render('index', {user:null});
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
        if(!req.session.isLogined) {
            return res.status(403).json({error: 'You must do login'});
        }

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
        if(!req.session.isLogined) {
            return res.status(403).json({error: 'You must do login'});
        }

        var _user_id = req.session.user.id;
        UserFriend.find({user_id: _user_id, accepted: true}, function(err, userFriends) {
            if(err) return res.status(500).json({error: err});
            var friendList = userFriends;
            res.render('friend_list', {friendListSize: friendList.length, friendList: friendList});
        });
    })

    app.get('/add_schedule', function(req, res) {
        if(!req.session.isLogined) {
            return res.status(403).json({error: 'You must do login'});
        }

        res.render('add_schedule');
    })

    app.get('/schedule_list', async function(req, res) {
        try {
            if(!req.session.isLogined) {
                return res.status(403).json({error: 'You must do login'});
            }
    
            var _user_id = req.session.user.id;
            // aggregate는 collection을 집합화 시킴
            const joined_schedule_query = await ScheduleUser.aggregate([
                {
                    // ScheduleUser.user_id와 _user_id 와 같은것을 고름
                    $match: {
                        user_id: _user_id,
                        accepted: 'true'
                    }
                },
                {
                    // ScheduleUser.schedule_id와 Schedule.id를 조인시킴
                    $lookup: {
                        from: 'schedules',
                        localField: 'schedule_id',
                        foreignField: 'id',
                        as: 'schedule_list',
                    }
                }
            ])

            const invited_schedule_query = await ScheduleUser.aggregate([
                {
                    // ScheduleUser.user_id와 _user_id 와 같은것을 고름
                    $match: {
                        user_id: _user_id,
                        accepted: 'false'
                    }
                },
                {
                    // ScheduleUser.schedule_id와 Schedule.id를 조인시킴
                    $lookup: {
                        from: 'schedules',
                        localField: 'schedule_id',
                        foreignField: 'id',
                        as: 'schedule_list',
                    }
                }
            ])

            var _joinedScheduleListSize;
            var _joinedScheduleList;
            var _invitedScheduleListSize;
            var _invitedScheduleList;

            if(joined_schedule_query.length === 0) {
                _joinedScheduleListSize = 0;
                _joinedScheduleList = [];
            }
            else {
                _joinedScheduleListSize = joined_schedule_query.length,
                _joinedScheduleList = joined_schedule_query
            }

            if(invited_schedule_query.length === 0) {
                _invitedScheduleListSize = 0
                _invitedScheduleList = [];
            }
            else {
                _invitedScheduleListSize = invited_schedule_query.length,
                _invitedScheduleList = invited_schedule_query
            }
    
            res.render(
                'schedule_list',
                {
                    joinedScheduleListSize: _joinedScheduleListSize,
                    joinedScheduleList: _joinedScheduleList,
                    invitedScheduleListSize: _invitedScheduleListSize,
                    invitedScheduleList: _invitedScheduleList,
                }
            );

        } catch (e) {
            console.log(e);
        }
    })

    app.get('/manage_schedule', async function(req, res) {
        try {
            if(!req.session.isLogined) {
                return res.status(403).json({error: 'You must do login'});
            }
    
            if(!req.query.schedule_id) {
                return res.redirect('/');
            }
    
            var _schedule_id = req.query.schedule_id;
            var _user_id = req.session.user.id;
    
            const schedule = await Schedule.findOne({id: _schedule_id});
            const schedule_query = await ScheduleUser.aggregate([
                {
                    $match: {
                        user_id: _user_id,
                        schedule_id: _schedule_id,
                        accepted: 'true',
                    }
                },
                {
                    $lookup: {
                        from: 'schedules',
                        localField: 'schedule_id',
                        foreignField: 'id',
                        as: 'schedule',
                    }
                },
            ]);

            if(schedule_query.length === 0) {
                return res.status(403).json({error: 'You are not schedule member'});
            }

            var _schedule = schedule_query[0].schedule[0];
            var _is_super_user;
            if(_schedule.super_user_id === _user_id) _is_super_user = true;
            else _is_super_user = false;

            res.render(
                'manage_schedule',
                {
                    schedule_id: _schedule_id,
                    is_super_user: _is_super_user,
                },
            )
        } catch(e) {
            console.log(e);
        }
    })

    // async와 await를 통해 동기진행을 함
    app.get('/member_list', async function(req,res) {
        try {
            if(!req.session.isLogined) {
                return res.status(403).json({error: 'You must do login'});
            }
    
            if(!req.query.schedule_id) {
                return res.redirect('/');
            }
    
            var _schedule_id = req.query.schedule_id;
            var _user_id = req.session.user.id;
            var _schedule;
            var _member_list;
            var _invited_member_list;
            var _is_super_user;

            const schedule_query = await ScheduleUser.aggregate([
                {
                    $match: {
                        schedule_id: _schedule_id,
                        user_id: _user_id,
                        accepted: 'true',
                    },
                },
                {
                    $lookup: {
                        from: 'schedules',
                        localField: 'schedule_id',
                        foreignField: 'id',
                        as: 'schedule',
                    }
                },
            ]);

            if(schedule_query.length === 0) {
                return res.status(403).json({error: 'You are not schedule member'});
            }

            const member_query = await ScheduleUser.aggregate([
                {
                    $match: {
                        schedule_id: _schedule_id,
                        accepted: 'true'
                    }
                },
                {
                    $lookup: {
                        from: 'users',
                        localField: 'user_id',
                        foreignField:'id',
                        as: 'member_list',
                    }
                }
            ])

            const invited_member_query = await ScheduleUser.aggregate([
                {
                    $match: {
                        schedule_id: _schedule_id,
                        accepted: 'false'
                    }
                },
                {
                    $lookup: {
                        from: 'users',
                        localField: 'user_id',
                        foreignField:'id',
                        as: 'member_list',
                    }
                }
            ])
            
            if(schedule_query.length === 0) _schedule = [];
            else _schedule = schedule_query[0].schedule[0];

            if(member_query.length === 0) _member_list = [];
            else _member_list = member_query;

            if(invited_member_query.length === 0) _invited_member_list = [];
            else _invited_member_list  = invited_member_query;

            if(_schedule.super_user_id === _user_id) _is_super_user = true;
            else _is_super_user = false;

            res.render(
                'member_list', 
                {
                    memberListSize: _member_list.length,
                    memberList: _member_list,
                    invitedMemberListSize: _invited_member_list.length,
                    invitedMemberList: _invited_member_list,
                    is_super_user: _is_super_user,
                    schedule: _schedule,
                }
            );
        } catch(e) {
            console.log(e);
        }
    })
        
        
}