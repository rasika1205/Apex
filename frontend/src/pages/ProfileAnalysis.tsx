import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Upload, FileText, TrendingUp, AlertCircle, CheckCircle2 } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Card } from '../components/ui/card';
import { toast } from 'sonner';
import { supabase } from '../App';
import { projectId, publicAnonKey } from '../utils/supabase/info';
import {
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip
} from 'recharts';

const ProfileAnalysis = () => {
  const [analyzing, setAnalyzing] = useState(false);
  const [analysis, setAnalysis] = useState<any>(null);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
  const file = e.target.files?.[0];
  if (!file) return;

  if (file.type !== "application/pdf") {
    toast.error("Please upload a PDF file");
    return;
  }

  setAnalyzing(true);

  try {
    const formData = new FormData();
    formData.append("file", file);

    const response = await fetch("http://localhost:8000/profile/analyze_resume", {
      method: "POST",
      body: formData,
    });

    if (!response.ok) throw new Error("Failed to analyze resume");

    const data = await response.json();
    setAnalysis(data);
    toast.success("Resume analyzed successfully!");
  } catch (err) {
    console.error(err);
    toast.error("Failed to analyze resume");
  } finally {
    setAnalyzing(false);
  }
};


  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h1 className="text-4xl mb-2">Profile Understanding Agent</h1>
        <p className="text-xl text-gray-400">
          Get AI-powered insights about your resume and skills
        </p>
      </motion.div>

      {/* Upload Section */}
      {!analysis && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <Card className="bg-white/5 backdrop-blur-sm border-white/10 p-12">
            <div className="text-center">
              <div className="flex justify-center mb-6">
                <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center">
                  <Upload className="w-10 h-10" />
                </div>
              </div>
              <h2 className="text-2xl mb-4">Upload Your Resume</h2>
              <p className="text-gray-400 mb-8 max-w-md mx-auto">
                Upload your resume in PDF format and let our AI analyze your skills,
                experience, and provide actionable insights
              </p>
              <label htmlFor="resume-upload">
                <Button
                  disabled={analyzing}
                  className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 cursor-pointer"
                  onClick={() => document.getElementById('resume-upload')?.click()}
                >
                  {analyzing ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                      Analyzing...
                    </>
                  ) : (
                    <>
                      <Upload className="w-5 h-5 mr-2" />
                      Select Resume (PDF)
                    </>
                  )}
                </Button>
                <input
                  id="resume-upload"
                  type="file"
                  accept=".pdf"
                  className="hidden"
                  onChange={handleFileUpload}
                />
              </label>
            </div>
          </Card>
        </motion.div>
      )}

      {/* Analysis Results */}
      {analysis && (
        <>
          {/* Summary Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="grid grid-cols-1 md:grid-cols-3 gap-6"
          >
            <Card className="bg-gradient-to-br from-blue-500/20 to-blue-600/10 border-blue-500/30 p-6">
              <div className="flex items-start justify-between mb-4">
                <FileText className="w-8 h-8 text-blue-400" />
              </div>
              <div className="text-sm text-gray-400 mb-1">Experience Level</div>
              <div className="text-2xl">{analysis.summary.experience}</div>
            </Card>

            <Card className="bg-gradient-to-br from-purple-500/20 to-purple-600/10 border-purple-500/30 p-6">
              <div className="flex items-start justify-between mb-4">
                <TrendingUp className="w-8 h-8 text-purple-400" />
              </div>
              <div className="text-sm text-gray-400 mb-1">Career Level</div>
              <div className="text-2xl">{analysis.summary.level}</div>
            </Card>

            <Card className="bg-gradient-to-br from-green-500/20 to-green-600/10 border-green-500/30 p-6">
              <div className="flex items-start justify-between mb-4">
                <CheckCircle2 className="w-8 h-8 text-green-400" />
              </div>
              <div className="text-sm text-gray-400 mb-1">Key Strength</div>
              <div className="text-2xl">{analysis.summary.strength}</div>
            </Card>
          </motion.div>

          {/* Charts Row */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Skills Radar Chart */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <Card className="bg-white/5 backdrop-blur-sm border-white/10 p-6">
                <h3 className="text-xl mb-6">Skill Distribution</h3>
                <ResponsiveContainer width="100%" height={350}>
                  <RadarChart data={analysis.radarData}>
                    <PolarGrid stroke="#ffffff20" />
                    <PolarAngleAxis dataKey="skill" stroke="#94a3b8" />
                    <PolarRadiusAxis stroke="#94a3b8" />
                    <Radar
                      name="Skills"
                      dataKey="value"
                      stroke="#8b5cf6"
                      fill="#8b5cf6"
                      fillOpacity={0.5}
                    />
                  </RadarChart>
                </ResponsiveContainer>
              </Card>
            </motion.div>

            {/* Strengths Bar Chart */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              <Card className="bg-white/5 backdrop-blur-sm border-white/10 p-6">
                <h3 className="text-xl mb-6">Competency Analysis</h3>
                <ResponsiveContainer width="100%" height={350}>
                  <BarChart data={analysis.barData} layout="vertical">
                    <CartesianGrid strokeDasharray="3 3" stroke="#ffffff10" />
                    <XAxis type="number" stroke="#94a3b8" />
                    <YAxis dataKey="category" type="category" stroke="#94a3b8" width={120} />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: '#1a1a1a',
                        border: '1px solid #ffffff20',
                        borderRadius: '8px',
                        color: '#fff'
                      }}
                    />
                    <Bar dataKey="score" fill="#3b82f6" radius={[0, 8, 8, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </Card>
            </motion.div>
          </div>

          {/* Detailed Analysis */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Strengths */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
            >
              <Card className="bg-white/5 backdrop-blur-sm border-white/10 p-6">
                <h3 className="text-xl mb-4 flex items-center gap-2">
                  <CheckCircle2 className="w-5 h-5 text-green-400" />
                  Strengths
                </h3>
                <div className="space-y-3">
                  {analysis.strengths.map((strength: string, idx: number) => (
                    <div key={idx} className="flex items-start gap-3 p-3 bg-green-500/10 rounded-lg border border-green-500/20">
                      <CheckCircle2 className="w-5 h-5 text-green-400 flex-shrink-0 mt-0.5" />
                      <span className="text-gray-300">{strength}</span>
                    </div>
                  ))}
                </div>
              </Card>
            </motion.div>

            {/* Weaknesses */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
            >
              <Card className="bg-white/5 backdrop-blur-sm border-white/10 p-6">
                <h3 className="text-xl mb-4 flex items-center gap-2">
                  <AlertCircle className="w-5 h-5 text-orange-400" />
                  Areas for Improvement
                </h3>
                <div className="space-y-3">
                  {analysis.weaknesses.map((weakness: string, idx: number) => (
                    <div key={idx} className="flex items-start gap-3 p-3 bg-orange-500/10 rounded-lg border border-orange-500/20">
                      <AlertCircle className="w-5 h-5 text-orange-400 flex-shrink-0 mt-0.5" />
                      <span className="text-gray-300">{weakness}</span>
                    </div>
                  ))}
                </div>
              </Card>
            </motion.div>
          </div>

          {/* Skills Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
          >
            <Card className="bg-white/5 backdrop-blur-sm border-white/10 p-6">
              <h3 className="text-xl mb-6">Skill Inventory</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h4 className="text-sm text-gray-400 mb-3">Technical Skills</h4>
                  <div className="flex flex-wrap gap-2">
                    {analysis.skills.technical.map((skill: string, idx: number) => (
                      <span
                        key={idx}
                        className="px-3 py-1 bg-blue-500/20 border border-blue-500/30 rounded-full text-sm text-blue-300"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
                <div>
                  <h4 className="text-sm text-gray-400 mb-3">Soft Skills</h4>
                  <div className="flex flex-wrap gap-2">
                    {analysis.skills.soft.map((skill: string, idx: number) => (
                      <span
                        key={idx}
                        className="px-3 py-1 bg-purple-500/20 border border-purple-500/30 rounded-full text-sm text-purple-300"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
              <div className="mt-6">
                <h4 className="text-sm text-gray-400 mb-3">Missing Skills (Recommended)</h4>
                <div className="flex flex-wrap gap-2">
                  {analysis.missingSkills.map((skill: string, idx: number) => (
                    <span
                      key={idx}
                      className="px-3 py-1 bg-red-500/20 border border-red-500/30 rounded-full text-sm text-red-300"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            </Card>
          </motion.div>

          {/* Action Button */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7 }}
            className="flex justify-center"
          >
            <Button
              onClick={() => setAnalysis(null)}
              variant="outline"
              className="border-white/20 hover:bg-white/5"
            >
              Analyze Another Resume
            </Button>
          </motion.div>
        </>
      )}
    </div>
  );
};

export default ProfileAnalysis;
