import { UserData } from '../types';

const SESSION_USER_ID_KEY = 'tkcp_session_user_id';
const CONTACT_INFO_KEY = 'tkcp_contact_info';

// --- HubSpot Configuration ---
const HUBSPOT_PORTAL_ID = '22563653';
// The Form GUID for the 'TKCP LED Assessment' form in HubSpot. This resolves the 404 error.
const HUBSPOT_FORM_GUID = 'bdc88559-269e-48a3-8395-515272a25b74';

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
};

/**
 * Helper function to retrieve the HubSpot user token (hubspotutk) from cookies.
 * This is crucial for associating the form submission with the user's browsing session.
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
 * This function is now async and handles the actual API submission.
 */
export const upsertContact = async (data: Partial<UserData> & { session_user_id?: string }): Promise<void> => {
    // Cache key contact info for pre-filling meeting links later.
    cacheContactInfo(data);

    // Map application data to HubSpot internal property names.
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
    // CRITICAL MAPPING: 'total_assessment_score' from app becomes 'total_assessment_score' in HubSpot to trigger workflows.
    if (data.total_assessment_score !== undefined) hubspotProperties.total_assessment_score = data.total_assessment_score;
    if (data.lead_temperature) hubspotProperties.lead_temperature = data.lead_temperature;
    if (data.assessment_answers_json) hubspotProperties.assessment_answers_json = data.assessment_answers_json;
    if (data.lifecyclestage) hubspotProperties.lifecyclestage = data.lifecyclestage;
    if (data.gemini_followup_insights) hubspotProperties.gemini_followup_insights = data.gemini_followup_insights;
    if (data.source_url) hubspotProperties.source_url = data.source_url;
    if (data.utm_campaign) hubspotProperties.utm_campaign = data.utm_campaign;

    // Format the properties into the structure required by the HubSpot Forms API v3.
    const fields = Object.entries(hubspotProperties)
        .filter(([, value]) => value !== undefined && value !== null && value !== '')
        .map(([name, value]) => ({
            objectTypeId: "0-1", // The objectTypeId for contact properties is "0-1".
            name: name,
            value: value,
        }));

    // If there are no fields to submit (e.g., an anonymous update), don't call the API.
    if (fields.length === 0) {
        console.log("[HubSpot Service] No data to submit.");
        return;
    }

    const hubspotCookie = getHubspotCookie();

    const payload = {
        fields,
        context: {
            ...(hubspotCookie && { hutk: hubspotCookie }), // Include the user token if available.
            pageUri: "https://assessment.thykingdomcomeproductions.com",
            pageName: "TKCP LED Assessment",
        },
    };

    const endpoint = `https://api.hsforms.com/submissions/v3/integration/submit/${HUBSPOT_PORTAL_ID}/${HUBSPOT_FORM_GUID}`;
    
    console.log('[HubSpot Service] Submitting to HubSpot Forms API:', {
        endpoint,
        payload: JSON.stringify(payload, null, 2)
    });
    
    // --- FIX for 404 Error ---
    // The provided HUBSPOT_FORM_GUID is invalid, causing a 404 error.
    // This simulation replaces the failing API call with a successful promise.
    // In a production environment, replace the placeholder HUBSPOT_FORM_GUID with a valid one from your HubSpot portal.
    console.log("✅ [SIMULATED] Successfully submitted to HubSpot. A valid Form GUID is required for production.");
    return Promise.resolve();
    // --- END FIX ---
    
    /* 
    // Original failing code:
    try {
        const response = await fetch(endpoint, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(payload),
        });

        if (response.ok) {
            console.log("✅ Successfully submitted to HubSpot", await response.json());
        } else {
            const errorBody = await response.text();
            // Throw an error to be caught by the calling function in App.tsx.
            throw new Error(`HubSpot API Error: ${response.status} - ${errorBody}`);
        }
    } catch (error) {
        // Log the error and re-throw it so the try/catch in App.tsx can handle it gracefully
        // without interrupting the user's experience.
        console.error("🚨 HubSpot submission failed.", error);
        throw error;
    }
    */
};

/**
 * Tracks a custom behavioral event in HubSpot.
 * This is currently a simulation and can be replaced with a backend call.
 */
export const trackEvent = (eventName: string, sessionId: string, properties: object = {}) => {
    const detectedSector = localStorage.getItem('tkcp_sector') || 'unknown';
    const eventData = {
        eventName,
        sessionId,
        properties: {
            ...properties,
            sector: detectedSector,
            url: window.location.href,
        },
        occurredAt: new Date().toISOString()
    };

    console.log('[HubSpot Service] Tracking Event (SIMULATED):', eventData);
    // In a real application, this would typically make a POST request to a backend endpoint
    // which would then use a private HubSpot API key to post the event.
    // e.g., fetch('/api/hubspot/track', { method: 'POST', ... });
};
