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

            console.log(messages[i]);

            let id = messages[i].ID;
            let phone = messages[i].RECEIVER;
            let body = messages[i].MSG;
            let attachment = messages[i].ATCHM;

            console.log(`Sending[${i}]: ${body} with ${attachment} to ${phone}`)

            if (phone && (body || attachment)) {
            } else {
                await orcCon.updateMessageSent(id, 'E')
                    .then((res) => {
                        console.log('Invalid data. Error Status Logged');
                    });
                continue;
            }

            await whatsapp.sendMessage(phone, body, attachment)
                .then(async (res) => {
                    await orcCon.updateMessageSent(id, 'T')
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
