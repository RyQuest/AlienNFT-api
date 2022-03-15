const sendResponse = (res, data = {}) => {
    res.json(data);
};

module.exports = sendResponse;