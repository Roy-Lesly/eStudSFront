export interface DashUserCardInter {
  id: number,
  type: string,
  count: number
  date: string
  icon: string
}


interface ItemInter { count: number, total_amount: number }
export interface DashFinanceChardInter {
  month: string,
  registration: ItemInter
  tuition: ItemInter
  expenses?: ItemInter
}


// export interface DashProfileSexChartInter {
//   male: number,
//   female: number
// }


export interface DashSpecialtyAndLevelCountStatisticsChartInter {
  specialty_name: string,
  "100": number,
  "200"?: number,
  "300"?: number,
  "400"?: number
  "500"?: number
}