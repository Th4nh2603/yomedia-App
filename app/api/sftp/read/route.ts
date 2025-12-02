import { NextRequest, NextResponse } from "next/server";
import SftpClient from "ssh2-sftp-client";

export const runtime = "nodejs"; // dùng Node runtime

export async function GET(req: NextRequest) {
  const url = new URL(req.url);
  const mode = (url.searchParams.get("mode") as "demo" | "media") || "demo";
  const path = url.searchParams.get("path");

  if (!path) {
    return NextResponse.json(
      { success: false, error: "Missing path" },
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

  const sftp = new SftpClient();

  try {
    await sftp.connect(config);

    const fileData = (await sftp.get(path)) as Buffer;

    // 1. Check đuôi file
    const ext = path.split(".").pop()?.toLowerCase();
    const imageExts = ["png", "jpg", "jpeg", "gif", "webp", "svg"];

    if (ext && imageExts.includes(ext)) {
      // 👉 Buffer -> Uint8Array cho hợp type BodyInit
      const uint8 = new Uint8Array(fileData);

      let contentType = "image/*";
      if (ext === "png") contentType = "image/png";
      else if (ext === "jpg" || ext === "jpeg") contentType = "image/jpeg";
      else if (ext === "gif") contentType = "image/gif";
      else if (ext === "webp") contentType = "image/webp";
      else if (ext === "svg") contentType = "image/svg+xml";

      return new NextResponse(uint8, {
        status: 200,
        headers: {
          "Content-Type": contentType,
          "Content-Length": uint8.byteLength.toString(),
        },
      });
    }
    // 👉 Không phải image → text như cũ
    const content = fileData.toString("utf8");
    return NextResponse.json({ success: true, content });
  } catch (err: any) {
    console.error("SFTP read error:", err);
    return NextResponse.json(
      { success: false, error: err.message || "Unknown error" },
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
