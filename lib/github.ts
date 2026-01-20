export type LatestCommit = {
  sha: string;
  message?: string | null;
  url?: string | null;
  repo?: string | null;
  author_name?: string | null;
  author_login?: string | null;
  author_avatar?: string | null;
  date?: string | null;
  filesChanged?: number | undefined;
  additions?: number | undefined;
  deletions?: number | undefined;
};

export async function fetchLatestPublicCommit(): Promise<LatestCommit | null> {
  try {
    const res = await fetch(
      "https://api.github.com/users/brignano/events/public",
      { next: { revalidate: 60 } }
    );
    if (!res.ok) return null;
    const events = await res.json();
    for (const ev of events) {
      if (ev.type === "PushEvent" && ev.payload) {
        const repo = ev.repo?.name;
        const commits = ev.payload.commits;
        const c = (commits && commits[0]) || ev.payload.head_commit;
        const head = ev.payload.head || (c && c.sha) || null;
        if (head && repo) {
          return {
            sha: head,
            message: c?.message || "",
            url: `https://github.com/${repo}/commit/${head}`,
            repo,
            author_name: c?.author?.name || null,
            author_login: ev.actor?.login || null,
            author_avatar: ev.actor?.avatar_url || null,
            date: ev.created_at || null,
          };
        }
      }
    }
    return null;
  } catch (e) {
    return null;
  }
}
