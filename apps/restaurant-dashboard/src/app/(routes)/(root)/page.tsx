import DashboardData from "../../../shared/screen/dashboard/dashboard.data";
import DashboardOverview from "../../../shared/screen/dashboard/dashboard.overview";

const Page = () => {
  return (
    <div className="w-full h-screen flex flex-col justify-center">
      <DashboardOverview />
      <DashboardData />
    </div>
  );
};

export default Page;
