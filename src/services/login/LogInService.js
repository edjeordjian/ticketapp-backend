const {setOkResponse} = require("../helpers/ResponseHelper");

const handleLogIn = async (req, res) => {
    return setOkResponse("Ok", res, {});
};

module.exports = {
    handleLogIn
};
