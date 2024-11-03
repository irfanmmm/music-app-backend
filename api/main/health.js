const health = (req, res) => {
  console.log("calling health");

  res.json({
    status: true,
    message: "Ok",
  });
};

module.exports = health;
