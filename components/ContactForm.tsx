import React, { useState } from 'react';
import { UserData } from '../types';
import { IconArrowRight, IconUser, IconMail, IconPhone, IconLocation } from './common/Icon';

interface ContactFormProps {
    onSubmit: (data: UserData) => void;
}

const InputField: React.FC<{ id: string, type: string, placeholder: string, value: string, onChange: (e: React.ChangeEvent<HTMLInputElement>) => void, icon: React.ReactNode, required?: boolean }> = 
({ id, type, placeholder, value, onChange, icon, required }) => (
    <div className="relative">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
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
            className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-church-primary focus:border-transparent transition"
        />
    </div>
);

const ContactForm: React.FC<ContactFormProps> = ({ onSubmit }) => {
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
            onSubmit(formData);
        }
    };

    return (
        <div>
            <h2 className="text-3xl font-display font-bold text-center text-gray-800">One Last Step...</h2>
            <p className="text-center text-gray-600 mt-2">Let us know where to send your personalized results.</p>
            <form onSubmit={handleSubmit} className="mt-8 space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                   <div>
                     <InputField id="firstName" type="text" placeholder="First Name" value={formData.firstName} onChange={handleChange} icon={<IconUser />} required />
                     {errors.firstName && <p className="text-red-500 text-sm mt-1">{errors.firstName}</p>}
                   </div>
                   <div>
                     <InputField id="lastName" type="text" placeholder="Last Name" value={formData.lastName} onChange={handleChange} icon={<IconUser />} required />
                     {errors.lastName && <p className="text-red-500 text-sm mt-1">{errors.lastName}</p>}
                   </div>
                </div>
                <div>
                  <InputField id="email" type="email" placeholder="Email Address" value={formData.email} onChange={handleChange} icon={<IconMail />} required />
                  {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
                </div>
                <div>
                    <InputField id="phone" type="tel" placeholder="Phone Number" value={formData.phone} onChange={handleChange} icon={<IconPhone />} required/>
                    {errors.phone && <p className="text-red-500 text-sm mt-1">{errors.phone}</p>}
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                   <div>
                     <InputField id="city" type="text" placeholder="City" value={formData.city} onChange={handleChange} icon={<IconLocation />} required />
                     {errors.city && <p className="text-red-500 text-sm mt-1">{errors.city}</p>}
                   </div>
                   <div>
                     <InputField id="state" type="text" placeholder="State" value={formData.state} onChange={handleChange} icon={<IconLocation />} required />
                     {errors.state && <p className="text-red-500 text-sm mt-1">{errors.state}</p>}
                   </div>
                </div>

                <button
                    type="submit"
                    className="w-full flex items-center justify-center bg-church-primary text-white font-bold py-3 px-6 rounded-md hover:bg-church-primary/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-church-primary transition-all duration-300"
                >
                    See My Results
                    <IconArrowRight className="ml-2" />
                </button>
            </form>
        </div>
    );
};

export default ContactForm;
