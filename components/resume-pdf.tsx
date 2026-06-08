import React from "react";
import {
  Document,
  Page,
  Text,
  View,
  StyleSheet,
  Font,
} from "@react-pdf/renderer";
import type { ResumeData } from "@/types/resume";

// Register fonts (optional - using built-in fonts for simplicity)
Font.register({
  family: "Helvetica",
  fonts: [
    { src: "Helvetica" },
    { src: "Helvetica-Bold", fontWeight: "bold" },
    { src: "Helvetica-Oblique", fontStyle: "italic" },
  ],
});

const styles = StyleSheet.create({
  page: {
    padding: 30,
    fontSize: 10,
    fontFamily: "Helvetica",
    lineHeight: 1.3,
  },
  header: {
    marginBottom: 10,
  },
  name: {
    fontSize: 19,
    fontWeight: "bold",
    marginBottom: 4,
  },
  title: {
    fontSize: 11,
    fontWeight: "bold",
    marginTop: 2,
    marginBottom: 6,
    color: "#333",
  },
  contactInfo: {
    fontSize: 9,
    color: "#555",
  },
  contactInfoRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginTop: 4,
  },
  contactInfoItem: {
    fontSize: 9,
    color: "#555",
    marginRight: 12,
    marginBottom: 2,
  },
  section: {
    marginBottom: 9,
  },
  sectionTitle: {
    fontSize: 12.5,
    fontWeight: "bold",
    marginBottom: 4,
    borderBottomWidth: 1,
    borderBottomColor: "#000",
    paddingBottom: 2,
  },
  summaryText: {
    fontSize: 10,
    lineHeight: 1.5,
    textAlign: "justify",
  },
  experienceItem: {
    marginBottom: 7,
  },
  jobHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 2,
  },
  jobPosition: {
    fontSize: 12,
    fontWeight: "bold",
  },
  jobCompany: {
    fontSize: 11,
    fontWeight: "bold",
    color: "#333",
  },
  jobLocation: {
    fontSize: 9,
    color: "#555",
  },
  jobDates: {
    fontSize: 9,
    color: "#555",
    textAlign: "right",
  },
  highlightsList: {
    marginLeft: 12,
    marginBottom: 4,
  },
  highlight: {
    fontSize: 9,
    marginBottom: 2,
    flexDirection: "row",
  },
  bullet: {
    width: 8,
    marginRight: 4,
  },
  highlightText: {
    flex: 1,
  },
  educationItem: {
    marginBottom: 8,
  },
  degree: {
    fontSize: 11,
    fontWeight: "bold",
  },
  institution: {
    fontSize: 10,
    color: "#333",
  },
  educationDetails: {
    fontSize: 9,
    color: "#555",
  },
  skillsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },
  skillCategory: {
    width: "48%",
    marginBottom: 5,
  },
  skillCategoryTitle: {
    fontSize: 11,
    fontWeight: "bold",
    marginBottom: 4,
  },
  skillItems: {
    fontSize: 9,
    color: "#444",
  },
  projectsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },
  projectItem: {
    width: "48%",
    marginBottom: 10,
  },
  projectName: {
    fontSize: 11,
    fontWeight: "bold",
    marginBottom: 2,
  },
  projectDescription: {
    fontSize: 9,
    marginBottom: 4,
    color: "#444",
  },
  certificationItem: {
    marginBottom: 6,
  },
  certificationName: {
    fontSize: 10,
    fontWeight: "bold",
  },
  certificationIssuer: {
    fontSize: 9,
    color: "#555",
  },
});

interface ResumePDFProps {
  data: ResumeData;
}

const ResumePDF: React.FC<ResumePDFProps> = ({ data }) => {
  const {
    personalInfo,
    summary,
    experience,
    leadership,
    skills,
    certifications,
  } = data;

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        {/* Header Section */}
        <View style={styles.header}>
          <Text style={styles.name}>{personalInfo.name}</Text>
          <Text style={styles.title}>{personalInfo.title}</Text>
          <View style={styles.contactInfoRow}>
            {personalInfo.email && (
              <Text style={styles.contactInfoItem}>
                Email: {personalInfo.email}
              </Text>
            )}
            {personalInfo.phone && (
              <Text style={styles.contactInfoItem}>
                Phone: {personalInfo.phone}
              </Text>
            )}
            {personalInfo.location && (
              <Text style={styles.contactInfoItem}>
                Location: {personalInfo.location}
              </Text>
            )}
            {personalInfo.website && (
              <Text style={styles.contactInfoItem}>
                Website: {personalInfo.website}
              </Text>
            )}
            {personalInfo.linkedin && (
              <Text style={styles.contactInfoItem}>
                LinkedIn: {personalInfo.linkedin}
              </Text>
            )}
            {personalInfo.github && (
              <Text style={styles.contactInfoItem}>
                GitHub: {personalInfo.github}
              </Text>
            )}
          </View>
        </View>

        {/* Summary Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Summary</Text>
          <Text style={styles.summaryText}>{summary}</Text>
        </View>

        {/* Experience Section */}
        {experience && experience.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Experience</Text>
            {experience.map((job, index) => (
              <View key={index} style={styles.experienceItem}>
                <View style={styles.jobHeader}>
                  <View style={{ flex: 1 }}>
                    <Text style={styles.jobPosition}>{job.position}</Text>
                    <Text style={styles.jobCompany}>{job.company}</Text>
                    {job.location && (
                      <Text style={styles.jobLocation}>{job.location}</Text>
                    )}
                  </View>
                  <View>
                    <Text style={styles.jobDates}>
                      {job.startDate} - {job.endDate}
                    </Text>
                  </View>
                </View>
                <View style={styles.highlightsList}>
                  {job.highlights
                    .slice(0, index === 0 ? 6 : 3)
                    .map((highlight, i) => (
                      <View key={i} style={styles.highlight}>
                        <Text style={styles.bullet}>•</Text>
                        <Text style={styles.highlightText}>{highlight}</Text>
                      </View>
                    ))}
                </View>
              </View>
            ))}
          </View>
        )}

        {/* Leadership & Community Section */}
        {leadership && leadership.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Leadership &amp; Community</Text>
            {leadership.map((item, index) => (
              <View key={index} style={styles.certificationItem}>
                <Text style={styles.certificationName}>
                  {item.organization}
                </Text>
                <Text style={styles.certificationIssuer}>
                  {item.role}
                  {item.description && ` — ${item.description}`}
                </Text>
              </View>
            ))}
          </View>
        )}

        {/* Education Section intentionally omitted in PDF to keep it to 2 pages */}

        {/* Skills Section */}
        {skills && skills.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Skills</Text>
            <View style={styles.skillsGrid}>
              {skills.map((skillGroup, index) => (
                <View key={index} style={styles.skillCategory}>
                  <Text style={styles.skillCategoryTitle}>
                    {skillGroup.category}
                  </Text>
                  <Text style={styles.skillItems}>
                    {skillGroup.items.join(", ")}
                  </Text>
                </View>
              ))}
            </View>
          </View>
        )}

        {/* Certifications Section */}
        {certifications && certifications.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Certifications</Text>
            {certifications.map((cert, index) => (
              <View key={index} style={styles.certificationItem}>
                <Text style={styles.certificationName}>{cert.name}</Text>
                <Text style={styles.certificationIssuer}>
                  {cert.issuer}
                  {cert.date && ` • Issued: ${cert.date}`}
                </Text>
              </View>
            ))}
          </View>
        )}
      </Page>
    </Document>
  );
};

export default ResumePDF;
