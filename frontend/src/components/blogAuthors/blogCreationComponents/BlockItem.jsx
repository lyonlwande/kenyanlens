import React from 'react';


const BlockItem = ({
  block, i, renderBlockPreview, moveBlock, deleteBlock, duplicateBlock, blocksLength
}) => {
  return (
    <div className="border border-purple-100 rounded-xl p-3 mb-4 bg-white/90 relative group shadow-sm transition hover:shadow-lg">
      {renderBlockPreview(block, i, false)}
      {/* Block controls */}
      <div className="absolute top-3 right-3 flex gap-2 opacity-0 group-hover:opacity-100 transition-all">
        <button type="button" title="Move Up" disabled={i === 0} onClick={() => moveBlock(i, 'up')} className="text-xs px-2 py-1 bg-gray-100 hover:bg-purple-100 text-purple-700 rounded-lg shadow-sm disabled:opacity-40 disabled:cursor-not-allowed transition">↑</button>
        <button type="button" title="Move Down" disabled={i === blocksLength - 1} onClick={() => moveBlock(i, 'down')} className="text-xs px-2 py-1 bg-gray-100 hover:bg-purple-100 text-purple-700 rounded-lg shadow-sm disabled:opacity-40 disabled:cursor-not-allowed transition">↓</button>
        <button type="button" title="Duplicate" onClick={() => duplicateBlock(i)} className="text-xs px-2 py-1 bg-gray-100 hover:bg-blue-100 text-blue-700 rounded-lg shadow-sm transition">⧉</button>
        <button type="button" title="Delete" onClick={() => deleteBlock(i)} className="text-xs px-2 py-1 bg-red-100 hover:bg-red-200 text-red-700 rounded-lg shadow-sm transition">✕</button>
      </div>
    </div>
  );
};

export default BlockItem;
