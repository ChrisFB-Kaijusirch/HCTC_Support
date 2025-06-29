import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, 
  ThumbsUp, 
  ThumbsDown, 
  Eye, 
  Calendar, 
  Tag,
  Share2,
  BookOpen,
  CheckCircle
} from 'lucide-react';
import { format } from 'date-fns';
import Card from '../components/UI/Card';
import Button from '../components/UI/Button';
import Badge from '../components/UI/Badge';
import { KnowledgeBaseArticle } from '../types';
import { getKnowledgeBaseArticleById, mockKnowledgeBase } from '../utils/mockData';

const KnowledgeBaseArticlePage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [article, setArticle] = useState<KnowledgeBaseArticle | null>(null);
  const [loading, setLoading] = useState(true);
  const [feedback, setFeedback] = useState<'helpful' | 'not-helpful' | null>(null);
  const [feedbackSubmitted, setFeedbackSubmitted] = useState(false);

  useEffect(() => {
    if (id) {
      // Simulate API call
      setTimeout(() => {
        const foundArticle = getKnowledgeBaseArticleById(id);
        setArticle(foundArticle || null);
        setLoading(false);
      }, 500);
    }
  }, [id]);

  const handleFeedback = async (type: 'helpful' | 'not-helpful') => {
    if (!article || feedbackSubmitted) return;

    setFeedback(type);
    setFeedbackSubmitted(true);

    // Simulate API call to update feedback
    await new Promise(resolve => setTimeout(resolve, 500));
    
    // Update local state (in real app, this would be handled by the API)
    if (type === 'helpful') {
      article.helpful += 1;
    } else {
      article.notHelpful += 1;
    }
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: article?.title,
          text: `Check out this helpful article: ${article?.title}`,
          url: window.location.href,
        });
      } catch (error) {
        // Fallback to clipboard
        navigator.clipboard.writeText(window.location.href);
      }
    } else {
      // Fallback to clipboard
      navigator.clipboard.writeText(window.location.href);
    }
  };

  const relatedArticles = article 
    ? mockKnowledgeBase
        .filter(a => 
          a.id !== article.id && 
          a.published && 
          (a.category === article.category || 
           a.appName === article.appName ||
           a.tags.some(tag => article.tags.includes(tag)))
        )
        .slice(0, 3)
    : [];

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded mb-4"></div>
          <div className="h-4 bg-gray-200 rounded mb-8 w-1/3"></div>
          <div className="space-y-4">
            <div className="h-4 bg-gray-200 rounded"></div>
            <div className="h-4 bg-gray-200 rounded"></div>
            <div className="h-4 bg-gray-200 rounded w-2/3"></div>
          </div>
        </div>
      </div>
    );
  }

  if (!article) {
    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Card className="text-center py-12">
          <BookOpen className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Article Not Found</h1>
          <p className="text-gray-600 mb-6">
            The article you're looking for doesn't exist or has been removed.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button onClick={() => navigate('/knowledge-base')}>
              Browse Knowledge Base
            </Button>
            <Link to="/submit-ticket">
              <Button variant="outline">Submit Support Ticket</Button>
            </Link>
          </div>
        </Card>
      </div>
    );
  }

  // Convert markdown-style content to HTML (basic implementation)
  const formatContent = (content: string) => {
    return content
      .replace(/^# (.*$)/gm, '<h1 class="text-3xl font-bold text-gray-900 mb-6 mt-8">$1</h1>')
      .replace(/^## (.*$)/gm, '<h2 class="text-2xl font-semibold text-gray-900 mb-4 mt-6">$1</h2>')
      .replace(/^### (.*$)/gm, '<h3 class="text-xl font-semibold text-gray-900 mb-3 mt-4">$1</h3>')
      .replace(/^\* (.*$)/gm, '<li class="mb-1">$1</li>')
      .replace(/^(\d+)\. (.*$)/gm, '<li class="mb-1">$2</li>')
      .replace(/\*\*(.*?)\*\*/g, '<strong class="font-semibold">$1</strong>')
      .replace(/\*(.*?)\*/g, '<em class="italic">$1</em>')
      .replace(/`(.*?)`/g, '<code class="bg-gray-100 px-2 py-1 rounded text-sm font-mono">$1</code>')
      .replace(/\n\n/g, '</p><p class="mb-4">')
      .replace(/^(?!<[h|l])/gm, '<p class="mb-4">')
      .replace(/<\/li>\n<li/g, '</li><li')
      .replace(/<li/g, '<ul class="list-disc list-inside mb-4 space-y-1"><li')
      .replace(/<\/li>(?!\n<li)/g, '</li></ul>');
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Breadcrumb */}
      <nav className="flex items-center space-x-2 text-sm text-gray-500 mb-6">
        <Link to="/knowledge-base" className="hover:text-primary-600 transition-colors">
          Knowledge Base
        </Link>
        <span>/</span>
        <span className="text-gray-900">{article.title}</span>
      </nav>

      {/* Back Button */}
      <Button
        variant="ghost"
        size="sm"
        onClick={() => navigate(-1)}
        icon={ArrowLeft}
        className="mb-6"
      >
        Back
      </Button>

      {/* Article Header */}
      <div className="mb-8">
        <div className="flex flex-wrap items-center gap-2 mb-4">
          <Badge variant="info">{article.category}</Badge>
          <Badge variant="default">{article.appName}</Badge>
        </div>
        
        <h1 className="text-4xl font-bold text-gray-900 mb-4">
          {article.title}
        </h1>
        
        <div className="flex flex-wrap items-center gap-6 text-sm text-gray-500">
          <div className="flex items-center space-x-1">
            <Calendar className="w-4 h-4" />
            <span>Updated {format(article.updatedAt, 'MMM dd, yyyy')}</span>
          </div>
          <div className="flex items-center space-x-1">
            <Eye className="w-4 h-4" />
            <span>{article.views} views</span>
          </div>
          <div className="flex items-center space-x-1">
            <ThumbsUp className="w-4 h-4" />
            <span>{article.helpful} helpful</span>
          </div>
        </div>
      </div>

      {/* Article Content */}
      <Card className="mb-8">
        <div 
          className="prose prose-lg max-w-none"
          dangerouslySetInnerHTML={{ __html: formatContent(article.content) }}
        />
      </Card>

      {/* Tags */}
      {article.tags.length > 0 && (
        <Card className="mb-8">
          <h3 className="text-lg font-semibold text-gray-900 mb-3">Tags</h3>
          <div className="flex flex-wrap gap-2">
            {article.tags.map((tag) => (
              <Link
                key={tag}
                to={`/knowledge-base?search=${encodeURIComponent(tag)}`}
                className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-gray-100 text-gray-700 hover:bg-gray-200 transition-colors"
              >
                <Tag className="w-3 h-3 mr-1" />
                {tag}
              </Link>
            ))}
          </div>
        </Card>
      )}

      {/* Feedback Section */}
      <Card className="mb-8">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          Was this article helpful?
        </h3>
        
        {feedbackSubmitted ? (
          <div className="flex items-center space-x-2 text-success-600">
            <CheckCircle className="w-5 h-5" />
            <span>Thank you for your feedback!</span>
          </div>
        ) : (
          <div className="flex items-center space-x-4">
            <Button
              variant="outline"
              size="sm"
              icon={ThumbsUp}
              onClick={() => handleFeedback('helpful')}
              className={feedback === 'helpful' ? 'bg-success-50 border-success-300' : ''}
            >
              Yes, helpful
            </Button>
            <Button
              variant="outline"
              size="sm"
              icon={ThumbsDown}
              onClick={() => handleFeedback('not-helpful')}
              className={feedback === 'not-helpful' ? 'bg-error-50 border-error-300' : ''}
            >
              No, not helpful
            </Button>
            <Button
              variant="ghost"
              size="sm"
              icon={Share2}
              onClick={handleShare}
            >
              Share
            </Button>
          </div>
        )}
      </Card>

      {/* Related Articles */}
      {relatedArticles.length > 0 && (
        <Card>
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Related Articles
          </h3>
          <div className="space-y-4">
            {relatedArticles.map((relatedArticle) => (
              <Link
                key={relatedArticle.id}
                to={`/knowledge-base/${relatedArticle.id}`}
                className="block p-4 rounded-lg border border-gray-200 hover:border-primary-300 hover:bg-primary-50 transition-all"
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <h4 className="font-medium text-gray-900 mb-1">
                      {relatedArticle.title}
                    </h4>
                    <p className="text-sm text-gray-600 mb-2 line-clamp-2">
                      {relatedArticle.content.substring(0, 150)}...
                    </p>
                    <div className="flex items-center space-x-4 text-xs text-gray-500">
                      <span>{relatedArticle.category}</span>
                      <span>{relatedArticle.views} views</span>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </Card>
      )}

      {/* Help Section */}
      <div className="mt-8 bg-primary-50 rounded-lg p-6 text-center">
        <h3 className="text-lg font-semibold text-gray-900 mb-2">
          Still need help?
        </h3>
        <p className="text-gray-600 mb-4">
          If this article didn't solve your problem, our support team is here to help.
        </p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link to="/submit-ticket">
            <Button>Submit Support Ticket</Button>
          </Link>
          <Link to="/knowledge-base">
            <Button variant="outline">Browse More Articles</Button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default KnowledgeBaseArticlePage;