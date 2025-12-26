import React from 'react';


import BlockItem from './BlockItem';
import AddBlockPopover from './AddBlockPopover';

const BlogContentEditor = ({
  blocks, blockImageFiles, blockVideoFiles, addPopoverIdx, setAddPopoverIdx, addBlockAt, moveBlock, deleteBlock, duplicateBlock, renderBlockPreview, blockTypes
}) => {
  return (
    <div className="flex-1 min-h-[300px] rounded-xl shadow-md border border-purple-100 p-4 sm:p-6 relative">
      <div className="flex items-center justify-between mb-4">
        <span className="font-bold text-base text-purple-800 tracking-wide">Blog Content</span>
      </div>
      {blocks.length === 0 && (
        <div className="flex flex-col items-center gap-3 my-12">
          <button
            type="button"
            className="flex items-center gap-2 px-4 py-3 rounded-full bg-gradient-to-r from-purple-200 to-blue-100 text-purple-800 border-2 border-purple-200 hover:from-purple-300 hover:to-blue-200 hover:scale-105 transition font-semibold shadow-md text-base"
            onClick={() => setAddPopoverIdx(0)}
          >
            <span className="text-2xl font-bold">+</span> Add your first block
          </button>
          {addPopoverIdx === 0 && (
            <AddBlockPopover
              show={true}
              onClose={() => setAddPopoverIdx(null)}
              onSelect={type => { addBlockAt(type, 0); }}
              blockTypes={blockTypes}
            />
          )}
        </div>
      )}
      {blocks.map((block, i) => (
        <BlockItem
          key={block.id || i}
          block={block}
          i={i}
          renderBlockPreview={renderBlockPreview}
          moveBlock={moveBlock}
          deleteBlock={deleteBlock}
          duplicateBlock={duplicateBlock}
          blocksLength={blocks.length}
        />
      ))}
      {/* Singular add at end */}
      <div className="flex justify-center my-6 relative">
        <button
          type="button"
          className="flex items-center gap-2 px-4 py-3 rounded-full bg-gradient-to-r from-purple-200 to-blue-100 text-purple-800 border-2 border-purple-200 hover:from-purple-300 hover:to-blue-200 hover:scale-105 transition font-semibold shadow-md text-base"
          onClick={() => setAddPopoverIdx(blocks.length)}
          aria-label="Add block"
        >
          <span className="text-2xl font-bold">+</span> Add block
        </button>
        {addPopoverIdx === blocks.length && (
          <AddBlockPopover
            show={true}
            onClose={() => setAddPopoverIdx(null)}
            onSelect={type => { addBlockAt(type, blocks.length); }}
            blockTypes={blockTypes}
          />
        )}
      </div>
    </div>
  );
};

export default BlogContentEditor;
