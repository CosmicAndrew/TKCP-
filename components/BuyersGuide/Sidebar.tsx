import React from 'react';
import { GUIDE_SECTIONS } from './index';
import { IconCheckCircle, IconCompare, IconChurch, IconDollarSign, IconChecklist, IconPrint, IconSearch, IconShare } from '../common/Icon';

interface SidebarProps {
    activeSection: number;
    setActiveSection: (section: number) => void;
    completedSections: Set<number>;
}

const SECTION_ICONS: { [key: number]: React.ReactNode } = {
    1: <IconCompare className="w-5 h-5" />,
    2: <IconSearch className="w-5 h-5" />,
    3: <IconChurch className="w-5 h-5" />,
    4: <IconDollarSign className="w-5 h-5" />,
    5: <IconChecklist className="w-5 h-5" />,
    6: <IconPrint className="w-5 h-5" />,
};

const Sidebar: React.FC<SidebarProps> = ({ activeSection, setActiveSection, completedSections }) => {
    
    const handleShare = async () => {
        const shareData = {
            title: 'TKCP Interactive LED Buyer\'s Guide',
            text: 'I\'m exploring LED solutions and found this interactive Buyer\'s Guide from TKCP. It\'s full of great info!',
            url: window.location.origin,
        };
        try {
            if (navigator.share) {
                await navigator.share(shareData);
            } else {
                const subject = encodeURIComponent(shareData.title);
                const body = encodeURIComponent(`${shareData.text}\n\n${shareData.url}`);
                window.location.href = `mailto:?subject=${subject}&body=${body}`;
            }
        } catch (err) {
            console.error('Error sharing:', err);
        }
    };
    
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
                                    <IconCheckCircle className="w-5 h-5 text-green-500 animate-bounce-in" />
                                )}
                            </button>
                        </li>
                    ))}
                </ul>
            </nav>
            <div className="mt-4 border-t pt-4 px-2">
                <button
                    onClick={handleShare}
                    className="w-full flex items-center justify-center gap-2 text-sm font-semibold p-2 rounded-md bg-gray-100 text-gray-700 hover:bg-gray-200 transition-colors"
                >
                    <IconShare className="w-4 h-4" />
                    <span>Share This Guide</span>
                </button>
            </div>
        </div>
    );
};

export default Sidebar;