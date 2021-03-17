const QRCode = require('qrcode-terminal');

const {Client} = require('whatsapp-web.js');
const client = new Client();

const {MessageMedia} = require('whatsapp-web.js');

client.on('qr', qr => {
    QRCode.generate(qr, {small: true});
});

client.on('ready', () => {
    console.log('Client is ready!');
});

function initializeWhatsApp() {
    return client.initialize();
}

function sendMessage(number, text, attachment) {

    // Getting chatId from the number.
    // we have to delete "+" from the beginning and add "@c.us" at the end of the number.
    const chatId = number.substring(1) + "@c.us";

    if (attachment) {
        const media = MessageMedia.fromFilePath(attachment);
        // Sending message with attachment
        return client.sendMessage(chatId, media, {
            caption: (text ? text : null)
        });
    } else {
        return client.sendMessage(chatId, text);
    }
}

module.exports = {
    initializeWhatsApp: initializeWhatsApp,
    sendMessage: sendMessage
}
