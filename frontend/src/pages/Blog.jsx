import React, { useEffect } from "react";
import { useParams } from "react-router-dom";
import useBlogStore from "../zustandStores/blogStore";
import Navbar from "../components/Navbar";
import GradientCircle from "../components/GradientCircle";
import Moment from "moment";
import { FaFacebook, FaTwitter, FaPinterest, FaLinkedin } from "react-icons/fa";
import Footer from "../components/Footer";
import Loader from "../components/Loader";
const Blog = () => {
  const { id } = useParams();
  const { selectedBlog, loading, error, fetchBlogById } = useBlogStore();
console.log("selectedBlog", selectedBlog);
  useEffect(() => {
    if (id) fetchBlogById(id);
    // eslint-disable-next-line
  }, [id]);

  if (loading) {
    return <Loader />;
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen">
        <Navbar />
        <div className="text-red-600 text-lg font-semibold mt-10">{error}</div>
        <Footer />
      </div>
    );
  }

  if (!selectedBlog) {
    return <Loader />;
  }

  const data = selectedBlog;
  

  // Recursive content block renderer
  const renderBlock = (block, idx) => {
    // Destructure all possible fields for clarity
    const {
      type, id, text, level, style, items, content, tags, keywords, metadata, caption, provider, transcript, embedType, embedConfig, title, filePath, alt, url
    } = block;
    switch (type) {
      case "heading":
        return React.createElement(
          `h${level && level >= 1 && level <= 6 ? level : 2}`,
          { key: id || idx, className: "mt-6 mb-2 font-bold" },
          text
        );
      case "subheading":
        return <h3 key={id || idx} className="mt-4 mb-2 font-semibold text-lg">{text}</h3>;
      case "paragraph":
        return <p key={id || idx} className="mb-4">{text}</p>;
      case "list":
        return style === "number" ? (
          <ol key={id || idx} className="list-decimal ml-6 mb-4">{items && items.map((item, i) => <li key={i}>{typeof item === "object" ? renderBlock(item, i) : item}</li>)}</ol>
        ) : (
          <ul key={id || idx} className="list-disc ml-6 mb-4">{items && items.map((item, i) => <li key={i}>{typeof item === "object" ? renderBlock(item, i) : item}</li>)}</ul>
        );
      case "image":
        return (
          <figure key={id || idx} className="mb-6 flex flex-col items-center">
            <img src={filePath || url} alt={alt || "Image"} className="rounded-lg max-h-80 mb-2" />
            {caption && <figcaption className="text-xs text-gray-500">{caption}</figcaption>}
            {provider && <span className="text-xs text-gray-400">Provider: {provider}</span>}
            {transcript && <details className="text-xs text-gray-400"><summary>Transcript</summary>{transcript}</details>}
            {Array.isArray(tags) && tags.length > 0 && (
              <div className="flex flex-wrap gap-1 mt-1">{tags.map((tag, i) => <span key={i} className="bg-purple-100 text-purple-700 rounded px-2 py-0.5 text-xs">{tag}</span>)}</div>
            )}
            {Array.isArray(keywords) && keywords.length > 0 && (
              <div className="text-xs text-gray-400 mt-1">Keywords: {keywords.join(", ")}</div>
            )}
            {metadata && <div className="text-xs text-gray-400 mt-1">Meta: {JSON.stringify(metadata)}</div>}
          </figure>
        );
      case "media":
        return (
          <figure key={id || idx} className="mb-6 flex flex-col items-center">
            <video src={filePath || url} controls className="rounded-lg max-h-80 mb-2" />
            {caption && <figcaption className="text-xs text-gray-500">{caption}</figcaption>}
            {provider && <span className="text-xs text-gray-400">Provider: {provider}</span>}
            {transcript && <details className="text-xs text-gray-400"><summary>Transcript</summary>{transcript}</details>}
            {Array.isArray(tags) && tags.length > 0 && (
              <div className="flex flex-wrap gap-1 mt-1">{tags.map((tag, i) => <span key={i} className="bg-purple-100 text-purple-700 rounded px-2 py-0.5 text-xs">{tag}</span>)}</div>
            )}
            {Array.isArray(keywords) && keywords.length > 0 && (
              <div className="text-xs text-gray-400 mt-1">Keywords: {keywords.join(", ")}</div>
            )}
            {metadata && <div className="text-xs text-gray-400 mt-1">Meta: {JSON.stringify(metadata)}</div>}
          </figure>
        );
      case "quote":
        return <blockquote key={id || idx} className="border-l-4 border-purple-400 pl-4 italic text-gray-700 mb-4">{text}</blockquote>;
      case "code":
        return <pre key={id || idx} className="bg-gray-100 rounded p-2 mb-4"><code>{text}</code></pre>;
      case "embed":
        if (embedType === "youtube" && embedConfig?.videoId) {
          return (
            <div key={id || idx} className="mb-6 flex flex-col items-center">
              <iframe
                width="560"
                height="315"
                src={`https://www.youtube.com/embed/${embedConfig.videoId}`}
                title="YouTube video player"
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                className="rounded-lg"
              ></iframe>
              {caption && <span className="text-xs text-gray-500">{caption}</span>}
            </div>
          );
        }
        return <div key={id || idx} className="mb-6"><span className="text-xs text-gray-500">Embedded content</span></div>;
      case "widget":
        return <div key={id || idx} className="mb-6"><span className="text-xs text-gray-500">Widget: {embedType || "Custom"}</span></div>;
      case "section":
        return (
          <section key={id || idx} className="mb-6">
            {title && <h4 className="font-semibold mb-2">{title}</h4>}
            {Array.isArray(content) && content.map((sub, i) =>
              typeof sub === "object" ? renderBlock(sub, i) : <div key={i}>{sub}</div>
            )}
            {Array.isArray(tags) && tags.length > 0 && (
              <div className="flex flex-wrap gap-1 mt-1">{tags.map((tag, i) => <span key={i} className="bg-purple-100 text-purple-700 rounded px-2 py-0.5 text-xs">{tag}</span>)}</div>
            )}
            {Array.isArray(keywords) && keywords.length > 0 && (
              <div className="text-xs text-gray-400 mt-1">Keywords: {keywords.join(", ")}</div>
            )}
            {metadata && <div className="text-xs text-gray-400 mt-1">Meta: {JSON.stringify(metadata)}</div>}
          </section>
        );
      default:
        return <div key={id || idx} className="mb-4">{text || JSON.stringify(block)}</div>;
    }
  };

  return (
    <div className="relative min-h-screen flex flex-col bg-white">
      <Navbar />
      <main className="flex-1 flex flex-col items-center px-4 sm:px-8 md:px-16 lg:px-32 xl:px-48 pt-20 pb-12 w-full">
        {/* Header Section */}
        <section className="w-full max-w-4xl text-center mb-8 text-gray-600">
          <div className="flex flex-col items-center">
            {data.thumbnail && (
              <img src={data.thumbnail} alt={data.title} className="rounded-2xl w-full max-h-96 object-cover mb-4 shadow" />
            )}
            <h1 className="text-3xl sm:text-5xl font-bold text-gray-900 mb-2">{data.title}</h1>
            {data.description && <p className="text-base sm:text-lg text-gray-700 mb-2">{data.description}</p>}
            {data.category && <span className="inline-block px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-xs font-semibold mb-2">{data.category}</span>}
            {data.isFeatured && <span className="inline-block px-3 py-1 bg-yellow-100 text-yellow-700 rounded-full text-xs font-semibold mb-2">Featured</span>}
            <div className="flex flex-wrap justify-center gap-2 mb-2">
              {Array.isArray(data.tags) && data.tags.length > 0 && data.tags.map((tag, idx) => (
                <span key={tag._id || idx} className="px-2 py-1 bg-purple-200 text-purple-800 rounded text-xs">{tag.name || tag}</span>
              ))}
            </div>
         
            <div className="flex items-center justify-center gap-4 text-xs text-gray-400 mb-2">
              <span>Views: {data.viewsCount}</span>
              <span>Shares: {data.sharesCount}</span>
              <span>Likes: {Array.isArray(data.likes) ? data.likes.length : 0}</span>
              <span>Status: {data.status}</span>
            </div>
            <div className="flex items-center justify-center gap-2 mb-2">
              <span className="text-xs text-gray-500">Published: {data.publishedAt ? Moment(data.publishedAt).format("MMMM Do YYYY") : "-"}</span>
              <span className="text-xs text-gray-500">Created: {data.createdAt ? Moment(data.createdAt).format("MMMM Do YYYY") : "-"}</span>
              <span className="text-xs text-gray-500">Updated: {data.updatedAt ? Moment(data.updatedAt).format("MMMM Do YYYY") : "-"}</span>
            </div>
            {data.author && (
              <div className="mt-2 text-xs text-gray-600">By {typeof data.author === "object" ? data.author.name : data.author}</div>
            )}
          </div>
        </section>
        {/* Gallery Section */}
        {Array.isArray(data.images) && data.images.length > 0 && (
          <section className="w-full max-w-3xl mb-8">
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {data.images.map((img, idx) => (
                <img key={idx} src={img} alt={`Gallery ${idx + 1}`} className="rounded-lg w-full h-40 object-cover shadow" />
              ))}
            </div>
          </section>
        )}
        {/* Content Section */}
        <section className="w-full max-w-3xl text-left prose prose-lg prose-purple break-words mb-8">
          {Array.isArray(data.content) && data.content.length > 0 ? (
            data.content.map((block, idx) => renderBlock(block, idx))
          ) : (
            <div>{data.description}</div>
          )}
        </section>
        {/* Social Share Buttons */}
        <section className="mt-8 w-full max-w-3xl mx-auto flex items-center gap-4">
          <p className="font-medium text-gray-800">Share this article:</p>
          <div className="flex items-center space-x-4">
            <a href="#" className="text-blue-600 hover:text-blue-800"><FaFacebook size={20} /></a>
            <a href="#" className="text-blue-400 hover:text-blue-600"><FaTwitter size={20} /></a>
            <a href="#" className="text-red-600 hover:text-red-800"><FaPinterest size={20} /></a>
            <a href="#" className="text-gray-800 hover:text-gray-900"><FaLinkedin size={20} /></a>
          </div>
        </section>
      </main>
      {/* Footer outside main, full width */}
      <div className="w-full">
        <Footer />
      </div>
    </div>
  );
};

export default Blog;
