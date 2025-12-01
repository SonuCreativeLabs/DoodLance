'use client';

import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  CreditCard, DollarSign, TrendingUp, TrendingDown,
  ArrowUpRight, ArrowDownLeft, Search, Filter, Download,
  MoreVertical, Eye, RefreshCw, ChevronLeft, ChevronRight,
  AlertCircle, CheckCircle, Clock, XCircle, Wallet
} from 'lucide-react';
import { motion } from 'framer-motion';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

// Mock transaction data
const mockTransactions = [
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
    createdAt: '2024-03-25 10:30 AM',
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
    createdAt: '2024-03-25 10:00 AM',
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
    createdAt: '2024-03-24 3:00 PM',
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
    createdAt: '2024-03-24 5:30 PM',
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
    createdAt: '2024-03-23 11:00 AM',
  },
  {
    id: 'TXN006',
    walletId: 'WAL005',
    userName: 'Ananya Reddy',
    userRole: 'freelancer',
    amount: 500,
    type: 'REFERRAL_BONUS',
    description: 'Referral bonus for new user signup',
    reference: 'REF001',
    paymentMethod: 'platform_wallet',
    status: 'COMPLETED',
    createdAt: '2024-03-23 9:30 AM',
  },
  {
    id: 'TXN007',
    walletId: 'WAL002',
    userName: 'Priya Patel',
    userRole: 'client',
    amount: 1000,
    type: 'COIN_PURCHASE',
    description: 'Purchase of 100 DoodCoins',
    paymentMethod: 'card',
    paymentId: 'CARD_789012',
    status: 'COMPLETED',
    createdAt: '2024-03-22 2:00 PM',
  },
  {
    id: 'TXN008',
    walletId: 'WAL001',
    userName: 'Rohit Sharma',
    userRole: 'freelancer',
    amount: 3500,
    type: 'WITHDRAWAL',
    description: 'Bank withdrawal completed',
    paymentMethod: 'bank_transfer',
    status: 'FAILED',
    createdAt: '2024-03-21 4:00 PM',
    failureReason: 'Invalid bank account details',
  },
];

// Mock wallet data
const mockWallets = [
  {
    id: 'WAL001',
    userName: 'Rohit Sharma',
    userRole: 'freelancer',
    balance: 12500,
    coins: 250,
    frozenAmount: 2000,
    totalEarnings: 234500,
    totalWithdrawals: 222000,
    lastTransaction: '2 hours ago',
  },
  {
    id: 'WAL002',
    userName: 'Priya Patel',
    userRole: 'client',
    balance: 5000,
    coins: 100,
    frozenAmount: 0,
    totalSpent: 45600,
    lastTransaction: '1 day ago',
  },
  {
    id: 'WAL003',
    userName: 'Virat Singh',
    userRole: 'freelancer',
    balance: 8900,
    coins: 180,
    frozenAmount: 1500,
    totalEarnings: 156780,
    totalWithdrawals: 147880,
    lastTransaction: '5 minutes ago',
  },
];

// Revenue chart data
const revenueChartData = [
  { date: 'Jan', revenue: 125000, transactions: 450 },
  { date: 'Feb', revenue: 189000, transactions: 620 },
  { date: 'Mar', revenue: 234000, transactions: 780 },
  { date: 'Apr', revenue: 198000, transactions: 690 },
  { date: 'May', revenue: 256000, transactions: 850 },
  { date: 'Jun', revenue: 289000, transactions: 920 },
];

const typeColors: Record<string, string> = {
  CREDIT: 'text-green-500',
  DEBIT: 'text-red-500',
  EARNING: 'text-green-500',
  WITHDRAWAL: 'text-orange-500',
  REFUND: 'text-yellow-500',
  COIN_PURCHASE: 'text-purple-500',
  COIN_REDEMPTION: 'text-blue-500',
  REFERRAL_BONUS: 'text-cyan-500',
};

const statusColors: Record<string, string> = {
  PENDING: 'bg-yellow-500',
  COMPLETED: 'bg-green-500',
  FAILED: 'bg-red-500',
  CANCELLED: 'bg-gray-500',
};

interface TransactionDetailsModalProps {
  transaction: any;
  open: boolean;
  onClose: () => void;
}

