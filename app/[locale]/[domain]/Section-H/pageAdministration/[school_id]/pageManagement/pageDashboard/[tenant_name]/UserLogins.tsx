import React, { useMemo } from 'react';
import { Bar } from "react-chartjs-2";
import { motion } from "framer-motion";
import { gql, useQuery } from '@apollo/client';
import dayjs from 'dayjs';
import { useParams, useSearchParams } from 'next/navigation';
import { decodeUrlID } from '@/functions';

const UserLogins = ({ period, date }: { period: "today" | "week" | "month" | "6 months", date?: string, }) => {
    const sp = useSearchParams();

    const variables = useMemo(() => {
        const today = date || dayjs().format("YYYY-MM-DD");
        const last7Days = date || dayjs().subtract(7, "days").format("YYYY-MM-DD");
        const last30Days = date || dayjs().subtract(30, "days").format("YYYY-MM-DD");
        const last180Days = date || dayjs().subtract(181, "days").format("YYYY-MM-DD");

        switch (period) {
            case "today":
                return { date: today };
            case "week":
                return { dateAfter: last7Days };
            case "month":
                return { dateAfter: last30Days };
            case "6 months":
                return { dateAfter: last180Days };
            default:
                return {};
        }
    }, [period]);

    // Fetch data with Apollo Client
    const { data, loading, error } = useQuery(
        GET_LOGIN_DATA, { 
            variables: {
                ...variables, 
                tenant_id: parseInt(decodeUrlID(sp?.get("id") || "")),
            }
        });

    if (loading) return <p>Loading...</p>;
    if (error) return <p>Error: {error.message}</p>;
    console.log(data)

    const loginDataGeneral = data?.allLoginGenerals?.edges || [];

    let labels: string[] = [];
    let dataValues: number[] = [];

    if (period === "today") {
        // Initialize array with 24 hours
        const hourlyLogins: Record<string, number> = {};
        loginDataGeneral.forEach(({ node }: any) => {
            if (node?.countHour) {
                const countHourData = JSON.parse(node.countHour);
                Object.keys(countHourData).forEach((hour) => {
                    hourlyLogins[hour] = (hourlyLogins[hour] || 0) + countHourData[hour];
                });
            }
        });

        labels = Array.from({ length: 24 }, (_, i) => `${i}:00`);
        dataValues = labels.map(hour => hourlyLogins[hour.replace(":00", "")] || 0);

    } else if (period === "week" || period === "month") {
        // Initialize days of the month or last 7 days
        const dailyLogins: Record<string, number> = {};
        const queryDate = dayjs(date) || dayjs()
        const thisMonthDays = queryDate.daysInMonth()

        loginDataGeneral.forEach(({ node }: any) => {
            const day = dayjs(node.date).format("D");
            dailyLogins[day] = (dailyLogins[day] || 0) + node.totalLogins;
        });
        console.log(thisMonthDays)
        const totalDays = period === "week" ? 7 : thisMonthDays
        labels = Array.from({ length: totalDays }, (_, i) =>
            (dayjs(date) || dayjs()).subtract(totalDays - 1 - i, "day").format("D") // Format as day number
        );
        dataValues = labels.map(day => dailyLogins[day] || 0);

    } else if (period === "6 months") {
        const monthlyLogins: Record<string, number> = {};
        loginDataGeneral.forEach(({ node }: any) => {
            const month = dayjs(node.date).format("YYYY-MM");
            monthlyLogins[month] = (monthlyLogins[month] || 0) + node.totalLogins;
        });
        labels = Array.from({ length: 6 }, (_, i) =>
            dayjs().subtract(i, "month").format("YYYY-MM")
        ).reverse();

        const displayLabels = labels.map(month => dayjs(month, "YYYY-MM").format("MMMM"));

        dataValues = labels.map(month => monthlyLogins[month] || 0);

        labels = displayLabels;
    }

    const chartData = {
        labels,
        datasets: [
            {
                label: "User Logins",
                data: dataValues,
                backgroundColor: "#3c82f6",
            },
        ],
    };

    return (
        <div>
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5 }}
                className="p-4 bg-white shadow-md rounded-lg"
            >
                <h2 className="text-xl font-semibold mb-4">User Login Statistics</h2>
                <Bar data={chartData} />
            </motion.div>
        </div>
    );
}

export default UserLogins;



const GET_LOGIN_DATA = gql`
    query GetLoginData(
        $date: Date, 
        $dateAfter: Date, 
        $dateMonth: Decimal,
        $tenant_id: ID
    ) {
    allLoginGenerals(
        date: $date, 
        dateAfter: $dateAfter, 
        dateMonth: $dateMonth
    ) {
        edges {
            node {
                id
                date
                countHour
                totalLogins
            }
        }
    }
    allTenants(
        id: $tenant_id
    ) {
        edges {
            node {
                id 
                user { matricle} 
                schemaName 
                schoolName 
                schoolType 
                isActive 
                description
                domains { 
                    edges {
                        node { domain }
                    }
                }
            }
        }
    }
  }
`;
