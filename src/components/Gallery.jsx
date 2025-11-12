import "/src/styles/Header.css";
import "/src/styles/Gallery.css";
import { useEffect, useState } from "react";
import { supabase } from "../supabaseClient";

const BUCKET = "e_invite_gallery";

const Gallery = () => {
  const [activeTab, setActiveTab] = useState("my"); // "my" or "all"
  const [images, setImages] = useState([]); // for current tab
  const [files, setFiles] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchImages = async (tab) => {
    const {
      data: { session },
    } = await supabase.auth.getSession();
    if (!session) return;

    const userId = session.user.id;

    let query = supabase.from("user_images").select("id, url, user_id").order("uploaded_at", { ascending: false });

    if (tab === "my") query = query.eq("user_id", userId);

    const { data: imagesData, error } = await query;

    if (error) {
      console.error("Error fetching images:", error.message);
      setImages([]);
      return;
    }

    // Generate signed URLs for private bucket
    const signedUrls = await Promise.all(
      imagesData.map(async (img) => {
        const { data: urlData, error } = await supabase.storage.from(BUCKET).createSignedUrl(img.url, 60); // 60 seconds validity
        return { ...img, signedUrl: urlData?.signedUrl || "" };
      })
    );

    setImages(signedUrls);
  };

  useEffect(() => {
    fetchImages(activeTab);
  }, [activeTab]);

  const handleFileChange = (e) => {
    const selectedFiles = Array.from(e.target.files);
    setFiles(selectedFiles);
  };

  const handleUpload = async () => {
    if (!files.length) return;

    setLoading(true);
    const {
      data: { session },
    } = await supabase.auth.getSession();
    if (!session) {
      alert("You must be logged in to upload files.");
      setLoading(false);
      return;
    }
    const userId = session.user.id;

    for (const file of files) {
      const filePath = `user_${userId}/${Date.now()}-${file.name}`;

      // Upload to storage
      const { data, error: storageError } = await supabase.storage.from(BUCKET).upload(filePath, file);

      if (storageError) {
        console.error("Upload error:", storageError.message);
        continue;
      }

      // Insert into user_images table
      const { error: dbError } = await supabase.from("user_images").insert([{ user_id: userId, url: filePath }]);

      if (dbError) console.error("DB insert error:", dbError.message);
    }

    setFiles([]);
    fetchImages(activeTab);
    setLoading(false);
  };

  const handleRemove = async (img) => {
    const { error: dbError } = await supabase.from("user_images").delete().eq("id", img.id);
    if (dbError) {
      console.error("Delete DB error:", dbError.message);
      return;
    }

    const { error: storageError } = await supabase.storage.from(BUCKET).remove([img.url]);
    if (storageError) console.error("Delete storage error:", storageError.message);

    fetchImages(activeTab);
  };

  return (
    <div className="gallery-container header">
      <h2 className="gallery-title mb-4">Gallery</h2>

      <div className="tabs">
        <button className={activeTab === "my" ? "active" : ""} onClick={() => setActiveTab("my")}>
          My Uploads
        </button>
        <button className={activeTab === "all" ? "active" : ""} onClick={() => setActiveTab("all")}>
          All Uploads
        </button>
      </div>

      {activeTab === "my" && (
        <div className="upload-section">
          <label className="upload-box">
            <input type="file" multiple accept="image/*" onChange={handleFileChange} />
            <span>Click or Drag & Drop to Upload</span>
          </label>
          {files.length > 0 && (
            <button className="btn-upload" onClick={handleUpload} disabled={loading}>
              {loading ? "Uploading..." : `Upload ${files.length} file(s)`}
            </button>
          )}
        </div>
      )}

      <div className="preview-grid">
        {images.map((img) => (
          <div key={img.id} className="preview-item">
            <img src={img.signedUrl} alt="gallery" />
            {activeTab === "my" && (
              <button className="remove-btn" onClick={() => handleRemove(img)}>
                ✕
              </button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Gallery;
