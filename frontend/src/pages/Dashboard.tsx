import React from 'react';
import { motion } from 'motion/react';
import { useNavigate } from 'react-router-dom';
import {
  Briefcase,
  FileCheck,
  MessageSquare,
  TrendingUp,
  ArrowUpRight,
  Sparkles
} from 'lucide-react';
import { Card } from '../components/ui/card';
import { Button } from '../components/ui/button';
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Area,
  AreaChart
} from 'recharts';

interface DashboardProps {
  user: any;
}

const Dashboard = ({ user }: DashboardProps) => {
  const navigate = useNavigate();

  const stats = [
    {
      label: 'Jobs Found',
      value: '142',
      change: '+12%',
      icon: Briefcase,
      color: 'from-blue-500 to-cyan-500',
      link: '/job-search'
    },
    {
      label: 'Applications',
      value: '28',
      change: '+8%',
      icon: FileCheck,
      color: 'from-purple-500 to-pink-500',
      link: '/tracker'
    },
    {
      label: 'Interviews',
      value: '7',
      change: '+3',
      icon: MessageSquare,
      color: 'from-green-500 to-emerald-500',
      link: '/tracker'
    },
    {
      label: 'Profile Score',
      value: '87%',
      change: '+5%',
      icon: TrendingUp,
      color: 'from-orange-500 to-red-500',
      link: '/profile-analysis'
    },
  ];

  const applicationData = [
    { week: 'Week 1', applications: 4 },
    { week: 'Week 2', applications: 7 },
    { week: 'Week 3', applications: 5 },
    { week: 'Week 4', applications: 12 },
  ];

  const activityData = [
    { day: 'Mon', searches: 15, applications: 2 },
    { day: 'Tue', searches: 22, applications: 4 },
    { day: 'Wed', searches: 18, applications: 3 },
    { day: 'Thu', searches: 25, applications: 5 },
    { day: 'Fri', searches: 20, applications: 3 },
    { day: 'Sat', searches: 8, applications: 1 },
    { day: 'Sun', searches: 5, applications: 0 },
  ];

  const recentNews = [
    {
      title: 'Tech Industry Hiring Surge Expected in Q1',
      source: 'Tech News',
      time: '2 hours ago'
    },
    {
      title: 'Remote Work Trends Continue to Rise',
      source: 'Career Insights',
      time: '5 hours ago'
    },
    {
      title: 'Top Skills in Demand for 2025',
      source: 'Job Market',
      time: '1 day ago'
    }
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="space-y-2"
      >
        <h1 className="text-4xl">
          Welcome back, {user?.user_metadata?.name || 'there'}! 👋
        </h1>
        <p className="text-xl text-gray-400">
          Here&apos;s your job hunt progress overview
        </p>
      </motion.div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, idx) => {
          const Icon = stat.icon;
          return (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.1 }}
              onClick={() => navigate(stat.link)}
              className="cursor-pointer"
            >
              <Card className="bg-white/5 backdrop-blur-sm border-white/10 p-6 hover:border-white/20 transition-all group">
                <div className="flex items-start justify-between mb-4">
                  <div className={`w-12 h-12 bg-gradient-to-br ${stat.color} rounded-xl flex items-center justify-center`}>
                    <Icon className="w-6 h-6 text-white" />
                  </div>
                  <span className="text-green-400 text-sm flex items-center gap-1">
                    {stat.change}
                    <ArrowUpRight className="w-4 h-4" />
                  </span>
                </div>
                <div>
                  <div className="text-3xl mb-1">{stat.value}</div>
                  <div className="text-gray-400">{stat.label}</div>
                </div>
              </Card>
            </motion.div>
          );
        })}
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Applications Chart */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <Card className="bg-white/5 backdrop-blur-sm border-white/10 p-6">
            <h3 className="text-xl mb-6 flex items-center gap-2">
              <FileCheck className="w-5 h-5 text-purple-400" />
              Applications Progress
            </h3>
            <ResponsiveContainer width="100%" height={250}>
              <AreaChart data={applicationData}>
                <defs>
                  <linearGradient id="colorApplications" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#ffffff10" />
                <XAxis dataKey="week" stroke="#94a3b8" />
                <YAxis stroke="#94a3b8" />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#1a1a1a',
                    border: '1px solid #ffffff20',
                    borderRadius: '8px',
                    color: '#fff'
                  }}
                />
                <Area
                  type="monotone"
                  dataKey="applications"
                  stroke="#8b5cf6"
                  strokeWidth={2}
                  fillOpacity={1}
                  fill="url(#colorApplications)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </Card>
        </motion.div>

        {/* Activity Chart */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          <Card className="bg-white/5 backdrop-blur-sm border-white/10 p-6">
            <h3 className="text-xl mb-6 flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-blue-400" />
              Weekly Activity
            </h3>
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={activityData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#ffffff10" />
                <XAxis dataKey="day" stroke="#94a3b8" />
                <YAxis stroke="#94a3b8" />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#1a1a1a',
                    border: '1px solid #ffffff20',
                    borderRadius: '8px',
                    color: '#fff'
                  }}
                />
                <Bar dataKey="searches" fill="#3b82f6" radius={[8, 8, 0, 0]} />
                <Bar dataKey="applications" fill="#8b5cf6" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </Card>
        </motion.div>
      </div>

      {/* Bottom Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Quick Actions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="lg:col-span-2"
        >
          <Card className="bg-white/5 backdrop-blur-sm border-white/10 p-6">
            <h3 className="text-xl mb-6 flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-yellow-400" />
              Quick Actions
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Button
                onClick={() => navigate('/job-search')}
                className="bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 justify-start h-auto py-4"
              >
                <Briefcase className="w-5 h-5 mr-3" />
                <div className="text-left">
                  <div>Search Jobs</div>
                  <div className="text-xs opacity-80">Find your next opportunity</div>
                </div>
              </Button>

              <Button
                onClick={() => navigate('/profile-analysis')}
                className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 justify-start h-auto py-4"
              >
                <FileCheck className="w-5 h-5 mr-3" />
                <div className="text-left">
                  <div>Analyze Profile</div>
                  <div className="text-xs opacity-80">Get AI insights</div>
                </div>
              </Button>

              <Button
                onClick={() => navigate('/career-planner')}
                className="bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 justify-start h-auto py-4"
              >
                <MessageSquare className="w-5 h-5 mr-3" />
                <div className="text-left">
                  <div>Career Guidance</div>
                  <div className="text-xs opacity-80">Chat with AI advisor</div>
                </div>
              </Button>

              <Button
                onClick={() => navigate('/auto-apply')}
                className="bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 justify-start h-auto py-4"
              >
                <TrendingUp className="w-5 h-5 mr-3" />
                <div className="text-left">
                  <div>Auto Apply</div>
                  <div className="text-xs opacity-80">Automate applications</div>
                </div>
              </Button>
            </div>
          </Card>
        </motion.div>

        {/* Recent News */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
        >
          <Card className="bg-white/5 backdrop-blur-sm border-white/10 p-6">
            <h3 className="text-xl mb-6 flex items-center gap-2">
              <MessageSquare className="w-5 h-5 text-green-400" />
              Latest News
            </h3>
            <div className="space-y-4">
              {recentNews.map((news, idx) => (
                <div
                  key={idx}
                  className="p-4 bg-white/5 rounded-lg hover:bg-white/10 transition-colors cursor-pointer"
                  onClick={() => navigate('/news')}
                >
                  <div className="text-sm mb-1">{news.title}</div>
                  <div className="text-xs text-gray-400 flex items-center justify-between">
                    <span>{news.source}</span>
                    <span>{news.time}</span>
                  </div>
                </div>
              ))}
              <Button
                variant="outline"
                className="w-full border-white/10 hover:bg-white/5"
                onClick={() => navigate('/news')}
              >
                View All News
              </Button>
            </div>
          </Card>
        </motion.div>
      </div>
    </div>
  );
};

export default Dashboard;
