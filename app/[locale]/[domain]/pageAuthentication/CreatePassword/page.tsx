import CreatePasswordForm from './Form';


const page = async ({
  params,
  searchParams,
}: {
    params: any;
    searchParams?: any;
}) => {
  const p = await params;
  const sp = await searchParams;

  return (
    <CreatePasswordForm searchParams={sp} params={p} />
  )
}

export default page;

