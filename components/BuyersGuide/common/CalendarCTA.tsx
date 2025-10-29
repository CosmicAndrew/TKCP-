import React from 'react';
import { HUBSPOT_CONFIG } from '../../../constants';
import * as HubSpot from '../../../services/hubspot';

type MeetingType = keyof typeof HUBSPOT_CONFIG.meetingLinks;

interface CalendarCTAProps {
    headline: string;
    buttonText: string;
    meetingType: MeetingType;
}

const CalendarCTA: React.FC<CalendarCTAProps> = ({ headline, buttonText, meetingType }) => {
    const handleScheduleClick = () => {
        const meetingLink = HUBSPOT_CONFIG.meetingLinks[meetingType];
        console.log(`Scheduling link clicked: ${buttonText} -> ${meetingLink}`);
        
        HubSpot.trackEvent('Calendar Booking Attempted', HubSpot.getSessionUserId(), { meeting_type: meetingType });
        
        // In a real app, this would open a HubSpot Meetings or Calendly link.
        // It's crucial to pass user info as query params to pre-fill the form.
        const hubspotContactInfo = HubSpot.getContactInfoForMeeting();
        const url = new URL(meetingLink);
        if(hubspotContactInfo.email) url.searchParams.append('email', hubspotContactInfo.email);
        if(hubspotContactInfo.firstName) url.searchParams.append('firstname', hubspotContactInfo.firstName);
        if(hubspotContactInfo.lastName) url.searchParams.append('lastname', hubspotContactInfo.lastName);

        window.open(url.toString(), '_blank');
    };

    return (
        <div className="my-8 p-6 bg-gray-100 border border-gray-200 rounded-lg text-center print-hide calendar-cta">
            <h4 className="text-xl font-display font-bold text-gray-800">{headline}</h4>
            <button
                onClick={handleScheduleClick}
                className="mt-4 px-8 py-3 bg-church-accent text-church-primary font-bold rounded-md hover:bg-yellow-400 transition-transform hover:scale-105"
            >
                {buttonText}
            </button>
        </div>
    );
};

export default CalendarCTA;