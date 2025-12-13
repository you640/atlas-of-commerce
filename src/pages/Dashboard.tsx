import { Helmet } from "react-helmet-async";
import DashboardHeader from "@/components/dashboard/DashboardHeader";
import DatabaseStats from "@/components/dashboard/DatabaseStats";
import WatchedCompanies from "@/components/dashboard/WatchedCompanies";
import UsageLimit from "@/components/dashboard/UsageLimit";
import ApiKeyManagement from "@/components/dashboard/ApiKeyManagement";
import UsageChart from "@/components/dashboard/UsageChart";
import DocumentationLinks from "@/components/dashboard/DocumentationLinks";
import UserProfile from "@/components/dashboard/UserProfile";
import MobileNav from "@/components/dashboard/MobileNav";

const Dashboard = () => {
  return (
    <>
      <Helmet>
        <title>Dashboard | IČO ATLAS</title>
        <meta name="description" content="Spravujte svoje API kľúče, sledujte využitie a monitorujte štatistiky firiem v SR." />
      </Helmet>

      <div className="min-h-screen pb-20 md:pb-6">
        <DashboardHeader />

        <main className="container max-w-4xl mx-auto px-4 py-6 space-y-6">
          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <DatabaseStats />
            <WatchedCompanies />
            <UsageLimit />
          </div>

          {/* API Management */}
          <ApiKeyManagement />

          {/* Analytics Section */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <UsageChart />
            <DocumentationLinks />
          </div>

          {/* User Profile */}
          <UserProfile />
        </main>

        <MobileNav />
      </div>
    </>
  );
};

export default Dashboard;
