import React, { useState } from 'react';
import { UserData } from '../../../types';
import { US_STATES } from '../../../constants';
import { InputField, SelectField } from '../../common/FormFields';
import { IconMail, IconLocation } from '../../common/Icon';

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
