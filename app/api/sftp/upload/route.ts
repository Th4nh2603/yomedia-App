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

    if (targetPath !== "." && targetPath !== "") {
      await sftp.mkdir(targetPath, true).catch(() => {});
    }

    const uploaded: string[] = [];

    for (const file of files) {
      const buffer = Buffer.from(await file.arrayBuffer());

      const remoteFilePath =
        targetPath === "." ? `./${file.name}` : `${targetPath}/${file.name}`;

      await sftp.put(buffer, remoteFilePath);
      uploaded.push(remoteFilePath);
    }

    await sftp.end();

    return NextResponse.json({ success: true, uploaded });
  } catch (err: any) {
    console.error("SFTP upload error:", err);
    return NextResponse.json(
      { success: false, error: err.message || String(err) },
      { status: 500 }
    );
  }
}
