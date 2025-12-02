import { NextRequest, NextResponse } from "next/server";
import Client from "ssh2-sftp-client";

export const runtime = "nodejs";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const path = typeof body.path === "string" ? body.path : "";
    const content = typeof body.content === "string" ? body.content : "";
    const mode = (body.mode as "demo" | "media") || "demo";

    if (!path) {
      return NextResponse.json(
        { success: false, error: "Missing path" },
        { status: 400 }
      );
    }

    const sftp = new Client();

    // 🔧 chọn config SFTP theo mode
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

    // ✍️ ghi file (content là string UTF-8)
    const buffer = Buffer.from(content ?? "", "utf-8");
    await sftp.put(buffer, path);

    await sftp.end();

    return NextResponse.json({ success: true });
  } catch (err: any) {
    console.error("SFTP write error:", err);
    return NextResponse.json(
      { success: false, error: err.message || "Write failed" },
      { status: 500 }
    );
  }
}
