
import React, { useState } from 'react';
import { UserData } from '../../../types';
import { US_STATES } from '../../../constants';
import { InputField, SelectField } from '../../common/FormFields';
import { IconMail, IconLocation, IconSpinner } from '../../common/Icon';

interface ProgressiveFormProps {
    onSubmit: (data: Partial<UserData>) => void;
    onClose: () => void;
}

const ProgressiveForm: React.FC<ProgressiveFormProps> = ({ onSubmit, onClose }) => {
    const [formData, setFormData] = useState({
        city: '',
        state: '',
        email: '',
    });
    const [errors, setErrors] = useState<{ [key: string]: string }>({});
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
        if (errors[e.target.name]) setErrors({ ...errors, [e.target.name]: '' });
    };
    
    const handleSelectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
        if (errors[e.target.name]) setErrors({ ...errors, [e.target.name]: '' });
    };

    const focusFirstError = (newErrors: { [key: string]: string }) => {
        const firstErrorKey = Object.keys(newErrors)[0];
        document.getElementById(firstErrorKey)?.focus();
    };

    const validate = () => {
        const newErrors: { [key: string]: string } = {};
        if (!formData.city) newErrors.city = "City is required.";
        if (!formData.state) newErrors.state = "State is required.";
        
        const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
        if (!formData.email) {
            newErrors.email = "Email is required.";
        } else if (!emailRegex.test(formData.email)) {
            newErrors.email = "Please enter a valid email address (e.g., user@example.com).";
        }
        
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0 ? null : newErrors;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const validationErrors = validate();
        
        if (!validationErrors) {
            setIsSubmitting(true);
            try {
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
        <div 
            className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 p-4"
            onClick={onClose}
            role="dialog"
            aria-modal="true"
            aria-labelledby="progressive-form-title"
        >
            <div 
                className="bg-white dark:bg-gray-800 rounded-lg shadow-2xl p-8 w-full max-w-md animate-fade-in-up"
                onClick={e => e.stopPropagation()}
            >
                <h4 id="progressive-form-title" className="text-2xl font-display font-bold text-center text-gray-800 dark:text-gray-100">📍 Complete Your Profile</h4>
                <p className="text-center text-gray-600 dark:text-gray-300 mt-2">Unlock personalized recommendations and the rest of the guide.</p>
                <form onSubmit={handleSubmit} className="mt-8 space-y-4" noValidate>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                            <div className="relative">
                                <input autoFocus className="sr-only" aria-hidden="true" tabIndex={-1} />
                                <InputField 
                                    id="city" 
                                    type="text" 
                                    placeholder="City*" 
                                    value={formData.city} 
                                    onChange={handleChange} 
                                    icon={<IconLocation />} 
                                    required 
                                    label="City" 
                                    error={errors.city} 
                                />
                            </div>
                            {errors.city && <p id="city-error" role="alert" className="text-red-500 text-sm mt-1 animate-pulse">{errors.city}</p>}
                        </div>
                        <div>
                            <SelectField id="state" value={formData.state} onChange={handleSelectChange} icon={<IconLocation />} required label="State" error={errors.state}>
                                <option value="" disabled>State*</option>
                                {US_STATES.map(state => <option key={state} value={state}>{state}</option>)}
                            </SelectField>
                            {errors.state && <p id="state-error" role="alert" className="text-red-500 text-sm mt-1 animate-pulse">{errors.state}</p>}
                        </div>
                    </div>
                    <div>
                        <InputField id="email" type="email" placeholder="Email Address*" value={formData.email} onChange={handleChange} icon={<IconMail />} required label="Email Address" error={errors.email} />
                        {errors.email && <p id="email-error" role="alert" className="text-red-500 text-sm mt-1 animate-pulse">{errors.email}</p>}
                    </div>
                    <button
                        type="submit"
                        disabled={isSubmitting}
                        className="w-full flex items-center justify-center bg-church-primary text-white font-bold py-3 px-4 rounded-md hover:bg-church-primary/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-church-primary transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {isSubmitting ? (
                            <span className="flex items-center" role="status" aria-live="polite">
                                <IconSpinner className="mr-2 animate-spin" />
                                Saving Profile...
                            </span>
                        ) : (
                            "Continue Reading Guide"
                        )}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default ProgressiveForm;
