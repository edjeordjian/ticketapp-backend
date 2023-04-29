const setOkResponse = (message, res, customData = {}) => {
    const data = {};

    if (message) {
        data.message = message;
    }

    return res.status(200)
               .json( {
                 ...customData,
                 ...data
               } );
};

const setErrorResponse = (error, res, status = 400) => {
    const responseBody = {
        error: error.toString(),
    };

    return res.status(status)
              .json(responseBody);
};

const setUnexpectedErrorResponse = (error, res) => {
    return setErrorResponse(error, res, 500);
};

module.exports = {
    setErrorResponse, setOkResponse, setUnexpectedErrorResponse
};
