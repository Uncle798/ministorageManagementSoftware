import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient({
   log: [
     {
       emit: "event",
       level: "query",
     },
   ],
 });
 
async function createMe() {
   const dbMe = await prisma.user.create({
      data: {
         email: String(process.env.MY_EMAIL),
         givenName: 'Eric',
         familyName: 'Branson',
         companyName: String(process.env.PUBLIC_COMPANY_NAME),
         admin: true
      }
   })
   return dbMe;
}

async function main() {
   createMe();
   console.log('db seeded')
}


main().catch((error)=>{
   console.error(error);
   process.exit(1);
}).finally(()=>{
   prisma.$disconnect();
})