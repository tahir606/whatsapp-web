const orcCon = require('./orcCon');
const whatsapp = require('./whatsapp');

async function startMessageService() {

    whatsapp.initializeWhatsApp()
        .then(async (res) => {
            console.log("Have initialized WhatsApp");
            let messages = await orcCon.getMessagesToBeSent();
            for (let i = 0; i < messages.length; i++) {

                let phone = messages[i].RECEIVER;
                let body = messages[i].MSG;

                console.log('Sending Message ' + i);
                console.log(`Phone: ${phone}`);
                console.log(`Message: ${body}`);

                whatsapp.sendMessage(phone, body)
                    .then((res) => {
                        console.log('Message Sent');
                    })
                    .catch((err) => {
                        console.log(err);
                    })
            }
        })
        .catch((err) => {
            console.log('logging error here');
            console.error(err);
        })
}

module.exports = {
    startMessageService: startMessageService
}
