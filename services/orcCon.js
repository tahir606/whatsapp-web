const oracledb = require('oracledb');
const dbConfig = require('../config/dbConfig');

async function connect() {
    let connection;

    try {

        connection = await oracledb.getConnection(dbConfig);

        return connection;

    } catch (err) {
        console.error(err);
    }
}

async function getMessagesToBeSent() {

    let connection = await connect();

    if (!connection) {
        throw new Error('An Error Occurred');
    }

    try {
        let sql, binds, options, result;

        sql = 'SELECT ID, RECEIVER, MSG, ATCHM FROM WHATSAPP_MSG WHERE STATUS = :1';
        binds = ['S'];

        options = {
            outFormat: oracledb.OUT_FORMAT_OBJECT,   // query result format
            // extendedMetaData: true,               // get extra metadata
            // prefetchRows:     100,                // internal buffer allocation size for tuning
            // fetchArraySize:   100                 // internal buffer allocation size for tuning
        };
        result = await connection.execute(sql, binds, options);

        return result.rows;
    } catch (err) {
        console.error(err);
    } finally {
        if (connection) {
            try {
                await connection.close()
            } catch (err) {
                console.error(err);
            }
        }
    }
}

async function updateMessageSent(messageId, status) {
    let connection = await connect();

    if (!connection) {
        throw new Error('An Error Occured');
    }

    try {
        let sql, binds, options, result;

        sql = 'UPDATE WHATSAPP_MSG set STATUS = :1 WHERE ID = :2';
        binds = [status, messageId];

        options = {
            autoCommit: true,
            // batchErrors: true,  // continue processing even if there are data errors
            bindDefs: [
                { type: oracledb.STRING, maxSize: 50},
                { type: oracledb.NUMBER }
            ]
        };

        result = await connection.execute(sql, binds, options);
        console.log("Number of rows inserted:", result.rowsAffected);
    } catch (err) {
        console.error(err);
    } finally {
        if (connection) {
            try {
                await connection.close()
            } catch (err) {
                console.error(err);
            }
        }
    }
}

module.exports = {
    getMessagesToBeSent: getMessagesToBeSent,
    updateMessageSent: updateMessageSent,
}
