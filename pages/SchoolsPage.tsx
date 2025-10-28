
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { supabase } from '../services/supabase';
import { School } from '../types';
import { LocationIcon } from '../components/icons';

const SchoolsPage: React.FC = () => {
  const [schools, setSchools] = useState<School[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchSchools = async () => {
      setLoading(true);
      const { data, error } = await supabase.from('schools').select('*').order('name');

      if (error) {
        console.error('Error fetching schools:', error);
        setError('Could not load schools. Please try again later.');
      } else {
        setSchools((data as School[]) || []);
      }
      setLoading(false);
    };

    fetchSchools();
  }, []);

  return (
    <div className="bg-slate-50 min-h-full">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-extrabold text-gray-900 tracking-tight">Our Partner Schools</h1>
          <p className="mt-4 max-w-2xl mx-auto text-lg text-gray-600">
            Find your school below to get started with your official supply list.
          </p>
        </div>

        {loading && (
          <div className="text-center text-gray-600">
            <p>Loading schools...</p>
          </div>
        )}

        {error && (
          <div className="text-center text-red-600 bg-red-50 p-4 rounded-md">
            <p>{error}</p>
          </div>
        )}

        {!loading && !error && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {schools.map((school) => (
              <a 
                key={school.id}
                href={`#find-supplies`} // In a real app, this would be a link to a school-specific page
                onClick={(e) => {
                  e.preventDefault();
                  // For now, smooth scroll to the homepage finder
                  const finder = document.getElementById('find-supplies');
                  if (finder) {
                    finder.scrollIntoView({ behavior: 'smooth' });
                  }
                }}
                className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-xl transition-shadow duration-300 group"
              >
                <div className="p-8">
                  <div className="uppercase tracking-wide text-sm text-blue-600 font-semibold">{school.name}</div>
                   <p className="mt-2 text-gray-500 flex items-start">
                     <LocationIcon className="w-5 h-5 mr-2 text-gray-400 flex-shrink-0 mt-1" />
                     <span>{school.address || 'Address not available'}</span>
                   </p>
                  <p className="block mt-4 text-lg leading-tight font-medium text-black group-hover:underline">View Supply Lists</p>
                </div>
              </a>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default SchoolsPage;
