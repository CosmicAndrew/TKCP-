import React, { useState } from 'react';
import { UserData, Sector } from '../types';
import { trackMetaEvent } from '../services/tracking';
import { InputField, SelectField } from './common/FormFields';
import { IconArrowRight, IconUser, IconPhone, IconBuildingOffice } from './common/Icon';

interface EmailCaptureFormProps {
    onSubmit: (data: Partial<UserData>) => void;
    sector: Sector;
}

const EmailCaptureForm: React.FC<EmailCaptureFormProps> = ({ onSubmit, sector }) => {
    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        phone: '',
        organizationType: sector,
    });
    
    const [errors, setErrors] = useState<{ [key: string]: string }>({});

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
         if (errors[e.target.name]) {
             setErrors({ ...errors, [e.target.name]: '' });
        }
    };

    const validate = () => {
        const newErrors: { [key: string]: string } = {};
        if (!formData.firstName) newErrors.firstName = "First name is required.";
        if (!formData.lastName) newErrors.lastName = "Last name is required.";
        
        const phoneDigits = (formData.phone || '').replace(/\D/g, '');
        if (!phoneDigits) {
            newErrors.phone = "Phone number is required.";
        } else if (phoneDigits.length < 10) {
            newErrors.phone = "Please enter a valid 10-digit phone number.";
        }

        if (!formData.organizationType) newErrors.organizationType = "Organization type is required.";
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    }

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if(validate()){
            trackMetaEvent('SubmitApplication', { form_type: 'email_capture_form' });
            onSubmit(formData);
        }
    };

    return (
        <div className="animate-fade-in-up">
            <h2 className="text-3xl font-display font-bold text-center text-gray-800 dark:text-gray-100">Get Your LED Buyer's Guide</h2>
            <p className="text-center text-gray-600 dark:text-gray-300 mt-2">Enter your details to access the complete guide and valuable insights.</p>
            <form onSubmit={handleSubmit} className="mt-8 space-y-6 max-w-md mx-auto" noValidate>
                 <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                   <div>
                     <InputField id="firstName" type="text" placeholder="First Name*" value={formData.firstName} onChange={handleChange} icon={<IconUser />} required label="First Name" error={errors.firstName} />
                     {errors.firstName && <p id="firstName-error" className="text-red-500 text-sm mt-1">{errors.firstName}</p>}
                   </div>
                   <div>
                     <InputField id="lastName" type="text" placeholder="Last Name*" value={formData.lastName} onChange={handleChange} icon={<IconUser />} required label="Last Name" error={errors.lastName} />
                     {errors.lastName && <p id="lastName-error" className="text-red-500 text-sm mt-1">{errors.lastName}</p>}
                   </div>
                 </div>
                <div>
                  <InputField id="phone" type="tel" placeholder="Phone Number*" value={formData.phone} onChange={handleChange} icon={<IconPhone />} required label="Phone Number" error={errors.phone} />
                  {errors.phone && <p id="phone-error" className="text-red-500 text-sm mt-1">{errors.phone}</p>}
                </div>
                <div>
                  <SelectField id="organizationType" value={formData.organizationType} onChange={handleChange} icon={<IconBuildingOffice/>} required label="Organization Type" error={errors.organizationType}>
                        <option value="">Organization Type*</option>
                        <option value="church">House of Worship</option>
                        <option value="hospitality">Venue/Business</option>
                  </SelectField>
                  {errors.organizationType && <p id="organizationType-error" className="text-red-500 text-sm mt-1">{errors.organizationType}</p>}
                </div>

                <button
                    type="submit"
                    className="w-full flex items-center justify-center bg-church-primary text-white font-bold py-3 px-6 rounded-md hover:bg-church-primary/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-church-primary transition-all duration-300"
                >
                    Access My LED Buyer's Guide
                    <IconArrowRight className="ml-2" />
                </button>
                <p className="text-center text-xs text-gray-500 dark:text-gray-400">We'll never spam you. Guide access only.</p>
            </form>
        </div>
    );
};

export default EmailCaptureForm;