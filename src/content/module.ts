/**
 * Single source of truth for the Code of Conduct module.
 * HR can change copy, questions, pass mark and toast messages here without touching UI code.
 */

export type ChapterBlock =
  | { kind: "lead"; text: string }
  | { kind: "heading"; text: string }
  | { kind: "paragraph"; text: string }
  | { kind: "bullets"; items: string[] }
  | { kind: "cards"; cards: { label: string; items: string[] }[] }
  | { kind: "callout"; title: string; text: string };

export interface Chapter {
  id: number;
  eyebrow: string;
  title: string;
  /** Short line used on the Welcome overview. */
  summary: string;
  /** Path under /public. For the POC every chapter reuses one video. */
  videoSrc: string;
  blocks: ChapterBlock[];
  /** Check-in questions shown after the video; all must be answered correctly to complete the chapter. */
  checks: Question[];
}

export interface Question {
  id: string;
  prompt: string;
  options: { id: string; text: string }[];
  correctOptionId: string;
  explanation: string;
}

export const moduleMeta = {
  company: "Truminds",
  companyLegal: "Truminds Software Systems",
  title: "Code of Conduct",
  docId: "TSS-HR-004",
  classification: "Internal",
  version: "v1.0",
  logoSrc: "/truminds-logo.webp",
  passMark: 0.8,
  certificatePrefix: "TSS-COC",
  signatory: {
    name: "Head of Human Resources",
    title: "Truminds Software Systems",
  },
};

export const SHARED_VIDEO = "/videos/coc.mp4";

export const instructions = {
  eyebrow: "Before you begin",
  title: "Instructions",
  lead: "This module walks you through the Truminds Code of Conduct. Please read these instructions to the end and accept them to begin Chapter 01.",
  sections: [
    {
      heading: "How the module works",
      items: [
        "There are four chapters. Each chapter starts with a short video, followed by the full text of that section of the Code.",
        "Watch each video to the end. You can pause and rewind, but you cannot skip ahead on your first viewing.",
        "When a video finishes, three short questions unlock. Answer them all correctly to unlock the next chapter. Your place in each video is saved if you leave and come back.",
        "Chapters you have completed stay open — you can return to them, rewatch the video and re-read the text at any time.",
      ],
    },
    {
      heading: "Final assessment",
      items: [
        "After all four chapters, a final assessment of 5 multiple-choice questions unlocks.",
        "You need 80% (4 out of 5) to pass. If you score below 80%, you can review the answers and retry as many times as you need. Questions are reshuffled on every attempt.",
        "Your score and number of attempts are recorded and visible to HR.",
      ],
    },
    {
      heading: "Attestation and certificate",
      items: [
        "Once you pass, you will be asked to confirm that you have read, understood and agree to comply with the Code of Conduct.",
        "After you attest, a completion certificate with a unique certificate ID is issued in your name.",
      ],
    },
    {
      heading: "Your progress",
      items: [
        "Progress is saved automatically in this browser on this device. Using a different browser or device will start the module afresh.",
        "Notifications at the top-right of the screen will confirm each step as you go.",
      ],
    },
    {
      heading: "Questions or concerns",
      items: [
        "If anything in the Code is unclear, speak to your manager or contact the HR team. Raising a question is always the right thing to do.",
      ],
    },
  ],
  acceptLabel: "I have read these instructions and accept the terms of this module",
  scrollHint: "Scroll to the end to continue",
};

