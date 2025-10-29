import React, { useState } from 'react';
import { UserData } from '../../../types';
import { IconMail, IconLocation } from '../../common/Icon';

interface ProgressiveFormProps {
    onSubmit: (data: Partial<UserData>) => void;
    onClose: () => void;
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

const ProgressiveForm: React.FC<ProgressiveFormProps> = ({ onSubmit, onClose }) => {
    const [formData, setFormData] = useState({
        city: '',
        state: '',
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
        if (!formData.city) newErrors.city = "City is required.";
        if (!formData.state) newErrors.state = "State is required.";
        if (!formData.email) {
            newErrors.email = "Email is required.";
        } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
            newErrors.email = "Email is invalid.";
        }
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (validate()) {
            onSubmit(formData);
        }
    };

    return (
        <div 
            className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 p-4"
            onClick={onClose}
            role="dialog"
            aria-modal="true"
            aria-labelledby="progressive-form-title"
        >
            <div 
                className="bg-white rounded-lg shadow-2xl p-8 w-full max-w-md animate-fade-in-up"
                onClick={e => e.stopPropagation()} // Prevent closing when clicking inside
            >
                <h4 id="progressive-form-title" className="text-2xl font-display font-bold text-center text-gray-800">📍 Complete Your Profile</h4>
                <p className="text-center text-gray-600 mt-2">Unlock personalized recommendations and the rest of the guide.</p>
                <form onSubmit={handleSubmit} className="mt-8 space-y-4" noValidate>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                            <InputField id="city" type="text" placeholder="City*" value={formData.city} onChange={handleChange} icon={<IconLocation />} required aria-label="City" />
                            {errors.city && <p className="text-red-500 text-sm mt-1">{errors.city}</p>}
                        </div>
                        <div>
                            <InputField id="state" type="text" placeholder="State*" value={formData.state} onChange={handleChange} icon={<IconLocation />} required aria-label="State" />
                            {errors.state && <p className="text-red-500 text-sm mt-1">{errors.state}</p>}
                        </div>
                    </div>
                    <div>
                        <InputField id="email" type="email" placeholder="Email Address*" value={formData.email} onChange={handleChange} icon={<IconMail />} required aria-label="Email Address" />
                        {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
                    </div>
                    <button
                        type="submit"
                        className="w-full bg-church-primary text-white font-bold py-3 px-4 rounded-md hover:bg-church-primary/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-church-primary transition-colors"
                    >
                        Continue Reading Guide
                    </button>
                </form>
            </div>
        </div>
    );
};

export default ProgressiveForm;
