module.exports = function(app, User, Schedule, ScheduleUser) {

    // Retrieve Schedules (All Repositories)
    app.get('/api/schedules', function(req, res){
        Schedule.find(function(err, repos) {
            if(err) return res.status(500).send({error: 'database failure'});
            res.json(repos);
        });
    })

    // Create Schedule
    app.post('/api/schedules/create', function(req, res) {
        var user_id = req.session.user.id;
        var schedule_name = req.body.schedule_name;

        var newSchedule = new Schedule();
        
        newSchedule.id = newSchedule._id;
        newSchedule.name = schedule_name;
        newSchedule.super_user_id = user_id;

        newSchedule.save(function(err){
            if(err) {
                console.error(err);
                res.json({result: 0});
                return;
            }

            var schedule_id = newSchedule._id;

            var newScheduleUser = new ScheduleUser();
            newScheduleUser.user_id = user_id;
            newScheduleUser.schedule_id = schedule_id;
            newScheduleUser.accepted = true;

            newScheduleUser.save(function(err) {
                if(err) {
                    console.error(err);
                    res.json({result: 0});
                    return;
                }

                res.redirect('/');
            })
        });

    })

    // Delete Schedule
    app.post('/api/schedules/remove', async function(req, res) {
        try {
            var _user_id = req.session.user.id;
            var _schedule_id = req.body.schedule_id;

            console.log(_schedule_id);

            const _schedule = await Schedule.findOne({id: _schedule_id});
            
            if(!_schedule) {
                return res.status(404).json({error: 'Schedule not found'});
            }

            const remove_schedule_member = await ScheduleUser.remove({
                schedule_id: _schedule_id,
            });

            // 추후에 포스트도 지워야 함

            const remove_schedule = await Schedule.remove({
                id: _schedule_id,
            });

            res.redirect('/');

        } catch (e) {
            return res.status(500).json({error: e});
            console.log(e);
        }
    })
}