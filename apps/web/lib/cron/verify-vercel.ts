import { ZlicxApiError } from "../api/errors";

export const verifyVercelSignature = async (req: Request) => {
  if (process.env.VERCEL !== "1") {
    return;
  }
  const authHeader = req.headers.get("authorization");

  if (
    !process.env.CRON_SECRET ||
    authHeader !== `Bearer ${process.env.CRON_SECRET}`
  ) {
    throw new ZlicxApiError({
      code: "unauthorized",
      message: "Invalid QStash request signature",
    });
  }
};
