module.exports = function(app, ScheduleUser, User, Schedule) {

    app.get('/api/scheduleUsers', function(req, res) {
        ScheduleUser.find(function(err, users) {
            if(err) return res.status(500).send({error: 'database failure'});
            res.json(users);
        });
    })

    app.post('/api/scheduleUsers/invite/request', async function(req, res) {
        try {
            var _invited_member_id = req.body.invited_member_id;
            var _schedule_id = req.body.schedule_id;

            const user = await User.findOne({id: _invited_member_id});
            
            if(!user) {
                return res.status(404).json({error: 'User not found'});
            }

            //이미 초대 되거나 등록된 멤버를 초대할 경우 오류
            const checkMember = await ScheduleUser.findOne(
                {
                    user_id: _invited_member_id,
                    schedule_id: _schedule_id
                }
            );

            if(checkMember) {
                if(checkMember.accepted === true) return res.status(403).json({error: 'already schedule member'});
                else return res.status(403).json({error: 'already invited user'});
            }

            var newMember = new ScheduleUser();
            newMember.user_id = _invited_member_id;
            newMember.schedule_id = _schedule_id;
            newMember.accepted = false;
            
            console.log(newMember);
            const inviting_member = await newMember.save();

            res.redirect(req.get('referer'));

        } catch(e) {
            res.status(500).json({error: e});
            console.log(e);
        }
    })

    app.post('/api/scheduleUsers/invite/cancle', async function(req, res) {
        try {
            var _schedule_id = req.body.schedule_id;
            var _invite_cancle_user_id = req.body.invite_cancle_user_id;

            const invite_cancle_user = await ScheduleUser.findOne({
                user_id: _invite_cancle_user_id,
                schedule_id: _schedule_id,
                accepted: false,
            });

            if(!invite_cancle_user) return res.status(404).json({error: 'User not found'});
            
            const cancle_invite = await ScheduleUser.remove({
                user_id: _invite_cancle_user_id,
                schedule_id: _schedule_id,
                accepted: false,
            })

            res.redirect(req.get('referer'));
        } catch(e) {
            res.status(500).json({error: e});
            console.log(e);
        }
    })

    app.post('/api/scheduleUsers/ban', async function(req, res) {
        try {
            var _schedule_id = req.body.schedule_id;
            var _ban_user_id = req.body.ban_user_id;

            if(_ban_user_id === req.session.user.id) {
                return res.status(403).json({error: 'You can not ban yourself'});
            }
    
            const _schedule = await Schedule.findOne({ id: _schedule_id });

            if(_ban_user_id === _schedule.super_user_id) {
                return res.status(403).json({error: 'You can not ban super user'});
            }
    
            const invite_cancle_user = await ScheduleUser.findOne({
                user_id: _ban_user_id,
                schedule_id: _schedule_id,
                accepted: true,
            });
    
            if(!invite_cancle_user) return res.status(404).json({error: 'User not found'});
            
            const cancle_invite = await ScheduleUser.remove({
                user_id: _ban_user_id,
                schedule_id: _schedule_id,
                accepted: true,
            })
    
            res.redirect(req.get('referer'));
        } catch(e) {
            res.status(500).json({error: e});
            console.log(e);
        }
    })

    app.post('/api/scheduleUsers/invite/response/accept', async function(req, res) {
        try {
            var _user_id = req.session.user.id;
            var _schedule_id = req.body.schedule_id;

            const schedule_user = await ScheduleUser.findOne({ user_id: _user_id, schedule_id: _schedule_id});

            if(!schedule_user) {
                return res.status(404).json({error: 'User not found'});
            }

            schedule_user.accepted = true;
            const accepting_invite = await schedule_user.save();

            res.redirect(req.get('referer'));

        } catch(e) {
            res.status(500).json({error: e});
            console.log(e);
        }
    })

    app.post('/api/scheduleUsers/invite/response/reject', async function(req, res) {
        try {
            var _user_id = req.session.user.id;
            var _schedule_id = req.body.schedule_id;

            const cancle_invite = await ScheduleUser.remove({
                user_id: _user_id,
                schedule_id: _schedule_id,
                accepted: false,
            })

            res.redirect(req.get('referer'));

        } catch(e) {
            res.status(500).json({error: e});
            console.log(e);
        }
    })
}