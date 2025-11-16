import React from 'react';
import * as HubSpot from '../../../services/hubspot';
import { HUBSPOT_CONFIG } from '../../../constants';
import { IconCalendar } from '../../common/Icon';

interface CalendarCTAProps {
    headline: string;
    buttonText: string;
    meetingType: 'priority' | 'discovery' | 'planning';
}

const trackMetaEvent = (eventName: string, params: object = {}) => {
    console.log(`[Meta Pixel Event]: ${eventName}`, params);
};

const CalendarCTA: React.FC<CalendarCTAProps> = ({ headline, buttonText, meetingType }) => {

    const handleBooking = () => {
        const userData = HubSpot.getContactInfoForMeeting();
        HubSpot.trackEvent('Calendar Booking Attempted from Buyer\'s Guide', HubSpot.getSessionUserId(), { meeting_type: meetingType });
        trackMetaEvent('Purchase', {
            content_type: 'consultation_booking', value: 500, currency: 'USD'
        });

        const url = new URL(HUBSPOT_CONFIG.meetingLinks[meetingType]);
        if (userData.firstName) url.searchParams.append('firstname', userData.firstName);
        if (userData.lastName) url.searchParams.append('lastname', userData.lastName);
        if (userData.email) url.searchParams.append('email', userData.email);
        
        url.searchParams.append('utm_source', 'buyers_guide_cta');
        url.searchParams.append('utm_campaign', `buyers_guide_${meetingType}`);

        window.open(url.toString(), '_blank');
    };

    return (
        <div className="mt-10 p-6 bg-church-primary text-white rounded-lg shadow-lg text-center animate-fade-in-up">
            <h3 className="text-2xl font-display font-bold">{headline}</h3>
            <button
                onClick={handleBooking}
                className="mt-4 flex items-center justify-center w-full sm:w-auto mx-auto px-8 py-3 font-bold text-gray-900 rounded-md bg-church-accent hover:bg-yellow-400 transition-all text-lg shadow-md hover:shadow-lg hover:-translate-y-1"
            >
                <IconCalendar className="w-6 h-6 mr-2" />
                <span>{buttonText}</span>
            </button>
        </div>
    );
};

export default CalendarCTA;
