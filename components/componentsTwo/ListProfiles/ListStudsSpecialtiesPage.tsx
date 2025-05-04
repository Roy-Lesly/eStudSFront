import Table from "@/componentsTwo/Table";
import { TableRowClassName } from "@/constants";
import getApolloClient, { decodeUrlID } from "@/functions";
import { protocol, RootApi } from "@/config";
import Link from "next/link";
import TabsStudents from "../TabsProfiles/TabsStudents";
import { AllUserProfilesResponse, EdgeUserProfile } from "@/Domain/schemas/interfaceGraphql";
import { gql } from "@apollo/client";


const columns = [
  {
    header: "No",
    accessor: "",
    className: "hidden md:table-cell md:w-1/12",
  },
  {
    header: "Class",
    accessor: "specialty__main_specialty__specialty_name",
    className: "md:table-cell w-9/12 md:w-5/12",
  },
  {
    header: "Year",
    accessor: "specialty__academic_year",
    className: "hidden md:table-cell w-1/12 md:w-3/12",
  },
  {
    header: "Level",
    accessor: "specialty__level__level",
    className: "hidden md:table-cell w-1/12 md:w-2/12",
  },
  {
    header: "Goto",
    accessor: "action",
    className: "table-cell w-3/12 md:w-1/12 text-center flex",
  },
];

const GET_ALL_USER_PROFILES = gql`
  query GetAllUserProfiles($first: Int, $userId: Decimal, $schoolId: Decimal) {
    allUserProfiles(first: $first, userId: $userId, schoolId: $schoolId) {
      edges {
        node {
          id
          user {
            id
            fullName
          }
          specialty { 
            id
            academicYear
            mainSpecialty { specialtyName }
            level { level }
          }
        }
      }
    }
  }
`;


const ListStudsSpecialtiesPage = async ({ params, data }: { params: any, data: EdgeUserProfile }) => {
  const client = getApolloClient(protocol + 'api' + params.domain + RootApi + '/graphql/');

  let apiMyProfiles;
  try {
    const result = await client.query<AllUserProfilesResponse>({
      query: GET_ALL_USER_PROFILES,
      variables: {
        first: 10,
        userId: decodeUrlID(data.node.user.id),
        schoolId: params.school_id,
      },
    });
    apiMyProfiles = result.data;
  } catch (error: any) {

    
    apiMyProfiles = null;
  }

  const renderRow = (item: EdgeUserProfile, index: number) => (
    <tr
      key={item.node.id}
      className={`${TableRowClassName.all + " " + TableRowClassName.md} text-lg`}
    >
      <td className="hidden md:table-cell">{index + 1}</td>
      <td className="md:table-cell">{item.node.specialty?.mainSpecialty?.specialtyName}</td>
      <td className="hidden md:table-cell">{item.node.specialty?.academicYear}</td>
      <td className="hidden md:table-cell">{item.node.specialty?.level?.level}</td>
      <td>
        <div className="flex gap-2 items-center justify-center">
          <Link href={`/${params.domain}/Section-H/pageAdministration/${params.school_id}/pageStudents/${item.node.id}/Info`} className="border border-bluedash px-4 py-1 rounded">Profile</Link>
        </div>
      </td>
    </tr>
  );

  return (
    <div className="bg-white flex-1 gap-2 m-2 mt-1 p-2 rounded-md">

      <TabsStudents page={2} params={params} />

      {data ? <div className="flex flex-col gap-4 md:my-10 my-4">
        <h1 className="capitalize font-semibold mb-1 text-center text-lg tracking-widest underline">SELECTED PROFILE CLASS</h1>
        <Table columns={columns} renderRow={renderRow} data={[data]} rowClassName="h-12" />
      </div> : <></>}

      {apiMyProfiles && apiMyProfiles.allUserProfiles.edges.length > 1 ? <div className="flex flex-col gap-1">
        <h1 className="capitalize font-semibold mb-1 text-center text-lg tracking-widest underline">OTHER CLASSES</h1>
        <Table columns={columns} renderRow={renderRow} data={apiMyProfiles.allUserProfiles.edges.filter((item: EdgeUserProfile) => item.node.specialty.id != data.node.specialty.id)} rowClassName="h-12" />
      </div> : <></>}
    </div>
  );
};

export default ListStudsSpecialtiesPage;
