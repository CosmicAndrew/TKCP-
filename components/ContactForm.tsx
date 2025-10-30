import React, { useState } from 'react';
import { UserData, Sector, LeadStatus } from '../types';
import { US_STATES } from '../../constants';
import { IconArrowRight, IconUser, IconMail, IconPhone, IconLocation } from './common/Icon';

interface ContactFormProps {
    onSubmit: (data: UserData) => void;
    sector: Sector;
    leadStatus: LeadStatus;
}

// Placeholder for Meta Pixel tracking
const trackMetaEvent = (eventName: string, params: object = {}) => {
    console.log(`[Meta Pixel Event]: ${eventName}`, params);
};

// Helper function to format phone number as (XXX) XXX-XXXX
const formatPhoneNumber = (value: string) => {
    if (!value) return '';

    const phoneNumber = value.replace(/[^\d]/g, '');
    const trimmedNumber = phoneNumber.slice(0, 10);
    
    const match = trimmedNumber.match(/^(\d{0,3})(\d{0,3})(\d{0,4})$/);
    if (!match) return trimmedNumber;
    
    const [, areaCode, middle, last] = match;
    
    let formatted = '';
    if (areaCode) {
        formatted += `(${areaCode}`;
        if (areaCode.length === 3) {
            formatted += ')';
        }
    }
    if (middle) {
        formatted += ` ${middle}`;
    }
    if (last) {
        formatted += `-${last}`;
    }

    return formatted;
};


const InputField: React.FC<{ id: string, type: string, placeholder: string, value: string, onChange: (e: React.ChangeEvent<HTMLInputElement>) => void, icon: React.ReactNode, required?: boolean, label: string, error?: string }> = 
({ id, type, placeholder, value, onChange, icon, required, label, error }) => (
    <>
        <label htmlFor={id} className="sr-only">{label}</label>
        <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400" aria-hidden="true">
                {icon}
            </div>
            <input
                id={id}
                name={id}
                type={type}
                placeholder={placeholder}
                value={value}
                onChange={onChange}
                required={required}
                aria-invalid={!!error}
                aria-describedby={error ? `${id}-error` : undefined}
                className={`w-full pl-10 pr-4 py-3 border rounded-md focus:ring-2 focus:border-transparent transition bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-200 dark:placeholder-gray-400 ${
                    error 
                    ? 'border-red-500 focus:ring-red-500' 
                    : 'border-gray-300 dark:border-gray-600 focus:ring-church-primary'
                }`}
            />
        </div>
    </>
);

const SelectField: React.FC<{ id: string, value: string, onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void, icon: React.ReactNode, required?: boolean, children: React.ReactNode, label: string, error?: string }> =
({ id, value, onChange, icon, required, children, label, error }) => (
    <>
        <label htmlFor={id} className="sr-only">{label}</label>
        <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400" aria-hidden="true">
                {icon}
            </div>
            <select
                id={id}
                name={id}
                value={value}
                onChange={onChange}
                required={required}
                aria-invalid={!!error}
                aria-describedby={error ? `${id}-error` : undefined}
                className={`w-full pl-10 pr-4 py-3 border rounded-md focus:ring-2 focus:border-transparent transition appearance-none bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-200 ${
                    error 
                    ? 'border-red-500 focus:ring-red-500' 
                    : 'border-gray-300 dark:border-gray-600 focus:ring-church-primary'
                } ${value === '' ? 'text-gray-500 dark:text-gray-400' : ''}`}
            >
                {children}
            </select>
            <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none text-gray-400" aria-hidden="true">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 9l4-4 4 4m0 6l-4 4-4-4"></path></svg>
            </div>
        </div>
    </>
);


