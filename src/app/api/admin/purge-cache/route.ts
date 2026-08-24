import { NextRequest, NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { getAuthSession } from "@/lib/auth";

export async function POST(req: NextRequest) {
  const session = await getAuthSession();
  if ((session?.user as any)?.role !== "OWNER") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    revalidatePath("/", "layout");
    return NextResponse.json({ success: true, message: "Cache purged" });
  } catch (error) {
    return NextResponse.json({ error: "Failed to purge cache" }, { status: 500 });
  }
}
