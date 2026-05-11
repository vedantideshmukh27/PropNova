/**
 * PropIntel AI Matching Engine
 * Handles intelligence extraction and compatibility scoring.
 */

export interface Property {
  id: string;
  title: string;
  price: number;
  location: string;
  property_type: string;
  listing_type: string;
  amenities: string[];
}

export interface BuyerProfile {
  id: string;
  preferred_location: string[];
  min_budget: number;
  max_budget: number;
  preferred_type: string[];
  urgency: string;
  timeline: string;
}

export interface MatchResult {
  score: number;
  intent: 'high' | 'medium' | 'low';
  reasons: string[];
}

/**
 * Calculates a match score between a buyer and a property.
 * In a real production app, this would call OpenAI to analyze unstructured data.
 */
export const calculateMatch = (buyer: BuyerProfile, property: Property): MatchResult => {
  let score = 0;
  const reasons: string[] = [];

  // 1. Location Match (30%)
  const isLocationMatch = buyer.preferred_location.some(loc => 
    property.location.toLowerCase().includes(loc.toLowerCase())
  );
  if (isLocationMatch) {
    score += 30;
    reasons.push('Matches preferred location');
  }

  // 2. Budget Match (30%)
  if (property.price >= buyer.min_budget && property.price <= buyer.max_budget) {
    score += 30;
    reasons.push('Perfect budget fit');
  } else if (property.price <= buyer.max_budget * 1.1) {
    score += 15;
    reasons.push('Slightly above budget but high value');
  }

  // 3. Property Type Match (20%)
  if (buyer.preferred_type.includes(property.property_type)) {
    score += 20;
    reasons.push(`Preferred property type (${property.property_type})`);
  }

  // 4. Urgency & Intent (20%)
  if (buyer.urgency === 'immediate') {
    score += 20;
  } else if (buyer.urgency === '1_month') {
    score += 10;
  }

  // Intent classification
  let intent: 'high' | 'medium' | 'low' = 'low';
  if (score >= 85) intent = 'high';
  else if (score >= 60) intent = 'medium';

  return {
    score,
    intent,
    reasons
  };
};

/**
 * AI Lead Intelligence Generator
 * Simulates OpenAI's capability to summarize buyer intent.
 */
export const generateBuyerIntel = async (buyer: BuyerProfile) => {
  // In production, this would be: 
  // const response = await openai.chat.completions.create({...})
  
  const summaries = [
    "High-intent buyer looking for immediate closure. Budget is firm and fits luxury profile.",
    "Actively exploring Bandra area. Shows preference for sea-facing properties with smart home features.",
    "Investment-focused buyer. Analyzing rental yield potential and long-term appreciation."
  ];

  return summaries[Math.floor(Math.random() * summaries.length)];
};
