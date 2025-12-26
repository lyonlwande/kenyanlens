import React from 'react';


const BlogActionButtons = ({
  loading, draftLoading, draftId, onSubmit, onDiscardDraft
}) => {
  return (
    <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center mt-4">
      <button
        type="submit"
        className={`w-full sm:w-40 h-12 bg-purple-700 hover:bg-purple-800 text-white px-4 py-2 rounded cursor-pointer text-base font-bold ${loading || draftLoading ? 'opacity-60 cursor-not-allowed' : ''}`}
        disabled={loading || draftLoading}
        onClick={onSubmit}
      >
        {draftId ? (loading || draftLoading ? 'Publishing...' : 'Publish Blog') : (loading ? 'Adding...' : 'Add Blog')}
      </button>
      {draftId && (
        <button
          type="button"
          className="w-full sm:w-40 h-12 bg-gray-300 hover:bg-gray-400 text-gray-800 px-4 py-2 rounded cursor-pointer text-base font-bold"
          onClick={onDiscardDraft}
          disabled={draftLoading}
        >
          Discard Draft
        </button>
      )}
    </div>
  );
};

export default BlogActionButtons;
