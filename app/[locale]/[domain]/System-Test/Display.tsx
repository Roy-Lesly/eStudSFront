'use client';

import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { CheckCircle, XCircle, ArrowLeft } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { AppReport } from '@/utils/Domain/schemas/interfaceGraphqlKPI';
import { useTranslation } from 'react-i18next';
import { EdgeSchoolIdentification } from '@/utils/Domain/schemas/interfaceGraphql';

type DataProps = {
    createdAt: string;
    totalTests: number;
    passed: number;
    apps: { [key: string]: AppReport };
};

const Display = (
    { data, p, sp, schoolIdentification }:
        { data: DataProps; p: any; sp: any, schoolIdentification: EdgeSchoolIdentification }
) => {

    const { hasHigher, hasSecondary, hasPrimary, hasVocational } = schoolIdentification?.node

    // const isOlderThan1Hour = Date.now() - new Date(data?.createdAt.replace(' ', 'T')).getTime() > 3600000;
    const isOlderThan1Hour = Date.now() - new Date(data?.createdAt.replace(' ', 'T')).getTime() > 10000;
    const router = useRouter();
    const { t } = useTranslation('common');
    const [loading, setLoading] = useState(false);

    const onChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const { value } = e.target;
        if (value.length > 2) {
            setLoading(true);
            router.push(`/${p.locale}/${p.domain}/System-Test/?section=${value}&run=true&update=true`);
        }
    };

    useEffect(() => {
        if (!sp?.run) {
            setLoading(false);
            router.push(`/${p.locale}/${p.domain}/System-Test/?section=${sp?.section}&run=false&update=false`);
        }
    }, [sp]);

    return (
        <motion.div
            className="px-2 md:px-6 py-4 md:py-6 w-full max-w-7xl mx-auto bg-blue-200 rounded-2xl shadow-lg"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
        >
            {/* Header Controls */}
            <div className="flex flex-col sm:flex-row justify-between items-center gap-2 mb-2">
                <button
                    onClick={() => router.back()}
                    className="flex items-center gap-2 text-blue-600 hover:text-blue-800 transition"
                >
                    <ArrowLeft size={20} />
                    <span className="font-semibold">{t('Back')}</span>
                </button>

                {isOlderThan1Hour && (
                    <select
                        onChange={onChange}
                        className="border border-slate-300 bg-white px-4 py-2 rounded-lg shadow-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                        <option value="">{t('Run System Tests')}</option>
                        {hasHigher ? <option value="higher">{t('Higher')}</option> : null}
                        {hasSecondary ? <option value="secondary">{t('Secondary')}</option> : null}
                        {hasPrimary ? <option value="primary">{t('Primary')}</option> : null}
                        {hasVocational ? <option value="vocational">{t('Vocational')}</option> : null}
                    </select>
                )}
            </div>

            {/* Summary Card */}
            <div className="bg-slate-100 rounded-xl p-4 mb-6 border border-slate-200">
                <h2 className="text-2xl font-bold text-slate-900 mb-4">{t('System Test Report')}</h2>
                <div className="flex flex-col gap-4 md:flex-row">
                    <div className='flex w-full gap-4'>
                        <div className='flex flex-col w-full'>
                            <p className="text-slate-900 font-semibold">{t('Total')}: {data?.totalTests}</p>
                            <p className="text-green-600 font-semibold">{t('Passed')}: {data?.passed}</p>
                            {(data?.totalTests - data?.passed) > 0 && (
                                <p className="text-red font-semibold">{t('Failed')}: {data?.totalTests - data?.passed}</p>
                            )}
                        </div>
                        <div className='flex flex-col w-full'>
                            <p className="text-slate-700">{t('Created At')}:</p>
                            <p className="text-sm font-semibold text-slate-900">{data?.createdAt.slice(0, 16)}</p>
                        </div>
                    </div>
                    {loading && (
                        <div className="flex w-full items-center gap-3 text-blue-600">
                            <div className="h-8 w-8 rounded-full border-4 border-blue-500 border-t-transparent animate-spin" />
                            <p className="font-medium">{t('System Tests Running')}...</p>
                        </div>
                    )}
                </div>
            </div>

            {/* Test App Sections */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {Object.values(data?.apps || {}).map((app: any, index: number) => (
                    <motion.div
                        key={index}
                        className="bg-white border border-slate-200 rounded-xl shadow-xl p-4"
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 * index }}
                    >
                        <h3 className="text-lg font-bold text-slate-700 mb-3">
                            {index + 1}. {app.appName.replaceAll('_', ' ').toUpperCase()}
                        </h3>

                        <div className="flex gap-3 text-sm mb-4">
                            <span className="w-full text-slate-900 font-medium">{t('Total')}: {app.total}</span>
                            <span className="w-full text-green-600 font-medium">✅ {t('Passed')}: {app.passed}</span>
                            {app.failed > 0 && (
                                <span className="w-full text-red font-medium">❌ {t('Failed')}: {app.failed}</span>
                            )}
                        </div>

                        <div className="space-y-2 max-h-[380px] overflow-y-auto pr-1 scrollbar-thin scrollbar-thumb-slate-300">
                            {app.results.map((res: any, idx: number) => (
                                <div
                                    key={idx}
                                    className={`flex items-start gap-3 px-4 py-2 rounded-md border ${res.status ? 'border-green-200 bg-green-50' : 'border-red bg-orange-40'
                                        }`}
                                >
                                    <div className="pt-1">
                                        {res.status ? (
                                            <CheckCircle className="text-green-600" size={20} />
                                        ) : (
                                            <XCircle className="text-red" size={20} />
                                        )}
                                    </div>
                                    <div>
                                        <p className="font-medium text-slate-900">
                                            {res.name}{' '}
                                            <span className="text-sm text-slate-900">({res.type})</span>
                                        </p>
                                        {!res.status && res.detail && (
                                            <p className="text-sm text-black mt-1">{res.detail}</p>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </motion.div>
                ))}
            </div>
        </motion.div>
    );
};

export default Display;
