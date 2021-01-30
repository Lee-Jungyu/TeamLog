module.exports = function(app, User) {

    //login
    app.post('/login', async function(req, res) {
        try {
            let _id = req.body.user_id;
            let _password = req.body.password;
            
            const user = await User.findOne({id: _id, password: _password});

            if(user) return res.status(200).json({status: 'success'});

            return res.status(404).json({status: 'not found'});
        } catch (e) {
            console.log(e);
            return res.status(500).json({status: e});
        }
    })
}