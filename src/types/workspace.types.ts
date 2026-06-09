/**
 * Types for the file-upload analysis flow.
 * Backend (user-workspace-service + ml-service advice) serializes these
 * endpoints in snake_case, so the interfaces mirror the wire format exactly.
 */

/** Workspace lifecycle — see Workspace.java (user-workspace-service). */
export type WorkspaceStatus = "INIT" | "PROCESSING" | "COMPLETED" | "FAILED"

/** GET /api/v1/workspaces/history → WorkspaceResponse[] */
export interface WorkspaceHistoryItem {
  id: string
  user_id: string | null
  name: string
  status: WorkspaceStatus
  error_message?: string | null
  progress: number | null
  created_at: string | null
  updated_at: string | null
}

/** POST /api/v1/workspaces (request) */
export interface CreateWorkspaceRequest {
  workspace_name: string
  file_name: string
  content_type: string
}

/** POST /api/v1/workspaces (response) */
export interface CreateWorkspaceResponse {
  workspace_id: string
  s3_presigned_url: string
}

/**
 * Advice status from ml-service inventory_advice flow.
 * PROCESSING|DONE|ERROR come from the backend; PENDING is synthetic — the FE
 * uses it when the advice row does not exist yet (GET returns 404) so polling
 * can keep waiting instead of treating it as a hard error.
 */
export type AdviceStatus = "PENDING" | "PROCESSING" | "DONE" | "ERROR"

/** Priority weight the advisor assigns to a strategy row. */
export type StrategyPriority = "HIGH" | "MEDIUM" | "LOW"

/** One row of result.inventory_strategy from the LLM advisor. */
export interface InventoryStrategyItem {
  item_id_or_category?: string
  issue?: string
  action?: string
  /** Impact on cash flow / revenue — drives the priority badge. */
  priority?: StrategyPriority
  /** Set for clearance/promo actions. */
  discount_percentage_recommendation?: number | null
  /** Set for restock actions ("Nhập thêm"). */
  suggested_restock_quantity?: number | null
  target_channel?: string
  reasoning?: string
}

/** One row of result.trend_forecasting from the LLM advisor. */
export interface TrendForecastItem {
  suggested_item?: string
  relevance_to_current_inventory?: string
  estimated_import_quantity?: number
  expected_retail_price_range?: string
  /** Cited Google Trends / search-interest signal backing the suggestion. */
  trend_evidence?: string
  market_trend_reasoning?: string
}

/** Parsed `result` JSON of the advice payload. */
export interface AdviceResult {
  inventory_strategy?: InventoryStrategyItem[]
  trend_forecasting?: TrendForecastItem[]
}

/** GET /api/v1/ml/recommendations/advice/{workspace_id} */
export interface AdviceResponse {
  workspace_id: string
  status: AdviceStatus
  result: AdviceResult | null
  error_log?: string | null
  created_at?: string | null
  updated_at?: string | null
}
