import React, { useRef, useState } from "react";
import { API } from "../lib/api";
import { Button } from "./ui/button";
import { DialogClose } from "./ui/dialog";
import { Input } from "./ui/input";
import { Label } from "./ui/label";

function isValidVideoUrl(url: string) {
  // Allow YouTube and Vimeo links (basic validation)
  const ytRegex = /^(https?:\/\/)?(www\.)?(youtube\.com|youtu\.be)\/(watch\?v=)?[\w-]{11}($|&)?/;
  const vimeoRegex = /^(https?:\/\/)?(www\.)?vimeo\.com\/[0-9]+/;
  return ytRegex.test(url) || vimeoRegex.test(url);
}

export default function EditProductContentsDialog({ product, onUpdated }: { product: any, onUpdated: (p: any) => void }) {
  // accept either new shape (product.images / product.video_links)
  // or legacy shape (product.contents with type/data)
  const initialImages = product.images ?? product.contents?.filter((c: any) => c.type === "image")?.map((c: any) => c.data) ?? [];
  const initialVideos = product.video_links ?? product.contents?.filter((c: any) => c.type === "video")?.map((c: any) => c.data) ?? [];
  const [images, setImages] = useState<string[]>(initialImages);
  const [videos, setVideos] = useState<string[]>(initialVideos);
  const [newVideo, setNewVideo] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const closeBtnRef = useRef<HTMLButtonElement | null>(null);

  function handleImageUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        setImages((prev) => [...prev, reader.result as string]);
      };
      reader.readAsDataURL(file);
    }
  }

  function handleAddVideo() {
    if (!isValidVideoUrl(newVideo)) {
      setError("Invalid video link (YouTube or Vimeo only)");
      return;
    }
    setVideos((prev) => [...prev, newVideo]);
    setNewVideo("");
    setError("");
  }

  async function handleSubmit() {
    setLoading(true);
    setError("");
    try {
      // Build payload in the requested format: { images: string[], video_links: string[] }
      const payload = {
        images: images.filter((img) => typeof img === "string" && img.trim().length > 0),
        video_links: videos.filter((v) => typeof v === "string" && v.trim().length > 0),
      };

      if ((!payload.images || payload.images.length === 0) && (!payload.video_links || payload.video_links.length === 0)) {
        setError("Please provide at least one image or video link.");
        setLoading(false);
        return;
      }

      const updated = await API.addProductMedia(product.id, payload);
      // Backend may return updated product or partial response; try to call onUpdated if product returned
      if (updated) onUpdated(updated);
      // programmatically close the parent Radix Dialog by clicking the hidden DialogClose button
      try {
        closeBtnRef.current?.click();
      } catch (e) {
        // ignore
      }
    } catch (e: any) {
      setError(e.message || "Failed to update product media");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="space-y-4">
      {/* hidden DialogClose to allow programmatic close from inside the dialog */}
      <DialogClose asChild>
        <button ref={closeBtnRef} style={{ display: "none" }} aria-hidden>
          close
        </button>
      </DialogClose>
      <div>
        <Label>Images</Label>
        <div className="flex flex-wrap gap-2 mb-2">
          {images.map((img, i) => (
            <img key={i} src={img} alt="img" className="w-16 h-16 object-cover rounded border" />
          ))}
        </div>
        <Input type="file" accept="image/*" onChange={handleImageUpload} />
      </div>
      <div>
        <Label>YouTube Videos</Label>
        <div className="flex flex-col gap-2 mb-2">
          {videos.map((vid, i) => (
            <div key={i} className="flex items-center gap-2">
              <a href={vid} target="_blank" rel="noopener noreferrer" className="text-blue-600 underline">{vid}</a>
            </div>
          ))}
        </div>
        <div className="flex gap-2">
          <Input value={newVideo} onChange={e => setNewVideo(e.target.value)} placeholder="YouTube link" />
          <Button type="button" onClick={handleAddVideo} disabled={!newVideo}>Add</Button>
        </div>
      </div>
      {error && <div className="text-red-600 text-sm">{error}</div>}
      <Button onClick={handleSubmit} disabled={loading} className="w-full bg-red-600 text-white">{loading ? "Saving..." : "Save Changes"}</Button>
    </div>
  );
}
