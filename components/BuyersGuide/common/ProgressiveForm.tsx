import React, { useState } from 'react';
import { UserData } from '../../../types';
import { US_STATES } from '../../../constants';
import { IconMail, IconLocation } from '../../common/Icon';

interface ProgressiveFormProps {
    onSubmit: (data: Partial<UserData>) => void;
    onClose: () => void;
}

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
    
    const handleSelectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
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
                className="bg-white dark:bg-gray-800 rounded-lg shadow-2xl p-8 w-full max-w-md animate-fade-in-up"
                onClick={e => e.stopPropagation()} // Prevent closing when clicking inside
            >
                <h4 id="progressive-form-title" className="text-2xl font-display font-bold text-center text-gray-800 dark:text-gray-100">📍 Complete Your Profile</h4>
                <p className="text-center text-gray-600 dark:text-gray-300 mt-2">Unlock personalized recommendations and the rest of the guide.</p>
                <form onSubmit={handleSubmit} className="mt-8 space-y-4" noValidate>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                            <InputField id="city" type="text" placeholder="City*" value={formData.city} onChange={handleChange} icon={<IconLocation />} required label="City" error={errors.city} />
                            {errors.city && <p className="text-red-500 text-sm mt-1">{errors.city}</p>}
                        </div>
                        <div>
                            <SelectField id="state" value={formData.state} onChange={handleSelectChange} icon={<IconLocation />} required label="State" error={errors.state}>
                                <option value="" disabled>State*</option>
                                {US_STATES.map(state => <option key={state} value={state}>{state}</option>)}
                            </SelectField>
                            {errors.state && <p className="text-red-500 text-sm mt-1">{errors.state}</p>}
                        </div>
                    </div>
                    <div>
                        <InputField id="email" type="email" placeholder="Email Address*" value={formData.email} onChange={handleChange} icon={<IconMail />} required label="Email Address" error={errors.email} />
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