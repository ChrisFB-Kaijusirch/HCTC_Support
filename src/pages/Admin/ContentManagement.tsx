import React, { useState, useMemo } from 'react';
import { 
  FileText, 
  Plus, 
  Edit, 
  Trash2, 
  Eye, 
  EyeOff,
  Save,
  X,
  TrendingUp,
  Bell,
  BookOpen,
  Calendar,
  Users,
  Search,
  Tag,
  Globe
} from 'lucide-react';
import { format } from 'date-fns';
import Card from '../../components/UI/Card';
import Button from '../../components/UI/Button';
import Badge from '../../components/UI/Badge';
import Input from '../../components/UI/Input';
import Select from '../../components/UI/Select';
import Textarea from '../../components/UI/Textarea';
import { useKnowledgeBase } from '../../hooks/useDynamoDB';

interface RecentUpdate {
  id: string;
  title: string;
  description: string;
  type: 'update' | 'maintenance' | 'content' | 'feature';
  date: string;
  isActive: boolean;
  createdBy: string;
  createdAt: string;
  updatedAt: string;
}

interface PopularTopic {
  id: string;
  title: string;
  articleId: string;
  views: number;
  isActive: boolean;
  order: number;
  createdBy: string;
  createdAt: string;
  updatedAt: string;
}

