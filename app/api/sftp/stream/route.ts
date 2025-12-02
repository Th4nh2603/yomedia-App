import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import Client from "ssh2-sftp-client";

export const runtime = "nodejs";

function getMimeType(path: string): string {
  if (path.endsWith(".mp4")) return "video/mp4";
  if (path.endsWith(".webm")) return "video/webm";
  if (path.endsWith(".jpg") || path.endsWith(".jpeg")) return "image/jpeg";
  if (path.endsWith(".png")) return "image/png";
  if (path.endsWith(".gif")) return "image/gif";
  if (path.endsWith(".html")) return "text/html; charset=utf-8";
  if (path.endsWith(".js")) return "text/javascript; charset=utf-8";
  if (path.endsWith(".css")) return "text/css; charset=utf-8";
  return "application/octet-stream";
}

export async function GET(req: NextRequest) {
  const url = new URL(req.url);
  const path = url.searchParams.get("path");
  const mode = (url.searchParams.get("mode") as "demo" | "media") || "demo";

  if (!path) {
    return NextResponse.json(
      { success: false, error: "Missing path" },
      { status: 400 }
    );
  }

  const sftp = new Client();

  try {
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

    // 👉 Ép luôn về Buffer cho đơn giản
    const fileBuffer = (await sftp.get(path)) as Buffer;

    await sftp.end();

    // 👉 Chuyển Buffer -> Uint8Array và CAST sang BodyInit
    const body = new Uint8Array(fileBuffer) as unknown as BodyInit;

    return new Response(body, {
      status: 200,
      headers: {
        "Content-Type": getMimeType(path),
        "Cache-Control": "no-cache",
      },
    });
  } catch (err: any) {
    console.error("SFTP get error:", err);
    try {
      await sftp.end();
    } catch {}
    return NextResponse.json(
      { success: false, error: err.message || String(err) },
      { status: 500 }
    );
  }
}
