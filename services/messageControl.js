const orcCon = require('./orcCon');
const whatsapp = require('./whatsapp');

async function startMessageService() {

    whatsapp.initializeWhatsApp()
        .then(async (res) => {
            console.log("Have initialized WhatsApp");
            await sendMessages();
        })
        .catch((err) => {
            console.log('logging error here');
            console.error(err);
        });

}

async function sendMessages() {
    setTimeout(async () => {
        console.log('Checking for Messages');
        let messages = await orcCon.getMessagesToBeSent();
        for (let i = 0; i < messages.length; i++) {

            let phone = messages[i].RECEIVER;
            let body = messages[i].MSG;

            console.log(`Sending[${i}]: ${body} to ${phone}`)

            await whatsapp.sendMessage(phone, body)
                .then( async (res) => {
                    let id = messages[i].ID;
                    await orcCon.updateMessageSent(id)
                        .then((res) => {
                            console.log('Message Sent+Updated');
                        });
                })
                .catch((err) => {
                    console.log(err);
                })
        }
        await sendMessages();
    }, 10000);
}

module.exports = {
    startMessageService: startMessageService
}
