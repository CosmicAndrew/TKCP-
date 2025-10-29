import React from 'react';
import { GUIDE_SECTIONS } from './index';
import { IconCheckCircle, IconCompare, IconChurch, IconDollarSign, IconChecklist, IconPrint } from '../common/Icon';

interface SidebarProps {
    activeSection: number;
    setActiveSection: (section: number) => void;
    completedSections: Set<number>;
}

const SECTION_ICONS: { [key: number]: React.ReactNode } = {
    1: <IconCompare className="w-5 h-5" />,
    2: <IconChurch className="w-5 h-5" />,
    3: <IconDollarSign className="w-5 h-5" />,
    4: <IconChecklist className="w-5 h-5" />,
    5: <IconPrint className="w-5 h-5" />,
};

const Sidebar: React.FC<SidebarProps> = ({ activeSection, setActiveSection, completedSections }) => {
    return (
        <div className="bg-white p-4 rounded-lg shadow-lg sticky top-8 print-hide">
            <h3 className="text-lg font-bold font-display text-gray-800 mb-4 px-2">Guide Sections</h3>
            <nav>
                <ul>
                    {GUIDE_SECTIONS.map(section => (
                        <li key={section.id}>
                            <button
                                onClick={() => setActiveSection(section.id)}
                                className={`w-full text-left flex items-center gap-3 p-3 my-1 rounded-md transition-colors text-sm font-semibold
                                    ${activeSection === section.id
                                        ? 'bg-church-primary/10 text-church-primary'
                                        : 'text-gray-600 hover:bg-gray-100'
                                    }`
                                }
                            >
                                <span className={activeSection === section.id ? 'text-church-primary' : 'text-gray-400'}>
                                    {SECTION_ICONS[section.id]}
                                </span>
                                <span className="flex-grow">{section.title}</span>
                                {completedSections.has(section.id) && (
                                    <IconCheckCircle className="w-5 h-5 text-green-500" />
                                )}
                            </button>
                        </li>
                    ))}
                </ul>
            </nav>
        </div>
    );
};

export default Sidebar;