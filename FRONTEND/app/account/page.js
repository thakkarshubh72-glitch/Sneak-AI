'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { formatINR } from '@/lib/currency';

export default function AccountPage() {
  const [activeTab, setActiveTab] = useState('orders');

  const demoUser = {
    name: 'John Doe',
    email: 'john@example.com',
    joined: 'March 2026',
  };

  const demoOrders = [
    { id: 'SNK-A7F2K9', date: 'Mar 12, 2026', items: 2, total: 369.98, status: 'Delivered' },
    { id: 'SNK-B3M1P5', date: 'Mar 5, 2026', items: 1, total: 189.99, status: 'In Transit' },
    { id: 'SNK-C8N4Q2', date: 'Feb 22, 2026', items: 3, total: 434.97, status: 'Delivered' },
  ];

  const demoFavorites = ['Air Nova X', 'Jordan 1 Retro High', 'New Balance 990v6'];

  const tabs = [
    { id: 'orders', label: 'Orders' },
    { id: 'favorites', label: 'Favorites' },
    { id: 'settings', label: 'Settings' },
  ];

  return (
    <div className="min-h-screen pt-24 pb-16">
      <div className="max-w-4xl mx-auto px-4">
        {/* Profile header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass rounded-3xl p-6 sm:p-8 mb-6 mt-4"
        >
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-primary-500 to-accent-purple flex items-center justify-center text-2xl font-bold">
              {demoUser.name.charAt(0)}
            </div>
            <div>
              <h1 className="font-display font-bold text-2xl">{demoUser.name}</h1>
              <p className="text-sm text-dark-200">{demoUser.email}</p>
              <p className="text-xs text-dark-300">Member since {demoUser.joined}</p>
            </div>
          </div>
        </motion.div>

        {/* Tabs */}
        <div className="flex gap-1 mb-6 glass rounded-xl p-1">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex-1 py-2.5 rounded-lg text-sm font-medium transition-all duration-300
                ${activeTab === tab.id ? 'bg-primary-600 text-white' : 'text-dark-200 hover:text-white'}`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Orders */}
        {activeTab === 'orders' && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-3">
            {demoOrders.map((order) => (
              <div key={order.id} className="glass rounded-2xl p-5 flex items-center justify-between">
                <div>
                  <p className="font-semibold text-sm">Order #{order.id}</p>
                  <p className="text-xs text-dark-300 mt-0.5">{order.date} · {order.items} item(s)</p>
                </div>
                <div className="text-right">
                  <p className="font-display font-bold">{formatINR(order.total)}</p>
                  <span className={`text-xs font-medium px-2 py-0.5 rounded-md mt-1 inline-block
                    ${order.status === 'Delivered' ? 'bg-accent-green/15 text-accent-green' : 'bg-accent-cyan/15 text-accent-cyan'}`}>
                    {order.status}
                  </span>
                </div>
              </div>
            ))}
          </motion.div>
        )}

        {/* Favorites */}
        {activeTab === 'favorites' && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-3">
            {demoFavorites.map((name, i) => (
              <div key={i} className="glass rounded-2xl p-5 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <span className="text-2xl">👟</span>
                  <p className="font-medium text-sm">{name}</p>
                </div>
                <Link href="/sneakers" className="text-xs text-primary-400 hover:text-primary-300 transition-colors">View</Link>
              </div>
            ))}
          </motion.div>
        )}

        {/* Settings */}
        {activeTab === 'settings' && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="glass rounded-2xl p-6 space-y-4">
            <h3 className="font-semibold mb-4">Account Settings</h3>
            <div>
              <label className="text-xs text-dark-200 mb-1.5 block">Name</label>
              <input className="input-field" defaultValue={demoUser.name} />
            </div>
            <div>
              <label className="text-xs text-dark-200 mb-1.5 block">Email</label>
              <input className="input-field" defaultValue={demoUser.email} />
            </div>
            <div>
              <label className="text-xs text-dark-200 mb-1.5 block">New Password</label>
              <input type="password" className="input-field" placeholder="Leave blank to keep current" />
            </div>
            <button className="btn-primary text-sm mt-4">Save Changes</button>
          </motion.div>
        )}
      </div>
    </div>
  );
}
