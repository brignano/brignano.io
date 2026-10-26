import React from "react";
import path from "node:path";
import {
  Document,
  Page,
  Text,
  View,
  Link,
  StyleSheet,
  Font,
} from "@react-pdf/renderer";
import type { ResumeData } from "@/types/resume";
import { groupExperienceByCompany } from "@/lib/experience";

// The site's own faces (design/DESIGN.md §5): Geist for everything you read,
// IBM Plex Mono for the precise bits — dates, section eyebrows, contact
// details. Embedded from assets/fonts (both OFL) so the PDF looks the same in
// every viewer instead of falling back to Helvetica. This file only runs on the
// server (app/resume.pdf/route.ts), so reading from disk is fine.
const FONTS = path.join(process.cwd(), "assets", "fonts");

Font.register({
  family: "Geist",
  fonts: [
    { src: path.join(FONTS, "Geist-Regular.ttf"), fontWeight: 400 },
    { src: path.join(FONTS, "Geist-Medium.ttf"), fontWeight: 500 },
    { src: path.join(FONTS, "Geist-SemiBold.ttf"), fontWeight: 600 },
  ],
});
Font.register({
  family: "Plex Mono",
  fonts: [
    { src: path.join(FONTS, "IBMPlexMono-Regular.ttf"), fontWeight: 400 },
    { src: path.join(FONTS, "IBMPlexMono-Medium.ttf"), fontWeight: 500 },
  ],
});

// No mid-word hyphenation. @react-pdf hyphenates by default, which split words
// like "intelli-gence" across lines — fine in a novel, sloppy on a resume.
Font.registerHyphenationCallback((word) => [word]);

// Mirrored from design/tokens.css (light theme). @react-pdf lays out off-DOM
// and cannot read a CSS custom property, so the values are literal here — the
// same exception app/opengraph-image.tsx takes. This is the one place in the
// file they appear; every style below reads from INK.
const INK = {
  n900: "#111114", // --n-900  name, headings
  n800: "#33333a", // --n-800  role titles
  n700: "#52525b", // --n-700  body copy
  n600: "#6b6b73", // --n-600  dates, eyebrows, the footer
  n300: "#cbcbce", // --n-300  section rules, the role timeline
  // --mark: identity, a drawn graphic only (DESIGN.md §3). Here it is the one
  // short rule under the name — the only colour on the page.
  mark: "#b4741f",
} as const;

const SANS = "Geist";
const MONO = "Plex Mono";

