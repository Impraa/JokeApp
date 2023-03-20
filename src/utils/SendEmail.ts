import nodemailer from 'nodemailer';

export const sendJoke = async function (joke:String,email:String) {
    const transporter = nodemailer.createTransport({
      service: "gmail",
      host: "smtp.gmail.com",
      auth: {
        user: 'biznisimpra@gmail.com',
        pass: 'gmzvtxwjpvvqrans',
      },
    });
  
    await transporter.sendMail({
      from: '"Joke App" <biznisimpra@gmail.com>', 
      to: `${email}`, 
      subject: "Joke App - Joke you requested", 
      text: "Here is your joke :D", 
      html: `<strong>${joke}</strong>`,
    });
  };