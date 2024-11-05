import React from "react";

const ActivityInfo = ({ activity }) => {
  const { name, description, location, category, tags } = activity;
  return (
    <div className="p-5">
      {/* Activity Details */}
      <h3 className="text-xl font-medium text-indigo-600">{name}</h3>
      <p className="text-gray-600 mb-2">{description}</p>
      <p className="text-sm text-gray-500">
        Location: {location} | category: {category}
      </p>
      {tags?.length > 0 && (
        <div className="text-gray-700 dark:text-gray-300 flex flex-wrap items-center space-x-2 mt-3">
          {tags.map((tag, i) => (
            <span
              key={i}
              className="bg-green-100 text-green-800 text-sm  mr-2 px-2.5 py-1.5 rounded dark:bg-blue-900 dark:text-green-300"
            >
              {tag}
            </span>
          ))}
        </div>
      )}
    </div>
  );
};

export default ActivityInfo;
