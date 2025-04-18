import ComingSoon from '@/ComingSoon'
import React from 'react'

const TranscriptTwoYear = ({
  type,
  params,
  data,
  setOpen,
  extra_data,
}: {
  type: "custom";
  params?: any;
  data: string;
  setOpen?: any;
  extra_data?: any;
}) => {
  return (
    <div>
      <ComingSoon />
    </div>
  )
}

export default TranscriptTwoYear