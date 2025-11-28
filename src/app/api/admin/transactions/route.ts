import { NextRequest, NextResponse } from 'next/server';

// Mock transaction data
let mockTransactions = [
  {
    id: 'TXN001',
    walletId: 'WAL001',
    userName: 'Rohit Sharma',
    userRole: 'freelancer',
    amount: 2125,
    type: 'EARNING',
    description: 'Payment for Net Bowling Session',
    reference: 'BK001',
    paymentMethod: 'platform_wallet',
    status: 'COMPLETED',
    createdAt: '2024-03-25T10:30:00Z',
  },
  {
    id: 'TXN002',
    walletId: 'WAL002',
    userName: 'Priya Patel',
    userRole: 'client',
    amount: 2500,
    type: 'DEBIT',
    description: 'Payment for Net Bowling Session',
    reference: 'BK001',
    paymentMethod: 'upi',
    paymentId: 'UPI_123456',
    status: 'COMPLETED',
    createdAt: '2024-03-25T10:00:00Z',
  },
  {
    id: 'TXN003',
    walletId: 'WAL001',
    userName: 'Rohit Sharma',
    userRole: 'freelancer',
    amount: 5000,
    type: 'WITHDRAWAL',
    description: 'Bank withdrawal request',
    paymentMethod: 'bank_transfer',
    status: 'PENDING',
    createdAt: '2024-03-24T15:00:00Z',
  },
  {
    id: 'TXN004',
    walletId: 'WAL003',
    userName: 'Virat Singh',
    userRole: 'freelancer',
    amount: 2975,
    type: 'EARNING',
    description: 'Payment for Professional Cricket Coaching',
    reference: 'BK002',
    paymentMethod: 'platform_wallet',
    status: 'COMPLETED',
    createdAt: '2024-03-24T17:30:00Z',
  },
  {
    id: 'TXN005',
    walletId: 'WAL004',
    userName: 'Amit Kumar',
    userRole: 'client',
    amount: 1500,
    type: 'REFUND',
    description: 'Refund for cancelled booking',
    reference: 'BK006',
    paymentMethod: 'upi',
    status: 'COMPLETED',
    createdAt: '2024-03-23T11:00:00Z',
  },
];

