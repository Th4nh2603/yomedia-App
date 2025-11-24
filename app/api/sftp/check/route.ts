import { NextRequest, NextResponse } from "next/server";
import SftpClient from "ssh2-sftp-client";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const path = searchParams.get("path");
  const fileName = searchParams.get("fileName");

  if (!path || !fileName) {
    return NextResponse.json(
      { success: false, error: "Missing parameters" },
      { status: 400 }
    );
  }

  const sftp = new SftpClient();

  try {
    await sftp.connect({
      host: process.env.SFTP_HOST,
      port: Number(process.env.SFTP_PORT),
      username: process.env.SFTP_USER,
      password: process.env.SFTP_PASS,
    });

    const remotePath = path === "." ? fileName : `${path}/${fileName}`;

    const exists = await sftp.exists(remotePath);

    await sftp.end();

    return NextResponse.json({
      success: true,
      exists: !!exists,
    });
  } catch (err: any) {
    return NextResponse.json(
      { success: false, error: err.message },
      { status: 500 }
    );
  }
}
