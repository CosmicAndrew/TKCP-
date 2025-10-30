import React from 'react';
import { GUIDE_SECTIONS } from './index';
import { IconCheckCircle, IconCompare, IconChurch, IconChecklist, IconPrint, IconSearch, IconShare, IconQuestionMarkCircle, IconCog } from '../common/Icon';

interface SidebarProps {
    activeSection: number;
    setActiveSection: (section: number) => void;
    completedSections: Set<number>;
}

const SECTION_ICONS: { [key: number]: React.ReactNode } = {
    1: <IconCompare className="w-5 h-5" />,
    2: <IconSearch className="w-5 h-5" />,
    3: <IconChurch className="w-5 h-5" />,
    4: <IconCog className="w-5 h-5" />,
    5: <IconChecklist className="w-5 h-5" />,
    6: <IconQuestionMarkCircle className="w-5 h-5" />,
    7: <IconPrint className="w-5 h-5" />,
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
        <div className="hidden md:block bg-white dark:bg-gray-800 p-4 rounded-lg shadow-lg md:sticky md:top-8 print-hide">
            <h3 className="text-lg font-bold font-display text-gray-800 dark:text-gray-100 mb-4 px-2">Guide Sections</h3>
            <nav>
                <ul>
                    {GUIDE_SECTIONS.map(section => (
                        <li key={section.id}>
                            <button
                                onClick={() => setActiveSection(section.id)}
                                className={`sidebar-nav-button group w-full text-left flex items-center gap-3 p-3 my-1 rounded-md transition-colors text-sm font-semibold
                                    ${activeSection === section.id
                                        ? 'bg-church-primary/10 text-church-primary dark:bg-church-primary/20 dark:text-blue-300'
                                        : 'text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                                    }`
                                }
                            >
                                <span className={`transition-transform duration-200 group-hover:scale-110 ${activeSection === section.id ? 'text-church-primary dark:text-blue-300' : 'text-gray-400 dark:text-gray-500'}`}>
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
            <div className="mt-4 border-t dark:border-gray-700 pt-4 px-2">
                <button
                    onClick={handleShare}
                    className="w-full flex items-center justify-center gap-2 text-sm font-semibold p-2 rounded-md bg-gray-100 text-gray-700 hover:bg-gray-200 transition-colors dark:bg-gray-700 dark:text-gray-200 dark:hover:bg-gray-600"
                >
                    <IconShare className="w-4 h-4" />
                    <span>Share This Guide</span>
                </button>
            </div>
        </div>
    );
};

export default Sidebar;