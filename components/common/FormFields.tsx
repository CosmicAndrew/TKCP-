import React from 'react';

export const InputField: React.FC<{ id: string, type: string, placeholder: string, value: string, onChange: (e: React.ChangeEvent<HTMLInputElement>) => void, icon: React.ReactNode, required?: boolean, label: string, error?: string }> = 
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
                className={`w-full pl-10 pr-4 py-2 md:py-3 border rounded-md focus:ring-2 focus:border-transparent transition bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-200 dark:placeholder-gray-400 ${
                    error 
                    ? 'border-red-500 focus:ring-red-500' 
                    : 'border-gray-300 dark:border-gray-600 focus:ring-church-primary'
                }`}
            />
        </div>
    </>
);

export const SelectField: React.FC<{ id: string, value: string, onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void, icon: React.ReactNode, required?: boolean, children: React.ReactNode, label: string, error?: string }> =
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
                className={`w-full pl-10 pr-4 py-2 md:py-3 border rounded-md focus:ring-2 focus:border-transparent transition appearance-none bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-200 ${
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