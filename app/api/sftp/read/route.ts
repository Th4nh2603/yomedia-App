import { NextResponse } from "next/server";
import SftpClient from "ssh2-sftp-client";

export async function GET(req: Request) {
  const sftp = new SftpClient();

  try {
    const url = new URL(req.url);
    const path = url.searchParams.get("path");
    if (!path) {
      return NextResponse.json({ success: false, error: "Missing path" });
    }

    await sftp.connect({
      host: process.env.SFTP_HOST,
      port: Number(process.env.SFTP_PORT),
      username: process.env.SFTP_USER,
      password: process.env.SFTP_PASS,
    });
    const buffer = await sftp.get(path);
    const content = buffer.toString("utf8"); // ✅ chuyển sang text

    await sftp.end();

    return NextResponse.json({ success: true, content });
  } catch (err: any) {
    console.error("SFTP Read Error:", err);
    return NextResponse.json({ success: false, error: err.message });
  }
}