export const chapters: Chapter[] = [
  {
    id: 1,
    eyebrow: "Chapter 01 · Introduction",
    title: "Why this code exists",
    summary: "What the Code is, who it applies to and why it matters.",
    videoSrc: SHARED_VIDEO,
    blocks: [
      {
        kind: "lead",
        text: "Truminds is built on trust — the trust of our clients, our partners and each other. This Code sets out the standards of behaviour that protect that trust and guide how we work every day.",
      },
      { kind: "heading", text: "What the Code is" },
      {
        kind: "paragraph",
        text: "The Code of Conduct is a statement of the values and principles that every person at Truminds is expected to live by. It does not try to cover every situation you may face. Instead, it gives you a clear reference point for making good decisions, and tells you where to go when you are unsure.",
      },
      { kind: "heading", text: "Who it applies to" },
      {
        kind: "bullets",
        items: [
          "All employees of Truminds Software Systems, at every level and in every location.",
          "Interns, trainees, contractors and consultants working on behalf of Truminds.",
          "Anyone representing Truminds with clients, partners or the public.",
        ],
      },
      { kind: "heading", text: "Why it matters" },
      {
        kind: "paragraph",
        text: "Our reputation is earned through thousands of small decisions made by individuals. A single lapse in judgement can undo years of good work. Following the Code protects you, your colleagues, our clients and the company.",
      },
      {
        kind: "callout",
        title: "Where the Code and local law differ",
        text: "Always comply with the law. Where local law or regulation sets a lower standard than this Code, the Code applies — its ethical standards prevail where laws are less stringent.",
      },
      { kind: "heading", text: "Using your judgement" },
      {
        kind: "paragraph",
        text: "If you face a situation the Code does not address, ask yourself: Is it legal? Is it consistent with the Code and our policies? Would I be comfortable if it were reported publicly? If the answer to any of these is no — or you are not sure — stop and ask your manager or HR before acting.",
      },
    ],
    checks: [
      {
        id: "c1-1",
        prompt: "Who does the Truminds Code of Conduct apply to?",
        options: [
            { id: "a", text: "Permanent employees only" },
            { id: "b", text: "Only people at manager level and above" },
            { id: "c", text: "Employees, interns, trainees, contractors and anyone representing Truminds" },
            { id: "d", text: "Only staff who deal directly with clients" },
        ],
        correctOptionId: "c",
        explanation: "The Code applies to all employees at every level and location, to interns, trainees, contractors and consultants, and to anyone representing Truminds.",
      },
      {
        id: "c1-2",
        prompt: "Local law sets a lower standard than the Code. What applies?",
        options: [
            { id: "a", text: "The local law, because it is lower" },
            { id: "b", text: "The Code, because its ethical standards prevail where laws are less stringent" },
            { id: "c", text: "Whichever the project team prefers" },
            { id: "d", text: "Neither, until HR decides" },
        ],
        correctOptionId: "b",
        explanation: "You must always comply with the law, but where it sets a lower bar than the Code, the Code's higher ethical standard applies.",
      },
      {
        id: "c1-3",
        prompt: "Which question is part of the judgement test for situations the Code does not cover?",
        options: [
            { id: "a", text: "Will this save the company money?" },
            { id: "b", text: "Is this what most colleagues would do?" },
            { id: "c", text: "Would I be comfortable if it were reported publicly?" },
            { id: "d", text: "Can I avoid being noticed?" },
        ],
        correctOptionId: "c",
        explanation: "Ask whether it is legal, consistent with the Code, and something you would be comfortable seeing reported publicly. If unsure, stop and ask before acting.",
      },
    ],
  },
  {
    id: 2,
    eyebrow: "Chapter 02 · Responsibilities",
    title: "What is expected of you",
    summary: "Your responsibilities, and the extra duties of people who lead others.",
    videoSrc: SHARED_VIDEO,
    blocks: [
      {
        kind: "lead",
        text: "The company's reputation is its most valuable asset. How we conduct ourselves day to day with each other, our clients and our stakeholders forms the basis of our ethical conduct as a company.",
      },
      {
        kind: "cards",
        cards: [
          {
            label: "Every employee",
            items: [
              "Take time to review and develop a working knowledge of the Code and Truminds' policies, and follow them at all times.",
              "Comply with applicable laws, rules and regulations, and promote ethical conduct of the business.",
              "Raise concerns promptly when you see behaviour that may breach the Code.",
              "Cooperate fully and honestly with any internal review or investigation.",
            ],
          },
          {
            label: "Heads of department and above",
            items: [
              "Drive a culture of integrity, honesty, ethical conduct and law-abiding behaviour among other employees.",
              "Be role models of the behaviours expected, and encourage others to abide by the Code.",
              "Make sure team members complete Code of Conduct training on time.",
              "Respond to concerns seriously, and never retaliate or allow retaliation against anyone who raises one.",
            ],
          },
        ],
      },
      { kind: "heading", text: "Speaking up" },
      {
        kind: "paragraph",
        text: "If you believe the Code has been breached, raise it with your manager, a senior leader or HR. Concerns raised in good faith will be treated confidentially to the extent possible, and Truminds does not tolerate retaliation of any kind against the person who raised them.",
      },
      { kind: "heading", text: "Annual acknowledgement" },
      {
        kind: "paragraph",
        text: "Every employee is required to complete this module and acknowledge the Code when they join and whenever the Code is materially updated. Completion is recorded by HR.",
      },
    ],
    checks: [
      {
        id: "c2-1",
        prompt: "Which of these is expected of every employee?",
        options: [
            { id: "a", text: "Raise concerns promptly when you see behaviour that may breach the Code" },
            { id: "b", text: "Wait for HR to notice problems" },
            { id: "c", text: "Investigate suspected breaches privately" },
            { id: "d", text: "Share concerns only with clients" },
        ],
        correctOptionId: "a",
        explanation: "Every employee is expected to raise concerns promptly and to cooperate fully and honestly with any internal review.",
      },
      {
        id: "c2-2",
        prompt: "What extra duty do Heads of Department and above have?",
        options: [
            { id: "a", text: "Approve exceptions to the Code for their team" },
            { id: "b", text: "Handle all concerns without involving HR" },
            { id: "c", text: "Be role models and encourage others to follow the Code" },
            { id: "d", text: "They have no extra duties" },
        ],
        correctOptionId: "c",
        explanation: "Leaders drive a culture of integrity, act as role models and make sure their teams complete Code of Conduct training on time.",
      },
      {
        id: "c2-3",
        prompt: "Someone raises a concern in good faith. How must Truminds treat the person who raised it?",
        options: [
            { id: "a", text: "Keep it confidential where possible and never retaliate" },
            { id: "b", text: "Share their name with the whole team" },
            { id: "c", text: "Ask them to withdraw the concern" },
            { id: "d", text: "Move them to a different team" },
        ],
        correctOptionId: "a",
        explanation: "Good-faith concerns are treated confidentially to the extent possible, and Truminds does not tolerate retaliation of any kind.",
      },
    ],
  },
  {
    id: 3,
    eyebrow: "Chapter 03 · Workplace",
    title: "Respect and dignity",
    summary: "A workplace free from harassment, discrimination and bullying.",
    videoSrc: SHARED_VIDEO,
    blocks: [
      {
        kind: "lead",
        text: "Everyone at Truminds has the right to be treated with respect and dignity. We value the different backgrounds, perspectives and experiences of our people, and we expect everyone to help create a workplace where all can do their best work.",
      },
      { kind: "heading", text: "Equal opportunity" },
      {
        kind: "paragraph",
        text: "Decisions about hiring, pay, promotion, training and every other aspect of employment are made on merit, skills and performance. We do not discriminate on the basis of gender, age, religion, caste, disability, marital status, sexual orientation, or any other characteristic protected by law.",
      },
      { kind: "heading", text: "Zero tolerance for harassment" },
      {
        kind: "paragraph",
        text: "Harassment of any kind — verbal, physical, visual or online — is not acceptable. This includes sexual harassment, which is addressed under our Prevention of Sexual Harassment (POSH) policy and its Internal Committee.",
      },
      {
        kind: "bullets",
        items: [
          "Unwelcome comments, jokes or messages about someone's appearance or personal life.",
          "Intimidation, threats, shouting or deliberately humiliating someone.",
          "Excluding or undermining a colleague, in person or in group chats.",
          "Sharing offensive images, memes or content at work or on work channels.",
        ],
      },
      { kind: "heading", text: "Respect extends beyond the office" },
      {
        kind: "paragraph",
        text: "These standards apply wherever you represent Truminds — at client sites, team events, work travel, and on social media and messaging platforms when you are interacting with colleagues or clients.",
      },
      {
        kind: "callout",
        title: "If it happens to you or someone else",
        text: "You do not have to handle it alone. Report it to your manager, HR, or the Internal Committee. Every report is taken seriously and handled confidentially.",
      },
    ],
    checks: [
      {
        id: "c3-1",
        prompt: "On what basis are decisions about hiring, pay and promotion made?",
        options: [
            { id: "a", text: "Seniority and personal relationships" },
            { id: "b", text: "Merit, skills and performance" },
            { id: "c", text: "Who the manager prefers" },
            { id: "d", text: "Age and years in the company" },
        ],
        correctOptionId: "b",
        explanation: "Employment decisions are made on merit, skills and performance, without discrimination on any protected characteristic.",
      },
      {
        id: "c3-2",
        prompt: "Which of these counts as harassment?",
        options: [
            { id: "a", text: "Giving a colleague constructive feedback in a review" },
            { id: "b", text: "Sharing offensive memes on a work channel" },
            { id: "c", text: "Disagreeing with a colleague in a meeting" },
            { id: "d", text: "Declining a meeting invitation" },
        ],
        correctOptionId: "b",
        explanation: "Harassment can be verbal, physical, visual or online. Sharing offensive images or memes on work channels is not acceptable.",
      },
      {
        id: "c3-3",
        prompt: "Where do the respect and dignity standards apply?",
        options: [
            { id: "a", text: "Only inside the office" },
            { id: "b", text: "Only during working hours" },
            { id: "c", text: "Only when a manager is present" },
            { id: "d", text: "Wherever you represent Truminds, including client sites, events, travel and online platforms" },
        ],
        correctOptionId: "d",
        explanation: "These standards go beyond the office to client sites, team events, work travel, and social media and messaging when dealing with colleagues or clients.",
      },
    ],
  },
  {
    id: 4,
    eyebrow: "Chapter 04 · Wellbeing",
    title: "Conduct, health and safety",
    summary: "Professional behaviour and keeping yourself and others safe.",
    videoSrc: SHARED_VIDEO,
    blocks: [
      {
        kind: "lead",
        text: "A safe, healthy and professional workplace is a shared responsibility. Each of us is expected to act in a way that protects our own wellbeing and that of the people around us.",
      },
      { kind: "heading", text: "Professional conduct" },
      {
        kind: "bullets",
        items: [
          "Be punctual, prepared and responsive, and honour the commitments you make.",
          "Dress and behave appropriately for the setting — office, client site or virtual meeting.",
          "Communicate courteously in person, by email, and on chat and collaboration tools.",
          "Use company time and resources for company work.",
        ],
      },
      { kind: "heading", text: "Alcohol, drugs and substances" },
      {
        kind: "paragraph",
        text: "Working under the influence of alcohol, illegal drugs or any substance that impairs your judgement is prohibited. Alcohol may only be consumed at company events where it has been approved, and always in moderation.",
      },
      { kind: "heading", text: "Health and safety" },
      {
        kind: "bullets",
        items: [
          "Follow all safety instructions, fire evacuation procedures and building rules.",
          "Report hazards, unsafe conditions, accidents and near-misses immediately to the facilities team or HR.",
          "Look after your physical and mental wellbeing, and speak to your manager or HR if your workload or environment is affecting your health.",
          "Never put yourself or others at risk to meet a deadline.",
        ],
      },
      {
        kind: "callout",
        title: "Violence is never acceptable",
        text: "Threats, violence or carrying weapons on company premises or at company events are strictly prohibited and will result in disciplinary action.",
      },
    ],
    checks: [
      {
        id: "c4-1",
        prompt: "When may alcohol be consumed in a work context?",
        options: [
            { id: "a", text: "Only at approved company events, and in moderation" },
            { id: "b", text: "Any time after 5 pm" },
            { id: "c", text: "During client calls if the client agrees" },
            { id: "d", text: "Whenever a colleague offers" },
        ],
        correctOptionId: "a",
        explanation: "Alcohol is only allowed at company events where it has been approved, and always in moderation. Working under the influence is prohibited.",
      },
      {
        id: "c4-2",
        prompt: "You spot a fire exit blocked by boxes. What should you do?",
        options: [
            { id: "a", text: "Leave it for the facilities team to find" },
            { id: "b", text: "Report it immediately to the facilities team or HR" },
            { id: "c", text: "Mention it at the next team meeting" },
            { id: "d", text: "Ignore it if there is no fire drill planned" },
        ],
        correctOptionId: "b",
        explanation: "Hazards, unsafe conditions, accidents and near-misses must be reported immediately.",
      },
      {
        id: "c4-3",
        prompt: "How does the Code treat threats, violence or weapons on company premises?",
        options: [
            { id: "a", text: "They are allowed with a manager's approval" },
            { id: "b", text: "They are discouraged but tolerated" },
            { id: "c", text: "They are only an issue if someone is hurt" },
            { id: "d", text: "They are strictly prohibited and lead to disciplinary action" },
        ],
        correctOptionId: "d",
        explanation: "Threats, violence or carrying weapons on company premises or at company events are strictly prohibited.",
      },
    ],
  },
];

