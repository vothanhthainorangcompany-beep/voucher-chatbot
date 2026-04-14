export function validateLife4CutUrl(url) {
  if (!url) {
    return {
      ok: false,
      message: "Thiếu link Life4Cut",
    };
  }

  try {
    const parsed = new URL(url);
    const params = parsed.searchParams;
    const folderPath = params.get("folderPath"); // ✅ THÊM MỚI
    console.log("🔥 folderPath:", folderPath); // ✅ debug
    // ❗ nếu không có folderPath → fail luôn
    if (!folderPath) {
      return {
        ok: false,
        message: "Thiếu folderPath trong link Life4Cut",
      };
    }

    // ✅ tách folderPath
    const parts = folderPath.split("/").filter(Boolean);

    console.log("🔥 parts:", parts);

    // ❗ kiểm tra cấu trúc
    if (parts.length < 3) {
      return {
        ok: false,
        message: "folderPath không đúng cấu trúc",
      };
    }

    // ✅ lấy dữ liệu
    const type = parts[0];
    const date = parts[1];
    const storeId = parts[2];

    console.log("🔥 type:", type);
    console.log("🔥 date:", date);
    console.log("🔥 storeId:", storeId);

    // ❗ check type
    if (type !== "QRimage") {
      return {
        ok: false,
        message: "folderPath không đúng QRimage",
      };
    }

    // ❗ check date
    if (!/^\d{8}$/.test(date)) {
      return {
        ok: false,
        message: "Ngày không hợp lệ",
      };
    }
    // ✅ CHO PHÉP life4cut + cloudinary
    const isValid =
      parsed.hostname.includes("life4cut.net") ||
      parsed.hostname.includes("cloudinary.com");

    if (!isValid) {
      return {
        ok: false,
        message: "Link không phải Life4Cut hợp lệ",
      };
    }

    return {
  ok: true,
  imageId: `${date}_${storeId}`, // ✅ QUAN TRỌNG
};
  } catch {
    return {
      ok: false,
      message: "Link không hợp lệ",
    };
  }
}
