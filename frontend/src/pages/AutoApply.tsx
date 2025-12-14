import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Rocket, Link as LinkIcon, CheckCircle2, Loader2, AlertCircle } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Card } from '../components/ui/card';
import { toast } from 'sonner';

interface ApplicationStep {
  label: string;
  status: 'pending' | 'processing' | 'completed' | 'error';
}

const AutoApply = () => {
  const [jobUrl, setJobUrl] = useState('');
  const [applying, setApplying] = useState(false);
  const [applicationComplete, setApplicationComplete] = useState(false);
  const [steps, setSteps] = useState<ApplicationStep[]>([
    { label: 'Validating job URL', status: 'pending' },
    { label: 'Extracting job details', status: 'pending' },
    { label: 'Tailoring resume', status: 'pending' },
    { label: 'Filling application form', status: 'pending' },
    { label: 'Submitting application', status: 'pending' },
  ]);

  const handleAutoApply = async () => {
  console.log("🔥 Auto apply clicked");

  if (!jobUrl.trim()) {
    toast.error("Please enter a job URL");
    return;
  }

  setApplying(true);
  setApplicationComplete(false);

  try {
    // Step 1: show progress
    setSteps(prev =>
      prev.map((s, i) =>
        i === 0 ? { ...s, status: "processing" } : s
      )
    );

    const response = await fetch("http://127.0.0.1:8000/apply", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        job_url: jobUrl,
        user_id: "demo-user"
      })
    });

    if (!response.ok) {
      throw new Error("Application failed");
    }

    const data = await response.json();
    console.log("📥 Backend response:", data);

    // Mark all steps complete
    setSteps(prev =>
      prev.map(step => ({ ...step, status: "completed" }))
    );

    setApplicationComplete(true);
    toast.success("Application submitted successfully!");

  } catch (err) {
    console.error(err);

    setSteps(prev =>
      prev.map(step =>
        step.status === "processing"
          ? { ...step, status: "error" }
          : step
      )
    );

    toast.error("Auto-apply failed");
  } finally {
    setApplying(false);
  }
};


  const resetForm = () => {
    setJobUrl('');
    setApplicationComplete(false);
    setSteps([
      { label: 'Validating job URL', status: 'pending' },
      { label: 'Extracting job details', status: 'pending' },
      { label: 'Tailoring resume', status: 'pending' },
      { label: 'Filling application form', status: 'pending' },
      { label: 'Submitting application', status: 'pending' },
    ]);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h1 className="text-4xl mb-2">Application Automation Agent</h1>
        <p className="text-xl text-gray-400">
          Automate your job applications with AI-powered form filling
        </p>
      </motion.div>

      {/* Main Card */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        <Card className="bg-white/5 backdrop-blur-sm border-white/10 p-8">
          {!applicationComplete ? (
            <div className="max-w-2xl mx-auto">
              <div className="text-center mb-8">
                <div className="flex justify-center mb-4">
                  <div className="w-20 h-20 bg-gradient-to-br from-orange-500 to-red-600 rounded-2xl flex items-center justify-center">
                    <Rocket className="w-10 h-10" />
                  </div>
                </div>
                <h2 className="text-2xl mb-4">Apply to Jobs Automatically</h2>
                <p className="text-gray-400">
                  Enter the job application URL and let ALEX handle the rest
                </p>
              </div>

              {/* URL Input */}
              <div className="mb-8">
                <div className="relative">
                  <LinkIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <Input
                    placeholder="https://example.com/job/apply"
                    value={jobUrl}
                    onChange={(e) => setJobUrl(e.target.value)}
                    disabled={applying}
                    className="pl-10 bg-white/5 border-white/10 text-white h-12"
                  />
                </div>
              </div>

              {/* Application Steps */}
              {(applying || steps.some(s => s.status !== 'pending')) && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="space-y-3 mb-8"
                >
                  {steps.map((step, idx) => (
                    <div
                      key={idx}
                      className={`flex items-center gap-3 p-4 rounded-lg border transition-all ${
                        step.status === 'completed'
                          ? 'bg-green-500/10 border-green-500/30'
                          : step.status === 'processing'
                          ? 'bg-blue-500/10 border-blue-500/30'
                          : step.status === 'error'
                          ? 'bg-red-500/10 border-red-500/30'
                          : 'bg-white/5 border-white/10'
                      }`}
                    >
                      {step.status === 'completed' ? (
                        <CheckCircle2 className="w-5 h-5 text-green-400 flex-shrink-0" />
                      ) : step.status === 'processing' ? (
                        <Loader2 className="w-5 h-5 text-blue-400 flex-shrink-0 animate-spin" />
                      ) : step.status === 'error' ? (
                        <AlertCircle className="w-5 h-5 text-red-400 flex-shrink-0" />
                      ) : (
                        <div className="w-5 h-5 rounded-full border-2 border-gray-600 flex-shrink-0" />
                      )}
                      <span className={step.status === 'completed' ? 'text-green-400' : ''}>
                        {step.label}
                      </span>
                    </div>
                  ))}
                </motion.div>
              )}

              {/* Action Button */}
              <Button
                onClick={handleAutoApply}
                disabled={applying || !jobUrl.trim()}
                className="w-full bg-gradient-to-r from-orange-500 to-red-600 hover:from-orange-600 hover:to-red-700 h-12"
              >
                {applying ? (
                  <>
                    <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                    Applying...
                  </>
                ) : (
                  <>
                    <Rocket className="w-5 h-5 mr-2" />
                    Start Auto Apply
                  </>
                )}
              </Button>

              {/* Info */}
              <div className="mt-6 p-4 bg-blue-500/10 border border-blue-500/30 rounded-lg">
                <h4 className="text-sm mb-2 flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 text-blue-400" />
                  How it works
                </h4>
                <ul className="text-xs text-gray-300 space-y-1 ml-6 list-disc">
                  <li>APEX extracts job details from the URL</li>
                  <li>Your resume is automatically tailored for the position</li>
                  <li>Application forms are filled with your information</li>
                  <li>The application is submitted on your behalf</li>
                </ul>
              </div>
            </div>
          ) : (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="max-w-2xl mx-auto text-center"
            >
              <div className="flex justify-center mb-6">
                <div className="w-24 h-24 bg-gradient-to-br from-green-500 to-emerald-600 rounded-full flex items-center justify-center">
                  <CheckCircle2 className="w-12 h-12" />
                </div>
              </div>
              <h2 className="text-3xl mb-4">Application Submitted!</h2>
              <p className="text-gray-400 mb-8">
                Your application has been successfully submitted. Good luck!
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
                <Card className="bg-white/5 border-white/10 p-4">
                  <div className="text-sm text-gray-400 mb-1">Application URL</div>
                  <div className="text-sm truncate">{jobUrl}</div>
                </Card>
                <Card className="bg-white/5 border-white/10 p-4">
                  <div className="text-sm text-gray-400 mb-1">Submitted At</div>
                  <div className="text-sm">{new Date().toLocaleString()}</div>
                </Card>
              </div>

              <div className="flex gap-4 justify-center">
                <Button
                  onClick={resetForm}
                  className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700"
                >
                  Apply to Another Job
                </Button>
                <Button
                  variant="outline"
                  className="border-white/20 hover:bg-white/5"
                  onClick={() => window.location.href = '/tracker'}
                >
                  View in Tracker
                </Button>
              </div>
            </motion.div>
          )}
        </Card>
      </motion.div>

      {/* Recent Applications */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <Card className="bg-white/5 backdrop-blur-sm border-white/10 p-6">
          <h3 className="text-xl mb-4">Recent Auto-Applications</h3>
          <div className="space-y-3">
            {[
              { company: 'Tech Corp', position: 'Senior Engineer', date: '2 hours ago', status: 'submitted' },
              { company: 'StartupXYZ', position: 'Full Stack Dev', date: '1 day ago', status: 'submitted' },
              { company: 'Design Co', position: 'Frontend Engineer', date: '2 days ago', status: 'submitted' },
            ].map((app, idx) => (
              <div
                key={idx}
                className="flex items-center justify-between p-4 bg-white/5 rounded-lg border border-white/10"
              >
                <div>
                  <div className="mb-1">{app.position}</div>
                  <div className="text-sm text-gray-400">{app.company} • {app.date}</div>
                </div>
                <span className="px-3 py-1 bg-green-500/20 border border-green-500/30 rounded-full text-sm text-green-300">
                  {app.status}
                </span>
              </div>
            ))}
          </div>
        </Card>
      </motion.div>
    </div>
  );
};

export default AutoApply;
