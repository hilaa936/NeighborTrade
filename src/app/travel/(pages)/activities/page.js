import Activities from "../../components/Activities";

const ActivitiesPage = () => {
  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-semibold text-center mb-6">
        Find the Best Activities
      </h1>
      <div className="w-auto">
        <Activities />
      </div>
    </div>
  );
};

export default ActivitiesPage;
