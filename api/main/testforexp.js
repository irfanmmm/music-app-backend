const path = require("path");
const testforexp = (req, res) => {
  global.appRoot = path.resolve(__dirname);
  console.log(global.appRoot, "hjh");

  res.sendFile("/public/templates/index.html")
};

module.exports = testforexp;
