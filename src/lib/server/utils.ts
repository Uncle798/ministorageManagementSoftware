import dayjs from "dayjs";

export function arrayOfYears(earliestYear:number | undefined){
   if(earliestYear === undefined){
      return [];
   }
   const thisYear = new Date().getFullYear();
   const years:number[] =[];
   for(let i=earliestYear; i<=thisYear; i++){
      years.push(i);
   }
   return years;
}

export function arrayOfMonths(startMonth:Date, endMonth:Date){
   const arrayOfMonths:Date[]=[];
   const numberOfMonths = dayjs(endMonth).diff(startMonth, 'month');
   for(let i=0; i<=numberOfMonths; i++){
      arrayOfMonths.push(dayjs(startMonth).add(i, 'month').toDate())
   }
   return arrayOfMonths
}