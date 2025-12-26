import React from 'react';


const BlogDraftStatus = ({ draftLoading, draftError, lastSaved, error, success }) => {
  return (
    <div className="min-h-[24px]">
      {draftLoading && <div className="mt-2 text-blue-600 font-semibold text-center">Saving draft...</div>}
      {draftError && <div className="mt-2 text-red-600 font-semibold text-center">{draftError}</div>}
      {lastSaved && <div className="mt-2 text-green-600 font-semibold text-center">Draft saved at {lastSaved.toLocaleTimeString()}</div>}
      {error && <div className="mt-2 text-red-600 font-semibold text-center">{error}</div>}
      {success && <div className="mt-2 text-green-600 font-semibold text-center">{success}</div>}
    </div>
  );
};

export default BlogDraftStatus;
