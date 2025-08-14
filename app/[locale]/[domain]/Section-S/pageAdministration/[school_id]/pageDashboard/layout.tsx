import List from "./List";

export default function DashboardLayout({
    counts,
    main,
    graphs,
    buttom,
}: {
    counts: React.ReactNode;
    graphs: React.ReactNode;
    main: React.ReactNode;
    buttom: React.ReactNode;
}) {
    return (
        <List
            params={""}
            searchParams={""}
        >
            <div className="min-h-screen bg-blue-100 p-4 space-y-6">
                {counts}
                {main}
                {graphs}
                {/* {buttom} */}
            </div>
        </List>
    );
}
