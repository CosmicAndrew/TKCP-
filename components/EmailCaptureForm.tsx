
import React, { useState } from 'react';
import { UserData, Sector } from '../types';
import { trackMetaEvent } from '../services/tracking';
import { InputField, SelectField } from './common/FormFields';
import { IconArrowRight, IconUser, IconPhone, IconBuildingOffice, IconSpinner, IconMail } from './common/Icon';

interface EmailCaptureFormProps {
    onSubmit: (data: Partial<UserData>) => void;
    sector: Sector;
}

const EmailCaptureForm: React.FC<EmailCaptureFormProps> = ({ onSubmit, sector }) => {
    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        email: '',
        phone: '',
        organizationType: sector,
    });
    
    const [errors, setErrors] = useState<{ [key: string]: string }>({});
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
         if (errors[e.target.name]) setErrors({ ...errors, [e.target.name]: '' });
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

        if (!formData.organizationType) newErrors.organizationType = "Organization type is required.";

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0 ? null : newErrors;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const validationErrors = validate();
        
        if(!validationErrors){
            setIsSubmitting(true);
            try {
                trackMetaEvent('SubmitApplication', { form_type: 'email_capture_form' });
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
        <div className="animate-fade-in-up">
            <h2 className="text-3xl font-display font-bold text-center text-gray-800 dark:text-gray-100">Get Your LED Buyer's Guide</h2>
            <p className="text-center text-gray-600 dark:text-gray-300 mt-2">Enter your details to access the complete guide and valuable insights.</p>
            <form onSubmit={handleSubmit} className="mt-8 space-y-6 max-w-md mx-auto" noValidate>
                 <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                   <div>
                     <InputField 
                        id="firstName" 
                        type="text" 
                        placeholder="First Name*" 
                        value={formData.firstName} 
                        onChange={handleChange} 
                        icon={<IconUser />} 
                        required 
                        label="First Name" 
                        error={errors.firstName} 
                     />
                     {errors.firstName && <p id="firstName-error" role="alert" className="text-red-500 text-sm mt-1 animate-pulse">{errors.firstName}</p>}
                   </div>
                   <div>
                     <InputField id="lastName" type="text" placeholder="Last Name*" value={formData.lastName} onChange={handleChange} icon={<IconUser />} required label="Last Name" error={errors.lastName} />
                     {errors.lastName && <p id="lastName-error" role="alert" className="text-red-500 text-sm mt-1 animate-pulse">{errors.lastName}</p>}
                   </div>
                 </div>
                
                <div>
                    <InputField 
                        id="email" 
                        type="email" 
                        placeholder="Email Address*" 
                        value={formData.email} 
                        onChange={handleChange} 
                        icon={<IconMail />}
                        required 
                        label="Email Address" 
                        error={errors.email} 
                    />
                    {errors.email && <p id="email-error" role="alert" className="text-red-500 text-sm mt-1 animate-pulse">{errors.email}</p>}
                </div>

                <div>
                  <InputField id="phone" type="tel" placeholder="Phone Number*" value={formData.phone} onChange={handleChange} icon={<IconPhone />} required label="Phone Number" error={errors.phone} />
                  {errors.phone && <p id="phone-error" role="alert" className="text-red-500 text-sm mt-1 animate-pulse">{errors.phone}</p>}
                </div>
                <div>
                  <SelectField id="organizationType" value={formData.organizationType} onChange={handleChange} icon={<IconBuildingOffice/>} required label="Organization Type" error={errors.organizationType}>
                        <option value="">Organization Type*</option>
                        <option value="church">House of Worship</option>
                        <option value="hospitality">Venue/Business</option>
                  </SelectField>
                  {errors.organizationType && <p id="organizationType-error" role="alert" className="text-red-500 text-sm mt-1 animate-pulse">{errors.organizationType}</p>}
                </div>

                <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full flex items-center justify-center bg-church-primary text-white font-bold py-3 px-6 rounded-md hover:bg-church-primary/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-church-primary transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    {isSubmitting ? (
                        <span className="flex items-center" role="status" aria-live="polite">
                            <IconSpinner className="mr-2 animate-spin" />
                            Unlocking Guide...
                        </span>
                    ) : (
                        <>
                            Access My LED Buyer's Guide
                            <IconArrowRight className="ml-2" />
                        </>
                    )}
                </button>
                <p className="text-center text-xs text-gray-500 dark:text-gray-400">We'll never spam you. Guide access only.</p>
            </form>
        </div>
    );
};

export default EmailCaptureForm;
