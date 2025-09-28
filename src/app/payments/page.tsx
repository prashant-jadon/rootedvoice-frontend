'use client'

import { motion } from 'framer-motion'
import { 
  DollarSign, 
  CreditCard, 
  TrendingUp, 
  Calendar, 
  Download, 
  Eye, 
  MoreVertical,
  CheckCircle,
  Clock,
  XCircle,
  AlertCircle,
  Plus,
  Filter,
  Search,
  FileText,
  Receipt,
  Banknote,
  Wallet,
  ArrowUpRight,
  ArrowDownRight,
  PieChart,
  BarChart3
} from 'lucide-react'
import Link from 'next/link'
import { useState } from 'react'

export default function PaymentsPage() {
  const [activeTab, setActiveTab] = useState('overview')
  const [showPaymentModal, setShowPaymentModal] = useState(false)

  // Dummy data
  const stats = [
    { title: 'Total Revenue', value: '$12,450', change: '+15.2%', icon: <DollarSign className="w-6 h-6" />, color: 'bg-green-500' },
    { title: 'This Month', value: '$3,240', change: '+8.1%', icon: <TrendingUp className="w-6 h-6" />, color: 'bg-blue-500' },
    { title: 'Pending Payments', value: '$890', change: '-2.3%', icon: <Clock className="w-6 h-6" />, color: 'bg-yellow-500' },
    { title: 'Completed Sessions', value: '156', change: '+12.5%', icon: <CheckCircle className="w-6 h-6" />, color: 'bg-purple-500' }
  ]

  const recentPayments = [
    {
      id: 1,
      client: 'Sarah Johnson',
      amount: 120,
      date: '2024-01-15',
      status: 'completed',
      method: 'Credit Card',
      session: 'Speech Therapy - 45 min',
      invoice: 'INV-001'
    },
    {
      id: 2,
      client: 'Michael Chen',
      amount: 150,
      date: '2024-01-14',
      status: 'pending',
      method: 'Bank Transfer',
      session: 'Language Assessment - 60 min',
      invoice: 'INV-002'
    },
    {
      id: 3,
      client: 'Emma Wilson',
      amount: 90,
      date: '2024-01-13',
      status: 'completed',
      method: 'PayPal',
      session: 'Follow-up - 30 min',
      invoice: 'INV-003'
    },
    {
      id: 4,
      client: 'David Rodriguez',
      amount: 120,
      date: '2024-01-12',
      status: 'failed',
      method: 'Credit Card',
      session: 'Speech Therapy - 45 min',
      invoice: 'INV-004'
    }
  ]

  const upcomingPayments = [
    {
      id: 1,
      client: 'Sarah Johnson',
      amount: 120,
      dueDate: '2024-01-20',
      session: 'Speech Therapy - 45 min',
      status: 'scheduled'
    },
    {
      id: 2,
      client: 'Michael Chen',
      amount: 150,
      dueDate: '2024-01-22',
      session: 'Language Assessment - 60 min',
      status: 'scheduled'
    }
  ]

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'bg-green-100 text-green-800'
      case 'pending':
        return 'bg-yellow-100 text-yellow-800'
      case 'failed':
        return 'bg-red-100 text-red-800'
      case 'scheduled':
        return 'bg-blue-100 text-blue-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="w-4 h-4" />
      case 'pending':
        return <Clock className="w-4 h-4" />
      case 'failed':
        return <XCircle className="w-4 h-4" />
      case 'scheduled':
        return <Calendar className="w-4 h-4" />
      default:
        return <AlertCircle className="w-4 h-4" />
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-4">
              <Link href="/dashboard" className="text-2xl font-bold text-black">Rooted Voices</Link>
              <span className="text-gray-400">/</span>
              <h1 className="text-2xl font-bold text-black">Payments & Billing</h1>
            </div>
            
            <div className="flex items-center space-x-4">
              <button 
                onClick={() => setShowPaymentModal(true)}
                className="bg-black text-white px-4 py-2 rounded-lg hover:bg-gray-800 transition-colors flex items-center space-x-2"
              >
                <Plus className="w-4 h-4" />
                <span>Record Payment</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Navigation Tabs */}
        <div className="mb-8">
          <nav className="flex space-x-8">
            {[
              { id: 'overview', label: 'Overview', icon: <BarChart3 className="w-5 h-5" /> },
              { id: 'payments', label: 'Payments', icon: <CreditCard className="w-5 h-5" /> },
              { id: 'invoices', label: 'Invoices', icon: <Receipt className="w-5 h-5" /> },
              { id: 'reports', label: 'Reports', icon: <PieChart className="w-5 h-5" /> }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors ${
                  activeTab === tab.id
                    ? 'bg-black text-white'
                    : 'text-gray-600 hover:text-black hover:bg-gray-100'
                }`}
              >
                {tab.icon}
                <span>{tab.label}</span>
              </button>
            ))}
          </nav>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {stats.map((stat, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              className="bg-white p-6 rounded-2xl premium-shadow"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 mb-1">{stat.title}</p>
                  <p className="text-2xl font-bold text-black">{stat.value}</p>
                  <p className="text-sm text-green-600 flex items-center mt-1">
                    <TrendingUp className="w-4 h-4 mr-1" />
                    {stat.change}
                  </p>
                </div>
                <div className={`${stat.color} p-3 rounded-full text-white`}>
                  {stat.icon}
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Recent Payments */}
          <div className="lg:col-span-2">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="bg-white rounded-2xl premium-shadow p-6"
            >
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-black">Recent Payments</h2>
                <div className="flex items-center space-x-2">
                  <button className="p-2 text-gray-400 hover:text-gray-600 transition-colors">
                    <Search className="w-4 h-4" />
                  </button>
                  <button className="p-2 text-gray-400 hover:text-gray-600 transition-colors">
                    <Filter className="w-4 h-4" />
                  </button>
                </div>
              </div>
              
              <div className="space-y-4">
                {recentPayments.map((payment, index) => (
                  <div key={payment.id} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                    <div className="flex items-center space-x-4">
                      <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center">
                        <span className="text-sm font-semibold text-gray-600">
                          {payment.client.split(' ').map(n => n[0]).join('')}
                        </span>
                      </div>
                      <div>
                        <h3 className="font-semibold text-black">{payment.client}</h3>
                        <p className="text-sm text-gray-600">{payment.session}</p>
                        <p className="text-xs text-gray-500">{payment.invoice}</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-6">
                      <div className="text-right">
                        <p className="font-semibold text-black">${payment.amount}</p>
                        <p className="text-sm text-gray-600">{payment.date}</p>
                        <p className="text-xs text-gray-500">{payment.method}</p>
                      </div>
                      
                      <div className="flex items-center space-x-2">
                        <span className={`px-3 py-1 rounded-full text-xs font-medium flex items-center space-x-1 ${getStatusColor(payment.status)}`}>
                          {getStatusIcon(payment.status)}
                          <span>{payment.status}</span>
                        </span>
                      </div>
                      
                      <div className="flex items-center space-x-2">
                        <button className="p-2 text-gray-400 hover:text-blue-600 transition-colors">
                          <Eye className="w-4 h-4" />
                        </button>
                        <button className="p-2 text-gray-400 hover:text-green-600 transition-colors">
                          <Download className="w-4 h-4" />
                        </button>
                        <button className="p-2 text-gray-400 hover:text-gray-600 transition-colors">
                          <MoreVertical className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Upcoming Payments */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="bg-white rounded-2xl premium-shadow p-6"
            >
              <h3 className="text-lg font-bold text-black mb-4">Upcoming Payments</h3>
              <div className="space-y-3">
                {upcomingPayments.map((payment) => (
                  <div key={payment.id} className="p-3 border border-gray-200 rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-semibold text-black text-sm">{payment.client}</span>
                      <span className="text-sm font-semibold text-black">${payment.amount}</span>
                    </div>
                    <p className="text-xs text-gray-600 mb-1">{payment.session}</p>
                    <p className="text-xs text-gray-500">Due: {payment.dueDate}</p>
                  </div>
                ))}
              </div>
            </motion.div>

            {/* Payment Methods */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="bg-white rounded-2xl premium-shadow p-6"
            >
              <h3 className="text-lg font-bold text-black mb-4">Payment Methods</h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <CreditCard className="w-5 h-5 text-gray-600" />
                    <span className="text-sm font-medium text-black">Credit Card</span>
                  </div>
                  <span className="text-xs text-green-600">Active</span>
                </div>
                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <Banknote className="w-5 h-5 text-gray-600" />
                    <span className="text-sm font-medium text-black">Bank Transfer</span>
                  </div>
                  <span className="text-xs text-green-600">Active</span>
                </div>
                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <Wallet className="w-5 h-5 text-gray-600" />
                    <span className="text-sm font-medium text-black">PayPal</span>
                  </div>
                  <span className="text-xs text-green-600">Active</span>
                </div>
              </div>
            </motion.div>

            {/* Quick Actions */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.5 }}
              className="bg-white rounded-2xl premium-shadow p-6"
            >
              <h3 className="text-lg font-bold text-black mb-4">Quick Actions</h3>
              <div className="space-y-3">
                <button className="w-full flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-50 transition-colors">
                  <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                    <Plus className="w-4 h-4 text-blue-600" />
                  </div>
                  <span className="text-sm font-medium text-black">Record Payment</span>
                </button>
                <button className="w-full flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-50 transition-colors">
                  <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                    <Receipt className="w-4 h-4 text-green-600" />
                  </div>
                  <span className="text-sm font-medium text-black">Create Invoice</span>
                </button>
                <button className="w-full flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-50 transition-colors">
                  <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center">
                    <Download className="w-4 h-4 text-purple-600" />
                  </div>
                  <span className="text-sm font-medium text-black">Export Reports</span>
                </button>
                <button className="w-full flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-50 transition-colors">
                  <div className="w-8 h-8 bg-orange-100 rounded-full flex items-center justify-center">
                    <CreditCard className="w-4 h-4 text-orange-600" />
                  </div>
                  <span className="text-sm font-medium text-black">Manage Methods</span>
                </button>
              </div>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Payment Modal */}
      {showPaymentModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3 }}
            className="bg-white rounded-2xl p-6 w-full max-w-md mx-4"
          >
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold text-black">Record Payment</h3>
              <button 
                onClick={() => setShowPaymentModal(false)}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                ×
              </button>
            </div>
            
            <form className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Client</label>
                <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black">
                  <option>Select a client</option>
                  <option>Sarah Johnson</option>
                  <option>Michael Chen</option>
                  <option>Emma Wilson</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Amount</label>
                <input 
                  type="number" 
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
                  placeholder="0.00"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Payment Method</label>
                <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black">
                  <option>Credit Card</option>
                  <option>Bank Transfer</option>
                  <option>PayPal</option>
                  <option>Cash</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Date</label>
                <input 
                  type="date" 
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Notes</label>
                <textarea 
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
                  placeholder="Add payment notes..."
                />
              </div>
              
              <div className="flex space-x-3 pt-4">
                <button 
                  type="button"
                  onClick={() => setShowPaymentModal(false)}
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button 
                  type="submit"
                  className="flex-1 px-4 py-2 bg-black text-white rounded-lg hover:bg-gray-800 transition-colors"
                >
                  Record Payment
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </div>
  )
}
