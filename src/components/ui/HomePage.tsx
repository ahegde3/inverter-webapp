import CustomerListComponent from "./CustomerListComponent";
import Dashboard from "./Dashboard";

const HomePage = () => {
  return (
    <div className="p-5 flex ">
      <CustomerListComponent />
      <Dashboard />
    </div>
  );
};

export default HomePage;
