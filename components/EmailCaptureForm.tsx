import React, { useState } from 'react';
import { UserData } from '../types';
import { IconArrowRight, IconUser, IconMail } from './common/Icon';

interface EmailCaptureFormProps {
    onSubmit: (data: Partial<UserData>) => void;
}

const InputField: React.FC<{ id: string, type: string, placeholder: string, value: string, onChange: (e: React.ChangeEvent<HTMLInputElement>) => void, icon: React.ReactNode, required?: boolean, 'aria-label': string }> = 
({ id, type, placeholder, value, onChange, icon, required, 'aria-label': ariaLabel }) => (
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
            className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-church-primary focus:border-transparent transition"
        />
    </div>
);

const EmailCaptureForm: React.FC<EmailCaptureFormProps> = ({ onSubmit }) => {
    const [formData, setFormData] = useState({
        firstName: '',
        email: '',
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
        if (!formData.email) {
            newErrors.email = "Email is required.";
        } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
            newErrors.email = "Email is invalid.";
        }
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
        <div>
            <h2 className="text-3xl font-display font-bold text-center text-gray-800">Great! Let's Stay in Touch.</h2>
            <p className="text-center text-gray-600 mt-2">Enter your info to receive our exclusive <span className="font-bold text-church-primary">LED Buyer's Guide</span> and valuable insights.</p>
            <form onSubmit={handleSubmit} className="mt-8 space-y-6 max-w-md mx-auto" noValidate>
                 <div>
                     <InputField id="firstName" type="text" placeholder="First Name" value={formData.firstName} onChange={handleChange} icon={<IconUser />} required aria-label="First Name" />
                     {errors.firstName && <p className="text-red-500 text-sm mt-1">{errors.firstName}</p>}
                   </div>
                <div>
                  <InputField id="email" type="email" placeholder="Email Address" value={formData.email} onChange={handleChange} icon={<IconMail />} required aria-label="Email Address"/>
                  {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
                </div>
                <button
                    type="submit"
                    className="w-full flex items-center justify-center bg-church-primary text-white font-bold py-3 px-6 rounded-md hover:bg-church-primary/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-church-primary transition-all duration-300"
                >
                    Send My Guide
                    <IconArrowRight className="ml-2" />
                </button>
            </form>
        </div>
    );
};

export default EmailCaptureForm;