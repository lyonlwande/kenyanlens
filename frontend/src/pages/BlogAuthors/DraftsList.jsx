import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import useBlogStore from '../../zustandStores/blogStore';

const DraftsList = () => {
  const { drafts, fetchDrafts, draftLoading, draftError, deleteDraft } = useBlogStore();
  const navigate = useNavigate();

  useEffect(() => {
    fetchDrafts();
  }, [fetchDrafts]);

  const handleResume = (draft) => {
    // Navigate to AddBlog with draftId as state
    navigate('/author/addBlog', { state: { draftId: draft._id } });
  };

  const handleDelete = async (draft) => {
    if (window.confirm('Are you sure you want to delete this draft?')) {
      await deleteDraft(draft._id);
    }
  };

  return (
    <div className="flex-1 p-8 overflow-y-auto">
      <h2 className="text-2xl font-bold mb-6 text-purple-800">My Blog Drafts</h2>
      {draftLoading && <div className="text-blue-600">Loading drafts...</div>}
      {draftError && <div className="text-red-600">{draftError}</div>}
      {!draftLoading && drafts.length === 0 && (
        <div className="text-gray-500">No drafts found. Start writing a new blog!</div>
      )}
      <div className="grid gap-4">
        {drafts.map((draft) => (
          <div key={draft._id} className="bg-white rounded shadow p-4 flex flex-col md:flex-row md:items-center justify-between hover:shadow-lg transition">
            <div>
              <div className="font-semibold text-lg text-purple-700">{draft.title || <span className="italic text-gray-400">Untitled</span>}</div>
              <div className="text-sm text-gray-500">Last updated: {new Date(draft.updatedAt).toLocaleString()}</div>
              <div className="text-sm text-gray-500">Category: {draft.category || <span className="italic">None</span>}</div>
            </div>
            <div className="flex gap-2 mt-4 md:mt-0">
              <button
                className="px-4 py-2 bg-purple-600 text-white rounded hover:bg-purple-700 font-semibold"
                onClick={() => handleResume(draft)}
              >
                Resume
              </button>
              <button
                className="px-4 py-2 bg-red-100 text-red-700 rounded hover:bg-red-200 font-semibold"
                onClick={() => handleDelete(draft)}
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default DraftsList;
