import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getAuthSession } from "@/lib/auth";

export async function GET(req: NextRequest) {
  try {
    const config = await prisma.siteConfig.findUnique({ where: { id: "default" } });
    return NextResponse.json(config);
  } catch (error) {
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

export async function PATCH(req: NextRequest) {
  const session = await getAuthSession();
  if ((session?.user as any)?.role !== "OWNER") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const data = await req.json();
    const config = await prisma.siteConfig.update({
      where: { id: "default" },
      data,
    });
    return NextResponse.json({ success: true, config });
  } catch (error) {
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
