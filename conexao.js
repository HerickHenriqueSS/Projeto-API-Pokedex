const mysql = require('serverless-mysql')({
    config: {
        host: "",
        database: "",
        user: "",
        password: ""
    }
});
module.exports = mysql;