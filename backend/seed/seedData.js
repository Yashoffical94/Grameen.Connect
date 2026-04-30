import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User from '../models/User.js';
import Job from '../models/Job.js';
import connectDB from '../config/db.js';

dotenv.config();

const seedData = async () => {
  try {
    await connectDB();

    // Clear existing data
    await User.deleteMany({});
    await Job.deleteMany({});

    console.log('Cleared existing data...');

    // Create labour users
    const labourUsers = await User.create([
      {
        name: 'Ramesh Singh',
        email: 'ramesh@gc.com',
        phone: '+919876543210',
        passwordHash: 'test123',
        role: 'labour',
        trade: 'Masonry',
        location: { state: 'Bihar', district: 'Patna', city: 'Patna' },
        skills: ['Brick laying', 'Concrete work', 'Plastering'],
        bio: 'Experienced mason with 12 years in residential and commercial construction.',
        experience: 12,
        dailyRate: 500,
        languages: ['Hindi', 'Bhojpuri'],
        available: true,
        verified: true,
        rating: 4.9,
        totalReviews: 28,
        totalJobsDone: 45,
      },
      {
        name: 'Santosh Kumar',
        email: 'santosh@gc.com',
        phone: '+919876543211',
        passwordHash: 'test123',
        role: 'labour',
        trade: 'Electrician',
        location: { state: 'Uttar Pradesh', district: 'Varanasi', city: 'Varanasi' },
        skills: ['Wiring', 'Panel installation', 'Troubleshooting', 'Solar systems'],
        bio: 'Certified electrician specializing in residential and industrial wiring.',
        experience: 10,
        dailyRate: 600,
        languages: ['Hindi', 'English'],
        available: true,
        verified: true,
        rating: 4.9,
        totalReviews: 32,
        totalJobsDone: 52,
      },
      {
        name: 'Arun Paswan',
        email: 'arun@gc.com',
        phone: '+919876543212',
        passwordHash: 'test123',
        role: 'labour',
        trade: 'Plumbing',
        location: { state: 'Bihar', district: 'Gaya', city: 'Gaya' },
        skills: ['Pipe fitting', 'Water tanks', 'Bathroom installation', 'Leak repair'],
        bio: 'Skilled plumber for all types of water supply and drainage work.',
        experience: 8,
        dailyRate: 450,
        languages: ['Hindi', 'Bhojpuri'],
        available: true,
        verified: true,
        rating: 4.7,
        totalReviews: 21,
        totalJobsDone: 38,
      },
      {
        name: 'Mohan Das',
        email: 'mohan@gc.com',
        phone: '+919876543213',
        passwordHash: 'test123',
        role: 'labour',
        trade: 'Carpentry',
        location: { state: 'Bihar', district: 'Nalanda', city: 'Bihar Sharif' },
        skills: ['Furniture making', 'Door/Window frames', 'Roofing', 'Formwork'],
        bio: 'Master carpenter with expertise in traditional and modern woodworking.',
        experience: 15,
        dailyRate: 520,
        languages: ['Hindi', 'Maithili'],
        available: true,
        verified: true,
        rating: 4.6,
        totalReviews: 19,
        totalJobsDone: 41,
      },
      {
        name: 'Jagdish Kumar',
        email: 'jagdish@gc.com',
        phone: '+919876543214',
        passwordHash: 'test123',
        role: 'labour',
        trade: 'Welding',
        location: { state: 'Jharkhand', district: 'Ranchi', city: 'Ranchi' },
        skills: ['Arc welding', 'MIG welding', 'Steel structures', 'Gate fabrication'],
        bio: 'Professional welder for structural and decorative metalwork.',
        experience: 11,
        dailyRate: 650,
        languages: ['Hindi', 'Nagpuri'],
        available: true,
        verified: true,
        rating: 4.8,
        totalReviews: 25,
        totalJobsDone: 36,
      },
      {
        name: 'Rajesh Prasad',
        email: 'rajesh@gc.com',
        phone: '+919876543215',
        passwordHash: 'test123',
        role: 'labour',
        trade: 'Painting',
        location: { state: 'Bihar', district: 'Darbhanga', city: 'Darbhanga' },
        skills: ['Interior painting', 'Exterior painting', 'Texture finishes', 'Waterproofing'],
        bio: 'Quality painter with attention to detail and clean work.',
        experience: 7,
        dailyRate: 400,
        languages: ['Hindi', 'Maithili'],
        available: true,
        verified: true,
        rating: 4.5,
        totalReviews: 16,
        totalJobsDone: 29,
      },
    ]);

    console.log('Created labour users...');

    // Create contractor users
    const contractorUsers = await User.create([
      {
        name: 'Anil Sharma',
        email: 'anil@gc.com',
        phone: '+919876543220',
        passwordHash: 'test123',
        role: 'contractor',
        company: 'Anil Constructions Pvt Ltd',
        location: { state: 'Bihar', district: 'Gaya', city: 'Gaya' },
        bio: 'Registered construction company with 20+ years of experience in infrastructure projects.',
        languages: ['Hindi', 'English'],
        verified: true,
        rating: 4.7,
        totalReviews: 45,
        totalJobsDone: 78,
      },
      {
        name: 'Mahesh Yadav',
        email: 'mahesh@gc.com',
        phone: '+919876543221',
        passwordHash: 'test123',
        role: 'contractor',
        company: 'Mahesh Kumar Infrastructure',
        location: { state: 'Jharkhand', district: 'Ranchi', city: 'Ranchi' },
        bio: 'Leading infrastructure contractor specializing in government and private projects.',
        languages: ['Hindi', 'Nagpuri', 'English'],
        verified: true,
        rating: 4.6,
        totalReviews: 38,
        totalJobsDone: 62,
      },
    ]);

    console.log('Created contractor users...');

    // Create jobs
    const jobs = await Job.create([
      {
        contractorId: contractorUsers[0]._id,
        title: 'Road Repair Project',
        description: 'Looking for skilled labourers for road repair and maintenance work. Experience with concrete and asphalt preferred.',
        type: 'Civil',
        trade: 'Civil',
        location: { state: 'Bihar', district: 'Gaya' },
        workersNeeded: 8,
        dailyRate: 450,
        duration: '2-3 months',
        startDate: new Date('2026-05-01'),
        endDate: new Date('2026-07-31'),
        requiredSkills: ['Concrete work', 'Road construction'],
        accommodation: 'none',
        languagePreference: 'Hindi',
        status: 'active',
        views: 124,
        applicantsCount: 12,
      },
      {
        contractorId: contractorUsers[0]._id,
        title: 'House Construction G+2',
        description: 'Residential building construction project. Need masons, labourers, and skilled workers for multi-story house construction.',
        type: 'Construction',
        trade: 'Masonry',
        location: { state: 'Bihar', district: 'Patna' },
        workersNeeded: 12,
        dailyRate: 500,
        duration: '6 months',
        startDate: new Date('2026-05-15'),
        endDate: new Date('2026-11-15'),
        requiredSkills: ['Brick laying', 'Concrete work', 'Plastering'],
        accommodation: 'partial',
        languagePreference: 'Hindi',
        status: 'active',
        views: 256,
        applicantsCount: 28,
      },
      {
        contractorId: contractorUsers[1]._id,
        title: 'School Renovation',
        description: 'Government school renovation project including painting, electrical work, and minor repairs.',
        type: 'Renovation',
        trade: 'Painting',
        location: { state: 'Jharkhand', district: 'Ranchi' },
        workersNeeded: 6,
        dailyRate: 480,
        duration: '1 month',
        startDate: new Date('2026-05-10'),
        endDate: new Date('2026-06-10'),
        requiredSkills: ['Interior painting', 'Exterior painting'],
        accommodation: 'none',
        languagePreference: 'Hindi',
        status: 'active',
        views: 89,
        applicantsCount: 8,
      },
      {
        contractorId: contractorUsers[1]._id,
        title: 'JJM Irrigation Channel',
        description: 'Jal Jeevan Mission irrigation channel construction. Need labourers for excavation and concrete work.',
        type: 'Construction',
        trade: 'Road & Civil',
        location: { state: 'Jharkhand', district: 'Hazaribagh' },
        workersNeeded: 20,
        dailyRate: 350,
        duration: '4 months',
        startDate: new Date('2026-06-01'),
        endDate: new Date('2026-10-01'),
        requiredSkills: ['Excavation', 'Concrete work'],
        accommodation: 'full',
        languagePreference: 'Hindi',
        status: 'active',
        views: 312,
        applicantsCount: 45,
      },
      {
        contractorId: contractorUsers[0]._id,
        title: 'Hospital Electrical Wiring',
        description: 'Complete electrical wiring for new hospital building. Need certified electricians with hospital experience.',
        type: 'Skilled Trade',
        trade: 'Electrician',
        location: { state: 'Bihar', district: 'Muzaffarpur' },
        workersNeeded: 4,
        dailyRate: 700,
        duration: '2 months',
        startDate: new Date('2026-05-20'),
        endDate: new Date('2026-07-20'),
        requiredSkills: ['Wiring', 'Panel installation', 'Troubleshooting'],
        accommodation: 'partial',
        languagePreference: 'Hindi',
        status: 'active',
        views: 178,
        applicantsCount: 15,
      },
      {
        contractorId: contractorUsers[1]._id,
        title: 'Bridge Pillar Construction',
        description: 'Major bridge construction project. Need experienced masons and labourers for pillar foundation work.',
        type: 'Construction',
        trade: 'Masonry',
        location: { state: 'Bihar', district: 'Bhagalpur' },
        workersNeeded: 15,
        dailyRate: 550,
        duration: '8 months',
        startDate: new Date('2026-04-15'),
        endDate: new Date('2026-12-15'),
        requiredSkills: ['Concrete work', 'Foundation work', 'Brick laying'],
        accommodation: 'full',
        languagePreference: 'Hindi',
        status: 'closed',
        views: 445,
        applicantsCount: 67,
      },
    ]);

    console.log('Created jobs...');

    console.log('\n✅ Seeding completed successfully!');
    console.log('\nTest Credentials:');
    console.log('Labour: ramesh@gc.com / test123');
    console.log('Contractor: anil@gc.com / test123');
    console.log('');

    process.exit(0);
  } catch (error) {
    console.error('Seeding error:', error);
    process.exit(1);
  }
};

seedData();
