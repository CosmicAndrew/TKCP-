
import React from 'react';
import { Sector } from '../../types';

interface ProgressBarProps {
    progress: number;
    sector: Sector;
}

const ProgressBar: React.FC<ProgressBarProps> = ({ progress, sector }) => {
    const bgColor = sector === Sector.Church ? 'bg-church-accent' : 'bg-hospitality-accent';

    return (
        <div>
            <div className="relative pt-1">
                <div className="flex mb-2 items-center justify-between">
                    <div>
                        <span className="text-xs font-semibold inline-block py-1 px-2 uppercase rounded-full text-white bg-gray-600">
                            Progress
                        </span>
                    </div>
                    <div className="text-right">
                        <span className={`text-xs font-semibold inline-block ${sector === Sector.Church ? 'text-church-primary' : 'text-hospitality-primary'}`}>
                            {progress}%
                        </span>
                    </div>
                </div>
                <div className="overflow-hidden h-2 mb-4 text-xs flex rounded bg-gray-200">
                    <div
                        style={{ width: `${progress}%` }}
                        className={`shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center ${bgColor} transition-all duration-500`}
                    ></div>
                </div>
            </div>
        </div>
    );
};

export default ProgressBar;
