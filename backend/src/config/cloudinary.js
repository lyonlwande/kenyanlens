import {v2 as cloudinary} from "cloudinary";
import { config } from "dotenv";
import fs from "fs";
import path from "path";

// Load environment variables
config();

// Configure Cloudinary with credentials
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});

/**
 * Enhanced file upload function for Cloudinary
 * Handles various file types and returns comprehensive metadata
 * 
 * @param {string} filePath - Path to the file to upload
 * @param {Object} options - Upload options
 * @returns {Promise<Object>} - Upload result with enhanced metadata
 */
export const uploadToCloudinary = async (filePath, options = {}) => {
  try {
    // Determine file type from mimetype or file extension if not provided
    const fileType = options.fileType || determineFileType(filePath, options.mimetype);

    // Enforce file size limits: image ≤ 10MB, video ≤ 100MB
    const stats = fs.statSync(filePath);
    if (fileType === 'image' && stats.size > 10 * 1024 * 1024) {
      throw new Error('Each image must be ≤ 10MB');
    }
    if (fileType === 'video' && stats.size > 100 * 1024 * 1024) {
      throw new Error('Each video must be ≤ 100MB');
    }

    // Set appropriate resource type based on file type
    let resourceType = "auto";
    if (fileType === "document") resourceType = "raw";
    if (options.resource_type) resourceType = options.resource_type;

    // Determine appropriate folder structure
    const folder = options.folder || `${fileType}s`;

    // Set up upload options
    const uploadOptions = {
      resource_type: resourceType,
      folder: folder,
      ...options,
    };

    // Add specific options based on file type
    if (fileType === "image") {
      // Add image-specific options if not provided
      if (!uploadOptions.transformation) {
        uploadOptions.transformation = [
          { quality: "auto", fetch_format: "auto" }
        ];
      }
    } else if (fileType === "video") {
      // Add video-specific options if not provided
      if (!uploadOptions.eager) {
        uploadOptions.eager = [
          { format: "mp4", quality: "auto" }
        ];
      }
    }

    const result = await cloudinary.uploader.upload(filePath, uploadOptions);

    // Enhance the result with additional metadata
    const enhancedResult = enhanceUploadResult(result, fileType);

    // Clean up temporary file if requested
    if (options.deleteAfterUpload && fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    }

    return enhancedResult;
  } catch (error) {
    console.error("Error uploading to Cloudinary:", error);
    throw new Error(`Cloudinary upload failed: ${error.message}`);
  }
};

/**
 * Determine file type based on file path or mimetype
 * 
 * @param {string} filePath - Path to the file
 * @param {string} mimetype - Optional mimetype
 * @returns {string} - Determined file type
 */
const determineFileType = (filePath, mimetype) => {
  // If mimetype is provided, use it to determine file type
  if (mimetype) {
    if (mimetype.startsWith("image/")) return "image";
    if (mimetype.startsWith("video/")) return "video";
    if (mimetype.startsWith("audio/")) return "audio";
    if (mimetype === "application/pdf" || 
        mimetype.startsWith("application/msword") || 
        mimetype.startsWith("application/vnd.openxmlformats-officedocument")) {
      return "document";
    }
  }
  
  // Otherwise use file extension
  const ext = path.extname(filePath).toLowerCase();
  
  // Image extensions
  if ([".jpg", ".jpeg", ".png", ".gif", ".webp", ".svg", ".bmp"].includes(ext)) {
    return "image";
  }
  
  // Video extensions
  if ([".mp4", ".mov", ".avi", ".wmv", ".flv", ".webm", ".mkv"].includes(ext)) {
    return "video";
  }
  
  // Audio extensions
  if ([".mp3", ".wav", ".ogg", ".m4a", ".flac", ".aac"].includes(ext)) {
    return "audio";
  }
  
  // Document extensions
  if ([".pdf", ".doc", ".docx", ".xls", ".xlsx", ".ppt", ".pptx", ".txt"].includes(ext)) {
    return "document";
  }
  
  // Default to other
  return "other";
};

/**
 * Enhance the upload result with additional metadata
 * 
 * @param {Object} result - Cloudinary upload result
 * @param {string} fileType - Type of file uploaded
 * @returns {Object} - Enhanced result with additional metadata
 */
