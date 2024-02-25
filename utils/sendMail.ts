import transport from "../core/mailer";
interface SendEmailProp {
  emailFrom: string;
  emailTo: string;
  subject: string;
  html: string;
}
export const sendEmail = (
  data: SendEmailProp,
  callback?: (err: Error | null) => void
) => {
  transport.verify((error) => {
    if (error) {
      console.log(error);
    } else {
      console.log("Ready to Send");
    }
  });
  const mail = {
    from: data.emailFrom,
    to: data.emailTo,
    subject: data.subject,
    html: data.html,
  };
  transport.sendMail(
    mail,
    callback ||
      function (error: Error | null): void {
        if (error) {
          console.log(error);
        } else {
          console.log(mail);
        }
      }
  );
};
