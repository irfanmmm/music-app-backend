const DataBase = require("../../db/db");
const jwt = require("jsonwebtoken");

const userdetails = async (req, res) => {
  console.log(req.socket.remoteAddress.split(':')[3] + ':3000');
  
  try {
    
    let userdetails = jwt.decode(req.headers.authorization)
    
    res.json({
      status: true,
      message: 'Success',
      ...userdetails
    })
  } catch (error) {
    res.json({
      status: false,
      message: 'Unotherized',
      error:error.toString()
    })
  }
};

module.exports = userdetails;