const StatsCard = ({ title, value, icon, truncate = false }) => {
  return (
    <div className="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-sm transition-shadow">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-600">{title}</p>
          <p className={`text-lg font-semibold text-gray-900 ${truncate ? 'truncate' : ''}`}>
            {value}
          </p>
        </div>
        <div className="p-2 rounded-full bg-gray-100 text-gray-600">
          {icon}
        </div>
      </div>
    </div>
  );
};

export default StatsCard;