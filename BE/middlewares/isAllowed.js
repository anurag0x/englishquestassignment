const isAllowed = async (req, res, next) => {
  try {
    let user = req.user
    if(user.role != "CREATOR") return res.status(400).send({message : "You don't have access to perform such operations."})
    next()
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .send({
        message: "Internal Server Error",
        error: error.message,
        isOk: false,
      });
  }
};

module.exports = {isAllowed}
