import { UserData } from '../types';

const SESSION_USER_ID_KEY = 'tkcp_session_user_id';
const CONTACT_INFO_KEY = 'tkcp_contact_info';

// --- Session Management ---

/**
 * Gets the unique session ID for the current user, creating one if it doesn't exist.
 * This ID links anonymous activity to an eventual contact record.
 */
export const getSessionUserId = (): string => {
    let sessionId = localStorage.getItem(SESSION_USER_ID_KEY);
    if (!sessionId) {
        sessionId = `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
        localStorage.setItem(SESSION_USER_ID_KEY, sessionId);
    }
    return sessionId;
};

export const clearSessionUserId = (): void => {
    localStorage.removeItem(SESSION_USER_ID_KEY);
    localStorage.removeItem(CONTACT_INFO_KEY);
};

// --- Contact Info Cache for Meeting Links ---
// Caches basic contact info to pre-fill HubSpot meeting links

const cacheContactInfo = (data: Partial<UserData>) => {
    try {
        const existingInfo = JSON.parse(localStorage.getItem(CONTACT_INFO_KEY) || '{}');
        const newInfo = { ...existingInfo };
        if (data.email) newInfo.email = data.email;
        if (data.firstName) newInfo.firstName = data.firstName;
        if (data.lastName) newInfo.lastName = data.lastName;
        localStorage.setItem(CONTACT_INFO_KEY, JSON.stringify(newInfo));
    } catch (error) {
        console.error("Failed to cache contact info:", error);
    }
};

export const getContactInfoForMeeting = (): Partial<UserData> => {
    try {
        return JSON.parse(localStorage.getItem(CONTACT_INFO_KEY) || '{}');
    } catch {
        return {};
    }
}


// --- Simulated HubSpot API Functions ---

/**
 * Creates or updates a contact in HubSpot.
 * In a real app, this would make a POST request to your backend,
 * which then securely communicates with the HubSpot API.
 * It uses the sessionUserId to link anonymous data before an email is known.
 */
export const upsertContact = (data: Partial<UserData> & { session_user_id: string }) => {
    // Cache key contact info for meeting links
    cacheContactInfo(data);

    // Map application data to HubSpot properties (use internal names)
    const hubspotProperties: { [key: string]: any } = {};
    if (data.email) hubspotProperties.email = data.email;
    if (data.firstName) hubspotProperties.firstname = data.firstName;
    if (data.lastName) hubspotProperties.lastname = data.lastName;
    if (data.phone) hubspotProperties.phone = data.phone;
    if (data.fullName) {
        const [firstName, ...lastNameParts] = data.fullName.split(' ');
        hubspotProperties.firstname = firstName;
        hubspotProperties.lastname = lastNameParts.join(' ');
    }
    if (data.city) hubspotProperties.city = data.city;
    if (data.state) hubspotProperties.state = data.state;
    if (data.organizationType) hubspotProperties.organization_type = data.organizationType;
    if (data.sector) hubspotProperties.sector = data.sector;

    // Custom assessment properties
    if (data.pain_scale_score !== undefined) hubspotProperties.pain_scale_score = data.pain_scale_score;
    if (data.organization_size) hubspotProperties.organization_size = data.organization_size;
    if (data.timeline_urgency) hubspotProperties.timeline_urgency = data.timeline_urgency;
    if (data.compelling_event) hubspotProperties.compelling_event = data.compelling_event;
    if (data.commitment_level) hubspotProperties.commitment_level = data.commitment_level;
    if (data.total_assessment_score !== undefined) hubspotProperties.total_assessment_score = data.total_assessment_score;
    if (data.lead_temperature) hubspotProperties.lead_temperature = data.lead_temperature;
    if (data.assessment_answers_json) hubspotProperties.assessment_answers_json = data.assessment_answers_json;
    if (data.lifecyclestage) hubspotProperties.lifecyclestage = data.lifecyclestage;
    if (data.gemini_followup_insights) hubspotProperties.gemini_followup_insights = data.gemini_followup_insights;
    
    // Source tracking
    if (data.source_url) hubspotProperties.source_url = data.source_url;
    if (data.utm_campaign) hubspotProperties.utm_campaign = data.utm_campaign;


    console.log('[HubSpot Service] Upserting Contact:', {
        sessionId: data.session_user_id,
        properties: hubspotProperties
    });

    // --- SIMULATED API CALL ---
    // fetch('/api/hubspot/contact', {
    //   method: 'POST',
    //   headers: { 'Content-Type': 'application/json' },
    //   body: JSON.stringify({
    //     sessionId: data.session_user_id,
    //     properties: hubspotProperties,
    //   }),
    // });
};


/**
 * Tracks a custom behavioral event in HubSpot.
 * In a real app, this would make a POST request to your backend.
 */
export const trackEvent = (eventName: string, sessionId: string, properties: object = {}) => {
    const detectedSector = localStorage.getItem('tkcp_sector') || 'unknown';
    const eventData = {
        eventName, // e.g., 'Viewed Buyer's Guide Section 3'
        sessionId,
        properties: {
            ...properties,
            sector: detectedSector,
            url: window.location.href,
        },
        occurredAt: new Date().toISOString()
    };

    console.log('[HubSpot Service] Tracking Event:', eventData);

    // --- SIMULATED API CALL ---
    // fetch('/api/hubspot/track', {
    //   method: 'POST',
    //   headers: { 'Content-Type': 'application/json' },
    //   body: JSON.stringify(eventData),
    // });
};