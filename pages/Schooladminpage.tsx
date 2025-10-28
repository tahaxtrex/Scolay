import React, { useState, useEffect, FormEvent } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { supabase } from '../services/supabase';
import { School, Grade, Database } from '../types';

const SchoolAdminPage: React.FC = () => {
    const { profile } = useAuth();
    const [school, setSchool] = useState<School | null>(null);
    const [grades, setGrades] = useState<Grade[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    const [description, setDescription] = useState('');
    const [address, setAddress] = useState('');
    const [logoUrl, setLogoUrl] = useState('');
    const [newGradeName, setNewGradeName] = useState('');
    const [isSaving, setIsSaving] = useState(false);
    const [successMessage, setSuccessMessage] = useState('');

    useEffect(() => {
        if (profile && profile.school_id) {
            fetchSchoolData(profile.school_id);
        } else if (profile) {
            setError("Your profile is not associated with a school.");
            setLoading(false);
        }
    }, [profile]);

    const fetchSchoolData = async (schoolId: string) => {
        setLoading(true);
        setError('');
        try {
            const { data: schoolData, error: schoolError } = await supabase
                .from('schools')
                .select('*')
                .eq('id', schoolId)
                .single();

            if (schoolError) throw schoolError;
            if (!schoolData) throw new Error("School not found.");
            
            const typedSchool = schoolData as School;
            setSchool(typedSchool);
            setDescription(typedSchool.description || '');
            setAddress(typedSchool.address || '');
            setLogoUrl(typedSchool.logo_url || '');

            const { data: gradesData, error: gradesError } = await supabase
                .from('grade_levels')
                .select('*')
                .eq('school_id', schoolId)
                .order('name');
            
            if (gradesError) throw gradesError;
            setGrades((gradesData as Grade[] | null) || []);

        } catch (err: any) {
            setError(err.message || "Failed to fetch school data.");
        } finally {
            setLoading(false);
        }
    };
    
    const handleUpdateProfile = async (e: FormEvent) => {
        e.preventDefault();
        if (!school) return;
        setIsSaving(true);
        setSuccessMessage('');

        const schoolUpdate: Database['public']['Tables']['schools']['Update'] = {
            description,
            address,
            logo_url: logoUrl,
        };

        const { error } = await (supabase
            .from('schools') as any)
            .update(schoolUpdate)
            .eq('id', school.id);
        
        if (error) {
            setError("Failed to update school profile.");
        } else {
            setSuccessMessage("Profile updated successfully!");
            // Refresh school data locally
            setSchool(prev => prev ? { ...prev, ...schoolUpdate } : null);
        }
        setIsSaving(false);
        setTimeout(() => setSuccessMessage(''), 3000);
    };

    const handleAddGrade = async (e: FormEvent) => {
        e.preventDefault();
        if (!school || !newGradeName.trim()) return;
        setIsSaving(true);
        setSuccessMessage('');

        const newGrade: Database['public']['Tables']['grade_levels']['Insert'] = {
            name: newGradeName.trim(),
            school_id: school.id,
        };

        const { data, error } = await (supabase
            .from('grade_levels') as any)
            .insert(newGrade)
            .select();

        if (error) {
            setError("Failed to add grade.");
        } else if (data) {
            const typed = data as Grade[];
            setGrades(prev => [...prev, ...typed]);
            setNewGradeName('');
            setSuccessMessage("Grade added successfully!");
        }
        setIsSaving(false);
        setTimeout(() => setSuccessMessage(''), 3000);
    };
    
    if (loading) return <div className="text-center p-8">Loading School Portal...</div>;
    if (error || !school) return <div className="text-center p-8 text-red-500">{error || "Could not load school information."}</div>;

    return (
        <div className="bg-gray-50 min-h-screen">
            <header className="bg-white shadow-sm">
                <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
                    <div className="flex items-center space-x-4">
                        {school.logo_url && (
                             <img src={school.logo_url} alt={`${school.name} logo`} className="h-16 w-16 object-contain rounded-md border p-1" />
                        )}
                        <div>
                            <h1 className="text-3xl font-bold text-gray-900">{school.name}</h1>
                            <p className="text-gray-600 mt-1">{school.address}</p>
                        </div>
                    </div>
                    <p className="text-gray-600 mt-2">Welcome, {profile?.full_name || 'Admin'}.</p>
                </div>
            </header>
            <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
                {successMessage && <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded relative mb-4" role="alert">{successMessage}</div>}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Left Column: School Profile & Grades */}
                    <div className="lg:col-span-2 space-y-8">
                        {/* School Profile Management */}
                        <div className="bg-white p-6 rounded-lg shadow">
                            <h2 className="text-2xl font-semibold text-gray-800 mb-4">School Profile</h2>
                            <form onSubmit={handleUpdateProfile} className="space-y-4">
                                <div>
                                    <label htmlFor="description" className="block text-sm font-medium text-gray-700">School Description</label>
                                    <textarea
                                        id="description"
                                        rows={4}
                                        value={description}
                                        onChange={(e) => setDescription(e.target.value)}
                                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                                        placeholder="Tell parents about your school..."
                                    ></textarea>
                                </div>
                                <div>
                                    <label htmlFor="address" className="block text-sm font-medium text-gray-700">Address</label>
                                    <input
                                        id="address"
                                        type="text"
                                        value={address}
                                        onChange={(e) => setAddress(e.target.value)}
                                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                                        placeholder="e.g., 123 Main St, Rabat, Morocco"
                                    />
                                </div>
                                <div>
                                    <label htmlFor="logo_url" className="block text-sm font-medium text-gray-700">Logo URL</label>
                                    <input
                                        id="logo_url"
                                        type="url"
                                        value={logoUrl}
                                        onChange={(e) => setLogoUrl(e.target.value)}
                                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                                        placeholder="https://example.com/logo.png"
                                    />
                                </div>
                                <div className="mt-4 text-right">
                                    <button type="submit" disabled={isSaving} className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:bg-blue-300">
                                        {isSaving ? 'Saving...' : 'Save Profile'}
                                    </button>
                                </div>
                            </form>
                        </div>

                        {/* Grade Management */}
                        <div className="bg-white p-6 rounded-lg shadow">
                            <h2 className="text-2xl font-semibold text-gray-800 mb-4">Manage Grades</h2>
                            <form onSubmit={handleAddGrade} className="flex items-center gap-4 mb-6">
                                <input
                                    type="text"
                                    value={newGradeName}
                                    onChange={(e) => setNewGradeName(e.target.value)}
                                    placeholder="Enter new grade name (e.g., Grade 5)"
                                    className="flex-grow block w-full border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm p-2"
                                />
                                <button type="submit" disabled={isSaving || !newGradeName.trim()} className="py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-green-600 hover:bg-green-700 disabled:bg-green-300">
                                    {isSaving ? 'Adding...' : 'Add Grade'}
                                </button>
                            </form>
                            <ul className="space-y-2">
                                {grades.length > 0 ? grades.map(grade => (
                                    <li key={grade.id} className="p-3 bg-gray-50 rounded-md border">{grade.name}</li>
                                )) : <p className="text-gray-500">No grades found for this school.</p>}
                            </ul>
                        </div>
                    </div>
                    
                    {/* Right Column: Placeholders */}
                    <div className="space-y-8">
                        <div className="bg-white p-6 rounded-lg shadow">
                            <h3 className="text-xl font-semibold text-gray-800">Manage Users</h3>
                            <p className="mt-2 text-gray-600">User management functionality coming soon.</p>
                        </div>
                         <div className="bg-white p-6 rounded-lg shadow">
                            <h3 className="text-xl font-semibold text-gray-800">View Orders</h3>
                            <p className="mt-2 text-gray-600">View school-specific orders here in the future.</p>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
};

export default SchoolAdminPage;
