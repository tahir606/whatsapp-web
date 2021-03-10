const qrcode = require('qrcode-terminal');

const { Client } = require('whatsapp-web.js');
const client = new Client();

const { MessageMedia } = require('whatsapp-web.js');


client.on('qr', qr => {
    qrcode.generate(qr, {small: true});
});

client.on('ready', () => {
    console.log('Client is ready!');	
	
	const number = "+923332132778";
	
	const text = "Hey There!";
	
	// Getting chatId from the number.
	// we have to delete "+" from the beginning and add "@c.us" at the end of the number.
	const chatId = number.substring(1) + "@c.us";

	const media = MessageMedia.fromFilePath('./attch.pdf');	
	
	// Sending message.
	client.sendMessage(chatId, media);

});

client.initialize();