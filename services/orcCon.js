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

        // For a complete list of options see the documentation.
        options = {
            outFormat: oracledb.OUT_FORMAT_OBJECT,   // query result format
            // extendedMetaData: true,               // get extra metadata
            // prefetchRows:     100,                // internal buffer allocation size for tuning
            // fetchArraySize:   100                 // internal buffer allocation size for tuning
        };

        result = await connection.execute(sql, binds, options);

        console.log("Metadata: ");
        console.dir(result.metaData, {depth: null});
        console.log("Query results: ");
        console.dir(result.rows, {depth: null});

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

module.exports = {
    getMessagesToBeSent: getMessagesToBeSent
}
