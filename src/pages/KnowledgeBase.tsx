import React, { useState, useMemo } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { Search, BookOpen, ThumbsUp, ThumbsDown, Eye, Filter, Tag } from 'lucide-react';
import Card from '../components/UI/Card';
import Button from '../components/UI/Button';
import Input from '../components/UI/Input';
import Badge from '../components/UI/Badge';
import { mockKnowledgeBase } from '../utils/mockData';

const KnowledgeBase: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [searchTerm, setSearchTerm] = useState(searchParams.get('search') || '');
  const [selectedCategory, setSelectedCategory] = useState(searchParams.get('category') || '');
  const [selectedApp, setSelectedApp] = useState(searchParams.get('app') || '');
  const [sortBy, setSortBy] = useState<'relevance' | 'views' | 'helpful' | 'recent'>('relevance');

  const categories = useMemo(() => {
    const cats = [...new Set(mockKnowledgeBase.map(article => article.category))];
    return cats.sort();
  }, []);

  const apps = useMemo(() => {
    const appList = [...new Set(mockKnowledgeBase.map(article => article.appName))];
    return appList.sort();
  }, []);

  const filteredArticles = useMemo(() => {
    let filtered = mockKnowledgeBase.filter(article => article.published);

    // Search filter
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(article =>
        article.title.toLowerCase().includes(term) ||
        article.content.toLowerCase().includes(term) ||
        article.tags.some(tag => tag.toLowerCase().includes(term))
      );
    }

    // Category filter
    if (selectedCategory) {
      filtered = filtered.filter(article => article.category === selectedCategory);
    }

    // App filter
    if (selectedApp) {
      filtered = filtered.filter(article => article.appName === selectedApp);
    }

    // Sort
    switch (sortBy) {
      case 'views':
        filtered.sort((a, b) => b.views - a.views);
        break;
      case 'helpful':
        filtered.sort((a, b) => b.helpful - a.helpful);
        break;
      case 'recent':
        filtered.sort((a, b) => b.updatedAt.getTime() - a.updatedAt.getTime());
        break;
      default:
        // Keep original order for relevance
        break;
    }

    return filtered;
  }, [searchTerm, selectedCategory, selectedApp, sortBy]);

  const popularArticles = useMemo(() => {
    return [...mockKnowledgeBase]
      .filter(article => article.published)
      .sort((a, b) => b.views - a.views)
      .slice(0, 5);
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const params = new URLSearchParams();
    if (searchTerm) params.set('search', searchTerm);
    if (selectedCategory) params.set('category', selectedCategory);
    if (selectedApp) params.set('app', selectedApp);
    setSearchParams(params);
  };

  const clearFilters = () => {
    setSearchTerm('');
    setSelectedCategory('');
    setSelectedApp('');
    setSearchParams({});
  };

  const getHelpfulnessRatio = (article: typeof mockKnowledgeBase[0]) => {
    const total = article.helpful + article.notHelpful;
    return total > 0 ? Math.round((article.helpful / total) * 100) : 0;
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">Knowledge Base</h1>
        <p className="text-xl text-gray-600 max-w-3xl mx-auto">
          Find answers to common questions and learn how to get the most out of your Holdings CTC applications.
        </p>
      </div>

      {/* Search and Filters */}
      <Card className="mb-8">
        <form onSubmit={handleSearch} className="space-y-4">
          <div className="flex flex-col lg:flex-row gap-4">
            <div className="flex-1">
              <Input
                placeholder="Search articles, topics, or keywords..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                icon={Search}
              />
            </div>
            <Button type="submit">Search</Button>
          </div>
          
          <div className="flex flex-wrap gap-4 items-center">
            <div className="flex items-center space-x-2">
              <Filter className="w-4 h-4 text-gray-500" />
              <span className="text-sm font-medium text-gray-700">Filters:</span>
            </div>
            
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="rounded-lg border-gray-300 text-sm"
            >
              <option value="">All Categories</option>
              {categories.map(category => (
                <option key={category} value={category}>{category}</option>
              ))}
            </select>
            
            <select
              value={selectedApp}
              onChange={(e) => setSelectedApp(e.target.value)}
              className="rounded-lg border-gray-300 text-sm"
            >
              <option value="">All Applications</option>
              {apps.map(app => (
                <option key={app} value={app}>{app}</option>
              ))}
            </select>
            
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="rounded-lg border-gray-300 text-sm"
            >
              <option value="relevance">Sort by Relevance</option>
              <option value="views">Most Viewed</option>
              <option value="helpful">Most Helpful</option>
              <option value="recent">Recently Updated</option>
            </select>
            
            {(searchTerm || selectedCategory || selectedApp) && (
              <Button variant="ghost" size="sm" onClick={clearFilters}>
                Clear Filters
              </Button>
            )}
          </div>
        </form>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Main Content */}
        <div className="lg:col-span-3">
          {filteredArticles.length > 0 ? (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-semibold text-gray-900">
                  Articles ({filteredArticles.length})
                </h2>
              </div>
              
              <div className="grid gap-6">
                {filteredArticles.map((article) => (
                  <Card key={article.id} hover>
                    <div className="flex flex-col md:flex-row md:items-start md:justify-between mb-4">
                      <div className="flex-1">
                        <div className="flex items-center space-x-2 mb-2">
                          <Badge variant="info" size="sm">
                            {article.category}
                          </Badge>
                          <Badge variant="default" size="sm">
                            {article.appName}
                          </Badge>
                        </div>
                        
                        <Link to={`/knowledge-base/${article.id}`}>
                          <h3 className="text-xl font-semibold text-gray-900 hover:text-primary-600 transition-colors mb-2">
                            {article.title}
                          </h3>
                        </Link>
                        
                        <p className="text-gray-600 mb-3 line-clamp-2">
                          {article.content.substring(0, 200)}...
                        </p>
                        
                        <div className="flex flex-wrap gap-2 mb-3">
                          {article.tags.slice(0, 3).map((tag) => (
                            <span
                              key={tag}
                              className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-gray-100 text-gray-700"
                            >
                              <Tag className="w-3 h-3 mr-1" />
                              {tag}
                            </span>
                          ))}
                          {article.tags.length > 3 && (
                            <span className="text-xs text-gray-500">
                              +{article.tags.length - 3} more
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-between pt-4 border-t border-gray-200">
                      <div className="flex items-center space-x-4 text-sm text-gray-500">
                        <div className="flex items-center space-x-1">
                          <Eye className="w-4 h-4" />
                          <span>{article.views} views</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <ThumbsUp className="w-4 h-4" />
                          <span>{getHelpfulnessRatio(article)}% helpful</span>
                        </div>
                      </div>
                      
                      <Link to={`/knowledge-base/${article.id}`}>
                        <Button variant="outline" size="sm">
                          Read Article
                        </Button>
                      </Link>
                    </div>
                  </Card>
                ))}
              </div>
            </div>
          ) : (
            <Card className="text-center py-12">
              <BookOpen className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                No articles found
              </h3>
              <p className="text-gray-600 mb-6">
                Try adjusting your search terms or filters to find what you're looking for.
              </p>
              <Button onClick={clearFilters}>Clear Filters</Button>
            </Card>
          )}
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Popular Articles */}
          <Card>
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Popular Articles
            </h3>
            <div className="space-y-3">
              {popularArticles.map((article, index) => (
                <Link
                  key={article.id}
                  to={`/knowledge-base/${article.id}`}
                  className="block p-3 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  <div className="flex items-start space-x-3">
                    <span className="flex-shrink-0 w-6 h-6 bg-primary-100 text-primary-600 rounded-full flex items-center justify-center text-sm font-medium">
                      {index + 1}
                    </span>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-gray-900 text-sm line-clamp-2">
                        {article.title}
                      </p>
                      <p className="text-xs text-gray-500 mt-1">
                        {article.views} views
                      </p>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </Card>

          {/* Categories */}
          <Card>
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Browse by Category
            </h3>
            <div className="space-y-2">
              {categories.map((category) => {
                const count = mockKnowledgeBase.filter(
                  article => article.category === category && article.published
                ).length;
                return (
                  <button
                    key={category}
                    onClick={() => {
                      setSelectedCategory(category);
                      const params = new URLSearchParams();
                      params.set('category', category);
                      setSearchParams(params);
                    }}
                    className={`w-full text-left p-2 rounded-lg transition-colors ${
                      selectedCategory === category
                        ? 'bg-primary-100 text-primary-700'
                        : 'hover:bg-gray-50'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-medium">{category}</span>
                      <span className="text-sm text-gray-500">{count}</span>
                    </div>
                  </button>
                );
              })}
            </div>
          </Card>

          {/* Quick Help */}
          <Card>
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Still Need Help?
            </h3>
            <p className="text-gray-600 mb-4">
              Can't find what you're looking for? Our support team is here to help.
            </p>
            <div className="space-y-2">
              <Link to="/submit-ticket">
                <Button size="sm" className="w-full">
                  Submit Ticket
                </Button>
              </Link>
              <Link to="/track-ticket">
                <Button variant="outline" size="sm" className="w-full">
                  Track Existing Ticket
                </Button>
              </Link>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default KnowledgeBase;