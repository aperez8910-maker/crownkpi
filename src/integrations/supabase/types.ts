export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "14.1"
  }
  public: {
    Tables: {
      alert_history: {
        Row: {
          changes_summary: string | null
          competitor_url: string
          email: string
          email_sent: boolean
          id: string
          new_score: number
          old_score: number
          score_change: number
          sent_at: string
          subscription_id: string | null
        }
        Insert: {
          changes_summary?: string | null
          competitor_url: string
          email: string
          email_sent?: boolean
          id?: string
          new_score: number
          old_score: number
          score_change: number
          sent_at?: string
          subscription_id?: string | null
        }
        Update: {
          changes_summary?: string | null
          competitor_url?: string
          email?: string
          email_sent?: boolean
          id?: string
          new_score?: number
          old_score?: number
          score_change?: number
          sent_at?: string
          subscription_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "alert_history_subscription_id_fkey"
            columns: ["subscription_id"]
            isOneToOne: false
            referencedRelation: "competitor_subscriptions"
            referencedColumns: ["id"]
          },
        ]
      }
      analysis_reports: {
        Row: {
          competitor_insights: string | null
          created_at: string
          hostname: string
          id: string
          marketing_channels: Json | null
          recommendations: string[] | null
          seo_score: number
          strengths: string[] | null
          top_keywords: string[] | null
          traffic_estimate: string | null
          url: string
          weaknesses: string[] | null
        }
        Insert: {
          competitor_insights?: string | null
          created_at?: string
          hostname: string
          id?: string
          marketing_channels?: Json | null
          recommendations?: string[] | null
          seo_score: number
          strengths?: string[] | null
          top_keywords?: string[] | null
          traffic_estimate?: string | null
          url: string
          weaknesses?: string[] | null
        }
        Update: {
          competitor_insights?: string | null
          created_at?: string
          hostname?: string
          id?: string
          marketing_channels?: Json | null
          recommendations?: string[] | null
          seo_score?: number
          strengths?: string[] | null
          top_keywords?: string[] | null
          traffic_estimate?: string | null
          url?: string
          weaknesses?: string[] | null
        }
        Relationships: []
      }
      competitor_subscriptions: {
        Row: {
          competitor_url: string
          created_at: string
          email: string
          id: string
          is_active: boolean
          last_analysis_hash: string | null
          last_checked_at: string | null
          last_seo_score: number | null
          updated_at: string
        }
        Insert: {
          competitor_url: string
          created_at?: string
          email: string
          id?: string
          is_active?: boolean
          last_analysis_hash?: string | null
          last_checked_at?: string | null
          last_seo_score?: number | null
          updated_at?: string
        }
        Update: {
          competitor_url?: string
          created_at?: string
          email?: string
          id?: string
          is_active?: boolean
          last_analysis_hash?: string | null
          last_checked_at?: string | null
          last_seo_score?: number | null
          updated_at?: string
        }
        Relationships: []
      }
      cron_job_runs: {
        Row: {
          alerts_sent: number | null
          completed_at: string | null
          duration_seconds: number | null
          error_message: string | null
          id: string
          job_name: string
          started_at: string
          status: string
          subscriptions_checked: number | null
        }
        Insert: {
          alerts_sent?: number | null
          completed_at?: string | null
          duration_seconds?: number | null
          error_message?: string | null
          id?: string
          job_name?: string
          started_at?: string
          status?: string
          subscriptions_checked?: number | null
        }
        Update: {
          alerts_sent?: number | null
          completed_at?: string | null
          duration_seconds?: number | null
          error_message?: string | null
          id?: string
          job_name?: string
          started_at?: string
          status?: string
          subscriptions_checked?: number | null
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      deactivate_subscription: {
        Args: { _competitor_url: string; _email: string }
        Returns: boolean
      }
      get_subscriptions_by_email: {
        Args: { _email: string }
        Returns: {
          competitor_url: string
          created_at: string
          email: string
          id: string
          is_active: boolean
          last_analysis_hash: string | null
          last_checked_at: string | null
          last_seo_score: number | null
          updated_at: string
        }[]
        SetofOptions: {
          from: "*"
          to: "competitor_subscriptions"
          isOneToOne: false
          isSetofReturn: true
        }
      }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const
