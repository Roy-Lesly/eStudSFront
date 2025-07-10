import { MonthList } from '@/constants';
import { EdgeSpecialty } from '@/Domain/schemas/interfaceGraphql';
import { decodeUrlID } from '@/functions';
import { gql, useQuery } from '@apollo/client';
import React, { useState } from 'react'

const ModalSelect = (
  { params, selectedData, setSelectedData, setPage, onClose }
    :
    { params: any, selectedData: { specialty: EdgeSpecialty, year: number, month: number }, setSelectedData: any, setPage: any, onClose: any }
) => {

  const [selectedYear, setSelectedYear] = useState<string>();
  const [selectedMonth, setSelectedMonth] = useState<string>();
  const [selectedDay, setSelectedDay] = useState<number>();
  const [months, setMonths] = useState<{ id: number; value: string; }[] | null>(null);
  const [days, setDays] = useState<number[] | null>(null);

  const variables = {
    schoolId: parseInt(params.school_id),
    specialtyId: parseInt(decodeUrlID(selectedData.specialty.node.id)),
  }

  const { loading, error, data } = useQuery(GET_ACAD_YEARS, { variables });

  if (loading) return <div className='flex w-full justify-center items-center'>
    <div className="animate-spin border-4 border-primary border-solid border-t-transparent h-10 rounded-full w-10"></div>
  </div>;
  if (error) return <p>Error: {error.message}</p>;

  const onSelectYear = (year: string) => {
    setSelectedYear(year);
    const thisAcadYear = data?.allAcademicYears[0].split("/")
    let m: { id: number; value: string; }[] | null = []
    if (year === thisAcadYear[0]) { m = MonthList.slice(8, 12) }
    if (year === thisAcadYear[1]) { m = MonthList.slice(0, 8) }
    if (year === "") { m = null }
    setMonths(m)
  }

  const onSelectMonth = (month: string) => {
    setSelectedMonth(month)
    const monthIndex = new Date(`${month} 1, ${parseInt(selectedYear || "")}`).getMonth(); // Convert month name to index
    const daysInMonth = new Date(parseInt(selectedYear || ""), monthIndex + 1, 0).getDate(); // Get last day of the month
    setDays(Array.from({ length: daysInMonth }, (_, i) => i + 1));
  }

   const onSelectDay = async (day: string) => {
      if (!selectedYear || !selectedMonth) return;
      setSelectedDay(parseInt(day));
   }
  

  const onNext = () => {
    if (selectedYear && selectedMonth) {
      setSelectedData({ 
        ...selectedData, 
        year: parseInt(selectedYear), 
        month: parseInt(selectedMonth),
        day: parseInt(selectedDay?.toString() || ""),
      });
      setPage(2);
      onClose();
    }
  }

  return (
    <div className="flex items-center justify-center bg-gray-200">
      <div className="p-6 bg-white rounded-lg shadow-lg max-w-md mx-auto">
        <h2 className="text-2xl font-semibold text-center text-gray-800 mb-4">
          TimeTable Creation Process
        </h2>

        {!loading ? <div className='flex gap-4 items-center justify-center flex-col text-lg font-medium text-black'>

          <select
            defaultValue={selectedYear}
            onChange={(e) => { onSelectYear(e.target.value) }}
            className='py-1 px-2 border rounded w-40'
          >
            <option key={0} value={""}>-------</option>
            {data?.allAcademicYears[0].split("/")?.map((item: string) => <option key={item} value={item}>{item}</option>)}
          </select>

          {months ? <select
            defaultValue={selectedMonth}
            onChange={(e) => onSelectMonth(e.target.value)}
            className='py-1 px-2 border rounded w-40'
          >
            <option key={1} value={""}>-------</option>
            {months?.map((item: { id: number; value: string; }) => <option key={item.id} value={item.id}>{item.value}</option>)}
          </select> : null}

          {days ? <select
            onChange={(e) => onSelectDay(e.target.value)}
            className='py-1 px-2 border rounded w-40'
          >
            <option key={1} value={""}>-------</option>
            {days?.map((item: number) => <option key={item} value={item}>{item}</option>)}
          </select> : null}


          {selectedDay ? <button
            className="w-full px-6 mt-4 py-2 bg-red text-white font-bold tracking-widest rounded-lg shadow-md hover:bg-red transition duration-300"
            onClick={() => onNext()}
          >
            Next
          </button> : null}
        </div>
          :
          <div className='flex w-full justify-center items-center'>
            <div className="animate-spin border-4 border-primary border-solid border-t-transparent h-10 rounded-full w-10"></div>
          </div>
        }


      </div>
    </div>
  );
}

export default ModalSelect


const GET_ACAD_YEARS = gql`
  query GetYears{
    allAcademicYears
  }
`;

