import { Hono } from 'npm:hono';
import { cors } from 'npm:hono/cors';
import { logger } from 'npm:hono/logger';
import { createClient } from 'jsr:@supabase/supabase-js@2';

const app = new Hono();

// Middleware
app.use('*', cors());
app.use('*', logger(console.log));

// Create Supabase client
const supabaseUrl = Deno.env.get('SUPABASE_URL');
const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');

console.log('Supabase URL:', supabaseUrl ? 'Set' : 'NOT SET');
console.log('Service Role Key:', supabaseServiceKey ? 'Set (length: ' + supabaseServiceKey.length + ')' : 'NOT SET');

const supabase = createClient(
  supabaseUrl ?? '',
  supabaseServiceKey ?? ''
);

// Signup route
app.post('/make-server-e2c6f5f9/signup', async (c) => {
  try {
    const { email, password, name } = await c.req.json();

    if (!email || !password || !name) {
      return c.json({ error: 'Missing required fields' }, 400);
    }

    // Create user with Supabase Auth
    const { data, error } = await supabase.auth.admin.createUser({
      email,
      password,
      user_metadata: { name },
      // Automatically confirm the user's email since an email server hasn't been configured.
      email_confirm: true
    });

    if (error) {
      console.log('Signup error:', error);
      return c.json({ error: error.message }, 400);
    }

    return c.json({ success: true, user: data.user });
  } catch (error) {
    console.log('Signup error:', error);
    return c.json({ error: 'Internal server error' }, 500);
  }
});

