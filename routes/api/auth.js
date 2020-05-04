const express = require('express');
const router = express.Router();
const config = require('config');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { check, validationResult } = require('express-validator');
const auth = require('../../middleware/auth');
const User = require('../../models/User');

//@route GET api/auth
//desc TEST route 
//@access Public

router.get('/',auth, async(req, res) => {
  try {
    const user =  await User.findById(req.user.id).select('-password');
    res.send(user);
  } catch (error) {
      console.error(error.message);
      res.status(500).json({ msg: 'Server Error'})
  }
})

    router.post('/',[
        check('email', 'Please include a valid email').exists(),
        check('password', 'Password is required').exists()
    
    ], async(req, res) => {
        const errors = validationResult(req);
        if(!errors.isEmpty()){
         return  res.status(401).json({ errors: errors.array() });
        }
      
        const { email, password } = req.body;
    
        try {
    
       let user = await User.findOne({ email});
    
      if(!user){
          return res.status(400).json({ msg: 'Invalid Credentials' });
      }
       
      //Encrypt password
    
     const isMatch = await bcrypt.compare(password, user.password);

     if(!isMatch){
         return res.status(400).json({ msg: 'Invalid Credentials'})
     }
    
       const payload = {
           user: {
               id: user.id
           }
       }
    
    
      //return Token
      jwt.sign(payload, config.get('Secret'), {
          expiresIn: 3600000
      }, (err, token) => {
          if (err) throw err;
          res.json({ token })
      })
    
    
        } catch (error) {
            console.log(error.message);
            res.status(500).json({ msg: 'Server Error'});
        }
      
    
    })




module.exports = router