import { PUBLIC_COMPANY_NAME, PUBLIC_URL } from "$env/static/public";
import { MailtrapClient } from "mailtrap";
import { MAILTRAP_TOKEN } from "$env/static/private";

const token = MAILTRAP_TOKEN;
export const mailtrap = new MailtrapClient({token})

const sender = {
   name: 'computer@ministoragemanagementsoftware.com',
   email: 'computer@ministoragemanagementsoftware.com',
}
export async function sendVerificationEmail(verificationCode:string, email:string) {
   try {
      const response = await mailtrap.send({
         from:sender,
         to: [{email}],
         subject: "Please verify your email",
         html: `Verification code: ${verificationCode}`
      }).catch((err) =>{
         console.error(err);
      })
      return response;
   } catch (error) {
      console.error(error)
      return error
   }
}

export async function sendMagicLinkEmail(magicLink:string, email:string) {
   try {  
      const response = await mailtrap.send({
         from:sender,
         to: [{email}],
         subject: `Login link from ${PUBLIC_COMPANY_NAME} `,
         html: `Please click this link or paste it into your browser \
         to log in: <a href="${PUBLIC_URL}/login/magicLink/${magicLink}">${PUBLIC_URL}/login/magicLink/${magicLink}</a>`
      }).catch((err) =>{
         console.error(err);
      })
      return response;
   } catch (error) {
      console.error(error)
      return error
   }
}

export async function sendStatusEmail(email:string, numberDemos:number) {
   try {
      const response = await mailtrap.send({
         from: sender,
         to:[{email}],
         subject: `Number of demos for ${PUBLIC_COMPANY_NAME} yesterday.`,
         html: `There were ${numberDemos} created yesterday.`
      })
      return response
   } catch (error) {
      console.error(error);
      return error
   }
}
