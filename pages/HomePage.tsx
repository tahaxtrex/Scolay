import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../services/supabase';
import { School, Grade, SupplyList } from '../types';
import { CheckCircleIcon, ArrowRightIcon, StepIcon1, StepIcon2, StepIcon3, StepIcon4 } from '../components/icons';

const HomePage: React.FC = () => {
  return (
    <div>
      <HeroSection />
      <HowItWorksSection />
      <FindSuppliesSection />
    </div>
  );
};

const HeroSection = () => (
  <section className="relative text-white py-24 md:py-32 bg-gradient-to-br from-blue-500 to-purple-600">
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
      <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight mb-4">
        School Supply Shopping Made Simple
      </h1>
      <p className="max-w-3xl mx-auto text-lg md:text-xl text-blue-100 mb-8">
        Select your school and grade, and we’ll show you the exact supplies you need. Order everything in one click and have it delivered before school starts.
      </p>
      <div className="flex flex-col sm:flex-row justify-center items-center gap-4">
        <a href="#find-supplies" className="w-full sm:w-auto inline-flex items-center justify-center px-8 py-3 text-lg font-semibold text-white bg-orange-500 rounded-lg shadow-lg hover:bg-orange-600 transition-transform transform hover:scale-105">
          Get Started <ArrowRightIcon className="w-5 h-5 ml-2" />
        </a>
        <button className="w-full sm:w-auto px-8 py-3 text-lg font-semibold bg-white/20 rounded-lg hover:bg-white/30 backdrop-blur-sm transition">
          Learn More
        </button>
      </div>
      <div className="mt-12 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 text-sm max-w-4xl mx-auto">
        <Feature text="Save hours of shopping time" />
        <Feature text="Get exactly what your school requires" />
        <Feature text="Delivery or pickup options" />
        <Feature text="Secure online payment" />
      </div>
    </div>
  </section>
);

const Feature = ({ text }: { text: string }) => (
  <div className="flex items-center justify-center p-3 bg-white/10 rounded-lg backdrop-blur-sm">
    <CheckCircleIcon className="w-5 h-5 text-green-300 mr-2" />
    <span>{text}</span>
  </div>
);

const HowItWorksSection = () => (
  <section className="py-16 sm:py-24 bg-white">
    <div className="container mx-auto px-4 sm:px-6 lg:px-8">
      <div className="text-center">
        <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">How It Works</h2>
        <p className="max-w-2xl mx-auto text-gray-600 mb-12">
          Getting your school supplies has never been easier. Follow these simple steps.
        </p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
        <StepCard
          icon={<StepIcon1 className="w-10 h-10 text-blue-500" />}
          step={1}
          title="Select School & Grade"
          description="Choose your child's school and grade level from our comprehensive list."
        />
        <StepCard
          icon={<StepIcon2 className="w-10 h-10 text-blue-500" />}
          step={2}
          title="View Supply List"
          description="Instantly see the official supply list required by your school."
        />
        <StepCard
          icon={<StepIcon3 className="w-10 h-10 text-blue-500" />}
          step={3}
          title="Add to Cart"
          description="Add all required items to your cart with a single click."
        />
        <StepCard
          icon={<StepIcon4 className="w-10 h-10 text-blue-500" />}
          step={4}
          title="Checkout & Deliver"
          description="Complete payment and choose delivery or pickup. Done!"
        />
      </div>
    </div>
  </section>
);

const StepCard = ({ icon, step, title, description }: { icon: React.ReactNode, step: number, title: string, description: string }) => (
  <div className="text-center p-6 border border-gray-200 rounded-lg shadow-sm hover:shadow-lg transition-shadow">
    <div className="inline-flex items-center justify-center w-16 h-16 mb-4 rounded-full bg-blue-100 relative">
      {icon}
      <span className="absolute -top-2 -right-2 flex h-8 w-8 items-center justify-center rounded-full bg-blue-500 text-white font-bold text-sm border-4 border-white">{step}</span>
    </div>
    <h3 className="text-xl font-semibold text-gray-800 mb-2">{title}</h3>
    <p className="text-gray-600">{description}</p>
  </div>
);

