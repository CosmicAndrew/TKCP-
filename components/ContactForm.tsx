
import React, { useState } from 'react';
import { UserData, Sector, LeadStatus } from '../types';
import { US_STATES } from '../constants';
import { trackMetaEvent } from '../services/tracking';
import { InputField, SelectField } from './common/FormFields';
import { IconArrowRight, IconUser, IconMail, IconPhone, IconLocation, IconSpinner } from './common/Icon';

interface ContactFormProps {
    onSubmit: (data: UserData) => void;
    sector: Sector;
    leadStatus: LeadStatus;
}

const formatPhoneNumber = (value: string) => {
    if (!value) return '';
    const phoneNumber = value.replace(/[^\d]/g, '');
    const trimmedNumber = phoneNumber.slice(0, 10);
    const match = trimmedNumber.match(/^(\d{0,3})(\d{0,3})(\d{0,4})$/);
    if (!match) return trimmedNumber;
    const [, areaCode, middle, last] = match;
    let formatted = '';
    if (areaCode) formatted += `(${areaCode}`;
    if (areaCode.length === 3) formatted += ')';
    if (middle) formatted += ` ${middle}`;
    if (last) formatted += `-${last}`;
    return formatted;
};

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
    const [isSubmitting, setIsSubmitting] = useState(false);
    
    const isLocationRequired = leadStatus === 'hot';

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData({ 
            ...formData, 
            [name]: name === 'phone' ? formatPhoneNumber(value) : value 
        });
        if (errors[name]) setErrors({ ...errors, [name]: '' });
    };
    
    const handleSelectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
        if (errors[name]) setErrors({ ...errors, [name]: '' });
    };

    const focusFirstError = (newErrors: { [key: string]: string }) => {
        const firstErrorKey = Object.keys(newErrors)[0];
        document.getElementById(firstErrorKey)?.focus();
    };

    const validate = () => {
        const newErrors: { [key: string]: string } = {};
        if (!formData.firstName) newErrors.firstName = "First name is required.";
        if (!formData.lastName) newErrors.lastName = "Last name is required.";
        
        const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
        if (!formData.email) {
            newErrors.email = "Email is required.";
        } else if (!emailRegex.test(formData.email)) {
            newErrors.email = "Please enter a valid email address (e.g., user@example.com).";
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
        return Object.keys(newErrors).length === 0 ? null : newErrors;
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const validationErrors = validate();
        
        if (!validationErrors) {
            setIsSubmitting(true);
            try {
                trackMetaEvent('SubmitApplication', { form_type: 'contact_form' });
                await onSubmit(formData);
            } catch (error) {
                console.error("Submission error:", error);
                setIsSubmitting(false);
            }
        } else {
            focusFirstError(validationErrors);
        }
    };
    
    return (
        <div className="animate-fade-in">
            <h2 className="text-3xl font-display font-bold text-center text-gray-800 dark:text-gray-100">Excellent! Let's Talk Next Steps.</h2>
            <p className="text-center text-gray-600 dark:text-gray-300 mt-2">Provide your details for a priority consultation.</p>
            <form onSubmit={handleSubmit} className="mt-8 space-y-6" noValidate>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                   <div>
                     <InputField id="firstName" type="text" placeholder="First Name" value={formData.firstName || ''} onChange={handleChange} icon={<IconUser />} required label="First Name" error={errors.firstName} />
                     {errors.firstName && <p id="firstName-error" role="alert" className="text-red-500 text-sm mt-1 animate-pulse">{errors.firstName}</p>}
                   </div>
                   <div>
                     <InputField id="lastName" type="text" placeholder="Last Name" value={formData.lastName || ''} onChange={handleChange} icon={<IconUser />} required label="Last Name" error={errors.lastName} />
                     {errors.lastName && <p id="lastName-error" role="alert" className="text-red-500 text-sm mt-1 animate-pulse">{errors.lastName}</p>}
                   </div>
                </div>
                <div>
                  <InputField id="email" type="email" placeholder="Email Address" value={formData.email || ''} onChange={handleChange} icon={<IconMail />} required label="Email Address" error={errors.email} />
                  {errors.email && <p id="email-error" role="alert" className="text-red-500 text-sm mt-1 animate-pulse">{errors.email}</p>}
                </div>
                <div>
                    <InputField id="phone" type="tel" placeholder="(XXX) XXX-XXXX" value={formData.phone || ''} onChange={handleChange} icon={<IconPhone />} required label="Phone Number" error={errors.phone} />
                    {errors.phone && <p id="phone-error" role="alert" className="text-red-500 text-sm mt-1 animate-pulse">{errors.phone}</p>}
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                   <div>
                     <InputField id="city" type="text" placeholder={isLocationRequired ? "City" : "City (Optional)"} value={formData.city || ''} onChange={handleChange} icon={<IconLocation />} required={isLocationRequired} label="City" error={errors.city} />
                     {errors.city && <p id="city-error" role="alert" className="text-red-500 text-sm mt-1 animate-pulse">{errors.city}</p>}
                   </div>
                   <div>
                     <SelectField id="state" value={formData.state || ''} onChange={handleSelectChange} icon={<IconLocation />} required={isLocationRequired} label="State" error={errors.state}>
                         <option value="" disabled>{isLocationRequired ? "State*" : "State (Optional)"}</option>
                         {US_STATES.map(state => <option key={state} value={state}>{state}</option>)}
                     </SelectField>
                     {errors.state && <p id="state-error" role="alert" className="text-red-500 text-sm mt-1 animate-pulse">{errors.state}</p>}
                   </div>
                </div>

                <button
                    type="submit"
                    disabled={isSubmitting}
                    aria-disabled={isSubmitting}
                    className="w-full flex items-center justify-center bg-church-primary text-white font-bold py-3 px-6 rounded-md hover:bg-church-primary/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-church-primary transform hover:-translate-y-1 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                >
                    {isSubmitting ? (
                        <span className="flex items-center" role="status" aria-live="polite">
                            <IconSpinner className="mr-2 animate-spin" />
                            Securing Your Spot...
                        </span>
                    ) : (
                        <>
                            Book My Consultation
                            <IconArrowRight className="ml-2" />
                        </>
                    )}
                </button>
            </form>
        </div>
    );
};

export default ContactForm;
