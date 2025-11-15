export interface FinancialEstimate {
  metric: string;
  value: string;
  confidence: 'High' | 'Medium' | 'Low';
}

export interface ReportData {
  id: string;
  analysisDate: string;
  shop_name: string;
  trust_score: string; // e.g., "B+"
  recommendation_summary: string; // e.g., "LOW RISK"
  executive_summary: string;
  financial_estimates: FinancialEstimate[];
  positive_indicators: string[];
  risks_or_concerns: string[];
  final_recommendation_and_rationale: string;
}
