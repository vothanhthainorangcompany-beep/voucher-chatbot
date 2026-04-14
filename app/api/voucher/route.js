export async function POST(req) {
  try {
    const body = await req.json();
    // 👇 LẤY DỮ LIỆU KHÁCH HÀNG
    const name = body.customer_name;
    const phone = body.customer_phone;
    const branch = body.branch_scope; // 🔥 FIX Ở ĐÂY
    const token = body.voucher_token;
    const image = body.image || body.image_ref || "";
    const email = body.customer_email || body.email || "";
    const life4CutLink = body.life4cut_link || body.life4CutLink || "";
    const employeeId = body.employee_id || "";

    // ✅ THÊM NGAY DƯỚI DÒNG TRÊN
    console.log("🚀 IMAGE NHẬN TỪ FRONTEND:", image);
    console.log("DATA GỬI:", {
      name,
      phone,
      branch,
      token,
      image,
      email, // ✅ THÊM
      life4CutLink, // ✅ THÊM
    });

    const appsScriptUrl =
      "https://script.google.com/macros/s/AKfycbwMOqvecrCR7XXg-14Xwy46rwTfKddaIBZSah1Zaek-kqxMf5ebhBzStnhrLPfhOsOr/exec";

    const response = await fetch(appsScriptUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        action: body.action || "", // ✅ QUAN TRỌNG NHẤT
        sender_id: phone,
        customer_name: name,
        customer_phone: phone,
        branch_scope: branch,
        voucher_token: token, // ✅ FIX Ở ĐÂY
        image_ref: image,
        customer_email: email,
        life4cut_link: life4CutLink,
        debug_link: life4CutLink,
        employee_id: employeeId, // ✅ THÊM CHÍNH XÁC Ở ĐÂY
      }),
      cache: "no-store",
    });

    const text = await response.text();

    // 🔥 DEBUG RẤT QUAN TRỌNG
    console.log("📥 RESPONSE TỪ APPS SCRIPT:", text);

    if (!response.ok) {
      return Response.json(
        {
          ok: false,
          message: `Apps Script lỗi HTTP ${response.status}`,
          raw: text,
        },
        { status: 500 },
      );
    }

    // 🔥 FIX JSON PARSE AN TOÀN
    let parsed;

    try {
      parsed = JSON.parse(text);
    } catch {
      console.log("❌ JSON parse lỗi:", text);
      return Response.json({
        ok: false,
        message: "Apps Script trả về không phải JSON",
        raw: text,
      });
    }

    return Response.json(parsed);
  } catch (error) {
    return Response.json(
      {
        ok: false,
        message: error?.message || "Proxy error",
      },
      { status: 500 },
    );
  }
}