const FindSuppliesSection = () => {
    const [schools, setSchools] = useState<School[]>([]);
    const [grades, setGrades] = useState<Grade[]>([]);
    const [selectedSchool, setSelectedSchool] = useState('');
    const [selectedGrade, setSelectedGrade] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        const fetchSchools = async () => {
            const { data, error } = await supabase.from('schools').select('*');
            if (error) console.error('Error fetching schools:', error);
            // Fix: Cast Supabase result to the correct type to avoid `never[]` inference issue.
            else setSchools((data as School[]) || []);
        };
        fetchSchools();
    }, []);

    useEffect(() => {
        if (selectedSchool) {
            const fetchGrades = async () => {
                setLoading(true);
                setSelectedGrade('');
                const { data, error } = await supabase.from('grade_levels').select('*').eq('school_id', selectedSchool);
                if (error) console.error('Error fetching grades:', error);
                // Fix: Cast Supabase result to the correct type to avoid `never[]` inference issue.
                else setGrades((data as Grade[]) || []);
                setLoading(false);
            };
            fetchGrades();
        } else {
            setGrades([]);
        }
    }, [selectedSchool]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!selectedSchool || !selectedGrade) {
            setError('Please select a school and a grade.');
            return;
        }
        setError('');
        setLoading(true);

        try {
            const { data, error } = await supabase
                .from('supply_lists')
                .select('id')
                .eq('grade_level_id', selectedGrade)
                .single();

            if (error || !data) {
                setError('Could not find a supply list for the selected grade.');
                console.error(error);
            } else {
                // FIX: Cast `data` to fix `never` type inference from Supabase.
                navigate(`/list/${(data as SupplyList).id}`);
            }
        } catch (err) {
            setError('An unexpected error occurred.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <section id="find-supplies" className="py-16 sm:py-24 bg-slate-50">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                <div className="max-w-2xl mx-auto bg-white p-8 border border-gray-200 rounded-2xl shadow-lg">
                    <div className="text-center mb-8">
                        <h2 className="text-3xl font-bold text-gray-800">Find Your School Supplies</h2>
                        <p className="text-gray-600 mt-2">Select your child's school and grade to view the required supply list</p>
                    </div>
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div>
                            <label htmlFor="school" className="block text-sm font-medium text-gray-700">School</label>
                            <select
                                id="school"
                                value={selectedSchool}
                                onChange={(e) => setSelectedSchool(e.target.value)}
                                className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
                            >
                                <option value="">Choose your school</option>
                                {schools.map((school) => (
                                    <option key={school.id} value={school.id}>{school.name}</option>
                                ))}
                            </select>
                        </div>
                        <div>
                            <label htmlFor="grade" className="block text-sm font-medium text-gray-700">Grade</label>
                            <select
                                id="grade"
                                value={selectedGrade}
                                onChange={(e) => setSelectedGrade(e.target.value)}
                                disabled={!selectedSchool || loading}
                                className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md disabled:bg-gray-100"
                            >
                                <option value="">Choose your grade</option>
                                {grades.map((grade) => (
                                    <option key={grade.id} value={grade.id}>{grade.name}</option>
                                ))}
                            </select>
                        </div>
                        {error && <p className="text-red-500 text-sm">{error}</p>}
                        <div>
                            <button
                                type="submit"
                                disabled={loading || !selectedGrade}
                                className="w-full flex justify-center items-center py-3 px-4 border border-transparent rounded-md shadow-sm text-base font-medium text-white bg-orange-500 hover:bg-orange-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500 disabled:bg-orange-300"
                            >
                                {loading ? 'Loading...' : 'View Supply List'}
                                <ArrowRightIcon className="w-5 h-5 ml-2" />
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </section>
    );
};

export default HomePage;