const ContentManagement: React.FC = () => {
  const { articles, loading, createArticle } = useKnowledgeBase();
  
  // Recent Updates State
  const [recentUpdates, setRecentUpdates] = useState<RecentUpdate[]>([
    {
      id: '1',
      title: 'Portfolio Manager v2.1.0 Released',
      description: 'New features include advanced analytics and improved performance',
      type: 'update',
      date: '2 days ago',
      isActive: true,
      createdBy: 'admin',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    },
    {
      id: '2',
      title: 'Scheduled Maintenance - Analytics Dashboard',
      description: 'Brief maintenance window scheduled for this weekend',
      type: 'maintenance',
      date: '1 week ago',
      isActive: true,
      createdBy: 'admin',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }
  ]);

  // Popular Topics State
  const [popularTopics, setPopularTopics] = useState<PopularTopic[]>([
    {
      id: '1',
      title: 'How to Reset Your Password',
      articleId: '1',
      views: 245,
      isActive: true,
      order: 1,
      createdBy: 'admin',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    },
    {
      id: '2',
      title: 'Adding New Assets to Portfolio',
      articleId: '2',
      views: 189,
      isActive: true,
      order: 2,
      createdBy: 'admin',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }
  ]);

  const [activeTab, setActiveTab] = useState<'updates' | 'topics' | 'knowledge'>('updates');
  const [showUpdateForm, setShowUpdateForm] = useState(false);
  const [showTopicForm, setShowTopicForm] = useState(false);
  const [showKnowledgeForm, setShowKnowledgeForm] = useState(false);
  const [editingUpdate, setEditingUpdate] = useState<RecentUpdate | null>(null);
  const [editingTopic, setEditingTopic] = useState<PopularTopic | null>(null);
  const [searchTerm, setSearchTerm] = useState('');

  // Form states
  const [updateForm, setUpdateForm] = useState({
    title: '',
    description: '',
    type: 'update' as RecentUpdate['type'],
    date: '',
  });

  const [topicForm, setTopicForm] = useState({
    title: '',
    articleId: '',
    order: 1,
  });

  const [knowledgeForm, setKnowledgeForm] = useState({
    title: '',
    content: '',
    category: '',
    appName: '',
    tags: '',
    published: false,
  });

  const filteredArticles = useMemo(() => {
    if (!searchTerm) return articles;
    return articles.filter(article =>
      article.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      article.category.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [articles, searchTerm]);

  const handleUpdateSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      if (editingUpdate) {
        // Update existing
        setRecentUpdates(prev => prev.map(update => 
          update.id === editingUpdate.id 
            ? { ...update, ...updateForm, updatedAt: new Date().toISOString() }
            : update
        ));
      } else {
        // Create new
        const newUpdate: RecentUpdate = {
          id: `update_${Date.now()}`,
          ...updateForm,
          isActive: true,
          createdBy: 'admin',
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        };
        setRecentUpdates(prev => [...prev, newUpdate]);
      }
      
      // Reset form
      setUpdateForm({ title: '', description: '', type: 'update', date: '' });
      setShowUpdateForm(false);
      setEditingUpdate(null);
    } catch (error) {
      console.error('Error saving update:', error);
    }
  };

  const handleTopicSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      if (editingTopic) {
        // Update existing
        setPopularTopics(prev => prev.map(topic => 
          topic.id === editingTopic.id 
            ? { ...topic, ...topicForm, updatedAt: new Date().toISOString() }
            : topic
        ));
      } else {
        // Create new
        const newTopic: PopularTopic = {
          id: `topic_${Date.now()}`,
          ...topicForm,
          views: 0,
          isActive: true,
          createdBy: 'admin',
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        };
        setPopularTopics(prev => [...prev, newTopic]);
      }
      
      // Reset form
      setTopicForm({ title: '', articleId: '', order: 1 });
      setShowTopicForm(false);
      setEditingTopic(null);
    } catch (error) {
      console.error('Error saving topic:', error);
    }
  };

  const handleKnowledgeSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const tagsArray = knowledgeForm.tags.split(',').map(tag => tag.trim()).filter(tag => tag);
      
      await createArticle({
        title: knowledgeForm.title,
        content: knowledgeForm.content,
        category: knowledgeForm.category,
        appName: knowledgeForm.appName,
        tags: tagsArray,
        views: 0,
        helpful: 0,
        notHelpful: 0,
        published: knowledgeForm.published,
      });
      
      // Reset form
      setKnowledgeForm({
        title: '',
        content: '',
        category: '',
        appName: '',
        tags: '',
        published: false,
      });
      setShowKnowledgeForm(false);
    } catch (error) {
      console.error('Error creating article:', error);
    }
  };

  const handleEditUpdate = (update: RecentUpdate) => {
    setEditingUpdate(update);
    setUpdateForm({
      title: update.title,
      description: update.description,
      type: update.type,
      date: update.date,
    });
    setShowUpdateForm(true);
  };

  const handleEditTopic = (topic: PopularTopic) => {
    setEditingTopic(topic);
    setTopicForm({
      title: topic.title,
      articleId: topic.articleId,
      order: topic.order,
    });
    setShowTopicForm(true);
  };

  const handleDeleteUpdate = (updateId: string) => {
    if (confirm('Are you sure you want to delete this update?')) {
      setRecentUpdates(prev => prev.filter(update => update.id !== updateId));
    }
  };

  const handleDeleteTopic = (topicId: string) => {
    if (confirm('Are you sure you want to delete this topic?')) {
      setPopularTopics(prev => prev.filter(topic => topic.id !== topicId));
    }
  };

  const handleToggleUpdateStatus = (updateId: string) => {
    setRecentUpdates(prev => prev.map(update => 
      update.id === updateId 
        ? { ...update, isActive: !update.isActive, updatedAt: new Date().toISOString() }
        : update
    ));
  };

  const handleToggleTopicStatus = (topicId: string) => {
    setPopularTopics(prev => prev.map(topic => 
      topic.id === topicId 
        ? { ...topic, isActive: !topic.isActive, updatedAt: new Date().toISOString() }
        : topic
    ));
  };

  const getUpdateTypeColor = (type: RecentUpdate['type']) => {
    switch (type) {
      case 'update': return 'success';
      case 'maintenance': return 'warning';
      case 'content': return 'info';
      case 'feature': return 'success';
      default: return 'default';
    }
  };

  const getUpdateTypeIcon = (type: RecentUpdate['type']) => {
    switch (type) {
      case 'update': return TrendingUp;
      case 'maintenance': return Bell;
      case 'content': return BookOpen;
      case 'feature': return Plus;
      default: return FileText;
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Content Management</h1>
        <p className="text-gray-600">
          Manage recent updates, popular help topics, and knowledge base articles
        </p>
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200 mb-8">
        <nav className="-mb-px flex space-x-8">
          {[
            { id: 'updates', label: 'Recent Updates', icon: Bell },
            { id: 'topics', label: 'Popular Topics', icon: TrendingUp },
            { id: 'knowledge', label: 'Knowledge Base', icon: BookOpen },
          ].map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              onClick={() => setActiveTab(id as any)}
              className={`flex items-center space-x-2 py-2 px-1 border-b-2 font-medium text-sm ${
                activeTab === id
                  ? 'border-primary-500 text-primary-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              <Icon className="w-4 h-4" />
              <span>{label}</span>
            </button>
          ))}
        </nav>
      </div>

      {/* Recent Updates Tab */}
      {activeTab === 'updates' && (
        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-semibold text-gray-900">Recent Updates</h2>
            <Button 
              icon={Plus} 
              onClick={() => {
                setShowUpdateForm(true);
                setEditingUpdate(null);
                setUpdateForm({ title: '', description: '', type: 'update', date: '' });
              }}
            >
              Add Update
            </Button>
          </div>

          {/* Update Form */}
          {showUpdateForm && (
            <Card>
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold text-gray-900">
                  {editingUpdate ? 'Edit Update' : 'Add New Update'}
                </h3>
                <Button 
                  variant="ghost" 
                  onClick={() => {
                    setShowUpdateForm(false);
                    setEditingUpdate(null);
                  }}
                >
                  <X className="w-4 h-4" />
                </Button>
              </div>

              <form onSubmit={handleUpdateSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <Input
                    label="Title *"
                    value={updateForm.title}
                    onChange={(e) => setUpdateForm(prev => ({ ...prev, title: e.target.value }))}
                    placeholder="Update title"
                    required
                  />
                  
                  <Select
                    label="Type *"
                    value={updateForm.type}
                    onChange={(e) => setUpdateForm(prev => ({ ...prev, type: e.target.value as any }))}
                    options={[
                      { value: 'update', label: 'Product Update' },
                      { value: 'maintenance', label: 'Maintenance' },
                      { value: 'content', label: 'Content Update' },
                      { value: 'feature', label: 'New Feature' },
                    ]}
                    required
                  />
                </div>

                <Input
                  label="Date Display *"
                  value={updateForm.date}
                  onChange={(e) => setUpdateForm(prev => ({ ...prev, date: e.target.value }))}
                  placeholder="e.g., 2 days ago, 1 week ago"
                  required
                />

                <Textarea
                  label="Description *"
                  value={updateForm.description}
                  onChange={(e) => setUpdateForm(prev => ({ ...prev, description: e.target.value }))}
                  placeholder="Brief description of the update"
                  rows={3}
                  required
                />

                <div className="flex justify-end space-x-4">
                  <Button 
                    type="button" 
                    variant="outline"
                    onClick={() => {
                      setShowUpdateForm(false);
                      setEditingUpdate(null);
                    }}
                  >
                    Cancel
                  </Button>
                  <Button type="submit">
                    {editingUpdate ? 'Update' : 'Create'}
                  </Button>
                </div>
              </form>
            </Card>
          )}

          {/* Updates List */}
          <div className="space-y-4">
            {recentUpdates.map((update) => {
              const TypeIcon = getUpdateTypeIcon(update.type);
              
              return (
                <Card key={update.id}>
                  <div className="flex items-start justify-between">
                    <div className="flex items-start space-x-4 flex-1">
                      <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center">
                        <TypeIcon className="w-5 h-5 text-gray-600" />
                      </div>

                      <div className="flex-1">
                        <div className="flex items-center space-x-3 mb-2">
                          <h3 className="font-medium text-gray-900">{update.title}</h3>
                          <Badge variant={getUpdateTypeColor(update.type)} size="sm">
                            {update.type}
                          </Badge>
                          <Badge variant={update.isActive ? 'success' : 'default'} size="sm">
                            {update.isActive ? 'Active' : 'Inactive'}
                          </Badge>
                        </div>
                        
                        <p className="text-gray-600 mb-2">{update.description}</p>
                        
                        <div className="flex items-center space-x-4 text-sm text-gray-500">
                          <span>{update.date}</span>
                          <span>Created: {format(new Date(update.createdAt), 'MMM dd, yyyy')}</span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center space-x-2">
                      <Button
                        variant="outline"
                        size="sm"
                        icon={update.isActive ? EyeOff : Eye}
                        onClick={() => handleToggleUpdateStatus(update.id)}
                      >
                        {update.isActive ? 'Hide' : 'Show'}
                      </Button>
                      
                      <Button
                        variant="outline"
                        size="sm"
                        icon={Edit}
                        onClick={() => handleEditUpdate(update)}
                      >
                        Edit
                      </Button>
                      
                      <Button
                        variant="outline"
                        size="sm"
                        icon={Trash2}
                        onClick={() => handleDeleteUpdate(update.id)}
                        className="text-error-600 hover:text-error-700"
                      >
                        Delete
                      </Button>
                    </div>
                  </div>
                </Card>
              );
            })}
          </div>
        </div>
      )}

      {/* Popular Topics Tab */}
      {activeTab === 'topics' && (
        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-semibold text-gray-900">Popular Help Topics</h2>
            <Button 
              icon={Plus} 
              onClick={() => {
                setShowTopicForm(true);
                setEditingTopic(null);
                setTopicForm({ title: '', articleId: '', order: 1 });
              }}
            >
              Add Topic
            </Button>
          </div>

          {/* Topic Form */}
          {showTopicForm && (
            <Card>
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold text-gray-900">
                  {editingTopic ? 'Edit Topic' : 'Add New Topic'}
                </h3>
                <Button 
                  variant="ghost" 
                  onClick={() => {
                    setShowTopicForm(false);
                    setEditingTopic(null);
                  }}
                >
                  <X className="w-4 h-4" />
                </Button>
              </div>

              <form onSubmit={handleTopicSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <Input
                    label="Topic Title *"
                    value={topicForm.title}
                    onChange={(e) => setTopicForm(prev => ({ ...prev, title: e.target.value }))}
                    placeholder="Help topic title"
                    required
                  />
                  
                  <Input
                    label="Display Order *"
                    type="number"
                    value={topicForm.order}
                    onChange={(e) => setTopicForm(prev => ({ ...prev, order: parseInt(e.target.value) || 1 }))}
                    min="1"
                    required
                  />
                </div>

                <Select
                  label="Linked Article *"
                  value={topicForm.articleId}
                  onChange={(e) => setTopicForm(prev => ({ ...prev, articleId: e.target.value }))}
                  options={[
                    { value: '', label: 'Select an article' },
                    ...articles.map(article => ({ 
                      value: article.id, 
                      label: article.title 
                    }))
                  ]}
                  required
                />

                <div className="flex justify-end space-x-4">
                  <Button 
                    type="button" 
                    variant="outline"
                    onClick={() => {
                      setShowTopicForm(false);
                      setEditingTopic(null);
                    }}
                  >
                    Cancel
                  </Button>
                  <Button type="submit">
                    {editingTopic ? 'Update' : 'Create'}
                  </Button>
                </div>
              </form>
            </Card>
          )}

          {/* Topics List */}
          <div className="space-y-4">
            {popularTopics
              .sort((a, b) => a.order - b.order)
              .map((topic) => {
                const linkedArticle = articles.find(article => article.id === topic.articleId);
                
                return (
                  <Card key={topic.id}>
                    <div className="flex items-start justify-between">
                      <div className="flex items-start space-x-4 flex-1">
                        <div className="w-10 h-10 bg-primary-100 rounded-lg flex items-center justify-center">
                          <span className="text-primary-600 font-semibold">{topic.order}</span>
                        </div>

                        <div className="flex-1">
                          <div className="flex items-center space-x-3 mb-2">
                            <h3 className="font-medium text-gray-900">{topic.title}</h3>
                            <Badge variant={topic.isActive ? 'success' : 'default'} size="sm">
                              {topic.isActive ? 'Active' : 'Inactive'}
                            </Badge>
                          </div>
                          
                          <div className="flex items-center space-x-4 text-sm text-gray-500">
                            <div className="flex items-center space-x-1">
                              <Users className="w-4 h-4" />
                              <span>{topic.views} views</span>
                            </div>
                            {linkedArticle && (
                              <div className="flex items-center space-x-1">
                                <BookOpen className="w-4 h-4" />
                                <span>Linked to: {linkedArticle.title}</span>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center space-x-2">
                        <Button
                          variant="outline"
                          size="sm"
                          icon={topic.isActive ? EyeOff : Eye}
                          onClick={() => handleToggleTopicStatus(topic.id)}
                        >
                          {topic.isActive ? 'Hide' : 'Show'}
                        </Button>
                        
                        <Button
                          variant="outline"
                          size="sm"
                          icon={Edit}
                          onClick={() => handleEditTopic(topic)}
                        >
                          Edit
                        </Button>
                        
                        <Button
                          variant="outline"
                          size="sm"
                          icon={Trash2}
                          onClick={() => handleDeleteTopic(topic.id)}
                          className="text-error-600 hover:text-error-700"
                        >
                          Delete
                        </Button>
                      </div>
                    </div>
                  </Card>
                );
              })}
          </div>
        </div>
      )}

      {/* Knowledge Base Tab */}
      {activeTab === 'knowledge' && (
        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-semibold text-gray-900">Knowledge Base Articles</h2>
            <Button 
              icon={Plus} 
              onClick={() => {
                setShowKnowledgeForm(true);
                setKnowledgeForm({
                  title: '',
                  content: '',
                  category: '',
                  appName: '',
                  tags: '',
                  published: false,
                });
              }}
            >
              Create Article
            </Button>
          </div>

          {/* Knowledge Base Form */}
          {showKnowledgeForm && (
            <Card>
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold text-gray-900">Create New Article</h3>
                <Button 
                  variant="ghost" 
                  onClick={() => setShowKnowledgeForm(false)}
                >
                  <X className="w-4 h-4" />
                </Button>
              </div>

              <form onSubmit={handleKnowledgeSubmit} className="space-y-6">
                <Input
                  label="Article Title *"
                  value={knowledgeForm.title}
                  onChange={(e) => setKnowledgeForm(prev => ({ ...prev, title: e.target.value }))}
                  placeholder="Enter article title"
                  required
                />

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <Input
                    label="Category *"
                    value={knowledgeForm.category}
                    onChange={(e) => setKnowledgeForm(prev => ({ ...prev, category: e.target.value }))}
                    placeholder="e.g., Account Management"
                    required
                  />
                  
                  <Input
                    label="Application Name *"
                    value={knowledgeForm.appName}
                    onChange={(e) => setKnowledgeForm(prev => ({ ...prev, appName: e.target.value }))}
                    placeholder="e.g., Portfolio Manager"
                    required
                  />
                </div>

                <Input
                  label="Tags"
                  value={knowledgeForm.tags}
                  onChange={(e) => setKnowledgeForm(prev => ({ ...prev, tags: e.target.value }))}
                  placeholder="Enter tags separated by commas"
                  helperText="e.g., password, login, account, security"
                />

                <Textarea
                  label="Article Content *"
                  value={knowledgeForm.content}
                  onChange={(e) => setKnowledgeForm(prev => ({ ...prev, content: e.target.value }))}
                  placeholder="Write your article content here. You can use markdown formatting."
                  rows={12}
                  required
                />

                <div className="flex items-center space-x-3">
                  <input
                    type="checkbox"
                    id="published"
                    checked={knowledgeForm.published}
                    onChange={(e) => setKnowledgeForm(prev => ({ ...prev, published: e.target.checked }))}
                    className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                  />
                  <label htmlFor="published" className="text-sm font-medium text-gray-700">
                    Publish article immediately
                  </label>
                </div>

                <div className="flex justify-end space-x-4">
                  <Button 
                    type="button" 
                    variant="outline"
                    onClick={() => setShowKnowledgeForm(false)}
                  >
                    Cancel
                  </Button>
                  <Button type="submit">
                    Create Article
                  </Button>
                </div>
              </form>
            </Card>
          )}

          {/* Search and Filter */}
          <Card>
            <div className="flex items-center space-x-4">
              <div className="flex-1">
                <Input
                  placeholder="Search articles..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  icon={Search}
                />
              </div>
              <span className="text-sm text-gray-500">
                {filteredArticles.length} of {articles.length} articles
              </span>
            </div>
          </Card>

          {/* Articles List */}
          <div className="space-y-4">
            {loading ? (
              <Card className="text-center py-8">
                <div className="animate-spin w-8 h-8 border-2 border-primary-600 border-t-transparent rounded-full mx-auto mb-4"></div>
                <p className="text-gray-500">Loading articles...</p>
              </Card>
            ) : filteredArticles.length > 0 ? (
              filteredArticles.map((article) => (
                <Card key={article.id} hover>
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-2">
                        <h3 className="font-medium text-gray-900">{article.title}</h3>
                        <Badge variant="info" size="sm">{article.category}</Badge>
                        <Badge variant="default" size="sm">{article.appName}</Badge>
                        <Badge variant={article.published ? 'success' : 'warning'} size="sm">
                          {article.published ? 'Published' : 'Draft'}
                        </Badge>
                      </div>
                      
                      <p className="text-gray-600 mb-3 line-clamp-2">
                        {article.content.substring(0, 200)}...
                      </p>
                      
                      <div className="flex items-center space-x-4 text-sm text-gray-500">
                        <div className="flex items-center space-x-1">
                          <Eye className="w-4 h-4" />
                          <span>{article.views} views</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <TrendingUp className="w-4 h-4" />
                          <span>{article.helpful} helpful</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <Calendar className="w-4 h-4" />
                          <span>Updated: {format(new Date(article.updatedAt), 'MMM dd, yyyy')}</span>
                        </div>
                      </div>

                      {article.tags.length > 0 && (
                        <div className="flex flex-wrap gap-1 mt-2">
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
                      )}
                    </div>

                    <div className="flex items-center space-x-2 ml-4">
                      <Button
                        variant="outline"
                        size="sm"
                        icon={Globe}
                        onClick={() => window.open(`/knowledge-base/${article.id}`, '_blank')}
                      >
                        View
                      </Button>
                      
                      <Button
                        variant="outline"
                        size="sm"
                        icon={Edit}
                      >
                        Edit
                      </Button>
                    </div>
                  </div>
                </Card>
              ))
            ) : (
              <Card className="text-center py-12">
                <BookOpen className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  No articles found
                </h3>
                <p className="text-gray-600 mb-6">
                  {searchTerm 
                    ? 'Try adjusting your search criteria.' 
                    : 'Get started by creating your first knowledge base article.'
                  }
                </p>
                <Button onClick={() => setShowKnowledgeForm(true)}>
                  Create First Article
                </Button>
              </Card>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default ContentManagement;