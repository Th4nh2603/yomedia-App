import { NextResponse } from "next/server";
import SftpClient from "ssh2-sftp-client";

// 🔴 RẤT QUAN TRỌNG: bắt buộc dùng Node runtime, không phải Edge
export const runtime = "nodejs";

export async function GET(req: Request) {
  const url = new URL(req.url);
  const mode = (url.searchParams.get("mode") as "demo" | "media") || "demo";
  const path = url.searchParams.get("path") || ".";

  // ✅ chọn config theo mode
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

  const sftp = new SftpClient();

  try {
    await sftp.connect(config);

    const files = await sftp.list(path); // path đang là "." từ FE
    return NextResponse.json({ success: true, files });
  } catch (err: any) {
    console.error("💥 SFTP List Error:", err);
    return NextResponse.json(
      {
        success: false,
        error: err?.message || "Unknown SFTP error",
      },
      { status: 500 }
    );
  } finally {
    try {
      await sftp.end();
    } catch {
      // ignore
    }
  }
}
