import { NextResponse } from "next/server";
import SftpClient from "ssh2-sftp-client";

export async function GET(req: Request) {
  const sftp = new SftpClient();

  try {
    const url = new URL(req.url);
    const path = url.searchParams.get("path") || "/script/demo"; // <-- lấy path động
    await sftp.connect({
      host: process.env.SFTP_HOST,
      port: Number(process.env.SFTP_PORT),
      username: process.env.SFTP_USER,
      password: process.env.SFTP_PASS,
    });

    const files = await sftp.list(path);
    await sftp.end();

    return NextResponse.json({ success: true, files });
  } catch (err: any) {
    console.error("SFTP List Error:", err);
    return NextResponse.json({ success: false, error: err.message });
  }
}
