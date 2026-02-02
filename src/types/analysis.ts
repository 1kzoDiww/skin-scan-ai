export type SkinType = "dry" | "oily" | "combination" | "normal" | "sensitive";
export type Severity = "mild" | "moderate" | "severe";

export interface ProblemZone {
  x: number; // percentage from left
  y: number; // percentage from top
  problem: string;
  severity: Severity;
}

export interface SkinCondition {
  name: string;
  description: string;
  severity: Severity;
}

export interface Recommendation {
  title: string;
  description: string;
  category: "skincare" | "lifestyle" | "products" | "professional";
}

export interface SkinAnalysisResult {
  skinType: SkinType;
  skinTypeDescription: string;
  conditions: SkinCondition[];
  problemZones: ProblemZone[];
  possibleCauses: string[];
  recommendations: Recommendation[];
  shouldSeeDermatologist: boolean;
  dermatologistReason?: string;
  overallHealth: number; // 0-100
  summary: string;
}
