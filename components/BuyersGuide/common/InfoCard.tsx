import React from 'react';

interface InfoCardProps {
    icon: React.ReactNode;
    title: string;
    value: string;
    description: string;
    color: 'blue' | 'yellow';
}

const InfoCard: React.FC<InfoCardProps> = ({ icon, title, value, description, color }) => {
    const colorClasses = {
        blue: {
            bg: 'bg-blue-50',
            border: 'border-blue-200',
            icon: 'text-church-primary',
            value: 'text-church-primary',
        },
        yellow: {
            bg: 'bg-yellow-50',
            border: 'border-yellow-300',
            icon: 'text-church-accent',
            value: 'text-church-accent',
        }
    };
    const selectedColor = colorClasses[color];

    return (
        <div className={`p-4 rounded-lg border ${selectedColor.bg} ${selectedColor.border}`}>
            <div className="flex items-center gap-4">
                <div className={`flex-shrink-0 text-3xl ${selectedColor.icon}`}>
                    {icon}
                </div>
                <div>
                    <p className="font-semibold text-gray-600">{title}</p>
                    <p className={`text-3xl font-bold ${selectedColor.value}`}>{value}</p>
                </div>
            </div>
            <p className="mt-3 text-sm text-gray-500">{description}</p>
        </div>
    );
};

export default InfoCard;
