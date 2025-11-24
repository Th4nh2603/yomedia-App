import { NextRequest, NextResponse } from "next/server";
import Client from "ssh2-sftp-client";

const sftpConfig = {
  host: process.env.SFTP_HOST,
  port: Number(process.env.SFTP_PORT),
  username: process.env.SFTP_USER,
  password: process.env.SFTP_PASS,
};

export async function POST(req: NextRequest) {
  const sftp = new Client();

  try {
    const body = await req.json();
    const path = body.path as string | undefined;
    const folderName = body.folderName as string | undefined;

    if (!folderName) {
      return NextResponse.json(
        { success: false, error: "folderName is required" },
        { status: 400 }
      );
    }

    const basePath = path && path !== "" ? path : ".";
    const newFolderPath =
      basePath === "." || basePath === "/"
        ? `./${folderName}`
        : basePath.endsWith("/")
        ? `${basePath}${folderName}`
        : `${basePath}/${folderName}`;

    await sftp.connect(sftpConfig);

    // mkdir(path, recursive)
    await sftp.mkdir(newFolderPath, true);

    return NextResponse.json({
      success: true,
      path: newFolderPath,
    });
  } catch (err: any) {
    console.error("SFTP mkdir error:", err);
    return NextResponse.json(
      { success: false, error: err.message },
      { status: 500 }
    );
  } finally {
    sftp.end();
  }
}
