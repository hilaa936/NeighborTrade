import React from "react";
import Activities from "../../components/activities/Activities";
import UserActivities from "../../components/activities/UserActivities";
import ActivitiesAI from "../../components/activities/ActivitiesAI";
import PageTitle from "@/components/layout/PageTitle";

const ActivitiesPage = () => {
  return (
    <div className="container mx-auto p-6">
      {/* AI activities */}
      {/* <h1 className="text-3xl font-semibold text-center mb-6">
        Find the Best Activities
      </h1>
      <div className="w-auto">
        <ActivitiesAI />
      </div> */}
      {/* activities DB */}
      <div>
        <PageTitle title="Travel Activities" />
        {/* <CreateActivityModal /> */}
        <Activities />
        <UserActivities />
      </div>
    </div>
  );
};

export default ActivitiesPage;
