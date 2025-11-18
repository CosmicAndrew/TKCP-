import React, { useState } from 'react';
import { Result } from '../../types';
import { utf8ToBase64 } from '../../utils';
import { trackMetaEvent, trackGA4Event } from '../../services/tracking';
import { IconFacebook, IconTwitter, IconLink } from './Icon';

interface SocialShareProps {
  result: Result;
}

const SocialShare: React.FC<SocialShareProps> = ({ result }) => {
  const [copyStatus, setCopyStatus] = useState('Copy Link');
  
  const resultDataString = JSON.stringify(result);
  const encodedResult = utf8ToBase64(resultDataString);
  const baseUrl = 'https://assessment.thykingdomcomeproductions.com';
  const shareUrl = `${baseUrl}?results=${encodedResult}`;
  const sectorText = result.sector === 'church' ? 'church' : 'venue';
  const shareText = `I just took the LED Video Wall Assessment and scored ${result.score}/20! Find out if LED displays are right for your ${sectorText}.`;
  const shareTitle = 'My TKCP LED Assessment Results';

  const handleShare = (platform: 'facebook' | 'twitter') => {
    trackMetaEvent('Share', { 
        platform, 
        content_type: 'assessment_results',
        content_id: 'tkcp_led_assessment',
        value: result.score
    });
    trackGA4Event('share', { method: platform, content_type: 'assessment_results' });

    const urls = {
      facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}&quote=${encodeURIComponent(shareText)}`,
      twitter: `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(shareUrl)}`,
    };

    window.open(urls[platform], '_blank', 'width=600,height=400');
  };

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(`${shareText} ${shareUrl}`);
      setCopyStatus('Copied!');
      setTimeout(() => setCopyStatus('Copy Link'), 2000);
    } catch (err) {
      console.error('Failed to copy text: ', err);
      setCopyStatus('Failed!');
    }
  };

  return (
    <div className="mt-8 pt-6 border-t border-gray-200 dark:border-gray-700 text-center">
        <h3 className="text-xl font-display font-bold text-gray-800 dark:text-gray-100">📢 Share Your Results</h3>
        <p className="mt-1 text-gray-600 dark:text-gray-300">Know a church or venue that needs this?</p>
        <div className="flex flex-col sm:flex-row justify-center items-center gap-4 mt-4">
            <button 
                onClick={() => handleShare('facebook')} 
                aria-label="Share on Facebook" 
                className="w-full sm:w-auto flex items-center justify-center gap-2 px-5 py-2.5 bg-blue-600 text-white font-semibold rounded-md hover:bg-blue-700 transition-colors"
            >
                <IconFacebook className="w-5 h-5" />
                <span>Share on Facebook</span>
            </button>
            <button 
                onClick={() => handleShare('twitter')} 
                aria-label="Share on Twitter" 
                className="w-full sm:w-auto flex items-center justify-center gap-2 px-5 py-2.5 bg-sky-500 text-white font-semibold rounded-md hover:bg-sky-600 transition-colors"
            >
                <IconTwitter className="w-5 h-5" />
                <span>Share on Twitter</span>
            </button>
            <button 
                onClick={handleCopyLink} 
                aria-label="Copy share link to clipboard"
                className={`w-full sm:w-auto flex items-center justify-center gap-2 px-5 py-2.5 font-semibold rounded-md transition-colors ${
                    copyStatus === 'Copied!' 
                    ? 'bg-green-500 text-white' 
                    : 'bg-gray-200 dark:bg-gray-600 text-gray-800 dark:text-gray-100 hover:bg-gray-300 dark:hover:bg-gray-500'
                }`}
            >
                <IconLink className="w-5 h-5" />
                <span>{copyStatus}</span>
            </button>
        </div>
    </div>
  );
};

export default SocialShare;