export const questions: Question[] = [
  {
    id: "q1",
    prompt: "A local regulation sets a lower standard than the Truminds Code. Which standard do you follow?",
    options: [
      { id: "a", text: "The local regulation, because it is the law" },
      { id: "b", text: "Whichever is easier to apply on the project" },
      { id: "c", text: "The Code — its ethical standards prevail where laws are less stringent" },
      { id: "d", text: "Whatever the client prefers" },
    ],
    correctOptionId: "c",
    explanation: "Always comply with the law, but where the law sets a lower bar, the Code's higher ethical standard applies.",
  },
  {
    id: "q2",
    prompt: "Which of these is an additional responsibility of Heads of Department and above?",
    options: [
      { id: "a", text: "Approving exceptions to the Code for their own team" },
      { id: "b", text: "Being role models of expected behaviour and encouraging others to follow the Code" },
      { id: "c", text: "Investigating every concern personally without involving HR" },
      { id: "d", text: "Nothing beyond what every employee must do" },
    ],
    correctOptionId: "b",
    explanation: "Leaders must drive a culture of integrity and act as role models, encouraging their teams to abide by the Code.",
  },
  {
    id: "q3",
    prompt: "A colleague keeps posting jokes about another teammate's appearance in the team chat. What should you do?",
    options: [
      { id: "a", text: "Ignore it — it's only a chat group, not the office" },
      { id: "b", text: "Join in so you don't seem unfriendly" },
      { id: "c", text: "Report it to your manager, HR or the Internal Committee" },
      { id: "d", text: "Leave the chat group quietly" },
    ],
    correctOptionId: "c",
    explanation: "Respect applies on chat and online channels too. Unwelcome comments about someone's appearance are harassment and should be reported.",
  },
  {
    id: "q4",
    prompt: "You notice a damaged electrical socket near your desk. What is the right action?",
    options: [
      { id: "a", text: "Report it to the facilities team or HR immediately" },
      { id: "b", text: "Try to fix it yourself to save time" },
      { id: "c", text: "Put a note on it and report it at the next team meeting" },
      { id: "d", text: "Nothing — it is facilities' job to notice" },
    ],
    correctOptionId: "a",
    explanation: "Hazards and unsafe conditions must be reported immediately so they can be fixed before anyone is hurt.",
  },
  {
    id: "q5",
    prompt: "You face a situation the Code does not address and you are not sure what to do. What should you do first?",
    options: [
      { id: "a", text: "Do what your peers usually do in similar cases" },
      { id: "b", text: "Proceed if it is not explicitly forbidden" },
      { id: "c", text: "Decide later if anyone asks about it" },
      { id: "d", text: "Stop and ask your manager or HR before acting" },
    ],
    correctOptionId: "d",
    explanation: "When in doubt, pause and ask. The Code is a guide for judgement, and asking is always the right first step.",
  },
];

