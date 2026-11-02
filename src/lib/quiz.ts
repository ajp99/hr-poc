import { questions, type Question } from "@/content/module";

export function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

/** A fresh attempt: question order and each question's option order are shuffled. */
export function buildAttempt(): Question[] {
  return shuffle(questions).map((q) => ({ ...q, options: shuffle(q.options) }));
}

export function scoreAnswers(answers: Record<string, string>) {
  return questions.filter((q) => answers[q.id] === q.correctOptionId).length;
}

export const LETTERS = ["A", "B", "C", "D", "E", "F"];
