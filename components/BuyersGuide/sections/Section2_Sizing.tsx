import React, { useState, useMemo } from 'react';
import { Sector } from '../../../types';
import CallToAction from '../common/CallToAction';

interface SectionProps {
  sector: Sector;
}

const Section2_Sizing: React.FC<SectionProps> = ({ sector }) => {
    const [distance, setDistance] = useState(50);
    const [width, setWidth] = useState(40);
    const [useCase, setUseCase] = useState(sector === 'church' ? 'lyrics' : 'presentation');

    const recommendation = useMemo(() => {
        // Simplified logic for demonstration
        const diagonalInches = distance * 2.5;
        const screenWidthFt = Math.min(width * 0.6, diagonalInches * 0.072);
        const screenHeightFt = screenWidthFt / 1.77; // 16:9 aspect ratio

        let pitch = 2.9;
        if (distance < 15) pitch = 1.9;
        if (distance < 10) pitch = 1.5;
        if (distance > 80) pitch = 3.9;
        
        if (useCase === 'video') pitch = Math.max(1.9, pitch - 0.5);

        return {
            width: screenWidthFt.toFixed(1),
            height: screenHeightFt.toFixed(1),
            pitch: pitch.toFixed(1),
        };
    }, [distance, width, useCase]);

    return (
        <div className="animate-fade-in-up">
            <h2 className="text-3xl font-display font-bold text-gray-800">2. Sizing & Configuration</h2>
            <p className="mt-2 text-gray-600">Use our calculator to determine the ideal screen dimensions and resolution for your space.</p>

            <div className="mt-8 flex flex-col md:flex-row gap-8">
                <div className="md:w-1/2 space-y-6">
                    <div>
                        <label htmlFor="distance" className="block text-sm font-medium text-gray-700">Furthest Viewing Distance (in feet)</label>
                        <input id="distance" type="number" value={distance} onChange={e => setDistance(Number(e.target.value))} className="mt-1 w-full p-2 border border-gray-300 rounded-md"/>
                    </div>
                     <div>
                        <label htmlFor="width" className="block text-sm font-medium text-gray-700">Venue Width (in feet)</label>
                        <input id="width" type="number" value={width} onChange={e => setWidth(Number(e.target.value))} className="mt-1 w-full p-2 border border-gray-300 rounded-md"/>
                    </div>
                    <div>
                        <label htmlFor="use-case" className="block text-sm font-medium text-gray-700">Primary Use Case</label>
                        <select id="use-case" value={useCase} onChange={e => setUseCase(e.target.value)} className="mt-1 w-full p-2 border border-gray-300 rounded-md">
                            {sector === 'church' ? (
                                <>
                                    <option value="lyrics">Sermon Notes & Lyrics</option>
                                    <option value="video">IMAG & Live Video</option>
                                    <option value="broadcast">Broadcast / Livestream</option>
                                </>
                            ) : (
                                 <>
                                    <option value="presentation">Presentations & Data</option>
                                    <option value="event-visuals">Live Event Visuals</option>
                                    <option value="digital-signage">Digital Signage</option>
                                </>
                            )}
                        </select>
                    </div>
                </div>
                <div className="md:w-1/2 p-6 bg-church-primary/5 rounded-lg border border-church-primary/20 flex flex-col justify-center items-center text-center">
                    <h3 className="text-xl font-bold font-display text-church-primary">Your Recommendation</h3>
                    <div className="mt-4 space-y-4">
                        <div>
                            <p className="text-sm text-gray-500 uppercase">Screen Size</p>
                            <p className="text-4xl font-bold text-gray-800">{recommendation.width}' <span className="text-2xl">x</span> {recommendation.height}'</p>
                        </div>
                        <div>
                            <p className="text-sm text-gray-500 uppercase">Pixel Pitch</p>
                            <p className="text-4xl font-bold text-gray-800">{recommendation.pitch}mm</p>
                        </div>
                    </div>
                     <p className="mt-4 text-xs text-gray-500">This is a starting point. A site assessment will confirm the perfect fit.</p>
                </div>
            </div>

            <CallToAction
                headline="Ready for a Perfect Fit?"
                subtext="Our experts provide free site assessments to guarantee flawless integration."
                buttonText="Request a Free Site Assessment"
                onClick={() => console.log('CTA Clicked: Site Assessment')}
            />
        </div>
    );
};

export default Section2_Sizing;
