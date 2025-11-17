import React, { useState, useMemo, useEffect, useRef } from 'react';
import { Sector, Result } from '../../../types';
import CalendarCTA from '../common/CalendarCTA';

interface SectionProps {
  sector: Sector;
  result: Result;
}

const Section2_Technology: React.FC<SectionProps> = ({ sector }) => {
    const [distance, setDistance] = useState(50); // in feet
    const [venueWidth, setVenueWidth] = useState(60); // in feet
    const containerRef = useRef<HTMLDivElement>(null);
    const [rotation, setRotation] = useState({ x: -20, y: 30 });
    const isDragging = useRef(false);
    const previousMousePosition = useRef({ x: 0, y: 0 });

    const recommendations = useMemo(() => {
        const recPixelPitch = Math.max(1.5, Math.min(10, distance / 10)).toFixed(1);
        let recScreenWidth = 2 * distance * Math.tan((33 * Math.PI) / 180 / 2);
        recScreenWidth = Math.min(recScreenWidth, venueWidth * 0.8);
        const recScreenHeight = recScreenWidth * (9 / 16);
        return {
            pixelPitch: recPixelPitch,
            width: recScreenWidth.toFixed(1),
            height: recScreenHeight.toFixed(1),
        };
    }, [distance, venueWidth]);

    const diagramScale = 300 / Math.max(venueWidth, distance * 1.5);
    const screenWidthPx = parseFloat(recommendations.width) * diagramScale;
    const screenHeightPx = parseFloat(recommendations.height) * diagramScale;
    const distancePx = distance * diagramScale;

    useEffect(() => {
        const container = containerRef.current;
        if (!container) return;
        const handleMouseDown = (e: MouseEvent) => {
            isDragging.current = true;
            previousMousePosition.current = { x: e.clientX, y: e.clientY };
            container.style.cursor = 'grabbing';
        };
        const handleMouseUp = () => { isDragging.current = false; container.style.cursor = 'grab'; };
        const handleMouseMove = (e: MouseEvent) => {
            if (!isDragging.current) return;
            const deltaX = e.clientX - previousMousePosition.current.x;
            const deltaY = e.clientY - previousMousePosition.current.y;
            setRotation(prev => ({ x: prev.x - deltaY * 0.5, y: prev.y + deltaX * 0.5 }));
            previousMousePosition.current = { x: e.clientX, y: e.clientY };
        };
        container.addEventListener('mousedown', handleMouseDown);
        window.addEventListener('mouseup', handleMouseUp);
        window.addEventListener('mousemove', handleMouseMove);
        return () => {
            container.removeEventListener('mousedown', handleMouseDown);
            window.removeEventListener('mouseup', handleMouseUp);
            window.removeEventListener('mousemove', handleMouseMove);
        };
    }, []);

    return (
        <div className="animate-fade-in-up">
            <h2 className="text-3xl font-display font-bold text-gray-800 dark:text-gray-100">2. Technology & Sizing</h2>
            <p className="mt-2 text-gray-600 dark:text-gray-300">Understand the core components and find the perfect dimensions for your space.</p>

            <div className="mt-8 grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Controls & Recommendations */}
                <div className="p-6 bg-gray-50 dark:bg-gray-700/50 rounded-lg border dark:border-gray-700">
                    <h3 className="text-xl font-bold font-display text-gray-700 dark:text-gray-200">Interactive Sizing Calculator</h3>
                    <div className="space-y-6 mt-4">
                        <div>
                            <label htmlFor="distance-slider" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Farthest Viewing Distance: <span className="font-bold text-church-primary dark:text-blue-300">{distance} ft</span></label>
                            <input id="distance-slider" type="range" min="10" max="150" step="5" value={distance} onChange={(e) => setDistance(Number(e.target.value))} className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-church-primary dark:bg-gray-600" />
                        </div>
                        <div>
                            <label htmlFor="width-slider" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Venue Width: <span className="font-bold text-church-primary dark:text-blue-300">{venueWidth} ft</span></label>
                            <input id="width-slider" type="range" min="20" max="200" step="5" value={venueWidth} onChange={(e) => setVenueWidth(Number(e.target.value))} className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-church-primary dark:bg-gray-600" />
                        </div>
                    </div>
                    <div className="mt-8 pt-6 border-t dark:border-gray-700 text-center">
                        <h4 className="font-bold text-lg text-gray-800 dark:text-gray-100">Our Recommendation:</h4>
                        <div className="mt-4 grid grid-cols-2 gap-4">
                            <div className="bg-white dark:bg-gray-800 p-3 rounded-md shadow-inner"><p className="text-sm text-gray-500 dark:text-gray-400">Screen Size (WxH)</p><p className="text-xl font-bold text-church-primary dark:text-blue-300">{recommendations.width}ft x {recommendations.height}ft</p></div>
                            <div className="bg-white dark:bg-gray-800 p-3 rounded-md shadow-inner"><p className="text-sm text-gray-500 dark:text-gray-400">Optimal Pixel Pitch</p><p className="text-xl font-bold text-church-primary dark:text-blue-300">{recommendations.pixelPitch} mm</p></div>
                        </div>
                    </div>
                </div>

                {/* Visual Diagram */}
                <div className="flex items-center justify-center p-4 bg-gray-100 dark:bg-gray-900/50 rounded-lg min-h-[300px]">
                    <div className="relative bg-gray-200 dark:bg-gray-700 border-2 border-gray-400 dark:border-gray-600" style={{ width: `${venueWidth * diagramScale}px`, height: `${distance * 1.5 * diagramScale}px` }}><div className="absolute top-0 left-1/2 -translate-x-1/2 bg-church-accent flex items-center justify-center text-xs font-bold text-black" style={{ width: `${screenWidthPx}px`, height: `${screenHeightPx}px` }}>SCREEN</div><div className="absolute bottom-4 left-1/2 -translate-x-1/2 w-4 h-4 bg-red-500 rounded-full" title="Farthest Viewer"></div><div className="absolute left-1/2 -translate-x-1/2 border-l border-dashed border-red-500/50" style={{ bottom: '24px', height: `${distancePx}px`}}></div></div>
                </div>
            </div>

            <div className="mt-8 p-6 bg-gray-50 dark:bg-gray-700/50 rounded-lg border dark:border-gray-700">
                <h3 className="text-xl font-display font-bold text-center text-gray-700 dark:text-gray-200">Interactive LED Panel Model</h3>
                <p className="text-sm text-center text-gray-600 dark:text-gray-400 mb-4">Click and drag to rotate the model.</p>
                <div ref={containerRef} className="perspective-container h-64 cursor-grab"><div className="led-cube" style={{ transform: `rotateX(${rotation.x}deg) rotateY(${rotation.y}deg)` }}><div className="led-cube-face front">TKCP</div><div className="led-cube-face back"></div><div className="led-cube-face right"></div><div className="led-cube-face left"></div><div className="led-cube-face top"></div><div className="led-cube-face bottom"></div></div></div>
                <div className="mt-4 text-gray-700 dark:text-gray-300"><p>This interactive 3D model helps visualize key concepts:</p><ul className="list-disc list-inside mt-2 space-y-1"><li><strong>Module Construction:</strong> The front face represents the individual LED modules that create the seamless image.</li><li><strong>Cabinet Depth:</strong> The side profile shows the slim design, crucial for installations with limited space.</li><li><strong>Service Access:</strong> The rear panel is where connections are made and where service access typically occurs.</li></ul></div>
            </div>

            <CalendarCTA
                headline="📐 Need a Precise On-Site Measurement?"
                buttonText="Schedule a Site Assessment"
                meetingType="planning"
            />
        </div>
    );
};

export default Section2_Technology;