const styles = StyleSheet.create({
  page: {
    paddingTop: 40,
    paddingHorizontal: 46,
    // Room for the fixed footer so body text never runs under it.
    paddingBottom: 48,
    fontFamily: SANS,
    fontSize: 9.5,
    color: INK.n700,
  },
  // Fixed on every page: a detached page 2 is otherwise anonymous, and this is
  // where the URL to send someone lives once the file has left the site.
  //
  // lineHeight lives on each text style, never on the Page: @react-pdf (4.x)
  // silently drops a `render` prop's output — the page numbers here — whenever
  // the Page style carries a lineHeight.
  footer: {
    position: "absolute",
    bottom: 24,
    left: 46,
    right: 46,
    flexDirection: "row",
    justifyContent: "space-between",
    fontFamily: MONO,
    fontSize: 7,
    color: INK.n600,
    letterSpacing: 0.3,
  },

  // Header
  header: {
    marginBottom: 16,
  },
  name: {
    fontSize: 25,
    fontWeight: 600,
    color: INK.n900,
    letterSpacing: -0.6,
    lineHeight: 1.15,
  },
  title: {
    fontSize: 11,
    color: INK.n700,
    lineHeight: 1.3,
    marginTop: 3,
  },
  markRule: {
    width: 32,
    height: 2,
    backgroundColor: INK.mark,
    marginTop: 10,
    marginBottom: 10,
  },
  contactRow: {
    flexDirection: "row",
    flexWrap: "wrap",
  },
  contactItem: {
    fontFamily: MONO,
    fontSize: 8,
    color: INK.n700,
    lineHeight: 1.5,
    textDecoration: "none",
  },
  contactSep: {
    fontFamily: MONO,
    fontSize: 8,
    color: INK.n300,
    lineHeight: 1.5,
    marginHorizontal: 6,
  },

  // Sections
  section: {
    marginBottom: 12,
  },
  // An eyebrow over a hairline, the way the site labels its sections.
  sectionTitle: {
    fontFamily: MONO,
    fontWeight: 500,
    fontSize: 7.5,
    letterSpacing: 1.4,
    textTransform: "uppercase",
    color: INK.n600,
    lineHeight: 1.2,
    paddingBottom: 4,
    marginBottom: 8,
    borderBottomWidth: 0.75,
    borderBottomColor: INK.n300,
  },
  summaryText: {
    fontSize: 10,
    lineHeight: 1.5,
    color: INK.n700,
  },

  // Experience. One header per employer; the roles beneath it hang off a thin
  // timeline so a long tenure reads as one run of promotions. See
  // lib/experience.ts.
  companyGroup: {
    marginBottom: 4,
  },
  companyHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "baseline",
    marginBottom: 6,
  },
  companyName: {
    fontSize: 12,
    fontWeight: 600,
    color: INK.n900,
    lineHeight: 1.2,
  },
  companyLocation: {
    fontSize: 9,
    fontWeight: 400,
    color: INK.n600,
  },
  companyRoles: {
    marginLeft: 3,
    paddingLeft: 11,
    borderLeftWidth: 0.75,
    borderLeftColor: INK.n300,
  },
  roleItem: {
    marginBottom: 8,
  },
  roleHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "baseline",
    marginBottom: 3,
  },
  rolePosition: {
    flex: 1,
    fontSize: 10,
    fontWeight: 600,
    color: INK.n800,
    lineHeight: 1.3,
    paddingRight: 12,
  },
  dates: {
    fontFamily: MONO,
    fontSize: 7.5,
    color: INK.n600,
    lineHeight: 1.3,
    textAlign: "right",
  },
  highlight: {
    flexDirection: "row",
    marginBottom: 2.5,
  },
  bullet: {
    width: 10,
    fontSize: 9,
    color: INK.n300,
    lineHeight: 1.4,
  },
  highlightText: {
    flex: 1,
    fontSize: 9,
    lineHeight: 1.4,
    color: INK.n700,
  },

  // Compact entries: leadership, education, certifications.
  entry: {
    marginBottom: 6,
  },
  entryHead: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "baseline",
  },
  entryName: {
    flex: 1,
    fontSize: 10,
    fontWeight: 600,
    color: INK.n800,
    lineHeight: 1.3,
    paddingRight: 12,
  },
  entryMeta: {
    fontSize: 9,
    fontWeight: 500,
    color: INK.n700,
    lineHeight: 1.4,
  },
  entryDetail: {
    fontSize: 9,
    color: INK.n700,
    lineHeight: 1.4,
  },

  // Skills: a label column and a value column, like a definition list.
  skillRow: {
    flexDirection: "row",
    marginBottom: 3,
  },
  skillCategory: {
    width: 132,
    fontFamily: MONO,
    fontSize: 7.5,
    color: INK.n600,
    lineHeight: 1.4,
    paddingTop: 1.5,
    paddingRight: 8,
  },
  skillItems: {
    flex: 1,
    fontSize: 9,
    color: INK.n700,
    lineHeight: 1.4,
  },
});

