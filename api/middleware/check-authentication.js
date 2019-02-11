const jwt = require('jsonwebtoken');

module.exports=(req,res,next)=>{

const token = req.headers.authorization.split(" ")[1];
// console.log(token);

try{
    const decoded = jwt.verify(token,process.env.JWT_KEY);
    req.userData=decoded;
    next();
}catch(error){
        res.status(401).json({
            message:'authorization failed'
        })
}

}

// const checkAuth=(req,res,next)=>{

// const token = req.body.token;
// try{
// var decoded = jwt.verify(token,secret);
// req.userData=decoded
// }catch(error){
// res.status(401).json({
//     message:'authenticationss failes'
// })
// }


// // if(!decoded || decoded.auth !== 'magic') {
// //     res.status(401).json({
// //         message:'authentication failes'
// //     })
// //   } else {
// //     return res.status(201).json(token)
// //   }
// }

// module.exports=checkAuth;