const enhanceUploadResult = (result, fileType) => {
  const enhanced = {
    ...result,
    fileType,
    metadata: {
      publicId: result.public_id,
      format: result.format,
      resourceType: result.resource_type,
      size: result.bytes,
      createdAt: result.created_at,
    }
  };
  
  // Add type-specific metadata
  if (fileType === "image") {
    enhanced.metadata.dimensions = {
      width: result.width,
      height: result.height,
      aspectRatio: result.width / result.height,
    };
    enhanced.thumbnailUrl = result.secure_url.replace("/upload/", "/upload/c_thumb,w_200,h_200/");
  } else if (fileType === "video") {
    enhanced.metadata.dimensions = {
      width: result.width,
      height: result.height,
      aspectRatio: result.width / result.height,
    };
    enhanced.metadata.duration = result.duration;
    enhanced.thumbnailUrl = result.secure_url.replace("/upload/", "/upload/c_thumb,w_200,h_200/");
  } else if (fileType === "audio") {
    enhanced.metadata.duration = result.duration;
  }
  
  return enhanced;
};

/**
 * Delete a file from Cloudinary
 * 
 * @param {string} publicId - Public ID of the file to delete
 * @param {Object} options - Delete options
 * @returns {Promise<Object>} - Deletion result
 */
export const deleteFromCloudinary = async (publicId, options = {}) => {
  try {
    const resourceType = options.resource_type || "image";
    const result = await cloudinary.uploader.destroy(publicId, {
      resource_type: resourceType,
      ...options,
    });
    return result;
  } catch (error) {
    console.error("Error deleting from Cloudinary:", error);
    throw new Error(`Cloudinary deletion failed: ${error.message}`);
  }
};

/**
 * Generate a signed URL for a Cloudinary resource
 * Useful for temporary access to private resources
 * 
 * @param {string} publicId - Public ID of the resource
 * @param {Object} options - Signing options
 * @returns {string} - Signed URL
 */
export const generateSignedUrl = (publicId, options = {}) => {
  const defaultOptions = {
    expiration: Math.floor(Date.now() / 1000) + 3600, // 1 hour from now
    ...options,
  };
  
  return cloudinary.url(publicId, defaultOptions);
};

/**
 * Get detailed metadata for a Cloudinary resource
 * @param {string} publicId - Public ID of the resource
 * @param {string} resourceType - Resource type (image, video, raw, etc.)
 * @returns {Promise<Object>} - Resource metadata
 */
export const getCloudinaryResourceMetadata = async (publicId, resourceType = "image") => {
  try {
    const result = await cloudinary.api.resource(publicId, { resource_type: resourceType });
    return result;
  } catch (error) {
    console.error("Error fetching Cloudinary metadata:", error);
    throw new Error(`Cloudinary metadata fetch failed: ${error.message}`);
  }
};

/**
 * Get media duration (for video/audio)
 * @param {string} publicId - Public ID of the resource
 * @param {string} resourceType - Resource type (video/audio)
 * @returns {Promise<number>} - Duration in seconds (0 if not found)
 */
export const getMediaDuration = async (publicId, resourceType = "video") => {
  const metadata = await getCloudinaryResourceMetadata(publicId, resourceType);
  return metadata.duration || 0;
};

/**
 * Get file size in bytes
 * @param {string} publicId - Public ID of the resource
 * @param {string} resourceType - Resource type (image, video, etc.)
 * @returns {Promise<number>} - File size in bytes (0 if not found)
 */
export const getFileSize = async (publicId, resourceType = "image") => {
  const metadata = await getCloudinaryResourceMetadata(publicId, resourceType);
  return metadata.bytes || 0;
};

/**
 * List all resources in a Cloudinary folder
 * @param {string} folder - Folder path
 * @param {string} resourceType - Resource type (image, video, etc.)
 * @returns {Promise<Array>} - List of resources
 */
export const listResourcesInFolder = async (folder, resourceType = "image") => {
  try {
    const result = await cloudinary.api.resources({ type: "upload", prefix: folder, resource_type: resourceType });
    return result.resources;
  } catch (error) {
    console.error("Error listing Cloudinary resources:", error);
    throw new Error(`Cloudinary list resources failed: ${error.message}`);
  }
};

/**
 * Check if a Cloudinary resource exists
 * @param {string} publicId - Public ID of the resource
 * @param {string} resourceType - Resource type (image, video, etc.)
 * @returns {Promise<boolean>} - True if exists, false otherwise
 */
export const cloudinaryResourceExists = async (publicId, resourceType = "image") => {
  try {
    await cloudinary.api.resource(publicId, { resource_type: resourceType });
    return true;
  } catch {
    return false;
  }
};

// Export the Cloudinary instance as default
export default cloudinary;
