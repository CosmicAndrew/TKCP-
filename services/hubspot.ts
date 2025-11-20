
import { UserData } from '../types';
import { LOCAL_STORAGE_KEYS } from '../constants';

// --- HubSpot Configuration ---
const HUBSPOT_PORTAL_ID = '22563653';
const HUBSPOT_FORM_GUID = 'f0cf68b1-496b-401a-8d26-816713d10c95';

// --- Session Management ---

/**
 * Gets the unique session ID for the current user, creating one if it doesn't exist.
 * This ID links anonymous activity to an eventual contact record.
 */
export const getSessionUserId = (): string => {
    let sessionId = localStorage.getItem(LOCAL_STORAGE_KEYS.sessionUserId);
    if (!sessionId) {
        sessionId = `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
        localStorage.setItem(LOCAL_STORAGE_KEYS.sessionUserId, sessionId);
    }
    return sessionId;
};

export const clearSessionUserId = (): void => {
    localStorage.removeItem(LOCAL_STORAGE_KEYS.sessionUserId);
    localStorage.removeItem(LOCAL_STORAGE_KEYS.contactInfo);
};

// --- Contact Info Cache for Meeting Links ---

const cacheContactInfo = (data: Partial<UserData>) => {
    try {
        const existingInfo = JSON.parse(localStorage.getItem(LOCAL_STORAGE_KEYS.contactInfo) || '{}');
        const newInfo = { ...existingInfo };
        if (data.email) newInfo.email = data.email;
        if (data.firstName) newInfo.firstName = data.firstName;
        if (data.lastName) newInfo.lastName = data.lastName;
        localStorage.setItem(LOCAL_STORAGE_KEYS.contactInfo, JSON.stringify(newInfo));
    } catch (error) {
        console.error("Failed to cache contact info:", error);
    }
};

export const getContactInfoForMeeting = (): Partial<UserData> => {
    try {
        return JSON.parse(localStorage.getItem(LOCAL_STORAGE_KEYS.contactInfo) || '{}');
    } catch {
        return {};
    }
};

/**
 * Helper function to retrieve the HubSpot user token (hubspotutk) from cookies.
 */
const getHubspotCookie = (): string | null => {
    const cookies = document.cookie.split(';');
    for (const cookie of cookies) {
        const parts = cookie.trim().split('=');
        if (parts[0] === 'hubspotutk') {
            return parts[1];
        }
    }
    return null;
};

/**
 * Creates or updates a contact in HubSpot using the Forms API v3.
 */
export const upsertContact = async (data: Partial<UserData> & { session_user_id?: string }): Promise<void> => {
    if (!data.email) {
        console.error('[HubSpot Service] Email is required for submission.');
        return; // Fail gracefully
    }

    cacheContactInfo(data);

    const hubspotProperties: { [key: string]: any } = {};
    if (data.email) hubspotProperties.email = data.email;
    if (data.firstName) hubspotProperties.firstname = data.firstName;
    if (data.lastName) hubspotProperties.lastname = data.lastName;
    if (data.phone) hubspotProperties.phone = data.phone;
    if (data.fullName && !data.firstName && !data.lastName) {
        const [firstName, ...lastNameParts] = data.fullName.split(' ');
        hubspotProperties.firstname = firstName;
        hubspotProperties.lastname = lastNameParts.join(' ');
    }
    if (data.city) hubspotProperties.city = data.city;
    if (data.state) hubspotProperties.state = data.state;
    if (data.sector) hubspotProperties.sector = data.sector;
    if (data.session_user_id) hubspotProperties.session_user_id = data.session_user_id;
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
    if (data.source_url) hubspotProperties.source_url = data.source_url;
    if (data.utm_campaign) hubspotProperties.utm_campaign = data.utm_campaign;

    const fields = Object.entries(hubspotProperties)
        .filter(([, value]) => value !== undefined && value !== null && value !== '')
        .map(([name, value]) => ({
            objectTypeId: "0-1",
            name: name,
            value: value,
        }));

    if (fields.length === 0) return;

    const hubspotCookie = getHubspotCookie();
    const payload = {
        fields,
        context: {
            ...(hubspotCookie && { hutk: hubspotCookie }),
            pageUri: window.location.href,
            pageName: document.title,
        },
    };

    try {
        const response = await fetch(`https://api.hsforms.com/submissions/v3/integration/submit/${HUBSPOT_PORTAL_ID}/${HUBSPOT_FORM_GUID}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload),
        });

        if (!response.ok) {
            const errorBody = await response.text();
             try {
                const errorJson = JSON.parse(errorBody);
                // Ignore BLOCKED_EMAIL errors as they are configuration based
                if (errorJson.errors?.some((e: any) => e.errorType === 'BLOCKED_EMAIL')) return;
            } catch {}
            console.error(`HubSpot API Error: ${response.status}`, errorBody);
        }
    } catch (error) {
        console.error("HubSpot submission network error.", error);
    }
};

/**
 * Tracks a custom behavioral event in HubSpot using the Tracking Code API.
 * Requires HubSpot tracking code to be loaded in index.html.
 */
export const trackBehavioralEvent = (eventName: string, properties: object = {}) => {
    const sessionId = getSessionUserId();
    const detectedSector = localStorage.getItem(LOCAL_STORAGE_KEYS.sector) || 'unknown';

    const eventProperties = {
        sector: detectedSector, // Default, can be overwritten by ...properties
        ...properties,
        session_id: sessionId,
        url: window.location.href,
        timestamp: new Date().toISOString()
    };

    // Check if HubSpot tracking code is loaded
    if (typeof window !== 'undefined' && window._hsq) {
        try {
            // Push custom behavioral event to HubSpot queue
            window._hsq.push([
                'trackCustomBehavioralEvent',
                {
                    name: eventName,
                    properties: eventProperties
                }
            ]);

            console.log(`✅ Tracked HubSpot event: ${eventName}`, eventProperties);
        } catch (error) {
            console.warn(`⚠️ Failed to track HubSpot event: ${eventName}`, error);
        }
    } else {
        console.warn(`⚠️ HubSpot tracking code not loaded. Event logged but not tracked: ${eventName}`, eventProperties);
    }
};

/**
 * Legacy wrapper for backwards compatibility during refactor
 */
export const trackEvent = (eventName: string, sessionId: string, properties: object = {}) => {
    trackBehavioralEvent(eventName, properties);
};