function TransactionDetailsModal({ transaction, open, onClose }: TransactionDetailsModalProps) {
  if (!transaction) return null;

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="bg-[#1a1a1a] border-gray-800">
        <DialogHeader>
          <DialogTitle className="text-white">Transaction Details</DialogTitle>
          <DialogDescription className="text-gray-400">
            Transaction ID: {transaction.id}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-gray-400">User</p>
              <p className="text-white">{transaction.userName}</p>
              <Badge variant="secondary" className="mt-1">
                {transaction.userRole}
              </Badge>
            </div>
            <div>
              <p className="text-sm text-gray-400">Amount</p>
              <p className={`text-2xl font-bold ${typeColors[transaction.type]}`}>
                {transaction.type === 'DEBIT' || transaction.type === 'WITHDRAWAL' ? '-' : '+'}
                ₹{transaction.amount}
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-400">Type</p>
              <p className="text-white">{transaction.type}</p>
            </div>
            <div>
              <p className="text-sm text-gray-400">Status</p>
              <Badge className={`${statusColors[transaction.status]} text-white`}>
                {transaction.status}
              </Badge>
            </div>
            <div>
              <p className="text-sm text-gray-400">Payment Method</p>
              <p className="text-white">{transaction.paymentMethod}</p>
            </div>
            <div>
              <p className="text-sm text-gray-400">Date</p>
              <p className="text-white">{transaction.createdAt}</p>
            </div>
          </div>

          <div className="border-t border-gray-700 pt-4">
            <p className="text-sm text-gray-400">Description</p>
            <p className="text-white">{transaction.description}</p>
          </div>

          {transaction.reference && (
            <div>
              <p className="text-sm text-gray-400">Reference</p>
              <p className="text-white font-mono">{transaction.reference}</p>
            </div>
          )}

          {transaction.paymentId && (
            <div>
              <p className="text-sm text-gray-400">Payment ID</p>
              <p className="text-white font-mono">{transaction.paymentId}</p>
            </div>
          )}

          {transaction.failureReason && (
            <Card className="bg-red-500/10 border-red-500/50 p-3">
              <p className="text-sm text-red-400">Failure Reason</p>
              <p className="text-white text-sm">{transaction.failureReason}</p>
            </Card>
          )}
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose}>Close</Button>
          {transaction.status === 'PENDING' && (
            <>
              <Button variant="destructive">Cancel</Button>
              <Button className="bg-green-600 hover:bg-green-700">Approve</Button>
            </>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export default function TransactionManagementPage() {
  const [transactions, setTransactions] = useState(mockTransactions);
  const [searchTerm, setSearchTerm] = useState('');
  const [typeFilter, setTypeFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedTransaction, setSelectedTransaction] = useState<any>(null);
  const [detailsModalOpen, setDetailsModalOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // Filter transactions
  const filteredTransactions = transactions.filter(transaction => {
    const matchesSearch = 
      transaction.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      transaction.userName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      transaction.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = typeFilter === 'all' || transaction.type === typeFilter;
    const matchesStatus = statusFilter === 'all' || transaction.status === statusFilter;
    
    return matchesSearch && matchesType && matchesStatus;
  });

  const totalPages = Math.ceil(filteredTransactions.length / itemsPerPage);
  const paginatedTransactions = filteredTransactions.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  // Calculate stats
  const stats = {
    totalTransactions: transactions.length,
    totalVolume: transactions.reduce((sum, t) => sum + t.amount, 0),
    platformFees: transactions.filter(t => t.type === 'EARNING').reduce((sum, t) => sum + (t.amount * 0.15), 0),
    pendingWithdrawals: transactions.filter(t => t.type === 'WITHDRAWAL' && t.status === 'PENDING').reduce((sum, t) => sum + t.amount, 0),
    failedTransactions: transactions.filter(t => t.status === 'FAILED').length,
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-white">Financial Management</h1>
          <p className="text-gray-400 mt-1 text-sm sm:text-base">Monitor transactions, wallets, and platform revenue</p>
        </div>
        <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
          <Button variant="outline" className="text-gray-300 w-full sm:w-auto">
            <Download className="w-4 h-4 mr-2" />
            Export Report
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
        <Card className="bg-[#1a1a1a] border-gray-800 p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-400">Total Volume</p>
              <p className="text-2xl font-bold text-white">₹{(stats.totalVolume / 1000).toFixed(1)}k</p>
            </div>
            <DollarSign className="w-8 h-8 text-green-500" />
          </div>
        </Card>
        <Card className="bg-[#1a1a1a] border-gray-800 p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-400">Platform Fees</p>
              <p className="text-2xl font-bold text-white">₹{(stats.platformFees / 1000).toFixed(1)}k</p>
            </div>
            <TrendingUp className="w-8 h-8 text-purple-500" />
          </div>
        </Card>
        <Card className="bg-[#1a1a1a] border-gray-800 p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-400">Transactions</p>
              <p className="text-2xl font-bold text-white">{stats.totalTransactions}</p>
            </div>
            <CreditCard className="w-8 h-8 text-blue-500" />
          </div>
        </Card>
        <Card className="bg-[#1a1a1a] border-gray-800 p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-400">Pending</p>
              <p className="text-2xl font-bold text-white">₹{(stats.pendingWithdrawals / 1000).toFixed(1)}k</p>
            </div>
            <Clock className="w-8 h-8 text-yellow-500" />
          </div>
        </Card>
        <Card className="bg-[#1a1a1a] border-gray-800 p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-400">Failed</p>
              <p className="text-2xl font-bold text-white">{stats.failedTransactions}</p>
            </div>
            <XCircle className="w-8 h-8 text-red-500" />
          </div>
        </Card>
      </div>

      {/* Revenue Chart */}
      <Card className="bg-[#1a1a1a] border-gray-800 p-6">
        <h3 className="text-lg font-semibold text-white mb-4">Revenue Overview</h3>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={revenueChartData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
            <XAxis dataKey="date" stroke="#9CA3AF" />
            <YAxis stroke="#9CA3AF" />
            <Tooltip 
              contentStyle={{ backgroundColor: '#1a1a1a', border: '1px solid #374151' }}
              labelStyle={{ color: '#fff' }}
            />
            <Line 
              type="monotone" 
              dataKey="revenue" 
              stroke="#8B5CF6" 
              strokeWidth={2}
              dot={{ fill: '#8B5CF6' }}
            />
          </LineChart>
        </ResponsiveContainer>
      </Card>

      {/* Filters */}
      <Card className="bg-[#1a1a1a] border-gray-800 p-4">
        <div className="flex flex-wrap gap-4">
          <div className="flex-1 min-w-[300px]">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              <Input
                placeholder="Search transactions..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 bg-[#2a2a2a] border-gray-700 text-white"
              />
            </div>
          </div>
          
          <Select value={typeFilter} onValueChange={setTypeFilter}>
            <SelectTrigger className="w-[150px] bg-[#2a2a2a] border-gray-700 text-white">
              <SelectValue placeholder="Type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Types</SelectItem>
              <SelectItem value="EARNING">Earnings</SelectItem>
              <SelectItem value="DEBIT">Debits</SelectItem>
              <SelectItem value="WITHDRAWAL">Withdrawals</SelectItem>
              <SelectItem value="REFUND">Refunds</SelectItem>
              <SelectItem value="COIN_PURCHASE">Coin Purchase</SelectItem>
              <SelectItem value="REFERRAL_BONUS">Referral Bonus</SelectItem>
            </SelectContent>
          </Select>

          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-[150px] bg-[#2a2a2a] border-gray-700 text-white">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="PENDING">Pending</SelectItem>
              <SelectItem value="COMPLETED">Completed</SelectItem>
              <SelectItem value="FAILED">Failed</SelectItem>
            </SelectContent>
          </Select>

          <Button
            variant="outline"
            onClick={() => {
              setSearchTerm('');
              setTypeFilter('all');
              setStatusFilter('all');
            }}
            className="text-gray-300"
          >
            <RefreshCw className="w-4 h-4 mr-2" />
            Reset
          </Button>
        </div>
      </Card>

      {/* Transactions Table */}
      <Card className="bg-[#1a1a1a] border-gray-800">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="border-b border-gray-800">
              <tr className="text-left">
                <th className="p-4 text-sm font-medium text-gray-400">Transaction ID</th>
                <th className="p-4 text-sm font-medium text-gray-400">User</th>
                <th className="p-4 text-sm font-medium text-gray-400">Type</th>
                <th className="p-4 text-sm font-medium text-gray-400">Amount</th>
                <th className="p-4 text-sm font-medium text-gray-400">Status</th>
                <th className="p-4 text-sm font-medium text-gray-400">Payment Method</th>
                <th className="p-4 text-sm font-medium text-gray-400">Date</th>
                <th className="p-4 text-sm font-medium text-gray-400">Actions</th>
              </tr>
            </thead>
            <tbody>
              {paginatedTransactions.map((transaction, index) => (
                <motion.tr
                  key={transaction.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className="border-b border-gray-800 hover:bg-[#2a2a2a] transition-colors"
                >
                  <td className="p-4">
                    <span className="text-white font-mono">{transaction.id}</span>
                  </td>
                  <td className="p-4">
                    <div>
                      <p className="text-white">{transaction.userName}</p>
                      <p className="text-xs text-gray-400">{transaction.userRole}</p>
                    </div>
                  </td>
                  <td className="p-4">
                    <div className="flex items-center gap-2">
                      {transaction.type === 'EARNING' || transaction.type === 'CREDIT' ? (
                        <ArrowDownLeft className="w-4 h-4 text-green-500" />
                      ) : (
                        <ArrowUpRight className="w-4 h-4 text-red-500" />
                      )}
                      <span className="text-white text-sm">{transaction.type}</span>
                    </div>
                  </td>
                  <td className="p-4">
                    <span className={`font-medium ${typeColors[transaction.type]}`}>
                      {transaction.type === 'DEBIT' || transaction.type === 'WITHDRAWAL' ? '-' : '+'}
                      ₹{transaction.amount}
                    </span>
                  </td>
                  <td className="p-4">
                    <Badge className={`${statusColors[transaction.status]} text-white`}>
                      {transaction.status}
                    </Badge>
                  </td>
                  <td className="p-4">
                    <span className="text-white text-sm">{transaction.paymentMethod}</span>
                  </td>
                  <td className="p-4">
                    <span className="text-gray-400 text-sm">{transaction.createdAt}</span>
                  </td>
                  <td className="p-4">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="sm">
                          <MoreVertical className="w-4 h-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="bg-[#1a1a1a] border-gray-800">
                        <DropdownMenuLabel>Actions</DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem
                          onClick={() => {
                            setSelectedTransaction(transaction);
                            setDetailsModalOpen(true);
                          }}
                          className="cursor-pointer"
                        >
                          <Eye className="w-4 h-4 mr-2" />
                          View Details
                        </DropdownMenuItem>
                        {transaction.status === 'PENDING' && (
                          <>
                            <DropdownMenuItem className="cursor-pointer text-green-400">
                              <CheckCircle className="w-4 h-4 mr-2" />
                              Approve
                            </DropdownMenuItem>
                            <DropdownMenuItem className="cursor-pointer text-red-400">
                              <XCircle className="w-4 h-4 mr-2" />
                              Reject
                            </DropdownMenuItem>
                          </>
                        )}
                        {transaction.status === 'FAILED' && (
                          <DropdownMenuItem className="cursor-pointer text-yellow-400">
                            <RefreshCw className="w-4 h-4 mr-2" />
                            Retry
                          </DropdownMenuItem>
                        )}
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="flex items-center justify-between p-4 border-t border-gray-800">
          <p className="text-sm text-gray-400">
            Showing {((currentPage - 1) * itemsPerPage) + 1} to {Math.min(currentPage * itemsPerPage, filteredTransactions.length)} of {filteredTransactions.length} transactions
          </p>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
              disabled={currentPage === 1}
              className="text-gray-300"
            >
              <ChevronLeft className="w-4 h-4" />
            </Button>
            {Array.from({ length: Math.min(5, totalPages) }, (_, i) => i + 1).map(page => (
              <Button
                key={page}
                variant={currentPage === page ? 'default' : 'outline'}
                size="sm"
                onClick={() => setCurrentPage(page)}
                className={currentPage === page ? 'bg-purple-600' : 'text-gray-300'}
              >
                {page}
              </Button>
            ))}
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
              disabled={currentPage === totalPages}
              className="text-gray-300"
            >
              <ChevronRight className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </Card>

      {/* Transaction Details Modal */}
      <TransactionDetailsModal
        transaction={selectedTransaction}
        open={detailsModalOpen}
        onClose={() => {
          setDetailsModalOpen(false);
          setSelectedTransaction(null);
        }}
      />
    </div>
  );
}
