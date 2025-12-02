import { NextRequest, NextResponse } from "next/server";
import Client from "ssh2-sftp-client";

export const runtime = "nodejs";

export async function POST(req: NextRequest) {
  const url = new URL(req.url);
  const mode = (url.searchParams.get("mode") as "demo" | "media") || "demo";

  try {
    const body = await req.json();
    const path = typeof body.path === "string" ? body.path : ".";
    const oldName = body.oldName as string;
    const newName = body.newName as string;

    if (!oldName || !newName) {
      return NextResponse.json(
        { success: false, error: "oldName và newName là bắt buộc" },
        { status: 400 }
      );
    }

    if (oldName === newName) {
      return NextResponse.json(
        { success: false, error: "Tên mới phải khác tên cũ" },
        { status: 400 }
      );
    }

    const sftp = new Client();

    // 🔧 chọn config theo mode
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

    const basePath = path && path !== "." ? path : ".";

    const oldFullPath =
      basePath === "." ? `./${oldName}` : `${basePath}/${oldName}`;
    const newFullPath =
      basePath === "." ? `./${newName}` : `${basePath}/${newName}`;

    // 🔍 Nếu file/dir mới đã tồn tại thì không cho rename để tránh ghi đè
    const existsNew = await sftp.exists(newFullPath);
    if (existsNew) {
      await sftp.end();
      return NextResponse.json(
        {
          success: false,
          error: `Đã tồn tại "${newName}" trong thư mục hiện tại`,
        },
        { status: 400 }
      );
    }

    // 🚚 Thực hiện rename (file hoặc folder đều được)
    await sftp.rename(oldFullPath, newFullPath);

    await sftp.end();

    return NextResponse.json({
      success: true,
      from: oldFullPath,
      to: newFullPath,
    });
  } catch (err: any) {
    console.error("SFTP rename error:", err);
    return NextResponse.json(
      { success: false, error: err.message || String(err) },
      { status: 500 }
    );
  }
}