// GET /api/admin/transactions - Get all transactions with filtering
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    const search = searchParams.get('search') || '';
    const type = searchParams.get('type') || 'all';
    const status = searchParams.get('status') || 'all';
    const dateFrom = searchParams.get('dateFrom');
    const dateTo = searchParams.get('dateTo');

    // Filter transactions
    let filteredTransactions = [...mockTransactions];
    
    if (search) {
      filteredTransactions = filteredTransactions.filter(txn => 
        txn.id.toLowerCase().includes(search.toLowerCase()) ||
        txn.userName.toLowerCase().includes(search.toLowerCase()) ||
        txn.description.toLowerCase().includes(search.toLowerCase())
      );
    }
    
    if (type !== 'all') {
      filteredTransactions = filteredTransactions.filter(txn => txn.type === type);
    }
    
    if (status !== 'all') {
      filteredTransactions = filteredTransactions.filter(txn => txn.status === status);
    }
    
    if (dateFrom) {
      filteredTransactions = filteredTransactions.filter(txn => 
        new Date(txn.createdAt) >= new Date(dateFrom)
      );
    }
    
    if (dateTo) {
      filteredTransactions = filteredTransactions.filter(txn => 
        new Date(txn.createdAt) <= new Date(dateTo)
      );
    }

    // Sort by date (newest first)
    filteredTransactions.sort((a, b) => 
      new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );

    // Pagination
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;
    const paginatedTransactions = filteredTransactions.slice(startIndex, endIndex);

    // Calculate stats
    const stats = {
      totalTransactions: mockTransactions.length,
      totalVolume: mockTransactions.reduce((sum, t) => sum + t.amount, 0),
      platformFees: mockTransactions
        .filter(t => t.type === 'EARNING')
        .reduce((sum, t) => sum + (t.amount * 0.15), 0),
      pendingWithdrawals: mockTransactions
        .filter(t => t.type === 'WITHDRAWAL' && t.status === 'PENDING')
        .reduce((sum, t) => sum + t.amount, 0),
      failedTransactions: mockTransactions.filter(t => t.status === 'FAILED').length,
      completedTransactions: mockTransactions.filter(t => t.status === 'COMPLETED').length,
    };

    return NextResponse.json({
      transactions: paginatedTransactions,
      total: filteredTransactions.length,
      page,
      totalPages: Math.ceil(filteredTransactions.length / limit),
      stats
    });
  } catch (error) {
    console.error('Get transactions error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// PUT /api/admin/transactions/:id - Update transaction
export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { transactionId, updates } = body;

    const txnIndex = mockTransactions.findIndex(t => t.id === transactionId);
    if (txnIndex === -1) {
      return NextResponse.json(
        { error: 'Transaction not found' },
        { status: 404 }
      );
    }

    // Update transaction
    mockTransactions[txnIndex] = { 
      ...mockTransactions[txnIndex], 
      ...updates,
      updatedAt: new Date().toISOString()
    };

    // Log audit action
    console.log(`Transaction ${transactionId} updated:`, updates);

    return NextResponse.json({
      success: true,
      transaction: mockTransactions[txnIndex]
    });
  } catch (error) {
    console.error('Update transaction error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// POST /api/admin/transactions/action - Perform transaction actions
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { transactionId, action, data } = body;

    const txnIndex = mockTransactions.findIndex(t => t.id === transactionId);
    if (txnIndex === -1) {
      return NextResponse.json(
        { error: 'Transaction not found' },
        { status: 404 }
      );
    }

    switch (action) {
      case 'approve':
        if (mockTransactions[txnIndex].type === 'WITHDRAWAL') {
          mockTransactions[txnIndex].status = 'COMPLETED';
          mockTransactions[txnIndex].approvedAt = new Date().toISOString();
          mockTransactions[txnIndex].approvedBy = 'Admin';
        }
        break;
        
      case 'reject':
        mockTransactions[txnIndex].status = 'FAILED';
        mockTransactions[txnIndex].failureReason = data.reason;
        mockTransactions[txnIndex].rejectedAt = new Date().toISOString();
        break;
        
      case 'retry':
        if (mockTransactions[txnIndex].status === 'FAILED') {
          mockTransactions[txnIndex].status = 'PENDING';
          mockTransactions[txnIndex].retriedAt = new Date().toISOString();
        }
        break;
        
      case 'refund':
        // Create a refund transaction
        const refundTxn = {
          id: `TXN${Date.now()}`,
          walletId: mockTransactions[txnIndex].walletId,
          userName: mockTransactions[txnIndex].userName,
          userRole: mockTransactions[txnIndex].userRole,
          amount: mockTransactions[txnIndex].amount,
          type: 'REFUND',
          description: `Refund for transaction ${transactionId}`,
          reference: transactionId,
          paymentMethod: mockTransactions[txnIndex].paymentMethod,
          status: 'COMPLETED',
          createdAt: new Date().toISOString(),
        };
        mockTransactions.push(refundTxn);
        break;
        
      default:
        return NextResponse.json(
          { error: 'Invalid action' },
          { status: 400 }
        );
    }

    // Log audit action
    console.log(`Transaction action performed: ${action} on ${transactionId}`, data);

    return NextResponse.json({
      success: true,
      transaction: mockTransactions[txnIndex],
      message: `Transaction ${action} successful`
    });
  } catch (error) {
    console.error('Transaction action error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// POST /api/admin/transactions/export - Export transactions
export async function EXPORT(request: NextRequest) {
  try {
    const body = await request.json();
    const { format, dateFrom, dateTo } = body;

    let exportData = [...mockTransactions];
    
    if (dateFrom) {
      exportData = exportData.filter(txn => 
        new Date(txn.createdAt) >= new Date(dateFrom)
      );
    }
    
    if (dateTo) {
      exportData = exportData.filter(txn => 
        new Date(txn.createdAt) <= new Date(dateTo)
      );
    }

    // In production, generate actual CSV/Excel file
    const exportUrl = `/exports/transactions-${Date.now()}.${format}`;

    return NextResponse.json({
      success: true,
      url: exportUrl,
      count: exportData.length,
      message: `Exported ${exportData.length} transactions`
    });
  } catch (error) {
    console.error('Export transactions error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
