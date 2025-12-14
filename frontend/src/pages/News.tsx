import React, { useEffect, useState } from 'react';
import { motion } from 'motion/react';
import { Newspaper, ExternalLink, Calendar, Tag } from 'lucide-react';
import { Card } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { Button } from '../components/ui/button';
import { toast } from 'sonner';
import { supabase } from '../App';
import { projectId, publicAnonKey } from '../utils/supabase/info';

interface NewsArticle {
  id: string;
  title: string;
  description: string;
  image: string;
  category: string;
  date: string;
  source: string;
}

const News = () => {
  const [articles, setArticles] = useState<NewsArticle[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  const categories = ['all', 'Industry', 'Career', 'Remote', 'Technology', 'Business'];

  const categoryColors: Record<string, string> = {
    'Industry': 'bg-blue-500/20 text-blue-300 border-blue-500/30',
    'Career': 'bg-green-500/20 text-green-300 border-green-500/30',
    'Remote': 'bg-purple-500/20 text-purple-300 border-purple-500/30',
    'Technology': 'bg-orange-500/20 text-orange-300 border-orange-500/30',
    'Business': 'bg-pink-500/20 text-pink-300 border-pink-500/30',
  };

  useEffect(() => {
    fetchNews();
  }, []);

  const fetchNews = async () => {
    setLoading(true);
    try {
      const { data: { session } } = await supabase.auth.getSession();
      
      const response = await fetch(
        `http://localhost:8000/news`,
        {
          headers: {
            'Authorization': `Bearer ${session?.access_token}`,
          }
        }
      );

      if (!response.ok) throw new Error('Failed to fetch news');

      const data = await response.json();
      
      // Add more mock articles
      const moreArticles: NewsArticle[] = [
        {
          id: '4',
          title: 'AI in Recruitment: The Future is Here',
          description: 'How artificial intelligence is transforming the hiring process',
          image: 'https://images.unsplash.com/photo-1677442136019-21780ecad995?w=800',
          category: 'Technology',
          date: '2025-12-07',
          source: 'Tech Weekly'
        },
        {
          id: '5',
          title: 'Salary Negotiation Tips for 2025',
          description: 'Expert advice on negotiating better compensation packages',
          image: 'https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=800',
          category: 'Career',
          date: '2025-12-06',
          source: 'Career Pro'
        },
        {
          id: '6',
          title: 'Top Companies Hiring Remote Workers',
          description: 'List of companies actively seeking remote talent',
          image: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=800',
          category: 'Remote',
          date: '2025-12-05',
          source: 'Remote Work Hub'
        },
        {
          id: '7',
          title: 'The Rise of the Gig Economy',
          description: 'Understanding the shift towards freelance and contract work',
          image: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800',
          category: 'Business',
          date: '2025-12-04',
          source: 'Business Today'
        },
        {
          id: '8',
          title: 'Upskilling in the Age of AI',
          description: 'Essential skills to stay competitive in the job market',
          image: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=800',
          category: 'Career',
          date: '2025-12-03',
          source: 'Learn & Grow'
        },
        {
          id: '9',
          title: 'Tech Layoffs: What\'s Really Happening',
          description: 'In-depth analysis of recent tech industry layoffs',
          image: 'https://images.unsplash.com/photo-1504384308090-c894fdcc538d?w=800',
          category: 'Industry',
          date: '2025-12-02',
          source: 'Industry Watch'
        }
      ];

      setArticles([...data.articles, ...moreArticles]);
    } catch (error) {
      console.error(error);
      toast.error('Failed to fetch news');
    } finally {
      setLoading(false);
    }
  };

  const filteredArticles = selectedCategory === 'all'
    ? articles
    : articles.filter(article => article.category === selectedCategory);

  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h1 className="text-4xl mb-2">Industry News</h1>
        <p className="text-xl text-gray-400">
          Stay updated with the latest job market trends and industry news
        </p>
      </motion.div>

      {/* Category Filters */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        <Card className="bg-white/5 backdrop-blur-sm border-white/10 p-4">
          <div className="flex flex-wrap gap-2">
            {categories.map((category) => (
              <Button
                key={category}
                onClick={() => setSelectedCategory(category)}
                variant={selectedCategory === category ? 'default' : 'outline'}
                className={selectedCategory === category
                  ? 'bg-gradient-to-r from-blue-500 to-purple-600'
                  : 'border-white/20 hover:bg-white/5'
                }
              >
                {category.charAt(0).toUpperCase() + category.slice(1)}
              </Button>
            ))}
          </div>
        </Card>
      </motion.div>

      {/* Loading State */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <Card key={i} className="bg-white/5 backdrop-blur-sm border-white/10 p-6 animate-pulse">
              <div className="aspect-video bg-white/10 rounded-lg mb-4" />
              <div className="h-6 bg-white/10 rounded mb-3" />
              <div className="h-4 bg-white/10 rounded w-2/3 mb-2" />
              <div className="h-4 bg-white/10 rounded w-1/2" />
            </Card>
          ))}
        </div>
      ) : (
        /* News Grid */
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredArticles.map((article, idx) => (
            <motion.div
              key={article.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 * (idx + 1) }}
            >
              <Card className="bg-white/5 backdrop-blur-sm border-white/10 overflow-hidden hover:border-white/20 transition-all group h-full flex flex-col">
                {/* Image */}
                <div className="aspect-video overflow-hidden">
                  <img
                    src={article.image}
                    alt={article.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                </div>

                {/* Content */}
                <div className="p-6 flex-1 flex flex-col">
                  {/* Category Badge */}
                  <Badge className={`mb-3 w-fit ${categoryColors[article.category] || 'bg-gray-500/20 text-gray-300 border-gray-500/30'}`}>
                    <Tag className="w-3 h-3 mr-1" />
                    {article.category}
                  </Badge>

                  {/* Title */}
                  <h3 className="text-xl mb-3 line-clamp-2 flex-shrink-0">
                    {article.title}
                  </h3>

                  {/* Description */}
                  <p className="text-gray-400 text-sm mb-4 line-clamp-2 flex-1">
                    {article.description}
                  </p>

                  {/* Meta */}
                  <div className="flex items-center justify-between text-sm text-gray-500 pt-4 border-t border-white/10">
                    <div className="flex items-center gap-2">
                      <Newspaper className="w-4 h-4" />
                      {article.source}
                    </div>
                    <div className="flex items-center gap-2">
                      <Calendar className="w-4 h-4" />
                      {new Date(article.date).toLocaleDateString()}
                    </div>
                  </div>

                  {/* Read More Button */}
                  <Button
                    className="w-full mt-4 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700"
                    onClick={() => toast.info('Opening article in new tab...')}
                  >
                    Read More
                    <ExternalLink className="w-4 h-4 ml-2" />
                  </Button>
                </div>
              </Card>
            </motion.div>
          ))}
        </div>
      )}

      {/* Empty State */}
      {!loading && filteredArticles.length === 0 && (
        <Card className="bg-white/5 backdrop-blur-sm border-white/10 p-12">
          <div className="text-center">
            <Newspaper className="w-16 h-16 mx-auto mb-4 text-gray-600" />
            <h3 className="text-xl mb-2">No articles found</h3>
            <p className="text-gray-400">
              Try selecting a different category
            </p>
          </div>
        </Card>
      )}
    </div>
  );
};

export default News;
