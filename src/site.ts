// Profile data shown on the home and about pages. Source of truth:
// github.com/ntheanh201/ntheanh201 README.

export const SITE = {
  title: "The Anh Nguyen",
  handle: "ntheanh201",
  description:
    "Notes on Kubernetes, GPU platforms and open source by The Anh Nguyen — Solutions Architect for the Viettel AI Platform, CNCF Ambassador and Kubestronaut.",
  url: "https://ntheanh201.id.vn",
};

export const SOCIAL = [
  { label: "GitHub", href: "https://github.com/ntheanh201" },
  { label: "LinkedIn", href: "https://www.linkedin.com/in/ntheanh201/" },
  { label: "X", href: "https://x.com/ntheanh201" },
  { label: "Facebook", href: "https://facebook.com/ntheanh201" },
];

export const FOCUS = [
  "LLM inference serving at scale: NVIDIA Dynamo, Token Factory",
  "GPU supercomputing on NVIDIA H200 and NVIDIA AI Enterprise",
  "AI workload scheduling: KAI Scheduler, Run:ai, Workload Map (NVIDIA DSX OS)",
  "GPU cluster bring-up and certification: AICR, NVCRE (NVIDIA DSX OS)",
  "Fractional and multi-tenant GPU: HAMi, MIG, GPU Operator",
  "InfiniBand, GPUDirect RDMA and multi-node NCCL",
  "MLOps on Kubernetes: Kubeflow, KServe",
];

const credly = (id: string) => `https://www.credly.com/badges/${id}`;
const nvidiaCredential = (id: string) => `https://credential.nvidia.com/${id}`;

export interface Cert {
  name: string;
  short?: string;
  issued: string; // YYYY-MM-DD (or just YYYY when the day isn't known), from the badge's Open Badges metadata or the certificate PDF
  img?: string;
  href?: string;
}

// Dates come from the Open Badges 2.0 metadata baked into each badge image
// (~/Downloads/"badges openmetadata 2.0"), falling back to the certificate PDFs.
export const CERTIFICATIONS: { issuer: string; note?: string; items: Cert[] }[] = [
  {
    issuer: "NVIDIA",
    items: [
      { name: "NVIDIA-Certified Professional: AI Networking", short: "NCP-AIN", issued: "2026-10-18", img: "/badges/nvidia-ncp-ain.png", href: nvidiaCredential("9beb4b0a-85a7-474f-b915-e64161966efa") },
      { name: "NVIDIA-Certified Professional: AI Infrastructure", short: "NCP-AII", issued: "2026-10-03", img: "/badges/nvidia-ncp-aii.png", href: nvidiaCredential("3a8e0b7b-32b6-47bd-a127-49cc8ebc77f5") },
      { name: "NVIDIA-Certified Professional: AI Operations", short: "NCP-AIO", issued: "2026-02-15", img: "/badges/nvidia-ncp-aio.png", href: credly("9237fdde-0176-416a-95e0-5c2568599ae4") },
      { name: "NVIDIA-Certified Associate: AI Infrastructure and Operations", short: "NCA-AIIO", issued: "2025-11-02", img: "/badges/nvidia-nca-aiio.png", href: credly("8d66c4d4-6dc9-48b5-bb64-18b3209ec0c5") },
    ],
  },
  {
    issuer: "Anthropic",
    items: [
      { name: "Claude Certified Architect – Foundations", issued: "2026-09-13", img: "/badges/claude-certified-architect.png", href: credly("323137e3-08d9-475d-b03e-3dd8f0f3740a") },
    ],
  },
  {
    issuer: "The Linux Foundation & CNCF",
    note: "Kubestronaut is awarded for holding all five Kubernetes certifications: CKA, CKAD, CKS, KCNA and KCSA.",
    items: [
      { name: "Kubestronaut", issued: "2025-06-24", img: "/badges/kubestronaut.png", href: credly("aac477c8-f802-4264-88ba-0dc84f84e046") },
      { name: "Linux Foundation Certified System Administrator", short: "LFCS", issued: "2026-06-20", img: "/badges/lfcs.png", href: credly("6f6a1074-4ded-4b3e-8403-7ebfa511aac9") },
      { name: "Certified Kubernetes Security Specialist", short: "CKS", issued: "2025-06-24", img: "/badges/cks.png", href: credly("939c19a2-7b0b-4fd3-ae65-c551b01fdaab") },
      { name: "Kubernetes and Cloud Native Security Associate", short: "KCSA", issued: "2024-12-28", img: "/badges/kcsa.png", href: credly("a29b1b9d-3e5a-4e9c-b154-2f4758ad71f1") },
      { name: "Certified Kubernetes Application Developer", short: "CKAD", issued: "2024-11-23", img: "/badges/ckad.png", href: credly("05335a16-c7e2-4586-a685-7038e8e86863") },
      { name: "Kubernetes and Cloud Native Associate", short: "KCNA", issued: "2024-10-26", img: "/badges/kcna.png", href: credly("6b6081d6-f126-4738-b920-48ae6e8ccc22") },
      { name: "Certified Kubernetes Administrator", short: "CKA", issued: "2024-09-01", img: "/badges/cka.png", href: credly("82e4149e-0e57-491b-938e-ac76f8c46229") },
    ],
  },
  {
    issuer: "Nebius Academy",
    items: [
      { name: "Nebius AI Leader Certification", issued: "2026-09-07", img: "/badges/nebius-ai-leader.png", href: credly("f49b83ba-a055-4712-aa37-208b83052efc") },
      { name: "Nebius Agentic AI Builder Certification", issued: "2026-07-18", img: "/badges/nebius-agentic-ai-builder.png", href: credly("a6c7b5a4-13e1-4f5b-bc2b-d916e7d7f141") },
      { name: "Nebius AI CloudOps Engineer Certification", issued: "2026-07-11", img: "/badges/nebius-ai-cloudops.png", href: credly("8252a412-1d35-4230-ab83-b3dd5910f449") },
    ],
  },
  {
    issuer: "Octopus Deploy (Codefresh)",
    items: [
      { name: "GitOps Certified: GitOps at Scale", issued: "2022-12-06", img: "/badges/gitops-at-scale.png", href: credly("9b2c0c2b-a4ed-4abd-9843-f21f7f92d61b") },
      { name: "GitOps Certified: GitOps Fundamentals", issued: "2022-11-29", img: "/badges/gitops-fundamentals.png", href: credly("29168376-0001-4d5e-9231-fd85e48342a6") },
    ],
  },
];

