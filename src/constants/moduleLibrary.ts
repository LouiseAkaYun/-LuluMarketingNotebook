import { 
  BarChart3, 
  TrendingUp, 
  Globe, 
  ShieldAlert, 
  Users, 
  UserCircle, 
  Map, 
  Search, 
  Target, 
  Zap, 
  Layers, 
  PieChart, 
  Network, 
  Rocket, 
  FileText,
  Compass,
  Tag,
  MessageSquare,
  Box,
  DollarSign,
  Activity,
  Briefcase
} from 'lucide-react';
import React from 'react';

export interface ModuleDefinition {
  type: string;
  name: string;
  category: string;
  icon: React.ElementType;
  columns: { key: string; label: string; type: 'text' | 'textarea' | 'select'; options?: string[] }[];
}

export const MODULE_LIBRARY: ModuleDefinition[] = [
  // Competitive Analysis
  {
    type: 'competitor_analysis',
    name: 'Competitor Analysis',
    category: 'Competitive Analysis',
    icon: Search,
    columns: [
      { key: 'competitor', label: 'Competitor', type: 'text' },
      { key: 'brand', label: 'Brand', type: 'text' },
      { key: 'platform', label: 'Platform', type: 'text' },
      { key: 'price', label: 'Price', type: 'text' },
      { key: 'rating', label: 'Rating', type: 'text' },
      { key: 'key_feature', label: 'Key Feature', type: 'text' },
      { key: 'strength', label: 'Strength', type: 'textarea' },
      { key: 'weakness', label: 'Weakness', type: 'textarea' },
      { key: 'market_position', label: 'Market Position', type: 'text' },
    ]
  },
  {
    type: 'competitor_overview',
    name: 'Competitor Overview',
    category: 'Competitive Analysis',
    icon: ShieldAlert,
    columns: [
      { key: 'brand', label: 'Brand', type: 'text' },
      { key: 'main_product', label: 'Main Product', type: 'text' },
      { key: 'price_range', label: 'Price Range', type: 'text' },
      { key: 'market_share', label: 'Market Share', type: 'text' },
      { key: 'target_segment', label: 'Target Segment', type: 'text' },
      { key: 'core_advantage', label: 'Core Advantage', type: 'textarea' },
    ]
  },
  {
    type: 'product_comparison',
    name: 'Product Comparison',
    category: 'Competitive Analysis',
    icon: Box,
    columns: [
      { key: 'product', label: 'Product', type: 'text' },
      { key: 'brand', label: 'Brand', type: 'text' },
      { key: 'price', label: 'Price', type: 'text' },
      { key: 'size', label: 'Size', type: 'text' },
      { key: 'weight', label: 'Weight', type: 'text' },
      { key: 'key_feature', label: 'Key Feature', type: 'text' },
      { key: 'battery', label: 'Battery', type: 'text' },
      { key: 'material', label: 'Material', type: 'text' },
      { key: 'target_user', label: 'Target User', type: 'text' },
    ]
  },
  {
    type: 'pricing_benchmark',
    name: 'Pricing Benchmark',
    category: 'Competitive Analysis',
    icon: DollarSign,
    columns: [
      { key: 'brand', label: 'Brand', type: 'text' },
      { key: 'product', label: 'Product', type: 'text' },
      { key: 'platform', label: 'Platform', type: 'text' },
      { key: 'price', label: 'Price', type: 'text' },
      { key: 'discount', label: 'Discount', type: 'text' },
      { key: 'price_tier', label: 'Price Tier', type: 'text' },
      { key: 'notes', label: 'Notes', type: 'textarea' },
    ]
  },

  // Market Analysis
  {
    type: 'market_size',
    name: 'Market Size',
    category: 'Market Analysis',
    icon: BarChart3,
    columns: [
      { key: 'region', label: 'Region', type: 'text' },
      { key: 'year', label: 'Year', type: 'text' },
      { key: 'market_size', label: 'Market Size', type: 'text' },
      { key: 'growth_rate', label: 'Growth Rate', type: 'text' },
      { key: 'source', label: 'Source', type: 'text' },
      { key: 'notes', label: 'Notes', type: 'textarea' },
    ]
  },
  {
    type: 'market_trend',
    name: 'Market Trend',
    category: 'Market Analysis',
    icon: TrendingUp,
    columns: [
      { key: 'trend', label: 'Trend', type: 'text' },
      { key: 'description', label: 'Description', type: 'textarea' },
      { key: 'evidence', label: 'Evidence', type: 'textarea' },
      { key: 'impact', label: 'Impact', type: 'select', options: ['High', 'Medium', 'Low'] },
      { key: 'time_horizon', label: 'Time Horizon', type: 'text' },
    ]
  },
  {
    type: 'pestle',
    name: 'PESTLE',
    category: 'Market Analysis',
    icon: Globe,
    columns: [
      { key: 'factor', label: 'Factor', type: 'select', options: ['Political', 'Economic', 'Social', 'Technological', 'Legal', 'Environmental'] },
      { key: 'impact', label: 'Impact', type: 'select', options: ['Positive', 'Negative', 'Neutral'] },
      { key: 'description', label: 'Description', type: 'textarea' },
    ]
  },
  {
    type: 'porter_five_forces',
    name: "Porter's Five Forces",
    category: 'Market Analysis',
    icon: Activity,
    columns: [
      { key: 'force', label: 'Force', type: 'select', options: ['Supplier Power', 'Buyer Power', 'Competitive Rivalry', 'Threat of Substitutes', 'Threat of New Entrants'] },
      { key: 'level', label: 'Level', type: 'select', options: ['High', 'Medium', 'Low'] },
      { key: 'explanation', label: 'Explanation', type: 'textarea' },
    ]
  },

  // Customer Analysis
  {
    type: 'customer_needs',
    name: 'Customer Needs',
    category: 'Customer Analysis',
    icon: MessageSquare,
    columns: [
      { key: 'segment', label: 'Customer Segment', type: 'text' },
      { key: 'need', label: 'Need', type: 'text' },
      { key: 'pain_point', label: 'Pain Point', type: 'textarea' },
      { key: 'solution', label: 'Current Solution', type: 'textarea' },
      { key: 'opportunity', label: 'Opportunity', type: 'textarea' },
    ]
  },
  {
    type: 'customer_persona',
    name: 'Customer Persona',
    category: 'Customer Analysis',
    icon: UserCircle,
    columns: [
      { key: 'persona_name', label: 'Persona Name', type: 'text' },
      { key: 'age', label: 'Age', type: 'text' },
      { key: 'occupation', label: 'Occupation', type: 'text' },
      { key: 'lifestyle', label: 'Lifestyle', type: 'textarea' },
      { key: 'needs', label: 'Needs', type: 'textarea' },
      { key: 'motivation', label: 'Buying Motivation', type: 'textarea' },
      { key: 'budget', label: 'Budget', type: 'text' },
      { key: 'channel', label: 'Preferred Channel', type: 'text' },
    ]
  },
  {
    type: 'customer_journey',
    name: 'Customer Journey',
    category: 'Customer Analysis',
    icon: Map,
    columns: [
      { key: 'stage', label: 'Stage', type: 'select', options: ['Awareness', 'Consideration', 'Purchase', 'Usage', 'Repeat'] },
      { key: 'action', label: 'Customer Action', type: 'textarea' },
      { key: 'channel', label: 'Channel', type: 'text' },
      { key: 'pain_point', label: 'Pain Point', type: 'textarea' },
      { key: 'opportunity', label: 'Opportunity', type: 'textarea' },
    ]
  },

  // Product Opportunity
  {
    type: 'feature_gap',
    name: 'Feature Gap',
    category: 'Product Opportunity',
    icon: Zap,
    columns: [
      { key: 'feature', label: 'Feature', type: 'text' },
      { key: 'competitor_support', label: 'Competitor Support', type: 'textarea' },
      { key: 'expectation', label: 'Market Expectation', type: 'textarea' },
      { key: 'gap_level', label: 'Gap Level', type: 'select', options: ['High', 'Medium', 'Low'] },
      { key: 'opportunity', label: 'Opportunity', type: 'textarea' },
    ]
  },
  {
    type: 'product_opportunity',
    name: 'Product Opportunity',
    category: 'Product Opportunity',
    icon: Rocket,
    columns: [
      { key: 'opportunity', label: 'Opportunity', type: 'text' },
      { key: 'segment', label: 'Customer Segment', type: 'text' },
      { key: 'problem', label: 'Problem', type: 'textarea' },
      { key: 'solution', label: 'Proposed Solution', type: 'textarea' },
      { key: 'potential', label: 'Market Potential', type: 'text' },
      { key: 'risk', label: 'Risk', type: 'textarea' },
    ]
  },
  {
    type: 'opportunity_score',
    name: 'Opportunity Score',
    category: 'Product Opportunity',
    icon: Target,
    columns: [
      { key: 'dimension', label: 'Dimension', type: 'select', options: ['Market Demand', 'Competition Level', 'Profit Margin', 'Differentiation', 'Trend Momentum', 'Supply Complexity'] },
      { key: 'score', label: 'Score (1-10)', type: 'text' },
      { key: 'notes', label: 'Notes', type: 'textarea' },
    ]
  },

  // Marketing Strategy
  {
    type: 'stp',
    name: 'STP',
    category: 'Marketing Strategy',
    icon: Compass,
    columns: [
      { key: 'segment', label: 'Segment', type: 'text' },
      { key: 'target', label: 'Target', type: 'text' },
      { key: 'positioning', label: 'Positioning', type: 'text' },
      { key: 'value_prop', label: 'Value Proposition', type: 'textarea' },
    ]
  },
  {
    type: '7p',
    name: '7P',
    category: 'Marketing Strategy',
    icon: Layers,
    columns: [
      { key: 'element', label: 'Element', type: 'select', options: ['Product', 'Price', 'Place', 'Promotion', 'People', 'Process', 'Physical Evidence'] },
      { key: 'strategy', label: 'Strategy', type: 'textarea' },
      { key: 'notes', label: 'Notes', type: 'textarea' },
    ]
  },
  {
    type: 'channel_strategy',
    name: 'Channel Strategy',
    category: 'Marketing Strategy',
    icon: Network,
    columns: [
      { key: 'channel', label: 'Channel', type: 'text' },
      { key: 'segment', label: 'Customer Segment', type: 'text' },
      { key: 'pros', label: 'Pros', type: 'textarea' },
      { key: 'cons', label: 'Cons', type: 'textarea' },
      { key: 'priority', label: 'Priority', type: 'select', options: ['High', 'Medium', 'Low'] },
    ]
  },
  {
    type: 'brand_positioning',
    name: 'Brand Positioning',
    category: 'Marketing Strategy',
    icon: Tag,
    columns: [
      { key: 'brand', label: 'Brand', type: 'text' },
      { key: 'target', label: 'Target Customer', type: 'text' },
      { key: 'price_tier', label: 'Price Tier', type: 'text' },
      { key: 'message', label: 'Core Message', type: 'textarea' },
      { key: 'differentiation', label: 'Differentiation', type: 'textarea' },
    ]
  },

  // Strategic Framework
  {
    type: 'swot',
    name: 'SWOT',
    category: 'Strategic Framework',
    icon: Briefcase,
    columns: [
      { key: 'strength', label: 'Strength', type: 'textarea' },
      { key: 'weakness', label: 'Weakness', type: 'textarea' },
      { key: 'opportunity', label: 'Opportunity', type: 'textarea' },
      { key: 'threat', label: 'Threat', type: 'textarea' },
    ]
  },
  {
    type: 'bcg_matrix',
    name: 'BCG Matrix',
    category: 'Strategic Framework',
    icon: PieChart,
    columns: [
      { key: 'product', label: 'Product', type: 'text' },
      { key: 'growth', label: 'Market Growth', type: 'text' },
      { key: 'share', label: 'Market Share', type: 'text' },
      { key: 'category', label: 'Category', type: 'select', options: ['Star', 'Cash Cow', 'Question Mark', 'Dog'] },
      { key: 'notes', label: 'Notes', type: 'textarea' },
    ]
  },
  {
    type: 'value_chain',
    name: 'Value Chain',
    category: 'Strategic Framework',
    icon: Users,
    columns: [
      { key: 'activity', label: 'Activity', type: 'select', options: ['Raw Material', 'Manufacturing', 'Brand', 'Distribution', 'Retail'] },
      { key: 'players', label: 'Key Players', type: 'textarea' },
      { key: 'contribution', label: 'Value Contribution', type: 'textarea' },
      { key: 'opportunity', label: 'Opportunity', type: 'textarea' },
    ]
  },
  {
    type: 'growth_strategy',
    name: 'Growth Strategy',
    category: 'Strategic Framework',
    icon: TrendingUp,
    columns: [
      { key: 'strategy', label: 'Strategy', type: 'text' },
      { key: 'description', label: 'Description', type: 'textarea' },
      { key: 'target', label: 'Target Market', type: 'text' },
      { key: 'risk', label: 'Risk', type: 'textarea' },
      { key: 'priority', label: 'Priority', type: 'select', options: ['High', 'Medium', 'Low'] },
    ]
  },

  // General
  {
    type: 'notes',
    name: 'Notes',
    category: 'General',
    icon: FileText,
    columns: [
      { key: 'date', label: 'Date', type: 'text' },
      { key: 'observation', label: 'Observation', type: 'textarea' },
      { key: 'source', label: 'Source', type: 'text' },
      { key: 'insight', label: 'Insight', type: 'textarea' },
    ]
  }
];
