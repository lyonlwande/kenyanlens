  // Helper to update all local state fields from a draft/blog object
 

import React, { useRef, useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { FaCloudUploadAlt, FaHeading, FaParagraph, FaListUl, FaImage, FaQuoteRight, FaCode, FaRegObjectGroup, FaPuzzlePiece, FaVideo } from 'react-icons/fa';
import { blogCartegories } from '../../assets/assets';
import useBlogStore from '../../zustandStores/blogStore';
import EditorJS from '@editorjs/editorjs';
import Header from '@editorjs/header';
import List from '@editorjs/list';
import ImageTool from '@editorjs/image';
import Quote from '@editorjs/quote';
import Code from '@editorjs/code';
import Embed from '@editorjs/embed';
// import useAuthStore from '../../zustandStores/authStore';

 const applyDraftToState = (draft) => {
    setTitle(draft.title || '');
    setSubTitle(draft.subTitle || '');
    setDescription(draft.description || '');
    setCategory(draft.category || '');
    setBlocks(draft.content || []);
    setThumbnail(draft.thumbnail || null);
    setCurrentDraft(draft);
  };


const blockTypes = [
  { type: 'heading', label: 'Heading', icon: <FaHeading /> },
  { type: 'paragraph', label: 'Paragraph', icon: <FaParagraph /> },
  { type: 'list', label: 'List', icon: <FaListUl /> },
  { type: 'image', label: 'Image', icon: <FaImage /> },
  { type: 'media', label: 'Media', icon: <FaVideo /> },
  { type: 'section', label: 'Section', icon: <FaRegObjectGroup /> },
  { type: 'quote', label: 'Quote', icon: <FaQuoteRight /> },
  { type: 'code', label: 'Code', icon: <FaCode /> },
  { type: 'embed', label: 'Embed', icon: <FaPuzzlePiece /> },
  { type: 'widget', label: 'Widget', icon: <FaPuzzlePiece /> },
];

const AddBlog = () => {
    // Inline block add popover state
    const [addPopoverIdx, setAddPopoverIdx] = useState(null); // index where popover is open

  const editorRef = useRef(null);
  const editorInstance = useRef(null);
  const navigate = useNavigate();
  const location = useLocation();
  // const { isAuthenticated } = useAuthStore();

  const [thumbnail, setThumbnail] = useState(null);
  const [title, setTitle] = useState("");
  const [subTitle, setSubTitle] = useState("");
  const [category, setCategory] = useState("");
  const [description, setDescription] = useState("");
  const [isPublished, setIsPublished] = useState(false);
  const [blocks, setBlocks] = useState([]); // Editor.js blocks
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [activeBlock, setActiveBlock] = useState(null); // For block-level editing
  // State for block image and video files and mapping
  const [blockImageFiles, setBlockImageFiles] = useState({}); // {blockIndex: File}
  const [blockVideoFiles, setBlockVideoFiles] = useState({}); // {blockIndex: File}

  const {
    createBlog,
    loading,
    saveDraft,
    fetchDrafts,
    fetchDraftById,
    deleteDraft,
    publishDraft,
    currentDraft,
    draftLoading,
    draftError,
    setCurrentDraft,
    clearDraftError
  } = useBlogStore();

  // Track draft id for updates
  const [draftId, setDraftId] = useState(null);
  const [lastSaved, setLastSaved] = useState(null);
  // Load draft on mount (if any), with localStorage fallback
  useEffect(() => {
    const loadDraft = async () => {
      // If navigated with a draftId, load that draft
      const draftIdFromNav = location.state?.draftId;
      if (draftIdFromNav) {
        const draft = await fetchDraftById(draftIdFromNav);
        if (draft) {
          setDraftId(draft._id);
          setCurrentDraft(draft);
          setTitle(draft.title || '');
          setSubTitle(draft.subTitle || '');
          setCategory(draft.category || '');
          setDescription(draft.description || '');
          setBlocks(draft.content || []);
            setThumbnail(draft.thumbnail || null); // Use Cloudinary URL if present
          return;
        }
      }
      // Otherwise, load the most recent backend draft
      const drafts = await fetchDrafts();
      if (drafts && drafts.length > 0) {
        const draft = drafts[0];
        setDraftId(draft._id);
        setCurrentDraft(draft);
        setTitle(draft.title || '');
        setSubTitle(draft.subTitle || '');
        setCategory(draft.category || '');
        setDescription(draft.description || '');
        setBlocks(draft.content || []);
          setThumbnail(draft.thumbnail || null); // Use Cloudinary URL if present
        return;
      }
      // If no backend draft, check localStorage
      const local = localStorage.getItem('blogDraft');
      if (local) {
        try {
          const localDraft = JSON.parse(local);
          setTitle(localDraft.title || '');
          setSubTitle(localDraft.subTitle || '');
          setCategory(localDraft.category || '');
          setDescription(localDraft.description || '');
          setBlocks(localDraft.blocks || []);
            setThumbnail(localDraft.thumbnail || null); // DataURL or URL
          setSuccess('Recovered unsaved local draft.');
        } catch (e) {
          // Ignore parse errors
        }
      }
    };
    loadDraft();
  }, [location.state]);

  // Auto-save draft (debounced) and to localStorage
  useEffect(() => {
    const timeout = setTimeout(async () => {
      // Only save if any field is filled
      if (title || subTitle || description || category || blocks.length > 0 || thumbnail) {
        // Save to backend
        const formData = new FormData();
        if (thumbnail && typeof thumbnail !== 'string') formData.append('thumbnail', thumbnail);
        formData.append('title', title);
        formData.append('subTitle', subTitle);
        formData.append('description', description);
        // Clean blocks for autosave: only keep alt and filePath for image blocks, and filePath for media blocks
        const blockImages = [];
        const blockImageMap = {};
        const blockVideos = [];
        const blockVideoMap = {};
        const cleanedBlocks = blocks.map((block, idx) => {
          if (block.type === 'image') {
            if (blockImageFiles[idx]) {
              blockImages.push(blockImageFiles[idx]);
              blockImageMap[block.id || idx] = blockImageFiles[idx].name;
            }
            const { alt, filePath } = block.data || {};
            const newData = {};
            if (alt) newData.alt = alt;
            if (filePath) newData.filePath = filePath;
            return { ...block, data: newData };
          }
          if (block.type === 'media') {
            if (blockVideoFiles[idx]) {
              blockVideos.push(blockVideoFiles[idx]);
              blockVideoMap[block.id || idx] = blockVideoFiles[idx].name;
            }
            const { filePath } = block.data || {};
            const newData = {};
            if (filePath) newData.filePath = filePath;
            return { ...block, data: newData };
          }
          return block;
        });
        formData.append('content', JSON.stringify(cleanedBlocks));
        formData.append('category', category);
        formData.append('isPublished', false);
        // Attach block images
        blockImages.forEach((file) => {
          formData.append('blockImages', file);
        });
        formData.append('blockImageMap', JSON.stringify(blockImageMap));
        // Attach block videos
        blockVideos.forEach((file) => {
          formData.append('blockVideos', file);
        });
        formData.append('blockVideoMap', JSON.stringify(blockVideoMap));
        const result = await saveDraft(formData, draftId);
        if (result && result._id) {
          setDraftId(result._id);
          setLastSaved(new Date());
          // Ensure thumbnail is set to Cloudinary URL after backend response
          setThumbnail(result.thumbnail || null);
          applyDraftToState(result); // <-- update all fields from backend
        }
        // Save to localStorage (thumbnail as null or DataURL if possible)
        let thumbnailToStore = thumbnail;
        if (thumbnail && typeof thumbnail !== 'string' && thumbnail instanceof File) {
          // Try to store as DataURL (sync, for small images)
          const reader = new FileReader();
          reader.onload = () => {
            localStorage.setItem('blogDraft', JSON.stringify({
              title, subTitle, description, category, blocks: cleanedBlocks, thumbnail: reader.result, ts: Date.now()
            }));
          };
          reader.readAsDataURL(thumbnail);
        } else {
          localStorage.setItem('blogDraft', JSON.stringify({
            title, subTitle, description, category, blocks: cleanedBlocks, thumbnail: thumbnailToStore, ts: Date.now()
          }));
        }
      } else {
        localStorage.removeItem('blogDraft');
      }
    }, 2000); // 2s debounce
    return () => clearTimeout(timeout);
  }, [title, subTitle, description, category, blocks, thumbnail, blockImageFiles, blockVideoFiles]);

  // Initialize Editor.js
  useEffect(() => {
    if (!editorInstance.current && editorRef.current) {
      editorInstance.current = new EditorJS({
        holder: editorRef.current,
        autofocus: true,
        placeholder: 'Write your blog content here... Click + to add blocks.',
        tools: {
          header: Header,
          list: List,
          image: {
            class: ImageTool,
            config: {
              endpoints: {
                byFile: '/api/uploads/image',
                byUrl: '/api/uploads/image-by-url',
              },
              field: 'image',
              types: 'image/*',
            },
          },
          quote: Quote,
          code: Code,
          embed: Embed,
        },
        minHeight: 200,
        onChange: async () => {
          const output = await editorInstance.current.save();
          setBlocks(output.blocks);
        },
      });
    }
    return () => {
      if (editorInstance.current && editorInstance.current.destroy) {
        editorInstance.current.destroy();
        editorInstance.current = null;
      }
    };
  }, []);


  // Add block at specific index (for inline add)
  const addBlockAt = (type, idx) => {
    setBlocks((prev) => {
      const newBlocks = [...prev];
      newBlocks.splice(idx, 0, { type, data: {}, id: Date.now() });
      return newBlocks;
    });
    setAddPopoverIdx(null);
  };

  // Block controls
  const moveBlock = (index, direction) => {
    setBlocks((prev) => {
      const newBlocks = [...prev];
      const target = newBlocks[index];
      newBlocks.splice(index, 1);
      newBlocks.splice(direction === 'up' ? index - 1 : index + 1, 0, target);
      return newBlocks;
    });
  };
  const deleteBlock = (index) => {
    setBlocks((prev) => prev.filter((_, i) => i !== index));
  };
  const duplicateBlock = (index) => {
    setBlocks((prev) => {
      const newBlocks = [...prev];
      newBlocks.splice(index, 0, { ...prev[index], id: Date.now() });
      return newBlocks;
    });
  };

  // Form validation
  const validateForm = () => {
    if (!thumbnail) return 'Image is required.';
    if (!title.trim()) return 'Title is required.';
    if (!subTitle.trim()) return 'Subtitle is required.';
    if (!description.trim()) return 'Description is required.';
    if (!blocks || blocks.length === 0) return 'Content is required.';
    if (!category) return 'Category is required.';
    return null;
  };

  // Blog submission handler (publish draft)
  const onSubmitHandler = async (e) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    // Always get latest blocks before submit
    let latestBlocks = blocks;
    if (editorInstance.current) {
      const output = await editorInstance.current.save();
      latestBlocks = output.blocks;
      setBlocks(latestBlocks);
    }

    const validationError = validateForm();
    if (validationError) {
      setError(validationError);
      return;
    }

    // Prepare blockImages and blockImageMap for backend (file upload only)
    const blockImages = [];
    const blockImageMap = {};
    // Remove fileDataUrl and url from image blocks before sending
    const blockVideos = [];
    const blockVideoMap = {};
    const cleanedBlocks = latestBlocks.map((block, idx) => {
      if (block.type === 'image') {
        if (blockImageFiles[idx]) {
          blockImages.push(blockImageFiles[idx]);
          blockImageMap[block.id || idx] = blockImageFiles[idx].name;
        }
        const { alt, filePath } = block.data || {};
        const newData = {};
        if (alt) newData.alt = alt;
        if (filePath) newData.filePath = filePath;
        return { ...block, data: newData };
      }
      if (block.type === 'media') {
        if (blockVideoFiles[idx]) {
          blockVideos.push(blockVideoFiles[idx]);
          blockVideoMap[block.id || idx] = blockVideoFiles[idx].name;
        }
        const { filePath } = block.data || {};
        const newData = {};
        if (filePath) newData.filePath = filePath;
        return { ...block, data: newData };
      }
      return block;
    });

    // If draft exists, publish it
    if (draftId) {
      const result = await publishDraft(draftId);
      if (result && result._id) {
        setSuccess('Blog published successfully!');
        localStorage.removeItem('blogDraft');
        setThumbnail(result.thumbnail || null); // Ensure Cloudinary URL is set
        applyDraftToState(result); // <-- update all fields from backend
        setTimeout(() => {
          navigate(`/blogs/${result._id}`);
        }, 1200);
      } else {
        setError('Failed to publish blog. Please try again.');
      }
    } else {
      // Fallback: create blog directly
      const formData = new FormData();
      if (thumbnail && typeof thumbnail !== 'string') formData.append('thumbnail', thumbnail);
      formData.append('title', title);
      formData.append('subTitle', subTitle);
      formData.append('description', description);
      formData.append('content', JSON.stringify(cleanedBlocks));
      formData.append('category', category);
      formData.append('isPublished', true);
      // Attach block images
      blockImages.forEach((file) => {
        formData.append('blockImages', file);
      });
      formData.append('blockImageMap', JSON.stringify(blockImageMap));
      // Attach block videos
      blockVideos.forEach((file) => {
        formData.append('blockVideos', file);
      });
      formData.append('blockVideoMap', JSON.stringify(blockVideoMap));
      const result = await createBlog(formData);
      if (result && result._id) {
        setSuccess('Blog created successfully!');
        localStorage.removeItem('blogDraft');
        setThumbnail(result.thumbnail || null); // Ensure Cloudinary URL is set
        applyDraftToState(result); // <-- update all fields from backend
        setTimeout(() => {
          navigate(`/blogs/${result._id}`);
        }, 1200);
      } else {
        setError('Failed to create blog. Please try again.');
      }
    }
  };
  // Discard draft handler
  const onDiscardDraft = async () => {
    if (draftId) {
      await deleteDraft(draftId);
      setDraftId(null);
      setCurrentDraft(null);
    }
    setTitle('');
    setSubTitle('');
    setCategory('');
    setDescription('');
    setBlocks([]);
    setThumbnail(null);
    localStorage.removeItem('blogDraft');
    setSuccess('Draft discarded.');
    setTimeout(() => setSuccess(null), 1200);
  };

  const generateWithAI = async () => {
    alert('AI content generation is not implemented yet.');
  };

  // Optionally, check authentication here and redirect if not authenticated
  // useEffect(() => {
  //   if (!isAuthenticated) navigate('/login');
  // }, [isAuthenticated, navigate]);

  // Block preview renderer (editable)
  const handleBlockChange = (i, field, value) => {
    setBlocks((prev) => {
      const newBlocks = [...prev];
      newBlocks[i] = {
        ...newBlocks[i],
        data: {
          ...newBlocks[i].data,
          [field]: value,
        },
      };
      return newBlocks;
    });
  };

  const renderBlockPreview = (block, i, readOnly = false) => {
    switch (block.type) {
      case 'heading':
        return readOnly ? (
          <h2 className="font-bold text-xl">{block.data?.text || 'Heading'}</h2>
        ) : (
          <input
            type="text"
            className="font-bold text-xl w-full bg-transparent outline-none"
            placeholder="Heading..."
            value={block.data?.text || ''}
            onChange={e => handleBlockChange(i, 'text', e.target.value)}
          />
        );
      case 'paragraph':
        return readOnly ? (
          <p>{block.data?.text || 'Paragraph'}</p>
        ) : (
          <textarea
            className="w-full bg-transparent outline-none resize-none"
            placeholder="Paragraph..."
            value={block.data?.text || ''}
            onChange={e => handleBlockChange(i, 'text', e.target.value)}
            rows={3}
          />
        );
      case 'list':
        return readOnly ? (
          <ul className="list-disc ml-6">
            {(block.data?.items || ['List item']).map((item, idx) => (
              <li key={idx}>{item}</li>
            ))}
          </ul>
        ) : (
          <textarea
            className="w-full bg-transparent outline-none resize-none"
            placeholder="List items (one per line)"
            value={block.data?.items ? block.data.items.join('\n') : ''}
            onChange={e => handleBlockChange(i, 'items', e.target.value.split('\n'))}
            rows={3}
          />
        );
      case 'image':
        return (
          <div className="flex flex-col items-center">
            <div className="w-32 h-32 bg-gray-200 flex items-center justify-center mb-2 rounded relative group">
              {blockImageFiles[i] ? (
                <img src={URL.createObjectURL(blockImageFiles[i])} alt={block.data?.alt || 'Image'} className="w-full h-full object-cover rounded" />
              ) : block.data?.filePath ? (
                <img src={block.data.filePath} alt={block.data?.alt || 'Image'} className="w-full h-full object-cover rounded" />
              ) : (
                <span className="text-gray-400">Image Block</span>
              )}
              {!readOnly && (
                <>
                  <button
                    type="button"
                    className="absolute bottom-2 right-2 bg-white/80 hover:bg-purple-100 text-purple-700 rounded-full p-2 shadow-md transition group-hover:scale-110"
                    onClick={() => {
                      document.getElementById(`image-file-input-${i}`)?.click();
                    }}
                    title="Choose Image"
                  >
                    <FaImage size={20} />
                  </button>
                  <input
                    id={`image-file-input-${i}`}
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={e => {
                      const file = e.target.files && e.target.files[0];
                      if (file) {
                        setBlockImageFiles(prev => ({ ...prev, [i]: file }));
                      }
                    }}
                  />
                </>
              )}
            </div>
            {!readOnly && (
              <input
                type="text"
                className="w-full text-xs bg-transparent outline-none border-b border-gray-300"
                placeholder="Alt text..."
                value={block.data?.alt || ''}
                onChange={e => handleBlockChange(i, 'alt', e.target.value)}
              />
            )}
          </div>
        );
      case 'media':
        return (
          <div className="flex flex-col items-center">
            <div className="w-32 h-32 bg-gray-200 flex items-center justify-center mb-2 rounded relative group">
              {blockVideoFiles[i] ? (
                <video width="128" height="128" controls>
                  <source src={URL.createObjectURL(blockVideoFiles[i])} type={blockVideoFiles[i].type} />
                  Your browser does not support the video tag.
                </video>
              ) : block.data?.filePath ? (
                <video width="128" height="128" controls>
                  <source src={block.data.filePath} />
                  Your browser does not support the video tag.
                </video>
              ) : (
                <span className="text-gray-400">Media Block</span>
              )}
              {!readOnly && (
                <>
                  <button
                    type="button"
                    className="absolute bottom-2 right-2 bg-white/80 hover:bg-blue-100 text-blue-700 rounded-full p-2 shadow-md transition group-hover:scale-110"
                    onClick={() => {
                      document.getElementById(`media-file-input-${i}`)?.click();
                    }}
                    title="Choose Video"
                  >
                    <FaVideo size={20} />
                  </button>
                  <input
                    id={`media-file-input-${i}`}
                    type="file"
                    accept="video/*"
                    className="hidden"
                    onChange={e => {
                      const file = e.target.files && e.target.files[0];
                      if (file) {
                        setBlockVideoFiles(prev => ({ ...prev, [i]: file }));
                      }
                    }}
                  />
                </>
              )}
            </div>
          </div>
        );
      case 'section':
        return (
          <div className="border p-2 rounded bg-blue-100">
            <span className="font-semibold">Section Block (Nested)</span>
            {/* Nested blocks could be rendered here in future */}
          </div>
        );
      case 'quote':
        return readOnly ? (
          <blockquote className="italic">{block.data?.text || 'Quote'}</blockquote>
        ) : (
          <textarea
            className="w-full bg-transparent outline-none italic resize-none"
            placeholder="Quote..."
            value={block.data?.text || ''}
            onChange={e => handleBlockChange(i, 'text', e.target.value)}
            rows={2}
          />
        );
      case 'code':
        return readOnly ? (
          <pre className="bg-gray-100 p-2">{block.data?.text || 'Code'}</pre>
        ) : (
          <textarea
            className="w-full bg-transparent outline-none font-mono resize-none"
            placeholder="Code..."
            value={block.data?.text || ''}
            onChange={e => handleBlockChange(i, 'text', e.target.value)}
            rows={3}
          />
        );
      case 'embed':
        return (
          <div className="bg-gray-100 p-2 rounded">
            <span className="text-xs">Embed Block</span>
            {!readOnly && (
              <input
                type="text"
                className="w-full text-xs bg-transparent outline-none border-b border-gray-300 mt-1"
                placeholder="Embed URL..."
                value={block.data?.url || ''}
                onChange={e => handleBlockChange(i, 'url', e.target.value)}
              />
            )}
          </div>
        );
      case 'widget':
        return (
          <div className="bg-gray-100 p-2 rounded">
            <span className="text-xs">Widget Block</span>
          </div>
        );
      default:
        return <div>Unknown Block</div>;
    }
  };


    // Responsive state for live preview toggle (mobile)
    const [showPreview, setShowPreview] = useState(false);

    return (
      <form onSubmit={onSubmitHandler} className="w-full min-h-screen bg-blue-50/50 text-gray-600 flex flex-col items-center py-4 md:py-8 overflow-auto">
        <div className="w-full max-w-5xl bg-white shadow rounded-lg px-2 sm:px-4 md:px-8 py-4 md:py-8 flex flex-col gap-6 md:gap-8">
          {/* Header */}
          <h1 className="text-xl sm:text-2xl font-bold text-purple-800 mb-2 text-center md:text-left">Create Blog</h1>

          {/* General Info Section */}
          <section className="bg-purple-50 rounded-lg p-4 sm:p-6 mb-2 flex flex-col gap-4 shadow-sm">
            <div className="flex flex-col md:flex-row gap-4 md:gap-6 items-center md:items-start">
              <div className="flex flex-col items-center w-full md:w-auto">
                <p className="mb-2 font-semibold">Upload Thumbnail</p>
                <label htmlFor="thumbnail" className="cursor-pointer flex flex-col items-center justify-center border-2 border-dashed border-purple-400 rounded-lg p-4 sm:p-6 hover:bg-blue-100 transition mb-2 w-32 h-32">
                  {thumbnail ? (
                    <img
                      src={
                        typeof thumbnail === 'string'
                          ? thumbnail
                          : thumbnail instanceof File
                            ? URL.createObjectURL(thumbnail)
                            : undefined
                      }
                      alt="Thumbnail Preview"
                      className="w-28 h-28 object-cover rounded shadow mb-2"
                    />
                  ) : (
                    <>
                      <FaCloudUploadAlt size={36} className="text-blue-400 mb-2" />
                      <span className="text-gray-500 text-xs sm:text-sm text-center">Click to upload image</span>
                    </>
                  )}
                  <input
                    onChange={e => {
                      if (e.target.files && e.target.files[0]) setThumbnail(e.target.files[0]);
                    }}
                    type="file"
                    id="thumbnail"
                    accept="image/*"
                    hidden
                    required
                  />
                </label>
              </div>
              <div className="flex-1 flex flex-col gap-3 sm:gap-4 w-full">
                <div>
                  <label className="font-semibold">Blog Title</label>
                  <input
                    type="text"
                    placeholder="Type here"
                    required
                    className="w-full p-2 border border-purple-400 outline-none rounded mt-1 text-sm sm:text-base"
                    onChange={e => setTitle(e.target.value)}
                    value={title}
                  />
                </div>
                <div>
                  <label className="font-semibold">Sub Title</label>
                  <input
                    type="text"
                    placeholder="Type here"
                    required
                    className="w-full p-2 border border-purple-400 outline-none rounded mt-1 text-sm sm:text-base"
                    onChange={e => setSubTitle(e.target.value)}
                    value={subTitle}
                  />
                </div>
                <div>
                  <label className="font-semibold">Description</label>
                  <textarea
                    placeholder="Enter a short summary (max 300 chars)"
                    required
                    className="w-full p-2 border border-purple-400 outline-none rounded mt-1 min-h-[60px] text-sm sm:text-base"
                    maxLength={300}
                    onChange={e => setDescription(e.target.value)}
                    value={description}
                  />
                </div>
                <div>
                  <label className="font-semibold">Blog Category</label>
                  <input
                    type="text"
                    placeholder="Enter category (e.g. Finance, Tech, etc.)"
                    required
                    className="w-full p-2 border border-purple-400 outline-none rounded mt-1 text-sm sm:text-base"
                    onChange={e => setCategory(e.target.value)}
                    value={category}
                  />
                </div>
                <div className="flex gap-2 items-center mt-2">
                  <label className="font-semibold">Publish now</label>
                  <input
                    type="checkbox"
                    checked={isPublished}
                    className="scale-125 cursor-pointer"
                    onChange={e => setIsPublished(e.target.checked)}
                  />
                </div>
              </div>
            </div>
          </section>


          {/* Blog Content Section */}
          <section className="bg-gradient-to-br from-blue-50 via-purple-50 to-white rounded-2xl p-4 sm:p-8 shadow-lg border border-purple-100">
            <div className="flex flex-col gap-6 md:gap-10 md:flex-row">
              {/* Block workspace: full width */}
              <div className="flex-1 min-h-[300px]  rounded-xl shadow-md border border-purple-100 p-4 sm:p-6 relative">
                <div className="flex items-center justify-between mb-4">
                  <span className="font-bold text-base text-purple-800 tracking-wide">Blog Content</span>
                  {/* Show preview toggle on mobile */}
                  <button
                    type="button"
                    className="md:hidden text-xs px-3 py-1 rounded-lg bg-purple-100 text-purple-700 border border-purple-200 hover:bg-purple-200 transition"
                    onClick={() => setShowPreview((v) => !v)}
                  >
                    {showPreview ? 'Hide Preview' : 'Show Preview'}
                  </button>
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
                    {/* Popover for first block */}
                    {addPopoverIdx === 0 && (
                      <div className="absolute z-30 mt-16 bg-white border border-purple-200 rounded-xl shadow-xl p-2 flex flex-col w-56 animate-fadeIn max-h-64 overflow-y-auto">
                        {blockTypes.map((block) => (
                          <button
                            key={block.type}
                            type="button"
                            className="flex items-center gap-3 px-3 py-2 hover:bg-purple-50 rounded-lg text-left transition"
                            onClick={() => addBlockAt(block.type, 0)}
                          >
                            <span className="text-lg">{block.icon}</span>
                            <span className="font-medium">{block.label}</span>
                          </button>
                        ))}
                        <button className="mt-2 text-xs text-gray-500 hover:text-gray-700" onClick={() => setAddPopoverIdx(null)}>Cancel</button>
                      </div>
                    )}
                  </div>
                )}
                {blocks.map((block, i) => (
                  <React.Fragment key={block.id || i}>
                    <div className="border border-purple-100 rounded-xl p-3 mb-4 bg-white/90 relative group shadow-sm transition hover:shadow-lg">
                      {renderBlockPreview(block, i, false)}
                      {/* Block controls */}
                      <div className="absolute top-3 right-3 flex gap-2 opacity-0 group-hover:opacity-100 transition-all">
                        <button type="button" title="Move Up" disabled={i === 0} onClick={() => moveBlock(i, 'up')} className="text-xs px-2 py-1 bg-gray-100 hover:bg-purple-100 text-purple-700 rounded-lg shadow-sm disabled:opacity-40 disabled:cursor-not-allowed transition">↑</button>
                        <button type="button" title="Move Down" disabled={i === blocks.length - 1} onClick={() => moveBlock(i, 'down')} className="text-xs px-2 py-1 bg-gray-100 hover:bg-purple-100 text-purple-700 rounded-lg shadow-sm disabled:opacity-40 disabled:cursor-not-allowed transition">↓</button>
                        <button type="button" title="Duplicate" onClick={() => duplicateBlock(i)} className="text-xs px-2 py-1 bg-gray-100 hover:bg-blue-100 text-blue-700 rounded-lg shadow-sm transition">⧉</button>
                        <button type="button" title="Delete" onClick={() => deleteBlock(i)} className="text-xs px-2 py-1 bg-red-100 hover:bg-red-200 text-red-700 rounded-lg shadow-sm transition">✕</button>
                      </div>
                    </div>
                  </React.Fragment>
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
                  {/* Popover */}
                  {addPopoverIdx === blocks.length && (
                    <div className="absolute z-30 top-16 left-1/2 -translate-x-1/2 bg-white border border-purple-200 rounded-xl shadow-xl p-2 flex flex-col w-56 animate-fadeIn max-h-64 overflow-y-auto">
                      {blockTypes.map((blockType) => (
                        <button
                          key={blockType.type}
                          type="button"
                          className="flex items-center gap-3 px-3 py-2 hover:bg-purple-50 rounded-lg text-left transition"
                          onClick={() => addBlockAt(blockType.type, blocks.length)}
                        >
                          <span className="text-lg">{blockType.icon}</span>
                          <span className="font-medium">{blockType.label}</span>
                        </button>
                      ))}
                      <button className="mt-2 text-xs text-gray-500 hover:text-gray-700" onClick={() => setAddPopoverIdx(null)}>Cancel</button>
                    </div>
                  )}
                </div>
              { /* <button
                  type="button"
                  className="mt-2 text-xs text-white bg-black/70 px-4 py-1.5 rounded hover:underline cursor-pointer"
                  onClick={generateWithAI}
                >
                  Generate with AI
                </button>*/}
              </div>

              {/* Live preview: always visible on md+, toggle on mobile */}
              <div className={`w-full md:w-72 bg-white/90 border-l-2 border-purple-100 p-4 rounded-xl shadow-md mt-6 md:mt-0 ${showPreview ? '' : 'hidden'} md:block`}>
                <div className="font-bold text-xs mb-3 text-purple-700">Live Preview</div>
                {blocks.map((block, i) => renderBlockPreview(block, i, true))}
              </div>
            </div>
            {/* Popover animation */}
            <style>{`
              @keyframes fadeIn { from { opacity: 0; transform: translateY(10px);} to { opacity: 1; transform: none; } }
              .animate-fadeIn { animation: fadeIn 0.15s cubic-bezier(0.4,0,0.2,1); }
            `}</style>
          </section>

          {/* Draft Save Status */}
          <div className="min-h-[24px]">
            {draftLoading && <div className="mt-2 text-blue-600 font-semibold text-center">Saving draft...</div>}
            {draftError && <div className="mt-2 text-red-600 font-semibold text-center">{draftError}</div>}
            {lastSaved && <div className="mt-2 text-green-600 font-semibold text-center">Draft saved at {lastSaved.toLocaleTimeString()}</div>}
            {error && <div className="mt-2 text-red-600 font-semibold text-center">{error}</div>}
            {success && <div className="mt-2 text-green-600 font-semibold text-center">{success}</div>}
          </div>

          {/* Draft/Publish/Discard Buttons */}
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center mt-4">
            <button
              type="submit"
              className={`w-full sm:w-40 h-12 bg-purple-700 hover:bg-purple-800 text-white px-4 py-2 rounded cursor-pointer text-base font-bold ${loading || draftLoading ? 'opacity-60 cursor-not-allowed' : ''}`}
              disabled={loading || draftLoading}
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
        </div>
      </form>
    );
};

export default AddBlog;
