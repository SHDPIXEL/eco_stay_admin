const Card = ({ title, value, icon }) => {
    return (
        <div className="bg-white rounded-sm shadow-sm p-6 hover:shadow-md transition-shadow duration-200">
            <div className="flex items-center justify-between">
                <div>
                    <h3 className="text-sm font-medium text-gray-500">{title}</h3>
                    <div className="mt-2 flex items-baseline">
                        <p className="text-2xl font-semibold text-gray-900">{value}</p>
                    </div>
                </div>

                <div className="p-3 bg-blue-50 rounded-lg">
                    {icon}
                </div>
            </div>
        </div>
    );
};
export default Card;