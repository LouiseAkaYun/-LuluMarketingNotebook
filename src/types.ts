export interface Project {
  id: string;
  name: string;
  description: string;
  status: string;
  created_at: string;
}

export interface Industry {
  id: string;
  project_id: string;
  name: string;
  description: string;
  region: string;
  industry_size: string;
  tags: string[];
  created_at: string;
}

export interface Category {
  id: string;
  project_id: string;
  name: string;
  description: string;
  tags: string[];
  created_at: string;
}

export interface Product {
  id: string;
  project_id: string;
  category_id: string;
  name: string;
  description: string;
  market: string;
  price_range: string;
  research_date: string;
  tags: string[];
  created_at: string;
}

export interface Module {
  id: string;
  parent_type: 'industry' | 'category' | 'product';
  parent_id: string;
  module_type: string;
  module_order: number;
  notes: string;
  created_at: string;
}

export interface ModuleRow {
  id: string;
  module_id: string;
  row_data: any;
  created_at: string;
}
