// Mock support ticket data for admin panel

export const mockTickets = [
  {
    id: 'TK001',
    subject: 'Unable to withdraw funds from wallet',
    description: 'I have been trying to withdraw my earnings for the past 3 days but the transaction keeps failing.',
    category: 'payment',
    priority: 'high',
    status: 'open',
    userId: 'USR001',
    userName: 'Rohit Sharma',
    userEmail: 'rohit@example.com',
    userRole: 'freelancer',
    assignedTo: 'Support Team',
    createdAt: '2024-03-20 10:30 AM',
    updatedAt: '2024-03-21 2:00 PM',
    messages: [
      {
        id: 'MSG001',
        sender: 'Rohit Sharma',
        senderType: 'user',
        message: 'I have been trying to withdraw my earnings for the past 3 days but the transaction keeps failing. My wallet shows ₹12,500 but I cannot access it.',
        timestamp: '2024-03-20 10:30 AM'
      },
      {
        id: 'MSG002',
        sender: 'Support Team',
        senderType: 'admin',
        message: 'Thank you for contacting us. We are looking into this issue. Can you please provide your wallet ID and the transaction IDs that failed?',
        timestamp: '2024-03-20 11:00 AM'
      },
      {
        id: 'MSG003',
        sender: 'Rohit Sharma',
        senderType: 'user',
        message: 'Wallet ID: WAL001, Failed transactions: TXN008, TXN009',
        timestamp: '2024-03-20 2:30 PM'
      }
    ]
  },
  {
    id: 'TK002',
    subject: 'Service was not delivered as promised',
    description: 'The freelancer did not show up for the scheduled coaching session.',
    category: 'dispute',
    priority: 'urgent',
    status: 'in_progress',
    userId: 'USR002',
    userName: 'Priya Patel',
    userEmail: 'priya@example.com',
    userRole: 'client',
    assignedTo: 'Admin',
    createdAt: '2024-03-19 4:00 PM',
    updatedAt: '2024-03-20 9:00 AM',
    messages: [
      {
        id: 'MSG004',
        sender: 'Priya Patel',
        senderType: 'user',
        message: 'I booked a coaching session for yesterday at 4 PM but the coach never showed up. I want a full refund.',
        timestamp: '2024-03-19 4:00 PM'
      },
      {
        id: 'MSG005',
        sender: 'Admin',
        senderType: 'admin',
        message: 'We apologize for the inconvenience. We have contacted the freelancer and are investigating the matter.',
        timestamp: '2024-03-19 5:30 PM'
      }
    ]
  },
  {
    id: 'TK003',
    subject: 'How to update my service packages?',
    description: 'Need help updating my service pricing and packages.',
    category: 'general',
    priority: 'low',
    status: 'resolved',
    userId: 'USR003',
    userName: 'Virat Singh',
    userEmail: 'virat@example.com',
    userRole: 'freelancer',
    assignedTo: 'Support Team',
    createdAt: '2024-03-18 11:00 AM',
    updatedAt: '2024-03-18 2:00 PM',
    resolvedAt: '2024-03-18 2:00 PM',
    messages: [
      {
        id: 'MSG006',
        sender: 'Virat Singh',
        senderType: 'user',
        message: 'I want to update my coaching packages and add a premium tier. How do I do this?',
        timestamp: '2024-03-18 11:00 AM'
      },
      {
        id: 'MSG007',
        sender: 'Support Team',
        senderType: 'admin',
        message: 'You can update your service packages by going to Profile > Services > Edit Service. Click on "Manage Packages" to add or modify your pricing tiers.',
        timestamp: '2024-03-18 11:30 AM'
      },
      {
        id: 'MSG008',
        sender: 'Virat Singh',
        senderType: 'user',
        message: 'Thank you! I found it and updated my packages successfully.',
        timestamp: '2024-03-18 2:00 PM'
      }
    ]
  },
  {
    id: 'TK004',
    subject: 'Account verification pending for too long',
    description: 'My KYC documents were submitted 10 days ago but verification is still pending.',
    category: 'verification',
    priority: 'medium',
    status: 'open',
    userId: 'USR004',
    userName: 'Ananya Reddy',
    userEmail: 'ananya@example.com',
    userRole: 'freelancer',
    assignedTo: 'Unassigned',
    createdAt: '2024-03-21 9:00 AM',
    updatedAt: '2024-03-21 9:00 AM',
    messages: [
      {
        id: 'MSG009',
        sender: 'Ananya Reddy',
        senderType: 'user',
        message: 'I submitted all my KYC documents 10 days ago but my account is still showing as unverified. This is affecting my ability to get bookings.',
        timestamp: '2024-03-21 9:00 AM'
      }
    ]
  },
  {
    id: 'TK005',
    subject: 'Bug in booking system',
    description: 'Getting error when trying to book a service.',
    category: 'bug',
    priority: 'high',
    status: 'open',
    userId: 'USR005',
    userName: 'Amit Kumar',
    userEmail: 'amit@example.com',
    userRole: 'client',
    assignedTo: 'Tech Team',
    createdAt: '2024-03-21 11:30 AM',
    updatedAt: '2024-03-21 12:00 PM',
    messages: [
      {
        id: 'MSG010',
        sender: 'Amit Kumar',
        senderType: 'user',
        message: 'When I try to book a net bowling session, I get an error "Something went wrong". This has been happening since yesterday.',
        timestamp: '2024-03-21 11:30 AM'
      },
      {
        id: 'MSG011',
        sender: 'Tech Team',
        senderType: 'admin',
        message: 'We are aware of this issue and our technical team is working on a fix. We expect it to be resolved within the next 2 hours.',
        timestamp: '2024-03-21 12:00 PM'
      }
    ]
  }
];
