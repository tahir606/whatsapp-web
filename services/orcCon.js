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

        sql = 'SELECT * FROM OZEKIMESSAGEOUT WHERE STATUS = :1';
        binds = ['send'];

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

async function updateMessageSent(messageId) {
    let connection = await connect();

    if (!connection) {
        throw new Error('An Error Occured');
    }

    try {
        let sql, binds, options, result;

        sql = 'UPDATE OZEKIMESSAGEOUT set STATUS = :1 WHERE ID = :2';
        binds = ['transmitted', messageId];

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