// "https://www.linkedin.com/in/brignano" -> "linkedin.com/in/brignano"
const bare = (url: string) =>
  url.replace(/^https?:\/\//, "").replace(/^www\./, "").replace(/\/$/, "");

interface ResumePDFProps {
  data: ResumeData;
}

const ResumePDF: React.FC<ResumePDFProps> = ({ data }) => {
  const {
    personalInfo,
    summary,
    experience,
    leadership,
    education,
    skills,
    certifications,
  } = data;

  // "https://brignano.io" -> "brignano.io/resume"
  const resumeUrl = `${bare(personalInfo.website ?? "brignano.io")}/resume`;

  // Shown bare (no "Email:" labels, no https://) and clickable. The values
  // explain themselves; the labels only cost width.
  const contacts = [
    personalInfo.email && {
      label: personalInfo.email,
      href: `mailto:${personalInfo.email}`,
    },
    personalInfo.phone && {
      label: personalInfo.phone,
      href: `tel:${personalInfo.phone.replace(/[^+\d]/g, "")}`,
    },
    personalInfo.location && { label: personalInfo.location },
    personalInfo.website && {
      label: bare(personalInfo.website),
      href: personalInfo.website,
    },
    personalInfo.linkedin && {
      label: bare(personalInfo.linkedin),
      href: personalInfo.linkedin,
    },
    personalInfo.github && {
      label: bare(personalInfo.github),
      href: personalInfo.github,
    },
  ].filter(Boolean) as { label: string; href?: string }[];

  return (
    <Document
      title={`${personalInfo.name} — Resume`}
      author={personalInfo.name}
      subject={personalInfo.title}
      creator={resumeUrl}
      producer={resumeUrl}
    >
      <Page size="LETTER" style={styles.page}>
        <View style={styles.footer} fixed>
          <Text>
            {personalInfo.name} · {resumeUrl}
          </Text>
          <Text
            render={({ pageNumber, totalPages }) =>
              `${pageNumber} / ${totalPages}`
            }
          />
        </View>

        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.name}>{personalInfo.name}</Text>
          <Text style={styles.title}>{personalInfo.title}</Text>
          <View style={styles.markRule} />
          <View style={styles.contactRow}>
            {contacts.map((c, i) => (
              <View key={c.label} style={{ flexDirection: "row" }}>
                {i > 0 && <Text style={styles.contactSep}>·</Text>}
                {c.href ? (
                  <Link src={c.href} style={styles.contactItem}>
                    {c.label}
                  </Link>
                ) : (
                  <Text style={styles.contactItem}>{c.label}</Text>
                )}
              </View>
            ))}
          </View>
        </View>

        {/* Summary */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Summary</Text>
          <Text style={styles.summaryText}>{summary.trim()}</Text>
        </View>

        {/* Experience */}
        {experience && experience.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Experience</Text>
            {/* Grouped by employer so a long tenure reads as one run of
                promotions rather than N separate jobs (lib/experience.ts).
                The group itself must stay wrappable — six roles under one
                header will not fit on a single page. */}
            {groupExperienceByCompany(experience).map((group) => (
              <View
                key={`${group.company}-${group.endDate}`}
                style={styles.companyGroup}
              >
                <View style={styles.companyHeader} wrap={false}>
                  <Text style={styles.companyName}>
                    {group.company}
                    {group.location && (
                      <Text style={styles.companyLocation}>
                        {"  ·  "}
                        {group.location}
                      </Text>
                    )}
                  </Text>
                  <Text style={styles.dates}>
                    {group.startDate} – {group.endDate}
                  </Text>
                </View>
                <View style={styles.companyRoles}>
                  {/* wrap={false} keeps a role's heading with its bullets —
                      without it a page break can strand a lone bullet at the
                      top of page 2, detached from the job it belongs to. */}
                  {group.roles.map(({ job, index }) => (
                    <View key={index} style={styles.roleItem} wrap={false}>
                      <View style={styles.roleHeader}>
                        <Text style={styles.rolePosition}>{job.position}</Text>
                        <Text style={styles.dates}>
                          {job.startDate} – {job.endDate}
                        </Text>
                      </View>
                      {/* Caps keep this to two pages. Mirrored by the
                          browser-print rules in globals.css — change both
                          together. */}
                      {job.highlights
                        .slice(0, index === 0 ? 8 : 4)
                        .map((highlight, i) => (
                          <View key={i} style={styles.highlight}>
                            <Text style={styles.bullet}>•</Text>
                            <Text style={styles.highlightText}>{highlight}</Text>
                          </View>
                        ))}
                    </View>
                  ))}
                </View>
              </View>
            ))}
          </View>
        )}

        {/* Leadership & Community */}
        {leadership && leadership.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Leadership &amp; Community</Text>
            {leadership.map((item, index) => (
              <View key={index} style={styles.entry} wrap={false}>
                <View style={styles.entryHead}>
                  <Text style={styles.entryName}>{item.organization}</Text>
                  <Text style={styles.dates}>{item.role}</Text>
                </View>
                {item.description && (
                  <Text style={styles.entryDetail}>{item.description}</Text>
                )}
              </View>
            ))}
          </View>
        )}

        {/* Education */}
        {education && education.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Education</Text>
            {education.map((edu, index) => (
              <View key={index} style={styles.entry} wrap={false}>
                <View style={styles.entryHead}>
                  <Text style={styles.entryName}>
                    {edu.degree}
                    {edu.field && `, ${edu.field}`}
                  </Text>
                  <Text style={styles.dates}>
                    {[edu.startDate, edu.endDate].filter(Boolean).join(" – ")}
                  </Text>
                </View>
                <Text style={styles.entryMeta}>{edu.institution}</Text>
                {(edu.gpa || edu.honors?.length) && (
                  <Text style={styles.entryDetail}>
                    {[edu.gpa && `GPA ${edu.gpa}`, edu.honors?.join(", ")]
                      .filter(Boolean)
                      .join("  ·  ")}
                  </Text>
                )}
              </View>
            ))}
          </View>
        )}

        {/* Skills */}
        {skills && skills.length > 0 && (
          <View style={styles.section} wrap={false}>
            <Text style={styles.sectionTitle}>Skills</Text>
            {skills.map((skillGroup, index) => (
              <View key={index} style={styles.skillRow}>
                <Text style={styles.skillCategory}>{skillGroup.category}</Text>
                <Text style={styles.skillItems}>
                  {skillGroup.items.join(", ")}
                </Text>
              </View>
            ))}
          </View>
        )}

        {/* Certifications */}
        {certifications && certifications.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Certifications</Text>
            {certifications.map((cert, index) => (
              <View key={index} style={styles.entry} wrap={false}>
                <View style={styles.entryHead}>
                  <Text style={styles.entryName}>{cert.name}</Text>
                  {cert.date && <Text style={styles.dates}>{cert.date}</Text>}
                </View>
                <Text style={styles.entryDetail}>{cert.issuer}</Text>
              </View>
            ))}
          </View>
        )}
      </Page>
    </Document>
  );
};

export default ResumePDF;