// Roles and recognition that aren't exams.
export const COMMUNITY: Cert[] = [
  { name: "CNCF Ambassador, 2026–2028 cohort", issued: "2026", img: "/badges/cncf-ambassador.png", href: "https://www.cncf.io/people/ambassadors/" },
  { name: "Speaker, KCD & OpenInfra Days Vietnam 2026", issued: "2026-09-03", img: "/badges/kcd-vietnam-2026-speaker.png", href: credly("3ac9ae7f-2d8d-41cc-a822-0a04a7b4b6b3") },
];

export const TRAINING = [
  { name: "NVIDIA Partner Network: Cloud NVIDIA Technologies Technical Curriculum (2025)", issued: "2026-04-08" },
  { name: "NVIDIA Partner Network: Compute Technical Curriculum (2025)", issued: "2026-04-08" },
  { name: "Hugging Face Agents Course: Fundamentals of Agents", issued: "2025-02-20" },
  { name: "The Shubhra Kar Linux Foundation Training (LiFT) Scholarship", issued: "2025" },
];

export const ALL_BADGES: Cert[] = [...COMMUNITY, ...CERTIFICATIONS.flatMap((g) => g.items)].filter((c) => c.img);

export const TALKS: { title: string; event: string; href: string; year?: string }[] = [
  {
    title: "Turning GPU-Hours into Tokens, and Tokens into a Service: Agent Router and NVIDIA Dynamo",
    event: "VOI & CNVN x AWS FCAJ Meetup: Cloud & AI Infrastructure, Hanoi",
    href: "https://ocgroups.dev/cncf/group/d2e22fa/event/5z4fnze",
    year: "2026",
  },
  {
    title: "From Project to Production: HAMi and Viettel Cloud",
    event: "KCD & OpenInfra Days Vietnam 2026",
    href: "https://sessionize.com/view/c0qvrydt/GridSmart",
  },
  {
    title: "Auditable Autonomy: Engineering With AI Teammates That Leave a Trace",
    event: "The Future of Software Engineering in the Agentic AI era",
    href: "https://viettelfamily.com/news/vds-quy-tu-chuyen-gia-viettel-ban-ve-tuong-lai-software-engineering-global",
  },
  {
    title: "From Vietnam to the World: Contributing to Kubernetes and earning the Linux Foundation Scholarship",
    event: "#cTENcf Birthday Bash Hanoi",
    href: "https://community.cncf.io/events/details/cncf-cloud-native-hanoi-presents-ctencf-birthday-bash-hanoi/",
  },
  {
    title: "AI GÕ CỬA — Doanh nghiệp Việt đã sẵn sàng?",
    event: "VIETTELDX TALKS #8",
    href: "https://www.youtube.com/watch?v=8pN4ft0OzpY",
  },
  {
    title: "HAMi: Fractional GPU for Efficient AI in Cloud Native",
    event: "OpenInfra & Cloud Native Day Vietnam 2025",
    href: "https://www.vietopeninfra.org/void2025",
  },
  {
    title: "Fractional GPU for AI: Open Source Solutions in Cloud Native",
    event: "Cloud Native Hanoi May Meetup: GPU and eBPF on Kubernetes",
    href: "https://community.cncf.io/events/details/cncf-cloud-native-hanoi-presents-may-meetup-gpu-and-ebpf-on-kubernetes/",
  },
];

// Writing published elsewhere, listed next to the posts on this site.
export const EXTERNAL_WRITING = [
  {
    title: "Turning GPU-hours into tokens: how Viettel Cloud serves multiple LLM families with NVIDIA Dynamo",
    where: "Viettel Cloud Tech Blog",
    date: "2026-10-05",
    href: "https://viettelcloud.vn/en/tech-blog/4/142",
    alt: { label: "Tiếng Việt", href: "https://viettelcloud.vn/tech-blog/4/142" },
  },
];
