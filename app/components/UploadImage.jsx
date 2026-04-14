"use client";
import { useState } from "react";
import axios from "axios";
import { validateLife4CutUrl } from "@/app/lib/validateLife4Cut";

export default function UploadImage() {
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState("");

  // chọn ảnh
  const handleChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setImage(file);
    setPreview(URL.createObjectURL(file));
  };

  // upload lên cloudinary
  const handleUpload = async () => {
    if (!image) {
      alert("Chọn ảnh trước");
      return;
    }

    try {
      // 1. upload ảnh qua API của bạn
      const formData = new FormData();
      formData.append("file", image);

      const uploadRes = await fetch("/api/upload-image", {
        method: "POST",
        body: formData,
      });

      const { url } = await uploadRes.json();

      console.log("Ảnh Cloudinary:", url);
      // 🔐 VALIDATE LIFE4CUT
      const result = validateLife4CutUrl(url);

      if (!result.ok) {
        alert(result.message);
        return; // ❌ DỪNG, KHÔNG chạy code phía dưới
      }

      // 2. GỬI SANG API VOUCHER (KHÔNG PHÁ CODE CŨ)
      await fetch("/api/voucher", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          // 👉 giữ nguyên data cũ nếu bạn có form
          name: "Test",
          phone: "0123456789",
          branch: "B001",

          // 👉 thêm dòng này (optional)
          image: url,
        }),
      });

      alert("Xong toàn bộ flow!");
    } catch (err) {
      console.error(err);
      alert("Lỗi!");
    }
  };
}
