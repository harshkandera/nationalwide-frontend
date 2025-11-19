
import React, { useState } from 'react';
import { LuMinus, LuPlus } from 'react-icons/lu';
import MaxWidthWrapper from '../../../component/MaxWidthWrapper';

const Careers = () => {
const jobs = [
    {
        title: 'Account Manager (Inside Sales)',
        location: 'Austin, Texas, USA',
        department: 'Sales',
        workType: 'Full time',
    },
    {
        title: 'Logistics Coordinator',
        location: 'Chicago, Illinois, USA',
        department: 'Logistics',
        workType: 'Full time',
    },
    {
        title: 'Administrative Assistant',
        location: 'Orlando, Florida, USA',
        department: 'Operations',
        workType: 'Full time',
    },
    {
        title: 'Commercial Director – North America',
        location: 'New York, New York, USA',
        department: 'Sales',
        workType: 'Full time',
    },
    {
        title: 'QA Engineer',
        location: 'San Francisco, California, USA',
        department: 'Engineering',
        workType: 'Full time',
    },
    {
        title: 'Customer Support Specialist (Bilingual – English & Spanish)',
        location: 'Houston, Texas, USA',
        department: 'Customer Support',
        workType: 'Full time',
    },
    {
        title: 'Account Manager (Inside Sales)',
        location: 'Miami, Florida, USA',
        department: 'Sales',
        workType: 'Full time',
    },
    {
        title: 'Risk & Compliance Analyst',
        location: 'Boston, Massachusetts, USA',
        department: 'Finance',
        workType: 'Full time',
    },
];

    return (
        <MaxWidthWrapper>
            <div className="py-10 sm:py-16 lg:py-24">
                <div className="max-w-5xl px-4 mx-auto sm:px-6 lg:px-8">
                    <div className="max-w-2xl mx-auto text-center">
                        <h2 className="text-3xl font-bold leading-tight text-richblue-200 sm:text-4xl lg:text-5xl">Job Openings </h2>
                     
                    </div>

                    <div className="flex flex-col gap-4 mt-20">
                        {jobs.map((job, index) => (
                            <div key={index} className="p-6 bg-white shadow-lg rounded-lg">
                                <h3 className="text-xl font-semibold text-richblue-900">
                                    Workplace type: {job.title}
                                </h3>
                                <p className="mt-2 text-gray-700">Location: {job.location}</p>
                                <p className="mt-2 text-gray-700">Department: {job.department}</p>
                                <p className="mt-2 text-gray-700">Work type: {job.workType}</p>
                            </div>
                        ))}
                    </div>

                    <div className="flex items-center justify-center mt-12 md:mt-16">
                        <div className="px-8 py-4 text-center bg-richblue-200 rounded-full">
                            <p className="text-gray-50">            If there are no current openings, feel free to send your resume for consideration for future opportunities.
                                <a href="#" title="" className="text-indigo-300 transition-all duration-200 hover:text-indigo-400 focus:text-indigo-400 hover:underline">Contact our support</a></p>
                        </div>
                    </div>
                </div>
            </div>


        </MaxWidthWrapper>
    );
};

export default Careers ;