const ContactForm: React.FC<ContactFormProps> = ({ onSubmit, sector, leadStatus }) => {
    const [formData, setFormData] = useState<UserData>({
        firstName: '',
        lastName: '',
        email: '',
        phone: '',
        city: '',
        state: '',
    });
    
    const [errors, setErrors] = useState<{ [key: string]: string }>({});
    
    const isLocationRequired = leadStatus === 'hot';

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        if (name === 'phone') {
            setFormData({ ...formData, [name]: formatPhoneNumber(value) });
        } else {
            setFormData({ ...formData, [name]: value });
        }
        
        if (errors[name]) {
             setErrors({ ...errors, [name]: '' });
        }
    };
    
    const handleSelectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
        if (errors[name]) {
             setErrors({ ...errors, [name]: '' });
        }
    };


    const validate = () => {
        const newErrors: { [key: string]: string } = {};
        if (!formData.firstName) newErrors.firstName = "First name is required.";
        if (!formData.lastName) newErrors.lastName = "Last name is required.";
        if (!formData.email) {
            newErrors.email = "Email is required.";
        } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
            newErrors.email = "Email is invalid.";
        }
        
        const phoneDigits = (formData.phone || '').replace(/\D/g, '');
        if (!phoneDigits) {
            newErrors.phone = "Phone number is required.";
        } else if (phoneDigits.length < 10) {
            newErrors.phone = "Please enter a valid 10-digit phone number.";
        }

        if (isLocationRequired) {
            if (!formData.city) newErrors.city = "City is required.";
            if (!formData.state) newErrors.state = "State is required.";
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    }

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if(validate()){
            console.log("Submitting to HubSpot (simulated):", formData);
            trackMetaEvent('SubmitApplication', { form_type: 'contact_form' });
            onSubmit(formData);
        }
    };
    
    const urlParams = new URLSearchParams(window.location.search);
    const utmCampaign = urlParams.get('utm_campaign') || '';

    return (
        <div>
            <h2 className="text-3xl font-display font-bold text-center text-gray-800 dark:text-gray-100">Excellent! Let's Talk Next Steps.</h2>
            <p className="text-center text-gray-600 dark:text-gray-300 mt-2">Provide your details for a priority consultation.</p>
            <form onSubmit={handleSubmit} className="mt-8 space-y-6" noValidate>
                {/* Hidden fields for HubSpot */}
                <input type="hidden" name="sector" value={sector} />
                <input type="hidden" name="source_url" value={window.location.href} />
                <input type="hidden" name="campaign_source" value={utmCampaign} />

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                   <div>
                     <InputField id="firstName" type="text" placeholder="First Name" value={formData.firstName || ''} onChange={handleChange} icon={<IconUser />} required label="First Name" error={errors.firstName} />
                     {errors.firstName && <p id="firstName-error" className="text-red-500 text-sm mt-1">{errors.firstName}</p>}
                   </div>
                   <div>
                     <InputField id="lastName" type="text" placeholder="Last Name" value={formData.lastName || ''} onChange={handleChange} icon={<IconUser />} required label="Last Name" error={errors.lastName} />
                     {errors.lastName && <p id="lastName-error" className="text-red-500 text-sm mt-1">{errors.lastName}</p>}
                   </div>
                </div>
                <div>
                  <InputField id="email" type="email" placeholder="Email Address" value={formData.email || ''} onChange={handleChange} icon={<IconMail />} required label="Email Address" error={errors.email} />
                  {errors.email && <p id="email-error" className="text-red-500 text-sm mt-1">{errors.email}</p>}
                </div>
                <div>
                    <InputField id="phone" type="tel" placeholder="(XXX) XXX-XXXX" value={formData.phone || ''} onChange={handleChange} icon={<IconPhone />} required label="Phone Number" error={errors.phone} />
                    {errors.phone && <p id="phone-error" className="text-red-500 text-sm mt-1">{errors.phone}</p>}
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                   <div>
                     <InputField id="city" type="text" placeholder={isLocationRequired ? "City" : "City (Optional)"} value={formData.city || ''} onChange={handleChange} icon={<IconLocation />} required={isLocationRequired} label="City" error={errors.city} />
                     {errors.city && <p id="city-error" className="text-red-500 text-sm mt-1">{errors.city}</p>}
                   </div>
                   <div>
                     <SelectField id="state" value={formData.state || ''} onChange={handleSelectChange} icon={<IconLocation />} required={isLocationRequired} label="State" error={errors.state}>
                         <option value="" disabled>{isLocationRequired ? "State*" : "State (Optional)"}</option>
                         {US_STATES.map(state => <option key={state} value={state}>{state}</option>)}
                     </SelectField>
                     {errors.state && <p id="state-error" className="text-red-500 text-sm mt-1">{errors.state}</p>}
                   </div>
                </div>

                <button
                    type="submit"
                    className="w-full flex items-center justify-center bg-church-primary text-white font-bold py-3 px-6 rounded-md hover:bg-church-primary/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-church-primary transform hover:-translate-y-1 transition-all duration-300"
                >
                    Book My Consultation
                    <IconArrowRight className="ml-2" />
                </button>
            </form>
        </div>
    );
};

export default ContactForm;