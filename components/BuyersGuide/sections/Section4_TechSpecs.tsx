import React, { useState, useEffect, useRef } from 'react';
import { Sector, Result } from '../../../types';
import CalendarCTA from '../common/CalendarCTA';

interface SectionProps {
  sector: Sector;
  result: Result;
}

const Section4_TechSpecs: React.FC<SectionProps> = ({ sector }) => {
    const containerRef = useRef<HTMLDivElement>(null);
    const [rotation, setRotation] = useState({ x: -20, y: 30 });
    const isDragging = useRef(false);
    const previousMousePosition = useRef({ x: 0, y: 0 });

    useEffect(() => {
        const container = containerRef.current;
        if (!container) return;

        const handleMouseDown = (e: MouseEvent) => {
            isDragging.current = true;
            previousMousePosition.current = { x: e.clientX, y: e.clientY };
            container.style.cursor = 'grabbing';
        };

        const handleMouseUp = () => {
            isDragging.current = false;
            container.style.cursor = 'grab';
        };

        const handleMouseMove = (e: MouseEvent) => {
            if (!isDragging.current) return;
            
            const deltaX = e.clientX - previousMousePosition.current.x;
            const deltaY = e.clientY - previousMousePosition.current.y;

            setRotation(prev => ({
                x: prev.x - deltaY * 0.5,
                y: prev.y + deltaX * 0.5
            }));
            
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
            <h2 className="text-3xl font-display font-bold text-gray-800 dark:text-gray-100">4. Technical Specifications</h2>
            <p className="mt-2 text-gray-600 dark:text-gray-300">Get a hands-on look at the technology behind your potential new LED wall.</p>

            <div className="mt-8 p-6 bg-gray-50 dark:bg-gray-700/50 rounded-lg border dark:border-gray-700">
                <h3 className="text-xl font-display font-bold text-center text-gray-700 dark:text-gray-200">Interactive LED Panel Model</h3>
                <p className="text-sm text-center text-gray-600 dark:text-gray-400 mb-4">Click and drag to rotate the model.</p>
                
                <div ref={containerRef} className="perspective-container">
                    <div className="led-cube" style={{ transform: `rotateX(${rotation.x}deg) rotateY(${rotation.y}deg)` }}>
                        <div className="led-cube-face front">TKCP</div>
                        <div className="led-cube-face back"></div>
                        <div className="led-cube-face right"></div>
                        <div className="led-cube-face left"></div>
                        <div className="led-cube-face top"></div>
                        <div className="led-cube-face bottom"></div>
                    </div>
                </div>

                <div className="mt-4 text-gray-700 dark:text-gray-300">
                    <p>This interactive 3D model allows you to inspect the construction of a typical LED cabinet. This helps visualize key concepts like:</p>
                    <ul className="list-disc list-inside mt-2 space-y-1">
                        <li><strong>Module Construction:</strong> The front face represents the individual LED modules that create the seamless image.</li>
                        <li><strong>Cabinet Depth:</strong> The side profile shows the slim design, crucial for installations with limited space.</li>
                        <li><strong>Service Access:</strong> The rear panel is where connections are made and where service access typically occurs.</li>
                    </ul>
                </div>
            </div>

            <CalendarCTA
                headline="⚙️ Dive Deeper into the Tech"
                buttonText="Book a Technical Deep-Dive"
                meetingType="planning"
            />
        </div>
    );
};

export default Section4_TechSpecs;