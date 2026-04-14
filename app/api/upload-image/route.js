
export async function POST(req) {
  try {
    const formData = await req.formData();
    const file = formData.get("file");

    const cloudName = "dcn96dr9n";

    const data = new FormData();
    data.append("file", file);
    data.append("upload_preset", "voucher_upload");
    const controller = new AbortController();
setTimeout(() => controller.abort(), 15000);

    const res = await fetch(
      `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`,
      {
        method: "POST",
        body: data,
        signal: controller.signal,
      }
    );

    const result = await res.json();

    console.log("Cloudinary result:", result);

    if (!result.secure_url) {
      throw new Error("Upload failed");
    }

    return Response.json({
      url: result.secure_url,
    });

  } catch (error) {
    console.error("Upload error:", error);
    return Response.json(
      { error: "Upload failed" },
      { status: 500 }
    );
  }
}