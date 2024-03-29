const Users = require('../models/userModel')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')

const userCtrl ={

    register: async (req ,res)=>{
        try {
            const {name,email,password}=req.body;

            const user = await Users.findOne({email})
            if(user) return res.status(400).json({msg:" the email already exists"})

            if(password.length <6)
            return res.status(400).json({msg:" password should aleast 6"})

            //pwd encryption
            const passwordHash = await bcrypt.hash(password,10)

            const newUser =  new Users({
                name,email,password:passwordHash
            })

            //save new user
            await newUser.save()
            // res.json({password,passwordHash})
            // create jsonWebTOken jwt  to authenticate
            
            // const accesstoken = createAccessToken({id: newUser._id})
            // const refreshtoken = createRefreshToken({id: newUser._id})
           

            // res.cookie('refreshtoken',refreshtoken,{
            //     httpOnly:true,
            //     path:'/user/refresh_token'
            // })

            // res.json({accesstoken})
            res.status(200).json({msg:"Registered successful"})




            //res.json({msg:"register success!"})


        } catch (err) {
            return res.status(500).json({msg:err.message})
        }
    },
    updateUserCart: async (req, res) => {
        const { userId, cart } = req.body;
    
        try {
            // Find the user by their ID
            const user = await Users.findById(userId);
    
            if (!user) {
                return res.status(404).json({ success: false, message: 'User not found' });
            }
    
            // Update only the 'cart' field in the user document
            user.cart = cart;
    
            // Save the updated user document
            await user.save();
    
            return res.status(200).json({ success: true, message: 'Cart updated successfully',user: user });
        } catch (error) {
            return res.status(500).json({ success: false, message: error.message });
        }
    },
    
      
    refreshToken: (req, res) =>{
        try {
            const rf_token = req.cookies.refreshtoken;
            if(!rf_token) return res.status(400).json({msg: "Please Login or Register"})

            jwt.verify(rf_token, process.env.REFRESH_TOKEN_SECRET, (err, user) =>{
                if(err) return res.status(400).json({msg: "Please Login or Register"})

                const accesstoken = createAccessToken({id: user.id})

                res.json({user,accesstoken})
            })

        } catch (err) {
            return res.status(500).json({msg: err.message})
        }
        
    },
    login: async (req,res) =>{
        try {
            const {email,password} = req.body;

            const user = await Users.findOne({email})
            const userDetails = await Users.findOne({email}).select('-password')
            if(!user) return res.status(400).json({msg:"user doesnot exist"})

            const isMatch = await bcrypt.compare(password,user.password)
            if(!isMatch) return res.status(400).json({msg:"incorrect pwd"})
            // if login success , create access token and refresh token
            // const accesstoken = createAccessToken({id: user._id})
            // const refreshtoken = createRefreshToken({id: user._id})
           

            // res.cookie('refreshtoken',refreshtoken,{
            //     httpOnly:true,
            //     path:'/user/refresh_token'
            // })

            // res.json({accesstoken})
            // console.log(userDetails)s
            res.status(200).json({userDetails,msg:"login success"})
           // res.json({msg:"login success"})

        } catch (err) {
            return res.status(500).json({msg: err.message})
        }
    },
    logout: async (req,res)=>{
        try {
            res.clearCookie('refreshtoken',{path:'/user/refresh_token'})
            return res.json({msg:"logged out"})
        } catch (err) {
            return res.status(500).json({msg: err.message})
            
        }
    },
    getUser: async (req, res) =>{
        try {
            const user = await Users.findById(req.user.id).select('-password')
            if(!user) return res.status(400).json({msg: "User does not exist."})

            res.json(user)
        } catch (err) {
            return res.status(500).json({msg: err.message})
        }
    },


}

const createAccessToken = (user)=>{
    return jwt.sign(user,process.env.ACCESS_TOKEN_SECRET,{expiresIn :'1d'})
}

const createRefreshToken = (user)=>{
    return jwt.sign(user,process.env.REFRESH_TOKEN_SECRET,{expiresIn :'7d'})
}

module.exports = userCtrl