import { protocol } from '@/config'
import { EdgeSchoolHigherInfo } from '@/Domain/schemas/interfaceGraphql'
import { GetSchoolInfoUrl } from '@/Domain/Utils-H/appControl/appConfig'
import { GetSchoolInfoInter } from '@/Domain/Utils-H/appControl/appInter'
import { decodeUrlID, getData } from '@/functions'
import { gql, useQuery } from '@apollo/client'
import { useParams } from 'next/navigation'
import React, { useEffect, useState } from 'react'


const GET_DATA = gql`
  query GetAllData {
    allSchoolInfos {
      edges {
        node {
          id
          campus
          address region schoolName
        }
      }
    }
  }
`;


const CampusInfo = () => {

  const domain = useParams().domain;
  const [count, setCount] = useState(0)
  const [schoolInfo, setSchoolInfo] = useState<EdgeSchoolHigherInfo>()

  const { data, loading, error } = useQuery(GET_DATA);

  useEffect(() => {
    const school = localStorage.getItem("school");
    if (count == 0 && school && !loading && data?.allSchoolInfos?.edges?.length) {
      setSchoolInfo(data?.allSchoolInfos?.edges.filter((item: EdgeSchoolHigherInfo) => decodeUrlID(item.node.id) === school)[0])
      setCount(1)
    }
  }, [count, domain, data])

  return (
    <div>
      {schoolInfo && <div className='tracking-widest'>
        <span className='dark:text-white flex font-semibold text-slate-800 text-xl'>{schoolInfo.node.schoolName}</span>
        <span className='flex font-medium gap-4 space-x-10'>{schoolInfo.node.campus.replace("_", "-")}, {schoolInfo.node.address}, {schoolInfo.node.region} </span>
      </div>}
    </div>
  )
}

export default CampusInfo