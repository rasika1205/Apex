import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Plus, Filter, Edit2, Trash2 } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Card } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../components/ui/table';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '../components/ui/dialog';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Textarea } from '../components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';
import { toast } from 'sonner';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { useEffect } from 'react';

const USER_ID = 'demo-user-123-0000-0000-000000000001';
type JobStatus = 'applied' | 'interviewing' | 'rejected' | 'accepted';

interface JobApplication {
  id: string;
  company: string;
  position: string;
  status: JobStatus;
  appliedDate: string;
  notes: string;
}

const JobTracker = () => {
  const [filter, setFilter] = useState<JobStatus | 'all'>('all');
  const [addModalOpen, setAddModalOpen] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [selectedJob, setSelectedJob] = useState<JobApplication | null>(null);
  
  const [jobs, setJobs] = useState<JobApplication[]>([]);

  const [newJob, setNewJob] = useState({
    company: '',
    position: '',
    status: 'applied' as JobStatus,
    appliedDate: new Date().toISOString().split('T')[0],
    notes: ''
  });
  useEffect(() => {
  const fetchJobs = async () => {
    try {
      const res = await fetch(
        `http://localhost:8000/tracker/jobs?user_id=${USER_ID}`
      );

      if (!res.ok) throw new Error('Failed to fetch jobs');

      const data = await res.json();

      setJobs(
        data.map((job: any) => ({
          id: job.id,
          company: job.company,
          position: job.position,
          status: job.status,
          appliedDate: job.applied_date,
          notes: job.notes || ''
        }))
      );
    } catch (err) {
      console.error(err);
      toast.error('Failed to load job applications');
    }
  };

  fetchJobs();
}, []);

  const statusColors = {
    applied: 'bg-blue-500/20 text-blue-300 border-blue-500/30',
    interviewing: 'bg-yellow-500/20 text-yellow-300 border-yellow-500/30',
    rejected: 'bg-red-500/20 text-red-300 border-red-500/30',
    accepted: 'bg-green-500/20 text-green-300 border-green-500/30',
  };

  const filteredJobs = filter === 'all' 
    ? jobs 
    : jobs.filter(job => job.status === filter);

  const statusCounts = {
    all: jobs.length,
    applied: jobs.filter(j => j.status === 'applied').length,
    interviewing: jobs.filter(j => j.status === 'interviewing').length,
    rejected: jobs.filter(j => j.status === 'rejected').length,
    accepted: jobs.filter(j => j.status === 'accepted').length,
  };

  const chartData = [
    { status: 'Applied', count: statusCounts.applied },
    { status: 'Interviewing', count: statusCounts.interviewing },
    { status: 'Rejected', count: statusCounts.rejected },
    { status: 'Accepted', count: statusCounts.accepted },
  ];

  const handleAddJob = async () => {
  if (!newJob.company || !newJob.position) {
    toast.error('Please fill in all required fields');
    return;
  }

  try {
    const res = await fetch(`http://localhost:8000/tracker/jobs`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        user_id: USER_ID,
        company: newJob.company,
        position: newJob.position,
        status: newJob.status,
        applied_date: newJob.appliedDate,
        notes: newJob.notes
      })
    });

    const data = await res.json();

    setJobs([
      {
        id: data.id,
        ...newJob
      },
      ...jobs
    ]);

    setAddModalOpen(false);
    toast.success('Job application added!');
  } catch (err) {
    console.error(err);
    toast.error('Failed to add job');
  }
};


  const handleEditJob = async () => {
  if (!selectedJob) return;

  try {
    await fetch(
      `http://localhost:8000/tracker/jobs/${selectedJob.id}`,
      {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          status: selectedJob.status,
          notes: selectedJob.notes
        })
      }
    );

    setJobs(
      jobs.map(job =>
        job.id === selectedJob.id ? selectedJob : job
      )
    );

    setEditModalOpen(false);
    setSelectedJob(null);
    toast.success('Job application updated!');
  } catch (err) {
    console.error(err);
    toast.error('Update failed');
  }
};


  const handleDeleteJob = async (id: string) => {
  try {
    await fetch(`http://localhost:8000/tracker/jobs/${id}`, {
      method: 'DELETE'
    });

    setJobs(jobs.filter(job => job.id !== id));
    toast.success('Job application deleted!');
  } catch (err) {
    console.error(err);
    toast.error('Delete failed');
  }
};


  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4"
      >
        <div>
          <h1 className="text-4xl mb-2">Job Tracker Agent</h1>
          <p className="text-xl text-gray-400">
            Track and manage your job applications
          </p>
        </div>
        <Button
          onClick={() => setAddModalOpen(true)}
          className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700"
        >
          <Plus className="w-5 h-5 mr-2" />
          Add Application
        </Button>
      </motion.div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        {[
          { label: 'All', value: statusCounts.all, filter: 'all' as const },
          { label: 'Applied', value: statusCounts.applied, filter: 'applied' as const },
          { label: 'Interviewing', value: statusCounts.interviewing, filter: 'interviewing' as const },
          { label: 'Rejected', value: statusCounts.rejected, filter: 'rejected' as const },
          { label: 'Accepted', value: statusCounts.accepted, filter: 'accepted' as const },
        ].map((stat, idx) => (
          <motion.div
            key={stat.filter}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 * idx }}
          >
            <Card
              onClick={() => setFilter(stat.filter)}
              className={`p-4 cursor-pointer transition-all ${
                filter === stat.filter
                  ? 'bg-blue-500/20 border-blue-500/30'
                  : 'bg-white/5 border-white/10 hover:border-white/20'
              }`}
            >
              <div className="text-sm text-gray-400 mb-1">{stat.label}</div>
              <div className="text-2xl">{stat.value}</div>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Chart */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <Card className="bg-white/5 backdrop-blur-sm border-white/10 p-6">
          <h3 className="text-xl mb-6">Application Status Overview</h3>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#ffffff10" />
              <XAxis dataKey="status" stroke="#94a3b8" />
              <YAxis stroke="#94a3b8" />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#1a1a1a',
                  border: '1px solid #ffffff20',
                  borderRadius: '8px',
                  color: '#fff'
                }}
              />
              <Bar dataKey="count" fill="#8b5cf6" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </Card>
      </motion.div>

      {/* Table */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
      >
        <Card className="bg-white/5 backdrop-blur-sm border-white/10 overflow-hidden">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="border-white/10 hover:bg-transparent">
                  <TableHead className="text-gray-400">Company</TableHead>
                  <TableHead className="text-gray-400">Position</TableHead>
                  <TableHead className="text-gray-400">Status</TableHead>
                  <TableHead className="text-gray-400">Applied Date</TableHead>
                  <TableHead className="text-gray-400">Notes</TableHead>
                  <TableHead className="text-gray-400 text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredJobs.map((job) => (
                  <TableRow key={job.id} className="border-white/10 hover:bg-white/5">
                    <TableCell className="font-medium">{job.company}</TableCell>
                    <TableCell>{job.position}</TableCell>
                    <TableCell>
                      <Badge className={statusColors[job.status]}>
                        {job.status}
                      </Badge>
                    </TableCell>
                    <TableCell>{new Date(job.appliedDate).toLocaleDateString()}</TableCell>
                    <TableCell className="max-w-xs truncate">{job.notes}</TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => {
                            setSelectedJob(job);
                            setEditModalOpen(true);
                          }}
                        >
                          <Edit2 className="w-4 h-4" />
                        </Button>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => handleDeleteJob(job.id)}
                          className="text-red-400 hover:text-red-300 hover:bg-red-500/10"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
          {filteredJobs.length === 0 && (
            <div className="text-center py-12 text-gray-400">
              No applications found with this status
            </div>
          )}
        </Card>
      </motion.div>

      {/* Add Job Modal */}
      <Dialog open={addModalOpen} onOpenChange={setAddModalOpen}>
        <DialogContent className="bg-black border-white/20 text-white">
          <DialogHeader>
            <DialogTitle>Add Job Application</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="company">Company</Label>
              <Input
                id="company"
                value={newJob.company}
                onChange={(e) => setNewJob({ ...newJob, company: e.target.value })}
                className="bg-white/5 border-white/10 text-white"
              />
            </div>
            <div>
              <Label htmlFor="position">Position</Label>
              <Input
                id="position"
                value={newJob.position}
                onChange={(e) => setNewJob({ ...newJob, position: e.target.value })}
                className="bg-white/5 border-white/10 text-white"
              />
            </div>
            <div>
              <Label htmlFor="status">Status</Label>
              <Select value={newJob.status} onValueChange={(value: JobStatus) => setNewJob({ ...newJob, status: value })}>
                <SelectTrigger className="bg-white/5 border-white/10 text-white">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-black border-white/20">
                  <SelectItem value="applied">Applied</SelectItem>
                  <SelectItem value="interviewing">Interviewing</SelectItem>
                  <SelectItem value="rejected">Rejected</SelectItem>
                  <SelectItem value="accepted">Accepted</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="appliedDate">Applied Date</Label>
              <Input
                id="appliedDate"
                type="date"
                value={newJob.appliedDate}
                onChange={(e) => setNewJob({ ...newJob, appliedDate: e.target.value })}
                className="bg-white/5 border-white/10 text-white"
              />
            </div>
            <div>
              <Label htmlFor="notes">Notes</Label>
              <Textarea
                id="notes"
                value={newJob.notes}
                onChange={(e) => setNewJob({ ...newJob, notes: e.target.value })}
                className="bg-white/5 border-white/10 text-white"
                rows={3}
              />
            </div>
            <Button
              onClick={handleAddJob}
              className="w-full bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700"
            >
              Add Application
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Edit Job Modal */}
      <Dialog open={editModalOpen} onOpenChange={setEditModalOpen}>
        <DialogContent className="bg-black border-white/20 text-white">
          <DialogHeader>
            <DialogTitle>Edit Job Application</DialogTitle>
          </DialogHeader>
          {selectedJob && (
            <div className="space-y-4">
              <div>
                <Label htmlFor="edit-company">Company</Label>
                <Input
                  id="edit-company"
                  value={selectedJob.company}
                  onChange={(e) => setSelectedJob({ ...selectedJob, company: e.target.value })}
                  className="bg-white/5 border-white/10 text-white"
                />
              </div>
              <div>
                <Label htmlFor="edit-position">Position</Label>
                <Input
                  id="edit-position"
                  value={selectedJob.position}
                  onChange={(e) => setSelectedJob({ ...selectedJob, position: e.target.value })}
                  className="bg-white/5 border-white/10 text-white"
                />
              </div>
              <div>
                <Label htmlFor="edit-status">Status</Label>
                <Select value={selectedJob.status} onValueChange={(value: JobStatus) => setSelectedJob({ ...selectedJob, status: value })}>
                  <SelectTrigger className="bg-white/5 border-white/10 text-white">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-black border-white/20">
                    <SelectItem value="applied">Applied</SelectItem>
                    <SelectItem value="interviewing">Interviewing</SelectItem>
                    <SelectItem value="rejected">Rejected</SelectItem>
                    <SelectItem value="accepted">Accepted</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="edit-appliedDate">Applied Date</Label>
                <Input
                  id="edit-appliedDate"
                  type="date"
                  value={selectedJob.appliedDate}
                  onChange={(e) => setSelectedJob({ ...selectedJob, appliedDate: e.target.value })}
                  className="bg-white/5 border-white/10 text-white"
                />
              </div>
              <div>
                <Label htmlFor="edit-notes">Notes</Label>
                <Textarea
                  id="edit-notes"
                  value={selectedJob.notes}
                  onChange={(e) => setSelectedJob({ ...selectedJob, notes: e.target.value })}
                  className="bg-white/5 border-white/10 text-white"
                  rows={3}
                />
              </div>
              <Button
                onClick={handleEditJob}
                className="w-full bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700"
              >
                Update Application
              </Button>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default JobTracker;
