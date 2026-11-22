import { fetchLatestPublicCommit } from "@/lib/github";

// The now bar's one piece of live data: the latest public commit. Served from
// here (static, regenerated every five minutes) so the pages themselves stay
// static and GitHub's rate limit is spent once, not once per visitor.
export const dynamic = "force-static";
export const revalidate = 300;

export async function GET() {
  const c = await fetchLatestPublicCommit();
  return Response.json(
    c?.date ? { commit: { repo: c.repo ?? null, url: c.url ?? null, date: c.date } } : { commit: null }
  );
}
