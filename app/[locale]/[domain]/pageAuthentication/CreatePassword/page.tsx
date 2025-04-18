import CreatePasswordForm from './Form';


const page = async ({
  params,
  searchParams,
}: {
    params: { id: string | number, domain: string };
    searchParams?: { [key: string]: string | string[] | undefined };
}) => {

  return (
    <CreatePasswordForm searchParams={searchParams} params={params} />
  )
}

export default page;

