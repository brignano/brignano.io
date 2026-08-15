import type { Experience } from "@/types/resume";

export interface ExperienceGroup {
  company: string;
  /** Taken from the most recent role in the run. */
  location?: string;
  /** Earliest start across the run — the year the tenure began. */
  startDate: string;
  /** End of the most recent role ("Present" while still there). */
  endDate: string;
  roles: { job: Experience; index: number }[];
}

/**
 * Collapse consecutive roles at the same employer into one group.
 *
 * Six repeated "The Hartford" headers read as six separate jobs; one grouped
 * header reads as a single long tenure with five promotions, which is the
 * stronger signal and the one the flat list was hiding. Only *consecutive*
 * runs group, so returning to a former employer stays its own block in the
 * right chronological place rather than being folded into the earlier stint.
 *
 * `index` is the role's position in the original array, preserved so callers
 * can keep using it for expand/collapse state and for the "first role gets
 * more bullets" rule.
 */
export function groupExperienceByCompany(
  experience: Experience[]
): ExperienceGroup[] {
  const groups: ExperienceGroup[] = [];

  experience.forEach((job, index) => {
    const current = groups[groups.length - 1];

    if (current && current.company === job.company) {
      current.roles.push({ job, index });
      // Entries run newest-first, so each later role pushes the start earlier.
      current.startDate = job.startDate;
    } else {
      groups.push({
        company: job.company,
        location: job.location,
        startDate: job.startDate,
        endDate: job.endDate,
        roles: [{ job, index }],
      });
    }
  });

  return groups;
}
