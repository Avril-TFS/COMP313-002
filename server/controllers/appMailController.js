const nodemailer = require("nodemailer");

const options = {
    host: 'smtp.ethereal.email',
    port: 587,
    auth: {
        user: 'cassandre22@ethereal.email',
        pass: 'mxtkwDXJFsKXkhQ5U9'
    }
};

// const mail = {
//   from: '"Maddison Foo " <maddison53@ethereal.email>',
//   to: "yuko@test.com",
//   subject: "DUE SOON",
//   text: "Due date is approaching",
//   html: "<h1>DUE DATE IS NEAR</h1>",
// };


// exports.sendEmail = async (req, res) => {
//     try {
//       const transport = nodemailer.createTransport(options);
//       const result = await transport.sendMail(mail);
//       console.log('+++ Sent +++');
//       console.log(result);
//       res.status(200).send("Email sent successfully");
//     } catch (err) {
//       console.error('--- Error ---');
//       console.error(err);
//       res.status(500).send("Error sending email");
//     }
   
//   };

exports.sendEmail = async (req, res) => {
  try {
  
    const { closestAssignment, diffDays ,userEmail} = req.body;
    console.log('req.body: ', req.body);
    const mail = {
      from: '"Maddison Foo " <maddison53@ethereal.email>',
      // to: "yuko@test.com",
      to: userEmail.toString(),
      subject: "DUE SOON",
      text: `Closest assignment: ${closestAssignment.name}\n${diffDays} day(s) left`,
      html: `<h1>Closest assignment: ${closestAssignment.name}</h1><p>${diffDays} day(s) left</p>`
    };
    
    const transport = nodemailer.createTransport(options);
    const result = await transport.sendMail(mail);
    console.log('+++ Sent +++');
    //console.log(result);
    res.status(200).send("Email sent successfully");
  } catch (err) {
    console.error('--- Error ---');
    console.error(err);
    res.status(500).send("Error sending email");
  }
};