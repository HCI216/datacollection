var nodemailer = require('nodemailer');

var transport = nodemailer.createTransport({
    host: 'smtp.126.com',
    port: 25,
    auth: {
        user: 'CoaSars@126.com',
        pass: 'Rapporter1'
    }
});

module.exports = {
    sendMail: function(receiver, content, subject, callback) {
        var mailOptions = {
            from: 'CoaSars@126.com',
            to: receiver,
            subject: subject,
            text: content
        };
        transport.sendMail(mailOptions, callback);
    },
    /*
     reprot:{
     path:xxxx
     }

     */
    sendReport: function(mailOpt, callback) {
        console.log(mailOpt.receiver);
        var mailOptions = {
            from: 'CoaSars@126.com',
            to: mailOpt.receiver,
            subject: mailOpt.subject,
            text: mailOpt.text,
            attachments: [{
                path: mailOpt.path
            }]
        };
        transport.sendMail(mailOptions, callback);
    }
};
