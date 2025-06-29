import { decodeUrlID, getAcademicYear } from '@/functions';
import React, { useEffect, useState } from 'react';
import Select from 'react-select';
import { useRouter } from 'next/navigation';
import { useApolloClient, gql } from '@apollo/client';
import { useTranslation } from 'react-i18next';
import { errorLog } from '@/utils/graphql/GetAppolloClient';
import { EdgeSpecialty } from '@/utils/Domain/schemas/interfaceGraphql';
import MyButtonLoading from '@/components/section-h/common/MyButtons/MyButtonLoading';


const SelectSpecialty = ({ params, apiData }: {
    params: any,
    apiData: {
        allAcademicYears: string[],
        allLevels: any,
        allDomains: any
    }
}) => {
    const router = useRouter();
    const { t } = useTranslation('common');
    const client = useApolloClient();

    const [submitting, setSubmitting] = useState(false);
    const [formData, setFormData] = useState({
        domainId: 0,
        academicYear: getAcademicYear(),
        level: 0,
        semester: null,
        specialtyId: 0,
    });

    const [specialtyData, setSpecialtyData] = useState<EdgeSpecialty[]>([]);

    useEffect(() => {
        const fetchSpecialties = async () => {
            try {
                const { data } = await client.query({
                    query: GET_SPECIALTIES,
                    variables: {
                        schoolId: params.school_id,
                        domainId: formData.domainId,
                        academicYear: formData.academicYear,
                        level: formData.level,
                    },
                });
                setSpecialtyData(data.allSpecialties.edges);
            } catch (error: any) {
                errorLog(error);
            }
        };

        if (formData.domainId && formData.level && formData.academicYear) {
            fetchSpecialties();
        }
    }, [formData.domainId, formData.level, formData.academicYear, formData.semester]);

    const handleChange = (selected: any, field: string) => {
        setFormData(prev => ({ ...prev, [field]: selected?.value || 0 }));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setSubmitting(true)
        const { specialtyId, semester } = formData;
        if (specialtyId && semester) {
            router.push(`/${params.domain}/Section-H/pageAdministration/${params.school_id}/pageBatchOperation/pageCourseAssignment/Actions?specialty_id=${specialtyId}&semester=${semester}`);
        }
    };

    const createOptions = (items: any[], labelFn: (item: any) => string, valueFn: (item: any) => any) =>
        items.map(item => ({ value: valueFn(item), label: labelFn(item) }));

    return (
        <form onSubmit={handleSubmit} className="space-y-6 text-slate-800 text-xl p-6 md:p-10 bg-white rounded-2xl shadow-md w-full max-w-2xl mx-auto">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">{t('Select Specialty')}</h2>

            <Select
                name="domainId"
                options={createOptions(apiData?.allDomains?.edges || [], d => d.node.domainName, d => decodeUrlID(d.node.id))}
                onChange={(e) => handleChange(e, 'domainId')}
                placeholder={t('Select Domain')}
                classNamePrefix="select"
            />

            <Select
                name="academicYear"
                options={createOptions(apiData?.allAcademicYears || [], y => y, y => y)}
                onChange={(e) => handleChange(e, 'academicYear')}
                placeholder={t('Select Academic Year')}
                classNamePrefix="select"
            />

            <Select
                name="level"
                options={createOptions(apiData?.allLevels?.edges || [], l => l.node.level, l => l.node.level)}
                onChange={(e) => handleChange(e, 'level')}
                placeholder={t('Select Level')}
                classNamePrefix="select"
            />

            <Select
                name="semester"
                options={createOptions(['I', 'II'], s => s, s => s)}
                onChange={(e) => handleChange(e, 'semester')}
                placeholder={t('Select Semester')}
                classNamePrefix="select"
            />

            {specialtyData?.length ? <Select
                name="specialtyId"
                options={createOptions(specialtyData, s => `${s.node.mainSpecialty.specialtyName} - ${s.node.level.level}`, s => decodeUrlID(s.node.id))}
                onChange={(e) => handleChange(e, 'specialtyId')}
                placeholder={t('Select Specialty')}
                classNamePrefix="select"
            /> : null}

            {!submitting ? formData?.specialtyId ? <button
                type="submit"
                className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-xl transition-all"
            >
                {t('Proceed')}
            </button> 
            : 
            null 
            : <MyButtonLoading title={t("Loading Courses") + " ..."} />}
        </form>
    );
};

export default SelectSpecialty;



const GET_SPECIALTIES = gql`
  query GetData(
    $schoolId: Decimal!
    $domainId: Decimal!
    $academicYear: String!
    $level: Decimal
  ) {
    allSpecialties(
      schoolId: $schoolId
      domainId: $domainId
      academicYear: $academicYear
      level: $level
    ) {
      edges {
        node {
          id
          academicYear
          level { level }
          mainSpecialty { specialtyName }
        }
      }
    }
  }
`;
