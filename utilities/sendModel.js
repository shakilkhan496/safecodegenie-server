
module.exports = {
    success: (res, message, data) => {
        return res.status(200).json({ success: true, message, data: data || {} });
    },
    sendFile: (res, filePath, fileName) => {
           res.sendFile(filePath+fileName);
    },
    error: (res, status, message, error) => {
        let now = new Date();
        const sendObj = { success: false, message, error: error || {}, date: new Date(now.getTime() + (330 * 60 * 1000)) };
        return res.status(status).json(sendObj);
    },
};