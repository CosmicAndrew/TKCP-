import React, { useState } from 'react';
import { UserData, Sector } from '../types';
import { IconArrowRight, IconUser, IconMail, IconPhone, IconLocation } from './common/Icon';

interface ContactFormProps {
    onSubmit: (data: UserData) => void;
    sector: Sector;
}

const InputField: React.FC<{ id: string, type: string, placeholder: string, value: string, onChange: (e: React.ChangeEvent<HTMLInputElement>) => void, icon: React.ReactNode, required?: boolean, 'aria-label': string, error?: string }> = 
({ id, type, placeholder, value, onChange, icon, required, 'aria-label': ariaLabel, error }) => (
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
            aria-label={ariaLabel}
            aria-invalid={!!error}
            aria-describedby={error ? `${id}-error` : undefined}
            className={`w-full pl-10 pr-4 py-3 border rounded-md focus:ring-2 focus:border-transparent transition ${
                error 
                ? 'border-red-500 focus:ring-red-500' 
                : 'border-gray-300 focus:ring-church-primary'
            }`}
        />
    </div>
);

const ContactForm: React.FC<ContactFormProps> = ({ onSubmit, sector }) => {
    const [formData, setFormData] = useState<UserData>({
        firstName: '',
        lastName: '',
        email: '',
        phone: '',
        city: '',
        state: '',
    });
    
    const [errors, setErrors] = useState<{ [key: string]: string }>({});

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
        if (errors[e.target.name]) {
             setErrors({ ...errors, [e.target.name]: '' });
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
        if (!formData.phone) newErrors.phone = "Phone number is required.";
        if (!formData.city) newErrors.city = "City is required.";
        if (!formData.state) newErrors.state = "State is required.";

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    }

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if(validate()){
            console.log("Submitting to HubSpot (simulated):", formData);
            onSubmit(formData);
        }
    };
    
    const urlParams = new URLSearchParams(window.location.search);
    const utmCampaign = urlParams.get('utm_campaign') || '';

    return (
        <div>
            <h2 className="text-3xl font-display font-bold text-center text-gray-800">Excellent! Let's Talk Next Steps.</h2>
            <p className="text-center text-gray-600 mt-2">Provide your details for a priority consultation.</p>
            <form onSubmit={handleSubmit} className="mt-8 space-y-6" noValidate>
                {/* Hidden fields for HubSpot */}
                <input type="hidden" name="sector" value={sector} />
                <input type="hidden" name="source_url" value={window.location.href} />
                <input type="hidden" name="campaign_source" value={utmCampaign} />

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                   <div>
                     <InputField id="firstName" type="text" placeholder="First Name" value={formData.firstName || ''} onChange={handleChange} icon={<IconUser />} required aria-label="First Name" error={errors.firstName} />
                     {errors.firstName && <p id="firstName-error" className="text-red-500 text-sm mt-1">{errors.firstName}</p>}
                   </div>
                   <div>
                     <InputField id="lastName" type="text" placeholder="Last Name" value={formData.lastName || ''} onChange={handleChange} icon={<IconUser />} required aria-label="Last Name" error={errors.lastName} />
                     {errors.lastName && <p id="lastName-error" className="text-red-500 text-sm mt-1">{errors.lastName}</p>}
                   </div>
                </div>
                <div>
                  <InputField id="email" type="email" placeholder="Email Address" value={formData.email || ''} onChange={handleChange} icon={<IconMail />} required aria-label="Email Address" error={errors.email} />
                  {errors.email && <p id="email-error" className="text-red-500 text-sm mt-1">{errors.email}</p>}
                </div>
                <div>
                    <InputField id="phone" type="tel" placeholder="Phone Number" value={formData.phone || ''} onChange={handleChange} icon={<IconPhone />} required aria-label="Phone Number" error={errors.phone} />
                    {errors.phone && <p id="phone-error" className="text-red-500 text-sm mt-1">{errors.phone}</p>}
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                   <div>
                     <InputField id="city" type="text" placeholder="City" value={formData.city || ''} onChange={handleChange} icon={<IconLocation />} required aria-label="City" error={errors.city} />
                     {errors.city && <p id="city-error" className="text-red-500 text-sm mt-1">{errors.city}</p>}
                   </div>
                   <div>
                     <InputField id="state" type="text" placeholder="State" value={formData.state || ''} onChange={handleChange} icon={<IconLocation />} required aria-label="State" error={errors.state} />
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