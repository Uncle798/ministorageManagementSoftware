import * as v from 'valibot'

export const loginSchema = v.object({
   email: v.pipe(v.string(), v.email()),
});
export type LoginSchema = typeof loginSchema;

export const emailFormSchema = v.pipe(
   v.object({
      email: v.pipe(v.string(), v.email()),
      confirmEmail: v.pipe(v.string(), v.email()),
   }),
   v.rawCheck(({dataset, addIssue}) =>{
      if(dataset.typed){
         if(dataset.value.email !== dataset.value.confirmEmail){
            addIssue({
               message: 'Emails must match',
               path: [{
                  type: 'object',
                  origin: 'value',
                  input: dataset.value,
                  key: 'email',
                  value: dataset.value.email
               }]
            })
         }
      }
   })
)
export type EmailFormSchema = typeof emailFormSchema;

export const registerFormSchema = v.pipe(
   v.object({
      familyName: v.pipe(v.string(), v.minLength(1), v.maxLength(255)),
      givenName: v.pipe(v.string(), v.minLength(1), v.maxLength(255)),
      companyName: v.pipe(v.string(), v.minLength(1), v.maxLength(255)),
      email: v.pipe(v.string(), v.email()),
      emailConfirm: v.pipe(v.string(), v.email())
   }),
   v.rawCheck(({dataset, addIssue}) => {
      if(dataset.typed){
         if(dataset.value.email !== dataset.value.emailConfirm){
            addIssue({
               message: 'Emails must match',
               path: [{
                  type: 'object',
                  origin: 'value',
                  input: dataset.value,
                  key: 'email', 
                  value: dataset.value.email
               }]
            })
         }
      }
   })
)
export type RegisterFormSchema = typeof registerFormSchema;

export const emailVerificationFormSchema = v.object({
   code: v.pipe(v.string(), v.minLength(8), v.maxLength(8))
});
export type EmailVerificationFormSchema = typeof emailVerificationFormSchema;

export const searchFormSchema = v.object({
   search: v.pipe(v.string(), v.minLength(1), v.maxLength(255)),
});
export type SearchFormSchema = typeof searchFormSchema;

export const cuidIdFormSchema = v.object({
   cuid2Id: v.pipe(v.string(), v.cuid2())
});
export type CuidIdFormSchema = typeof cuidIdFormSchema;

export const magicLinkFormSchema = v.object({
   email: v.pipe(v.string(), v.minLength(5))
});
export type MagicLinkFormSchema  = typeof magicLinkFormSchema;

export const dateSearchFormSchema = v.object({
   startDate: v.optional(v.date()),
   endDate: v.optional(v.date())
});
export type DateSearchFormSchema = typeof dateSearchFormSchema;

export const blankFormSchema = v.object({});
export type BlankFormSchema = typeof blankFormSchema;