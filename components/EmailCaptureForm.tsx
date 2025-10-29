import React, { useState } from 'react';
import { UserData, Sector } from '../types';
import { IconArrowRight, IconUser, IconPhone, IconBuildingOffice } from './common/Icon';

interface EmailCaptureFormProps {
    onSubmit: (data: Partial<UserData>) => void;
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

const SelectField: React.FC<{ id: string, value: string, onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void, icon: React.ReactNode, required?: boolean, children: React.ReactNode, 'aria-label': string, error?: string }> =
({ id, value, onChange, icon, required, children, 'aria-label': ariaLabel, error }) => (
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
            aria-label={ariaLabel}
            aria-invalid={!!error}
            aria-describedby={error ? `${id}-error` : undefined}
            className={`w-full pl-10 pr-4 py-3 border rounded-md focus:ring-2 focus:border-transparent transition appearance-none ${
                error 
                ? 'border-red-500 focus:ring-red-500' 
                : 'border-gray-300 focus:ring-church-primary'
            }`}
        >
            {children}
        </select>
         <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none text-gray-400" aria-hidden="true">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 9l4-4 4 4m0 6l-4 4-4-4"></path></svg>
        </div>
    </div>
);


const EmailCaptureForm: React.FC<EmailCaptureFormProps> = ({ onSubmit, sector }) => {
    const [formData, setFormData] = useState({
        fullName: '',
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
        if (!formData.fullName) newErrors.fullName = "Full name is required.";
        if (!formData.phone) newErrors.phone = "Phone number is required.";
        if (!formData.organizationType) newErrors.organizationType = "Organization type is required.";
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    }

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if(validate()){
            onSubmit(formData);
        }
    };

    return (
        <div className="animate-fade-in-up">
            <h2 className="text-3xl font-display font-bold text-center text-gray-800">Get Your LED Buyer's Guide</h2>
            <p className="text-center text-gray-600 mt-2">Enter your details to access the complete guide and valuable insights.</p>
            <form onSubmit={handleSubmit} className="mt-8 space-y-6 max-w-md mx-auto" noValidate>
                 <div>
                     <InputField id="fullName" type="text" placeholder="Full Name*" value={formData.fullName} onChange={handleChange} icon={<IconUser />} required aria-label="Full Name" error={errors.fullName} />
                     {errors.fullName && <p id="fullName-error" className="text-red-500 text-sm mt-1">{errors.fullName}</p>}
                   </div>
                <div>
                  <InputField id="phone" type="tel" placeholder="Phone Number*" value={formData.phone} onChange={handleChange} icon={<IconPhone />} required aria-label="Phone Number" error={errors.phone} />
                  {errors.phone && <p id="phone-error" className="text-red-500 text-sm mt-1">{errors.phone}</p>}
                </div>
                <div>
                  <SelectField id="organizationType" value={formData.organizationType} onChange={handleChange} icon={<IconBuildingOffice/>} required aria-label="Organization Type" error={errors.organizationType}>
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
                <p className="text-center text-xs text-gray-500">We'll never spam you. Guide access only.</p>
            </form>
        </div>
    );
};

export default EmailCaptureForm;