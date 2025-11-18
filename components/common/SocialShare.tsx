import React from 'react';
import { Result } from '../../types';
import { utf8ToBase64 } from '../../utils';
import { trackMetaEvent, trackGA4Event } from '../../services/tracking';
import { IconFacebook, IconLinkedIn, IconTwitter } from './Icon';

interface SocialShareProps {
  result: Result;
}

const SocialShare: React.FC<SocialShareProps> = ({ result }) => {
  const resultDataString = JSON.stringify(result);
  const encodedResult = utf8ToBase64(resultDataString);
  const baseUrl = 'https://assessment.thykingdomcomeproductions.com';
  const shareUrl = `${baseUrl}?results=${encodedResult}`;
  const sectorText = result.sector === 'church' ? 'church' : 'venue';
  const shareText = `I just discovered the perfect LED video wall solution for my ${sectorText}! My score was ${result.score}/${result.maxScore}. Take the FREE assessment:`;
  const shareTitle = 'My TKCP LED Assessment Results';

  const handleShare = (platform: 'facebook' | 'twitter' | 'linkedin') => {
    trackMetaEvent('Share', { platform, content_type: 'assessment_results' });
    trackGA4Event('share', { method: platform, content_type: 'assessment_results' });

    const urls = {
      facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`,
      twitter: `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(shareUrl)}`,
      linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(shareUrl)}`
    };

    window.open(urls[platform], '_blank', 'width=600,height=400');
  };

  return (
    <div className="mt-8 pt-6 border-t border-gray-200 dark:border-gray-700 text-center">
        <h4 className="font-semibold text-gray-700 dark:text-gray-300">📢 Know a church or venue that needs this?</h4>
        <div className="flex justify-center gap-4 mt-4">
            <button onClick={() => handleShare('facebook')} aria-label="Share on Facebook" className="p-3 bg-gray-100 dark:bg-gray-700 rounded-full text-gray-700 dark:text-gray-200 hover:bg-blue-100 dark:hover:bg-blue-900/50 hover:text-blue-700 transition-colors">
                <IconFacebook className="w-6 h-6" />
            </button>
            <button onClick={() => handleShare('twitter')} aria-label="Share on Twitter" className="p-3 bg-gray-100 dark:bg-gray-700 rounded-full text-gray-700 dark:text-gray-200 hover:bg-blue-100 dark:hover:bg-blue-900/50 hover:text-blue-500 transition-colors">
                <IconTwitter className="w-6 h-6" />
            </button>
            <button onClick={() => handleShare('linkedin')} aria-label="Share on LinkedIn" className="p-3 bg-gray-100 dark:bg-gray-700 rounded-full text-gray-700 dark:text-gray-200 hover:bg-blue-100 dark:hover:bg-blue-900/50 hover:text-blue-600 transition-colors">
                <IconLinkedIn className="w-6 h-6" />
            </button>
        </div>
    </div>
  );
};

export default SocialShare;
