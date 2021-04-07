const signin = (req, res)=>{
    console.log("User Signin")
    console.log(req.body)
}

const signup = (req, res)=>{
    console.log("User Signup")
    console.log(req.body)
}

module.exports = {
    signin,
    signup,
}