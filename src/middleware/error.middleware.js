const errormiddleware = (err, req, resp, next) => {
    console.error(err);
    resp.status(500).json({
        message: 'Internal server error'
    });
};

module.exports = errormiddleware;