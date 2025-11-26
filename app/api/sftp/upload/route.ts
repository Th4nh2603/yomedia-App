import { NextResponse } from "next/server";
import Client from "ssh2-sftp-client";

export const runtime = "nodejs";

export async function POST(req: Request) {
  try {
    const formData = await req.formData();

    const rawFiles = formData.getAll("files");
    const files = rawFiles.filter(
      (f): f is File => typeof f === "object" && "arrayBuffer" in f
    ) as File[];

    const targetPath =
      typeof formData.get("path") === "string"
        ? (formData.get("path") as string)
        : ".";

    if (!files.length) {
      return NextResponse.json(
        { success: false, error: "No files to upload" },
        { status: 400 }
      );
    }

    const sftp = new Client();

    await sftp.connect({
      host: process.env.SFTP_HOST,
      port: Number(process.env.SFTP_PORT),
      username: process.env.SFTP_USER,
      password: process.env.SFTP_PASS,
    });

    const uploaded: string[] = [];
    const skippedExisting: string[] = [];

    for (const file of files) {
      const buffer = Buffer.from(await file.arrayBuffer());

      // ✅ file.name có thể là path: 480x270/abc.html
      const relativePath = file.name.replace(/\\/g, "/");

      const remoteFilePath =
        targetPath === "."
          ? `./${relativePath}`
          : `${targetPath}/${relativePath}`;

      // 🔥 Tạo folder trung gian (recursive)
      const dir = remoteFilePath.substring(0, remoteFilePath.lastIndexOf("/"));
      if (dir) {
        await sftp.mkdir(dir, true).catch(() => {});
      }

      // ✅ Check tồn tại – nếu có thì bỏ qua
      const exists = await sftp.exists(remoteFilePath);
      if (exists) {
        skippedExisting.push(remoteFilePath);
        continue;
      }

      await sftp.put(buffer, remoteFilePath);
      uploaded.push(remoteFilePath);
    }

    await sftp.end();

    return NextResponse.json({
      success: true,
      uploaded,
      skippedExisting,
    });
  } catch (err: any) {
    console.error("SFTP upload error:", err);
    return NextResponse.json(
      { success: false, error: err.message || String(err) },
      { status: 500 }
    );
  }
}
