import { NextRequest, NextResponse } from "next/server";
import Client from "ssh2-sftp-client";

export async function GET(req: NextRequest) {
  const sftp = new Client();

  try {
    const url = new URL(req.url);

    const mode = (url.searchParams.get("mode") as "demo" | "media") || "demo";
    const path = url.searchParams.get("path") || ".";
    const fileName = url.searchParams.get("fileName") || "";

    if (!fileName) {
      return NextResponse.json(
        { success: false, error: "fileName is required", exists: false },
        { status: 400 }
      );
    }

    const config =
      mode === "media"
        ? {
            host: process.env.SFTP_media_HOST,
            port: Number(process.env.SFTP_media_PORT),
            username: process.env.SFTP_media_USER,
            password: process.env.SFTP_media_PASS,
          }
        : {
            host: process.env.SFTP_demo_HOST,
            port: Number(process.env.SFTP_demo_PORT),
            username: process.env.SFTP_demo_USER,
            password: process.env.SFTP_demo_PASS,
          };

    await sftp.connect(config);

    // 🔹 Lấy danh sách file của thư mục hiện tại
    const list = await sftp.list(path);

    await sftp.end();

    // 🔹 Kiểm tra có file trùng tên không
    const exists = list.some((item) => item.name === fileName);

    return NextResponse.json({ success: true, exists });
  } catch (err: any) {
    console.error("SFTP CHECK ERROR:", err);
    try {
      await sftp.end();
    } catch {}
    return NextResponse.json(
      { success: false, error: err.message ?? "Unknown error", exists: false },
      { status: 500 }
    );
  }
}
