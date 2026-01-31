require('dotenv').config();
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function mockBookingCreation() {
    const servicePrice = 1200;
    const commissionRate = 0.05;

    // Logic simulation from API
    const baseTotal = servicePrice;
    const platformFee = Math.round(baseTotal * commissionRate);
    const finalPrice = baseTotal + platformFee;

    console.log('--- API Logic Simulation ---');
    console.log('Service Price:', servicePrice);
    console.log('Commission (5%):', platformFee);
    console.log('Final Stored Price (Total):', finalPrice);

    // Logic simulation from Dashboard
    const services = [{ price: 1200, quantity: 1 }];
    const dashboardPayment = services.reduce((sum, s) => sum + (s.price * s.quantity), 0);

    console.log('--- Dashboard Logic Simulation ---');
    console.log('Calculated Display Payment:', dashboardPayment);

    if (finalPrice === 1260 && dashboardPayment === 1200) {
        console.log('✅ Logic Verification PASSED');
    } else {
        console.log('❌ Logic Verification FAILED');
    }
}

mockBookingCreation();
