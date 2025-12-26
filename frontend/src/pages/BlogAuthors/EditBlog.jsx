import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import useBlogStore from '../../zustandStores/blogStore';
import Loader from '../../components/Loader';

const EditBlog = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { selectedBlog, loading, error, fetchBlogById, updateBlog } = useBlogStore();

  const [form, setForm] = useState({
    title: '',
    description: '',
    content: [],
    tags: [],
    category: '',
    thumbnail: '',
  });
  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState(null);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    if (id) fetchBlogById(id);
    // eslint-disable-next-line
  }, [id]);

  useEffect(() => {
    if (selectedBlog && selectedBlog._id === id) {
      setForm({
        title: selectedBlog.title || '',
        description: selectedBlog.description || '',
        content: selectedBlog.content || [],
        tags: selectedBlog.tags || [],
        category: selectedBlog.category || '',
        thumbnail: selectedBlog.thumbnail || '',
      });
    }
  }, [selectedBlog, id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  // For tags, simple comma-separated input
  const handleTagsChange = (e) => {
    setForm((prev) => ({ ...prev, tags: e.target.value.split(',').map(t => t.trim()) }));
  };

  // For content, you may want to use your content block editor here
  // For now, simple textarea for demonstration
  const handleContentChange = (e) => {
    setForm((prev) => ({ ...prev, content: [{ type: 'paragraph', text: e.target.value }] }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setSaveError(null);
    setSuccess(false);
    const updated = await updateBlog(id, form);
    setSaving(false);
    if (updated) {
      setSuccess(true);
      setTimeout(() => navigate('/author/listBlog'), 1200);
    } else {
      setSaveError('Failed to update blog.');
    }
  };

  if (loading || !selectedBlog) return <Loader />;
  if (error) return <div className="text-red-600 p-4">{error}</div>;

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white rounded shadow mt-8">
      <h2 className="text-2xl font-bold mb-4 text-purple-800">Edit Blog</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block font-medium">Title</label>
          <input name="title" value={form.title} onChange={handleChange} className="w-full border rounded p-2" required />
        </div>
        <div>
          <label className="block font-medium">Description</label>
          <textarea name="description" value={form.description} onChange={handleChange} className="w-full border rounded p-2" rows={2} />
        </div>
        <div>
          <label className="block font-medium">Content</label>
          <textarea name="content" value={form.content[0]?.text || ''} onChange={handleContentChange} className="w-full border rounded p-2" rows={6} />
          <div className="text-xs text-gray-400 mt-1">(For demo: only plain text. Integrate your content block editor here.)</div>
        </div>
        <div>
          <label className="block font-medium">Tags (comma separated)</label>
          <input name="tags" value={form.tags.join(', ')} onChange={handleTagsChange} className="w-full border rounded p-2" />
        </div>
        <div>
          <label className="block font-medium">Category</label>
          <input name="category" value={form.category} onChange={handleChange} className="w-full border rounded p-2" />
        </div>
        <div>
          <label className="block font-medium">Thumbnail URL</label>
          <input name="thumbnail" value={form.thumbnail} onChange={handleChange} className="w-full border rounded p-2" />
        </div>
        {saveError && <div className="text-red-600">{saveError}</div>}
        {success && <div className="text-green-600">Blog updated! Redirecting...</div>}
        <div className="flex gap-4">
          <button type="submit" className="bg-purple-700 text-white px-4 py-2 rounded" disabled={saving}>{saving ? 'Saving...' : 'Save Changes'}</button>
          <button type="button" className="bg-gray-300 px-4 py-2 rounded" onClick={() => navigate('/author/listBlog')}>Cancel</button>
        </div>
      </form>
    </div>
  );
};

export default EditBlog;