export const attestation = {
  eyebrow: "Final step",
  title: "Attestation",
  lead: "Please confirm that you have completed this module and will abide by the Truminds Code of Conduct.",
  statement:
    "I confirm that I have read and understood the Truminds Code of Conduct (TSS-HR-004). I agree to comply with it and with Truminds' policies at all times, and I understand that a breach of the Code may lead to disciplinary action.",
  checkboxLabel: "I have read, understood and agree to comply with the Code of Conduct",
  nameLabel: "Type your full name as your signature",
};

/** Every learner-facing notification message lives here. */
export const messages = {
  signedIn: (name: string) => `Welcome, ${name}`,
  signedOut: "You have been signed out",
  instructionsAccepted: "Terms accepted — Chapter 01 unlocked",
  videoHalf: (ch: number) => `Halfway through Chapter ${pad(ch)} — keep going`,
  videoAlmost: (ch: number) => `Almost done — Chapter ${pad(ch)} wraps up shortly`,
  skipBlocked: "Please watch the video fully before skipping ahead",
  videoDone: (ch: number) => `Video complete — answer 3 questions to finish Chapter ${pad(ch)}`,
  checkWrong: "Not quite — read the hint and try again",
  chapterComplete: (ch: number) => `Chapter ${pad(ch)} complete — Chapter ${pad(ch + 1)} unlocked`,
  modulesHalf: "You're halfway through the chapters",
  allChaptersDone: "All chapters complete — Assessment unlocked",
  submitTitle: "Submit your answers?",
  submitBody: "You can't change your answers after submitting.",
  passed: (pct: number) => `Passed with ${pct}% — please complete your attestation`,
  nearMiss: (pct: number) => `So close — ${pct}%. Review the answers and try again`,
  failed: (pct: number) => `${pct}% — 80% needed to pass. Review the answers and retry`,
  retry: "New attempt — questions reshuffled",
  lockedStep: (requirement: string) => `Complete ${requirement} to unlock this step`,
  progressSaved: "Progress saved",
  attested: "Attestation recorded — certificate ready",
  pdfPlaceholder: "PDF download coming soon",
  csvExported: (n: number) => `Exported ${n} records`,
  resetTitle: "Reset all demo progress?",
  resetBody: "This clears the demo learner's progress, attempts and certificate in this browser. Mock employees are not affected.",
  resetDone: "Demo data reset",
  videoMissing: "Video not added yet",
};

export function pad(n: number) {
  return String(n).padStart(2, "0");
}
