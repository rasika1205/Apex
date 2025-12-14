import React, { useState } from 'react';
import { motion } from 'motion/react';
import { AlertCircle, TrendingDown, Lightbulb, Target, ArrowRight } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Card } from '../components/ui/card';
import { Textarea } from '../components/ui/textarea';
import { toast } from 'sonner';
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

const RejectionAnalyzer = () => {
  const [rejectionText, setRejectionText] = useState('');
  const [analyzing, setAnalyzing] = useState(false);
  const [analysis, setAnalysis] = useState<any>(null);

  const handleAnalyze = async () => {
      console.log("🔥 Analyze button clicked");
  if (!rejectionText.trim()) {
    toast.error('Please enter rejection email text');
    return;
  }

  setAnalyzing(true);

  try {

    console.log("📤 Sending request:", rejectionText);
    const response = await fetch(
      'http://localhost:8000/rejection_analyze',
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ rejectionText })
      }
    );
    console.log("📥 Response received:", response.status);
    if (!response.ok) throw new Error('Failed to analyze rejection');

    const data = await response.json();
    setAnalysis(data);
    toast.success('Rejection analyzed successfully!');
  } catch (err) {
    console.error(err);
    toast.error('Analysis failed');
  } finally {
    setAnalyzing(false);
  }
};


  const resetForm = () => {
    setRejectionText('');
    setAnalysis(null);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h1 className="text-4xl mb-2">Rejection Analyzer Agent</h1>
        <p className="text-xl text-gray-400">
          Learn from rejections and improve your job hunt strategy
        </p>
      </motion.div>

      {/* Input Section */}
      {!analysis && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <Card className="bg-white/5 backdrop-blur-sm border-white/10 p-8">
            <div className="text-center mb-6">
              <div className="flex justify-center mb-4">
                <div className="w-20 h-20 bg-gradient-to-br from-red-500 to-pink-600 rounded-2xl flex items-center justify-center">
                  <TrendingDown className="w-10 h-10" />
                </div>
              </div>
              <h2 className="text-2xl mb-4">Analyze Rejection Email</h2>
              <p className="text-gray-400">
                Paste your rejection email below to get insights on what went wrong and how to improve
              </p>
            </div>

            <Textarea
              placeholder="Paste your rejection email here..."
              value={rejectionText}
              onChange={(e) => setRejectionText(e.target.value)}
              className="bg-white/5 border-white/10 text-white min-h-[200px] mb-6"
            />

            <Button
              onClick={handleAnalyze}
              disabled={analyzing || !rejectionText.trim()}
              className="w-full bg-gradient-to-r from-red-500 to-pink-600 hover:from-red-600 hover:to-pink-700 h-12"
            >
              {analyzing ? (
                <>
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                  Analyzing...
                </>
              ) : (
                <>
                  <AlertCircle className="w-5 h-5 mr-2" />
                  Analyze Rejection
                </>
              )}
            </Button>
          </Card>
        </motion.div>
      )}

      {/* Analysis Results */}
      {analysis && (
        <>
          {/* Skill Gap Chart */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <Card className="bg-white/5 backdrop-blur-sm border-white/10 p-6">
              <h3 className="text-xl mb-6 flex items-center gap-2">
                <Target className="w-5 h-5 text-red-400" />
                Skill Gap Analysis
              </h3>
              <ResponsiveContainer width="100%" height={350}>
                <RadarChart data={analysis.skillGap}>
                  <PolarGrid stroke="#ffffff20" />
                  <PolarAngleAxis dataKey="skill" stroke="#94a3b8" />
                  <PolarRadiusAxis stroke="#94a3b8" />
                  <Radar
                    name="Current Level"
                    dataKey="current"
                    stroke="#ef4444"
                    fill="#ef4444"
                    fillOpacity={0.3}
                  />
                  <Radar
                    name="Required Level"
                    dataKey="required"
                    stroke="#10b981"
                    fill="#10b981"
                    fillOpacity={0.3}
                  />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#1a1a1a',
                      border: '1px solid #ffffff20',
                      borderRadius: '8px',
                      color: '#fff'
                    }}
                  />
                </RadarChart>
              </ResponsiveContainer>
            </Card>
          </motion.div>

          {/* Missing Skills */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <Card className="bg-white/5 backdrop-blur-sm border-white/10 p-6">
              <h3 className="text-xl mb-4 flex items-center gap-2">
                <AlertCircle className="w-5 h-5 text-orange-400" />
                Missing Skills
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {analysis.missingSkills.map((item: any, idx: number) => (
                  <div
                    key={idx}
                    className="p-4 bg-red-500/10 border border-red-500/30 rounded-lg"
                  >
                    <div className="text-lg mb-2">{item.skill}</div>
                    <div className="text-sm text-gray-400 mb-1">
                      Importance: <span className="text-orange-400">{item.importance}</span>
                    </div>
                    <div className="text-sm text-gray-400">
                      Gap: {item.gap}
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          </motion.div>

          {/* Mistakes */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <Card className="bg-white/5 backdrop-blur-sm border-white/10 p-6">
              <h3 className="text-xl mb-4 flex items-center gap-2">
                <AlertCircle className="w-5 h-5 text-red-400" />
                Identified Mistakes
              </h3>
              <div className="space-y-3">
                {analysis.mistakes.map((mistake: string, idx: number) => (
                  <div
                    key={idx}
                    className="flex items-start gap-3 p-4 bg-red-500/10 border border-red-500/20 rounded-lg"
                  >
                    <div className="w-6 h-6 bg-red-500/20 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                      <span className="text-sm">{idx + 1}</span>
                    </div>
                    <p className="text-gray-300">{mistake}</p>
                  </div>
                ))}
              </div>
            </Card>
          </motion.div>

          {/* Suggestions */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <Card className="bg-white/5 backdrop-blur-sm border-white/10 p-6">
              <h3 className="text-xl mb-4 flex items-center gap-2">
                <Lightbulb className="w-5 h-5 text-yellow-400" />
                Improvement Suggestions
              </h3>
              <div className="space-y-3">
                {analysis.suggestions.map((suggestion: string, idx: number) => (
                  <div
                    key={idx}
                    className="flex items-start gap-3 p-4 bg-green-500/10 border border-green-500/20 rounded-lg"
                  >
                    <Lightbulb className="w-5 h-5 text-yellow-400 flex-shrink-0 mt-0.5" />
                    <p className="text-gray-300">{suggestion}</p>
                  </div>
                ))}
              </div>
            </Card>
          </motion.div>

          {/* Next Steps */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            <Card className="bg-white/5 backdrop-blur-sm border-white/10 p-6">
              <h3 className="text-xl mb-4 flex items-center gap-2">
                <ArrowRight className="w-5 h-5 text-blue-400" />
                Action Plan
              </h3>
              <div className="space-y-4">
                {analysis.nextSteps.map((step: any, idx: number) => (
                  <div
                    key={idx}
                    className="p-5 bg-blue-500/10 border border-blue-500/30 rounded-lg"
                  >
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <h4 className="text-lg mb-1">{step.action}</h4>
                        <div className="text-sm text-blue-400">
                          Timeline: {step.timeline}
                        </div>
                      </div>
                      <div className="w-8 h-8 bg-blue-500/20 rounded-full flex items-center justify-center flex-shrink-0">
                        <span className="text-sm">{idx + 1}</span>
                      </div>
                    </div>
                    <div>
                      <div className="text-sm text-gray-400 mb-2">Resources:</div>
                      <div className="flex flex-wrap gap-2">
                        {step.resources.map((resource: string, rIdx: number) => (
                          <span
                            key={rIdx}
                            className="px-3 py-1 bg-blue-500/20 border border-blue-500/30 rounded-full text-sm"
                          >
                            {resource}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          </motion.div>

          {/* Action Button */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="flex justify-center"
          >
            <Button
              onClick={resetForm}
              variant="outline"
              className="border-white/20 hover:bg-white/5"
            >
              Analyze Another Rejection
            </Button>
          </motion.div>
        </>
      )}
    </div>
  );
};

export default RejectionAnalyzer;
