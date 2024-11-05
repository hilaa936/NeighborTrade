import React from "react";

const ActivityInfo = ({ activity }) => {
  const { name, description, location, category, tags } = activity;
  return (
    <div>
      {/* Activity Details */}
      <h3 className="text-xl font-medium text-indigo-600">{name}</h3>
      <p className="text-gray-600 mb-2">{description}</p>
      <p className="text-sm text-gray-500">
        Location: {location} | category: {category}
      </p>
      {tags.length > 0 && (
        <span className="text-gray-700 flex">
          tags:
          {tags.map((tag, i) => (
            <p key={i} className="">
              {tag}
            </p>
          ))}
        </span>
      )}
    </div>
  );
};

export default ActivityInfo;
