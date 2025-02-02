const User = require('../model/UserSQL');
const bcrypt = require('bcrypt');

const handleNewUser = async (req, res) => {
    const {user, email, pwd} = req.body;
    if (!user || !pwd) return res.status(400).json({ 'message': 'Username and password are required.' });

    // check for duplicate usernames in the db
    const duplicate = await User.findOne({ where: { username: user } });
    if (duplicate) return res.sendStatus(409); //conflict
    try{
        //encrypt the password
        const hashedPwd = await bcrypt.hash(pwd, 10);

        //create and store the new user
        const result = await User.create({ 
            "username": user, 
            "email": email,
            "password": hashedPwd, 
        });

        console.log(result);

        res.status(201).json({'success' : `New user ${user} created.`});
    } catch(err) {
        console.error('Error during user creation:', err);
        res.status(500).json({'message': err.message});
    }
}

module.exports = { handleNewUser };
