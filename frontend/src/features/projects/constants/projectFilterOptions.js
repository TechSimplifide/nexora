export const COMMON_DOMAINS = [
  "Artificial Intelligence",
  "Machine Learning",
  "Web Development",
  "Mobile App Development",
  "Cloud Computing & DevOps",
  "Cybersecurity",
  "Internet of Things (IoT)",
  "Blockchain & Web3",
  "Data Science & Analytics",
  "Embedded Systems",
  "Healthcare Technology",
  "FinTech",
  "AR / VR & Game Development",
];

export const COMMON_DEPARTMENTS = [
  "Computer Science & Engineering",
  "Information Technology",
  "Artificial Intelligence & Data Science",
  "Electronics & Telecommunication",
  "Electrical Engineering",
  "Mechanical Engineering",
  "Civil Engineering",
  "Computer Applications (MCA/BCA)",
];

export const COMMON_TECHNOLOGIES = [
  "React",
  "Node.js",
  "Python",
  "TypeScript",
  "PyTorch",
  "TensorFlow",
  "Docker",
  "Next.js",
  "FastAPI",
  "MongoDB",
  "PostgreSQL",
  "Flutter",
  "Java",
  "C++",
  "AWS",
  "Kubernetes",
];

export function getAcademicYearOptions() {
  const currentYear = new Date().getFullYear();
  const years = [];
  for (let i = -3; i <= 2; i++) {
    const start = currentYear + i;
    const end = String(start + 1).slice(-2);
    years.push(`${start}-${end}`);
  }
  return years;
}
