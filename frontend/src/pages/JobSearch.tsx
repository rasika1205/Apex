import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Search, MapPin, Briefcase, DollarSign, FileText, MessageCircle, Copy, Download } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Card } from '../components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '../components/ui/dialog';
import { toast } from 'sonner';
import { supabase } from '../App';
import { projectId, publicAnonKey } from '../utils/supabase/info';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip
} from 'recharts';

interface Job {
  id: string;
  title: string;
  company: string;
  location: string;
  experience: string;
  salary: string;
  description: string;
  posted: string;
  type: string;
}

const JobSearch = () => {
  const [searchQuery, setSearchQuery] = useState('software engineer');
  const [location, setLocation] = useState('remote');
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(false);
  
  // Modal states
  const [resumeModalOpen, setResumeModalOpen] = useState(false);
  const [salaryModalOpen, setSalaryModalOpen] = useState(false);
  const [interviewModalOpen, setInterviewModalOpen] = useState(false);
  const [selectedJob, setSelectedJob] = useState<Job | null>(null);
  
  // Modal data
  const [tailoredResume, setTailoredResume] = useState<any>(null);
  const [salaryEstimate, setSalaryEstimate] = useState<any>(null);
  const [interviewQuestions, setInterviewQuestions] = useState<any>(null);
  const [modalLoading, setModalLoading] = useState(false);

  const searchJobs = async () => {
    setLoading(true);
    try {
      const { data: { session } } = await supabase.auth.getSession();
      
      const response = await fetch(
        `http://localhost:8000/find_jobs?q=${encodeURIComponent(searchQuery)}&location=${encodeURIComponent(location)}`,
        {
          headers: {
            'Authorization': `Bearer ${session?.access_token}`,
          }
        }
      );

      if (!response.ok) throw new Error('Failed to search jobs');

      const data = await response.json();
      setJobs(data.jobs);
      toast.success(`Found ${data.jobs.length} jobs!`);
    } catch (error) {
      console.error(error);
      toast.error('Failed to search jobs');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    searchJobs();
  }, []);

  const openResumeModal = async (job: Job) => {
    setSelectedJob(job);
    setResumeModalOpen(true);
    setModalLoading(true);
    
    try {
      const { data: { session } } = await supabase.auth.getSession();
      
      const response = await fetch(
        `http://localhost:8000/tailor_resume`,
        {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${session?.access_token}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ jobDescription: job.description })
        }
      );

      if (!response.ok) throw new Error('Failed to tailor resume');

      const data = await response.json();
      setTailoredResume(data);
    } catch (error) {
      console.error(error);
      toast.error('Failed to generate tailored resume');
    } finally {
      setModalLoading(false);
    }
  };

  const openSalaryModal = async (job: Job) => {
    setSelectedJob(job);
    setSalaryModalOpen(true);
    setModalLoading(true);
    
    try {
      const { data: { session } } = await supabase.auth.getSession();
      
      const response = await fetch(
        `http://localhost:8000/estimate_salary`,
        {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${session?.access_token}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ jobDescription: job.description })
        }
      );

      if (!response.ok) throw new Error('Failed to estimate salary');

      const data = await response.json();
      setSalaryEstimate(data);
    } catch (error) {
      console.error(error);
      toast.error('Failed to estimate salary');
    } finally {
      setModalLoading(false);
    }
  };

  const openInterviewModal = async (job: Job) => {
    setSelectedJob(job);
    setInterviewModalOpen(true);
    setModalLoading(true);
    
    try {
      const { data: { session } } = await supabase.auth.getSession();
      
      const response = await fetch(
        `http://localhost:8000/interview_prep`,
        {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${session?.access_token}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ jobDescription: job.description })
        }
      );

      if (!response.ok) throw new Error('Failed to generate interview prep');

      const data = await response.json();
      setInterviewQuestions(data);
    } catch (error) {
      console.error(error);
      toast.error('Failed to generate interview questions');
    } finally {
      setModalLoading(false);
    }
  };

  const copySummary = () => {
    if (tailoredResume) {
      navigator.clipboard.writeText(tailoredResume.summary);
      toast.success('Copied to clipboard!');
    }
  };

  const downloadInterviewPrep = () => {
    if (interviewQuestions) {
      const content = interviewQuestions.questions
        .map((q: any) => `Q: ${q.question}\n\nA: ${q.answer}\n\n---\n\n`)
        .join('');
      
      const blob = new Blob([content], { type: 'text/plain' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'interview-prep.txt';
      a.click();
      toast.success('Downloaded interview prep!');
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h1 className="text-4xl mb-2">Job Search Agent</h1>
        <p className="text-xl text-gray-400">
          Find your perfect job opportunity with AI assistance
        </p>
      </motion.div>

      {/* Search Bar */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        <Card className="bg-white/5 backdrop-blur-sm border-white/10 p-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <Input
                placeholder="Job title, keywords..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 bg-white/5 border-white/10 text-white"
              />
            </div>
            <div className="flex-1 relative">
              <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <Input
                placeholder="Location..."
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                className="pl-10 bg-white/5 border-white/10 text-white"
              />
            </div>
            <Button
              onClick={searchJobs}
              disabled={loading}
              className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700"
            >
              {loading ? 'Searching...' : 'Search Jobs'}
            </Button>
          </div>
        </Card>
      </motion.div>

      {/* Job Results */}
      <div className="grid grid-cols-1 gap-6">
        {jobs.map((job, idx) => (
          <motion.div
            key={job.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 * (idx + 1) }}
          >
            <Card className="bg-white/5 backdrop-blur-sm border-white/10 p-6 hover:border-white/20 transition-all">
              <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4">
                <div className="flex-1">
                  <h3 className="text-2xl mb-2">{job.title}</h3>
                  <div className="flex flex-wrap gap-4 text-gray-400 mb-4">
                    <div className="flex items-center gap-2">
                      <Briefcase className="w-4 h-4" />
                      {job.company}
                    </div>
                    <div className="flex items-center gap-2">
                      <MapPin className="w-4 h-4" />
                      {job.location}
                    </div>
                    <div className="flex items-center gap-2">
                      <DollarSign className="w-4 h-4" />
                      {job.salary}
                    </div>
                  </div>
                  <p className="text-gray-300 mb-4">{job.description}</p>
                  <div className="flex flex-wrap gap-2 text-sm">
                    <span className="px-3 py-1 bg-blue-500/20 border border-blue-500/30 rounded-full text-blue-300">
                      {job.type}
                    </span>
                    <span className="px-3 py-1 bg-purple-500/20 border border-purple-500/30 rounded-full text-purple-300">
                      {job.experience}
                    </span>
                    <span className="px-3 py-1 bg-green-500/20 border border-green-500/30 rounded-full text-green-300">
                      {job.posted}
                    </span>
                  </div>
                </div>

                <div className="flex lg:flex-col gap-2">
                  <Button
                    onClick={() => openResumeModal(job)}
                    className="flex-1 lg:flex-none bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600"
                  >
                    <FileText className="w-4 h-4 mr-2" />
                    Tailor Resume
                  </Button>
                  <Button
                    onClick={() => openSalaryModal(job)}
                    className="flex-1 lg:flex-none bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600"
                  >
                    <DollarSign className="w-4 h-4 mr-2" />
                    Estimate Salary
                  </Button>
                  <Button
                    onClick={() => openInterviewModal(job)}
                    className="flex-1 lg:flex-none bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600"
                  >
                    <MessageCircle className="w-4 h-4 mr-2" />
                    Interview Prep
                  </Button>
                </div>
              </div>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Resume Tailoring Modal */}
      <Dialog open={resumeModalOpen} onOpenChange={setResumeModalOpen}>
        <DialogContent className="bg-black border-white/20 text-white max-w-2xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-2xl">Tailored Resume for {selectedJob?.title}</DialogTitle>
          </DialogHeader>
          {modalLoading ? (
            <div className="flex justify-center py-12">
              <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin" />
            </div>
          ) : tailoredResume ? (
            <div className="space-y-6">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <h4 className="text-sm text-gray-400">Professional Summary</h4>
                  <Button size="sm" variant="outline" onClick={copySummary}>
                    <Copy className="w-4 h-4 mr-2" />
                    Copy
                  </Button>
                </div>
                <p className="p-4 bg-white/5 rounded-lg border border-white/10">
                  {tailoredResume.summary}
                </p>
              </div>

              <div>
                <h4 className="text-sm text-gray-400 mb-2">Key Skills</h4>
                <div className="flex flex-wrap gap-2">
                  {tailoredResume.keySkills.map((skill: string, idx: number) => (
                    <span
                      key={idx}
                      className="px-3 py-1 bg-blue-500/20 border border-blue-500/30 rounded-full text-sm"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>

              <div>
                <h4 className="text-sm text-gray-400 mb-2">Experience Highlights</h4>
                {tailoredResume.experience.map((exp: any, idx: number) => (
                  <div key={idx} className="p-4 bg-white/5 rounded-lg border border-white/10 mb-3">
                    <div className="mb-2">{exp.title} at {exp.company}</div>
                    <div className="text-sm text-gray-400 mb-2">{exp.duration}</div>
                    <ul className="list-disc list-inside space-y-1 text-sm text-gray-300">
                      {exp.highlights.map((highlight: string, hIdx: number) => (
                        <li key={hIdx}>{highlight}</li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>

              <div className="p-4 bg-green-500/10 border border-green-500/30 rounded-lg">
                <div className="text-sm text-gray-400 mb-1">Match Score</div>
                <div className="text-3xl text-green-400">{tailoredResume.matchScore}%</div>
              </div>
            </div>
          ) : null}
        </DialogContent>
      </Dialog>

      {/* Salary Estimator Modal */}
      <Dialog open={salaryModalOpen} onOpenChange={setSalaryModalOpen}>
        <DialogContent className="bg-black border-white/20 text-white max-w-2xl">
          <DialogHeader>
            <DialogTitle className="text-2xl">Salary Estimate for {selectedJob?.title}</DialogTitle>
          </DialogHeader>
          {modalLoading ? (
            <div className="flex justify-center py-12">
              <div className="w-12 h-12 border-4 border-green-500 border-t-transparent rounded-full animate-spin" />
            </div>
          ) : salaryEstimate ? (
            <div className="space-y-6">
              <div className="grid grid-cols-3 gap-4">
                <div className="p-4 bg-white/5 rounded-lg border border-white/10 text-center">
                  <div className="text-sm text-gray-400 mb-1">Minimum</div>
                  <div className="text-2xl">${(salaryEstimate.min / 1000).toFixed(0)}k</div>
                </div>
                <div className="p-4 bg-green-500/20 rounded-lg border border-green-500/30 text-center">
                  <div className="text-sm text-gray-400 mb-1">Median</div>
                  <div className="text-2xl text-green-400">${(salaryEstimate.median / 1000).toFixed(0)}k</div>
                </div>
                <div className="p-4 bg-white/5 rounded-lg border border-white/10 text-center">
                  <div className="text-sm text-gray-400 mb-1">Maximum</div>
                  <div className="text-2xl">${(salaryEstimate.max / 1000).toFixed(0)}k</div>
                </div>
              </div>

              <div>
                <ResponsiveContainer width="100%" height={200}>
                  <BarChart data={[
                    { label: 'Min', value: salaryEstimate.min },
                    { label: '25th', value: salaryEstimate.percentile25 },
                    { label: 'Median', value: salaryEstimate.median },
                    { label: '75th', value: salaryEstimate.percentile75 },
                    { label: 'Max', value: salaryEstimate.max }
                  ]}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#ffffff10" />
                    <XAxis dataKey="label" stroke="#94a3b8" />
                    <YAxis stroke="#94a3b8" />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: '#1a1a1a',
                        border: '1px solid #ffffff20',
                        borderRadius: '8px'
                      }}
                      formatter={(value: number) => `$${(value / 1000).toFixed(0)}k`}
                    />
                    <Bar dataKey="value" fill="#10b981" radius={[8, 8, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>

              <div>
                <h4 className="text-sm text-gray-400 mb-3">Factors Considered</h4>
                <ul className="space-y-2">
                  {salaryEstimate.factors.map((factor: string, idx: number) => (
                    <li key={idx} className="flex items-start gap-2 text-sm text-gray-300">
                      <div className="w-1.5 h-1.5 bg-green-400 rounded-full mt-1.5" />
                      {factor}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          ) : null}
        </DialogContent>
      </Dialog>

      {/* Interview Prep Modal */}
      <Dialog open={interviewModalOpen} onOpenChange={setInterviewModalOpen}>
        <DialogContent className="bg-black border-white/20 text-white max-w-3xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-2xl">Interview Preparation for {selectedJob?.title}</DialogTitle>
          </DialogHeader>
          {modalLoading ? (
            <div className="flex justify-center py-12">
              <div className="w-12 h-12 border-4 border-purple-500 border-t-transparent rounded-full animate-spin" />
            </div>
          ) : interviewQuestions ? (
            <div className="space-y-6">
              {interviewQuestions.questions.map((q: any, idx: number) => (
                <div key={idx} className="p-4 bg-white/5 rounded-lg border border-white/10">
                  <div className="mb-3">
                    <span className="text-purple-400 mr-2">Q{idx + 1}:</span>
                    {q.question}
                  </div>
                  <div className="pl-6 text-sm text-gray-300 leading-relaxed">
                    <span className="text-green-400 mr-2">A:</span>
                    {q.answer}
                  </div>
                </div>
              ))}
              <Button
                onClick={downloadInterviewPrep}
                className="w-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600"
              >
                <Download className="w-4 h-4 mr-2" />
                Download as PDF
              </Button>
            </div>
          ) : null}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default JobSearch;
