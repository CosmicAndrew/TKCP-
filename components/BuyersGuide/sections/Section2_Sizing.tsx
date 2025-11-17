import React, { useState, useMemo } from 'react';
import { Sector, Result } from '../../../types';
import CalendarCTA from '../common/CalendarCTA';

interface SectionProps {
  sector: Sector;
  result: Result;
}

const Section2_Sizing: React.FC<SectionProps> = ({ sector }) => {
    const [distance, setDistance] = useState(50); // in feet
    const [venueWidth, setVenueWidth] = useState(60); // in feet

    const recommendations = useMemo(() => {
        // Pixel Pitch Rule of Thumb: Viewing Distance (ft) * 1 = Pixel Pitch (mm)
        // This is a more modern rule for 20/20 vision.
        const recPixelPitch = Math.max(1.5, Math.min(10, distance / 10)).toFixed(1);

        // Screen Width based on a 33-degree horizontal viewing angle (SMPTE standard for mixed use)
        const tanTheta = Math.tan((33 * Math.PI) / 180 / 2);
        let recScreenWidth = 2 * distance * tanTheta;

        // Ensure screen width is not more than 80% of venue width
        recScreenWidth = Math.min(recScreenWidth, venueWidth * 0.8);

        // Standard 16:9 aspect ratio
        const recScreenHeight = recScreenWidth * (9 / 16);

        return {
            pixelPitch: recPixelPitch,
            width: recScreenWidth.toFixed(1),
            height: recScreenHeight.toFixed(1),
        };
    }, [distance, venueWidth]);

    const diagramScale = 300 / Math.max(venueWidth, distance * 1.5); // pixels per foot
    const screenWidthPx = parseFloat(recommendations.width) * diagramScale;
    const screenHeightPx = parseFloat(recommendations.height) * diagramScale;
    const distancePx = distance * diagramScale;


    return (
        <div className="animate-fade-in-up">
            <h2 className="text-3xl font-display font-bold text-gray-800 dark:text-gray-100">2. Sizing & Placement Guide</h2>
            <p className="mt-2 text-gray-600 dark:text-gray-300">Use our interactive tool to find the perfect screen dimensions for your space.</p>

            <div className="mt-8 grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Controls & Recommendations */}
                <div className="p-6 bg-gray-50 dark:bg-gray-700/50 rounded-lg border dark:border-gray-700">
                    <h3 className="text-xl font-bold font-display text-gray-700 dark:text-gray-200">Interactive Calculator</h3>
                    
                    <div className="space-y-6 mt-4">
                        <div>
                            <label htmlFor="distance-slider" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Farthest Viewing Distance: <span className="font-bold text-church-primary dark:text-blue-300">{distance} ft</span></label>
                            <input
                                id="distance-slider"
                                type="range"
                                min="10"
                                max="150"
                                step="5"
                                value={distance}
                                onChange={(e) => setDistance(Number(e.target.value))}
                                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-church-primary dark:bg-gray-600"
                            />
                        </div>
                        <div>
                            <label htmlFor="width-slider" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Venue Width: <span className="font-bold text-church-primary dark:text-blue-300">{venueWidth} ft</span></label>
                            <input
                                id="width-slider"
                                type="range"
                                min="20"
                                max="200"
                                step="5"
                                value={venueWidth}
                                onChange={(e) => setVenueWidth(Number(e.target.value))}
                                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-church-primary dark:bg-gray-600"
                            />
                        </div>
                    </div>
                    
                    <div className="mt-8 pt-6 border-t dark:border-gray-700 text-center">
                        <h4 className="font-bold text-lg text-gray-800 dark:text-gray-100">Our Recommendation:</h4>
                        <div className="mt-4 grid grid-cols-2 gap-4">
                            <div className="bg-white dark:bg-gray-800 p-3 rounded-md shadow-inner">
                                <p className="text-sm text-gray-500 dark:text-gray-400">Screen Size (WxH)</p>
                                <p className="text-xl font-bold text-church-primary dark:text-blue-300">{recommendations.width}ft x {recommendations.height}ft</p>
                            </div>
                            <div className="bg-white dark:bg-gray-800 p-3 rounded-md shadow-inner">
                                <p className="text-sm text-gray-500 dark:text-gray-400">Optimal Pixel Pitch</p>
                                <p className="text-xl font-bold text-church-primary dark:text-blue-300">{recommendations.pixelPitch} mm</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Visual Diagram */}
                <div className="flex items-center justify-center p-4 bg-gray-100 dark:bg-gray-900/50 rounded-lg min-h-[300px]">
                    <div 
                        className="relative bg-gray-200 dark:bg-gray-700 border-2 border-gray-400 dark:border-gray-600"
                        style={{ width: `${venueWidth * diagramScale}px`, height: `${distance * 1.5 * diagramScale}px` }}
                    >
                         <div 
                            className="absolute top-0 left-1/2 -translate-x-1/2 bg-church-accent flex items-center justify-center text-xs font-bold text-black"
                            style={{ width: `${screenWidthPx}px`, height: `${screenHeightPx}px` }}
                         >
                            SCREEN
                        </div>

                        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 w-4 h-4 bg-red-500 rounded-full" title="Farthest Viewer"></div>
                        <div className="absolute left-1/2 -translate-x-1/2 border-l border-dashed border-red-500/50" style={{ bottom: '24px', height: `${distancePx}px`}}></div>
                    </div>
                </div>
            </div>

            <CalendarCTA
                headline="📐 Need a Precise On-Site Measurement?"
                buttonText="Schedule a Site Assessment"
                meetingType="planning"
            />
        </div>
    );
};

export default Section2_Sizing;