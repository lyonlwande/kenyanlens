import React from 'react';


const AddBlockPopover = ({
  show, onClose, onSelect, blockTypes
}) => {
  if (!show) return null;
  return (
    <div className="absolute z-30 mt-16 bg-white border border-purple-200 rounded-xl shadow-xl p-2 flex flex-col w-56 animate-fadeIn max-h-64 overflow-y-auto">
      {blockTypes.map((block) => (
        <button
          key={block.type}
          type="button"
          className="flex items-center gap-3 px-3 py-2 hover:bg-purple-50 rounded-lg text-left transition"
          onClick={() => onSelect(block.type)}
        >
          <span className="text-lg">{block.icon}</span>
          <span className="font-medium">{block.label}</span>
        </button>
      ))}
      <button className="mt-2 text-xs text-gray-500 hover:text-gray-700" onClick={onClose}>Cancel</button>
    </div>
  );
};

export default AddBlockPopover;