// Health check
app.get('/make-server-e2c6f5f9/health', (c) => {
  return c.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Profile analysis - resume upload and analysis
app.post('/make-server-e2c6f5f9/analyze-resume', async (c) => {
  try {
    const accessToken = c.req.header('Authorization')?.split(' ')[1];
    const { data: { user }, error: authError } = await supabase.auth.getUser(accessToken);
    
    if (!user?.id || authError) {
      return c.json({ error: 'Unauthorized' }, 401);
    }

    // Mock resume analysis response
    const analysis = {
      summary: {
        experience: '5+ years',
        strength: 'Strong technical skills',
        level: 'Senior'
      },
      skills: {
        technical: ['JavaScript', 'React', 'Node.js', 'Python', 'AWS'],
        soft: ['Leadership', 'Communication', 'Problem Solving']
      },
      strengths: [
        'Extensive full-stack development experience',
        'Strong leadership and team collaboration',
        'Cloud infrastructure expertise'
      ],
      weaknesses: [
        'Limited machine learning experience',
        'No mobile development background'
      ],
      missingSkills: ['Machine Learning', 'Mobile Development', 'DevOps'],
      radarData: [
        { skill: 'Frontend', value: 90 },
        { skill: 'Backend', value: 85 },
        { skill: 'DevOps', value: 60 },
        { skill: 'ML/AI', value: 40 },
        { skill: 'Mobile', value: 30 },
        { skill: 'Cloud', value: 80 }
      ],
      barData: [
        { category: 'Technical Skills', score: 85 },
        { category: 'Leadership', score: 75 },
        { category: 'Communication', score: 80 },
        { category: 'Problem Solving', score: 90 }
      ]
    };

    return c.json(analysis);
  } catch (error) {
    console.log('Resume analysis error:', error);
    return c.json({ error: 'Failed to analyze resume' }, 500);
  }
});

// Job search
app.get('/make-server-e2c6f5f9/search-jobs', async (c) => {
  try {
    const accessToken = c.req.header('Authorization')?.split(' ')[1];
    const { data: { user }, error: authError } = await supabase.auth.getUser(accessToken);
    
    if (!user?.id || authError) {
      return c.json({ error: 'Unauthorized' }, 401);
    }

    const query = c.req.query('q') || 'software engineer';
    const location = c.req.query('location') || 'remote';

    // Mock job results
    const jobs = [
      {
        id: '1',
        title: 'Senior Software Engineer',
        company: 'Tech Corp',
        location: 'Remote',
        experience: '5+ years',
        salary: '$120k - $180k',
        description: 'We are looking for an experienced software engineer to join our team...',
        posted: '2 days ago',
        type: 'Full-time'
      },
      {
        id: '2',
        title: 'Full Stack Developer',
        company: 'StartupXYZ',
        location: 'San Francisco, CA',
        experience: '3-5 years',
        salary: '$100k - $150k',
        description: 'Join our fast-growing startup as a full stack developer...',
        posted: '1 week ago',
        type: 'Full-time'
      },
      {
        id: '3',
        title: 'Frontend Engineer',
        company: 'Design Co',
        location: 'New York, NY',
        experience: '2-4 years',
        salary: '$90k - $130k',
        description: 'Looking for a frontend engineer passionate about UI/UX...',
        posted: '3 days ago',
        type: 'Full-time'
      }
    ];

    return c.json({ jobs, query, location });
  } catch (error) {
    console.log('Job search error:', error);
    return c.json({ error: 'Failed to search jobs' }, 500);
  }
});

// Tailor resume for specific job
app.post('/make-server-e2c6f5f9/tailor-resume', async (c) => {
  try {
    const accessToken = c.req.header('Authorization')?.split(' ')[1];
    const { data: { user }, error: authError } = await supabase.auth.getUser(accessToken);
    
    if (!user?.id || authError) {
      return c.json({ error: 'Unauthorized' }, 401);
    }

    const { jobDescription } = await c.req.json();

    const tailoredResume = {
      summary: 'Experienced software engineer with 5+ years specializing in full-stack development, cloud infrastructure, and leading high-performing engineering teams.',
      keySkills: ['React', 'Node.js', 'AWS', 'Python', 'Leadership'],
      experience: [
        {
          title: 'Senior Software Engineer',
          company: 'Tech Company',
          duration: '2020 - Present',
          highlights: [
            'Led team of 5 engineers in building scalable microservices',
            'Reduced API response time by 40% through optimization',
            'Implemented CI/CD pipeline improving deployment frequency'
          ]
        }
      ],
      matchScore: 92
    };

    return c.json(tailoredResume);
  } catch (error) {
    console.log('Tailor resume error:', error);
    return c.json({ error: 'Failed to tailor resume' }, 500);
  }
});

// Estimate salary
app.post('/make-server-e2c6f5f9/estimate-salary', async (c) => {
  try {
    const accessToken = c.req.header('Authorization')?.split(' ')[1];
    const { data: { user }, error: authError } = await supabase.auth.getUser(accessToken);
    
    if (!user?.id || authError) {
      return c.json({ error: 'Unauthorized' }, 401);
    }

    const salaryEstimate = {
      min: 100000,
      max: 160000,
      median: 130000,
      percentile25: 110000,
      percentile75: 145000,
      factors: [
        'Experience level: 5+ years',
        'Location: San Francisco Bay Area',
        'Company size: Large (1000+ employees)',
        'Role: Senior Software Engineer'
      ]
    };

    return c.json(salaryEstimate);
  } catch (error) {
    console.log('Salary estimation error:', error);
    return c.json({ error: 'Failed to estimate salary' }, 500);
  }
});

// Generate interview prep
app.post('/make-server-e2c6f5f9/interview-prep', async (c) => {
  try {
    const accessToken = c.req.header('Authorization')?.split(' ')[1];
    const { data: { user }, error: authError } = await supabase.auth.getUser(accessToken);
    
    if (!user?.id || authError) {
      return c.json({ error: 'Unauthorized' }, 401);
    }

    const questions = [
      {
        question: 'Tell me about yourself and your experience.',
        answer: 'I am a software engineer with 5+ years of experience specializing in full-stack development. I have worked on scalable web applications using React, Node.js, and cloud technologies like AWS...'
      },
      {
        question: 'What is your experience with microservices architecture?',
        answer: 'I have extensive experience designing and implementing microservices. In my previous role, I led the migration from a monolithic application to microservices, which improved scalability and deployment speed...'
      },
      {
        question: 'How do you handle conflicts in a team?',
        answer: 'I believe in open communication and addressing conflicts early. I schedule one-on-one discussions to understand different perspectives and work towards a solution that benefits the team and project...'
      },
      {
        question: 'Describe a challenging technical problem you solved.',
        answer: 'One of the most challenging problems was optimizing our API performance. I identified bottlenecks through profiling, implemented caching strategies, and optimized database queries, resulting in a 40% improvement in response time...'
      }
    ];

    return c.json({ questions });
  } catch (error) {
    console.log('Interview prep error:', error);
    return c.json({ error: 'Failed to generate interview prep' }, 500);
  }
});

// Career planning chat
app.post('/make-server-e2c6f5f9/career-chat', async (c) => {
  try {
    const accessToken = c.req.header('Authorization')?.split(' ')[1];
    const { data: { user }, error: authError } = await supabase.auth.getUser(accessToken);
    
    if (!user?.id || authError) {
      return c.json({ error: 'Unauthorized' }, 401);
    }

    const { message } = await c.req.json();

    // Simple mock response
    const responses = [
      'Based on your profile, I recommend focusing on cloud certifications to advance your career.',
      'Consider transitioning into a tech lead role where you can leverage your experience.',
      'Building a portfolio of side projects can help demonstrate your skills to potential employers.',
      'Networking at industry events and conferences can open new opportunities.',
      'I suggest learning about system design and architecture for senior-level positions.'
    ];

    const response = responses[Math.floor(Math.random() * responses.length)];

    return c.json({ response });
  } catch (error) {
    console.log('Career chat error:', error);
    return c.json({ error: 'Failed to process chat' }, 500);
  }
});

// Fetch news
app.get('/make-server-e2c6f5f9/news', async (c) => {
  try {
    const accessToken = c.req.header('Authorization')?.split(' ')[1];
    const { data: { user }, error: authError } = await supabase.auth.getUser(accessToken);
    
    if (!user?.id || authError) {
      return c.json({ error: 'Unauthorized' }, 401);
    }

    // Mock news articles
    const articles = [
      {
        id: '1',
        title: 'Tech Industry Hiring Trends for 2025',
        description: 'Analysis of the latest hiring trends in the technology sector',
        image: 'https://images.unsplash.com/photo-1504384308090-c894fdcc538d?w=800',
        category: 'Industry',
        date: '2025-12-10',
        source: 'Tech News'
      },
      {
        id: '2',
        title: 'Top 10 Skills Employers Are Looking For',
        description: 'A comprehensive guide to the most in-demand skills',
        image: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=800',
        category: 'Career',
        date: '2025-12-09',
        source: 'Career Insights'
      },
      {
        id: '3',
        title: 'Remote Work: The New Normal',
        description: 'How remote work is reshaping the job market',
        image: 'https://images.unsplash.com/photo-1588196749597-9ff075ee6b5b?w=800',
        category: 'Remote',
        date: '2025-12-08',
        source: 'Work Trends'
      }
    ];

    return c.json({ articles });
  } catch (error) {
    console.log('News fetch error:', error);
    return c.json({ error: 'Failed to fetch news' }, 500);
  }
});

Deno.serve(app.fetch);