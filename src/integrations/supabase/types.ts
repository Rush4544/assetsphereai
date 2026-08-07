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
    PostgrestVersion: "14.15"
  }
  public: {
    Tables: {
      asset_assignments: {
        Row: {
          asset_id: string | null
          asset_name: string | null
          assigned_by_name: string | null
          assigned_to_email: string | null
          assigned_to_name: string
          assignment_date: string | null
          created_at: string
          created_by_id: string | null
          id: string
          notes: string | null
          organization_id: string | null
          previous_owner_name: string | null
          reason: string | null
          return_date: string | null
          status: string
          updated_at: string
        }
        Insert: {
          asset_id?: string | null
          asset_name?: string | null
          assigned_by_name?: string | null
          assigned_to_email?: string | null
          assigned_to_name: string
          assignment_date?: string | null
          created_at?: string
          created_by_id?: string | null
          id?: string
          notes?: string | null
          organization_id?: string | null
          previous_owner_name?: string | null
          reason?: string | null
          return_date?: string | null
          status?: string
          updated_at?: string
        }
        Update: {
          asset_id?: string | null
          asset_name?: string | null
          assigned_by_name?: string | null
          assigned_to_email?: string | null
          assigned_to_name?: string
          assignment_date?: string | null
          created_at?: string
          created_by_id?: string | null
          id?: string
          notes?: string | null
          organization_id?: string | null
          previous_owner_name?: string | null
          reason?: string | null
          return_date?: string | null
          status?: string
          updated_at?: string
        }
        Relationships: []
      }
      asset_categories: {
        Row: {
          created_at: string
          created_by_id: string | null
          default_lifecycle_years: number | null
          depreciation_method: string | null
          description: string | null
          icon: string | null
          id: string
          name: string
          organization_id: string | null
          parent_category_id: string | null
          sector: string | null
          status: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          created_by_id?: string | null
          default_lifecycle_years?: number | null
          depreciation_method?: string | null
          description?: string | null
          icon?: string | null
          id?: string
          name: string
          organization_id?: string | null
          parent_category_id?: string | null
          sector?: string | null
          status?: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          created_by_id?: string | null
          default_lifecycle_years?: number | null
          depreciation_method?: string | null
          description?: string | null
          icon?: string | null
          id?: string
          name?: string
          organization_id?: string | null
          parent_category_id?: string | null
          sector?: string | null
          status?: string
          updated_at?: string
        }
        Relationships: []
      }
      assets: {
        Row: {
          asset_tag: string | null
          assigned_user_email: string | null
          assigned_user_name: string | null
          barcode: string | null
          budget_code: string | null
          building_id: string | null
          building_name: string | null
          category_id: string | null
          category_name: string | null
          condition: string
          cost_centre: string | null
          cpu: string | null
          created_at: string
          created_by_id: string | null
          currency: string | null
          current_value: number | null
          custom_fields: Json
          department_id: string | null
          department_name: string | null
          depreciation_method: string | null
          depreciation_value: number | null
          disk_gb: number | null
          disk_used_pct: number | null
          document_urls: string[] | null
          funding_source: string | null
          gps_lat: number | null
          gps_lng: number | null
          hostname: string | null
          id: string
          installed_software: string | null
          insurance_value: number | null
          invoice_number: string | null
          ip_address: string | null
          last_seen: string | null
          lifecycle_status: string
          logged_in_user: string | null
          mac_address: string | null
          manufacturer: string | null
          model: string | null
          name: string
          next_maintenance_date: string | null
          notes: string | null
          online_status: string | null
          organization_id: string | null
          os: string | null
          photo_urls: string[] | null
          purchase_date: string | null
          purchase_order_number: string | null
          purchase_price: number | null
          ram_gb: number | null
          replacement_cost: number | null
          residual_value: number | null
          room_id: string | null
          room_name: string | null
          serial_number: string | null
          supplier: string | null
          tax_amount: number | null
          updated_at: string
          useful_life_years: number | null
          vendor_id: string | null
          vendor_name: string | null
          warranty_cost: number | null
          warranty_end: string | null
          warranty_start: string | null
        }
        Insert: {
          asset_tag?: string | null
          assigned_user_email?: string | null
          assigned_user_name?: string | null
          barcode?: string | null
          budget_code?: string | null
          building_id?: string | null
          building_name?: string | null
          category_id?: string | null
          category_name?: string | null
          condition?: string
          cost_centre?: string | null
          cpu?: string | null
          created_at?: string
          created_by_id?: string | null
          currency?: string | null
          current_value?: number | null
          custom_fields?: Json
          department_id?: string | null
          department_name?: string | null
          depreciation_method?: string | null
          depreciation_value?: number | null
          disk_gb?: number | null
          disk_used_pct?: number | null
          document_urls?: string[] | null
          funding_source?: string | null
          gps_lat?: number | null
          gps_lng?: number | null
          hostname?: string | null
          id?: string
          installed_software?: string | null
          insurance_value?: number | null
          invoice_number?: string | null
          ip_address?: string | null
          last_seen?: string | null
          lifecycle_status?: string
          logged_in_user?: string | null
          mac_address?: string | null
          manufacturer?: string | null
          model?: string | null
          name: string
          next_maintenance_date?: string | null
          notes?: string | null
          online_status?: string | null
          organization_id?: string | null
          os?: string | null
          photo_urls?: string[] | null
          purchase_date?: string | null
          purchase_order_number?: string | null
          purchase_price?: number | null
          ram_gb?: number | null
          replacement_cost?: number | null
          residual_value?: number | null
          room_id?: string | null
          room_name?: string | null
          serial_number?: string | null
          supplier?: string | null
          tax_amount?: number | null
          updated_at?: string
          useful_life_years?: number | null
          vendor_id?: string | null
          vendor_name?: string | null
          warranty_cost?: number | null
          warranty_end?: string | null
          warranty_start?: string | null
        }
        Update: {
          asset_tag?: string | null
          assigned_user_email?: string | null
          assigned_user_name?: string | null
          barcode?: string | null
          budget_code?: string | null
          building_id?: string | null
          building_name?: string | null
          category_id?: string | null
          category_name?: string | null
          condition?: string
          cost_centre?: string | null
          cpu?: string | null
          created_at?: string
          created_by_id?: string | null
          currency?: string | null
          current_value?: number | null
          custom_fields?: Json
          department_id?: string | null
          department_name?: string | null
          depreciation_method?: string | null
          depreciation_value?: number | null
          disk_gb?: number | null
          disk_used_pct?: number | null
          document_urls?: string[] | null
          funding_source?: string | null
          gps_lat?: number | null
          gps_lng?: number | null
          hostname?: string | null
          id?: string
          installed_software?: string | null
          insurance_value?: number | null
          invoice_number?: string | null
          ip_address?: string | null
          last_seen?: string | null
          lifecycle_status?: string
          logged_in_user?: string | null
          mac_address?: string | null
          manufacturer?: string | null
          model?: string | null
          name?: string
          next_maintenance_date?: string | null
          notes?: string | null
          online_status?: string | null
          organization_id?: string | null
          os?: string | null
          photo_urls?: string[] | null
          purchase_date?: string | null
          purchase_order_number?: string | null
          purchase_price?: number | null
          ram_gb?: number | null
          replacement_cost?: number | null
          residual_value?: number | null
          room_id?: string | null
          room_name?: string | null
          serial_number?: string | null
          supplier?: string | null
          tax_amount?: number | null
          updated_at?: string
          useful_life_years?: number | null
          vendor_id?: string | null
          vendor_name?: string | null
          warranty_cost?: number | null
          warranty_end?: string | null
          warranty_start?: string | null
        }
        Relationships: []
      }
      audit_logs: {
        Row: {
          action: string
          created_at: string
          created_by_id: string | null
          details: string | null
          entity_id: string | null
          entity_name: string | null
          entity_type: string | null
          id: string
          ip_address: string | null
          organization_id: string | null
          severity: string
          user_email: string | null
          user_name: string | null
        }
        Insert: {
          action: string
          created_at?: string
          created_by_id?: string | null
          details?: string | null
          entity_id?: string | null
          entity_name?: string | null
          entity_type?: string | null
          id?: string
          ip_address?: string | null
          organization_id?: string | null
          severity?: string
          user_email?: string | null
          user_name?: string | null
        }
        Update: {
          action?: string
          created_at?: string
          created_by_id?: string | null
          details?: string | null
          entity_id?: string | null
          entity_name?: string | null
          entity_type?: string | null
          id?: string
          ip_address?: string | null
          organization_id?: string | null
          severity?: string
          user_email?: string | null
          user_name?: string | null
        }
        Relationships: []
      }
      buildings: {
        Row: {
          address: string | null
          city: string | null
          country: string | null
          created_at: string
          created_by_id: string | null
          floors: number | null
          id: string
          name: string
          organization_id: string | null
          state: string | null
          status: string
          updated_at: string
          zip_code: string | null
        }
        Insert: {
          address?: string | null
          city?: string | null
          country?: string | null
          created_at?: string
          created_by_id?: string | null
          floors?: number | null
          id?: string
          name: string
          organization_id?: string | null
          state?: string | null
          status?: string
          updated_at?: string
          zip_code?: string | null
        }
        Update: {
          address?: string | null
          city?: string | null
          country?: string | null
          created_at?: string
          created_by_id?: string | null
          floors?: number | null
          id?: string
          name?: string
          organization_id?: string | null
          state?: string | null
          status?: string
          updated_at?: string
          zip_code?: string | null
        }
        Relationships: []
      }
      departments: {
        Row: {
          cost_center: string | null
          created_at: string
          created_by_id: string | null
          head_email: string | null
          head_name: string | null
          id: string
          name: string
          organization_id: string | null
          parent_department_id: string | null
          status: string
          updated_at: string
        }
        Insert: {
          cost_center?: string | null
          created_at?: string
          created_by_id?: string | null
          head_email?: string | null
          head_name?: string | null
          id?: string
          name: string
          organization_id?: string | null
          parent_department_id?: string | null
          status?: string
          updated_at?: string
        }
        Update: {
          cost_center?: string | null
          created_at?: string
          created_by_id?: string | null
          head_email?: string | null
          head_name?: string | null
          id?: string
          name?: string
          organization_id?: string | null
          parent_department_id?: string | null
          status?: string
          updated_at?: string
        }
        Relationships: []
      }
      distribution_requests: {
        Row: {
          asset_category: string | null
          asset_id: string | null
          asset_name: string
          assigned_to_email: string | null
          assigned_to_name: string
          created_at: string
          created_by_id: string | null
          department: string | null
          fulfilled_date: string | null
          id: string
          item_condition: string | null
          notes: string | null
          organization_id: string | null
          priority: string
          request_date: string | null
          requested_by_email: string | null
          requested_by_name: string | null
          return_date: string | null
          status: string
          updated_at: string
        }
        Insert: {
          asset_category?: string | null
          asset_id?: string | null
          asset_name: string
          assigned_to_email?: string | null
          assigned_to_name: string
          created_at?: string
          created_by_id?: string | null
          department?: string | null
          fulfilled_date?: string | null
          id?: string
          item_condition?: string | null
          notes?: string | null
          organization_id?: string | null
          priority?: string
          request_date?: string | null
          requested_by_email?: string | null
          requested_by_name?: string | null
          return_date?: string | null
          status?: string
          updated_at?: string
        }
        Update: {
          asset_category?: string | null
          asset_id?: string | null
          asset_name?: string
          assigned_to_email?: string | null
          assigned_to_name?: string
          created_at?: string
          created_by_id?: string | null
          department?: string | null
          fulfilled_date?: string | null
          id?: string
          item_condition?: string | null
          notes?: string | null
          organization_id?: string | null
          priority?: string
          request_date?: string | null
          requested_by_email?: string | null
          requested_by_name?: string | null
          return_date?: string | null
          status?: string
          updated_at?: string
        }
        Relationships: []
      }
      geofences: {
        Row: {
          active: boolean
          alert_on_entry: boolean
          alert_on_exit: boolean
          center_lat: number
          center_lng: number
          color: string | null
          created_at: string
          created_by_id: string | null
          description: string | null
          id: string
          name: string
          notes: string | null
          organization_id: string | null
          radius_meters: number
          speed_limit_kmh: number | null
          updated_at: string
          vehicle_ids: string[] | null
        }
        Insert: {
          active?: boolean
          alert_on_entry?: boolean
          alert_on_exit?: boolean
          center_lat: number
          center_lng: number
          color?: string | null
          created_at?: string
          created_by_id?: string | null
          description?: string | null
          id?: string
          name: string
          notes?: string | null
          organization_id?: string | null
          radius_meters?: number
          speed_limit_kmh?: number | null
          updated_at?: string
          vehicle_ids?: string[] | null
        }
        Update: {
          active?: boolean
          alert_on_entry?: boolean
          alert_on_exit?: boolean
          center_lat?: number
          center_lng?: number
          color?: string | null
          created_at?: string
          created_by_id?: string | null
          description?: string | null
          id?: string
          name?: string
          notes?: string | null
          organization_id?: string | null
          radius_meters?: number
          speed_limit_kmh?: number | null
          updated_at?: string
          vehicle_ids?: string[] | null
        }
        Relationships: []
      }
      invoices: {
        Row: {
          amount: number | null
          billing_cycle: string
          billing_period_end: string | null
          billing_period_start: string | null
          created_at: string
          created_by_id: string | null
          currency: string | null
          id: string
          invoice_number: string
          notes: string | null
          organization_id: string
          organization_name: string | null
          paid_date: string | null
          pdf_url: string | null
          plan: string | null
          status: string
          stripe_invoice_id: string | null
          subtotal: number | null
          tax_amount: number | null
          total: number | null
          updated_at: string
        }
        Insert: {
          amount?: number | null
          billing_cycle?: string
          billing_period_end?: string | null
          billing_period_start?: string | null
          created_at?: string
          created_by_id?: string | null
          currency?: string | null
          id?: string
          invoice_number: string
          notes?: string | null
          organization_id: string
          organization_name?: string | null
          paid_date?: string | null
          pdf_url?: string | null
          plan?: string | null
          status?: string
          stripe_invoice_id?: string | null
          subtotal?: number | null
          tax_amount?: number | null
          total?: number | null
          updated_at?: string
        }
        Update: {
          amount?: number | null
          billing_cycle?: string
          billing_period_end?: string | null
          billing_period_start?: string | null
          created_at?: string
          created_by_id?: string | null
          currency?: string | null
          id?: string
          invoice_number?: string
          notes?: string | null
          organization_id?: string
          organization_name?: string | null
          paid_date?: string | null
          pdf_url?: string | null
          plan?: string | null
          status?: string
          stripe_invoice_id?: string | null
          subtotal?: number | null
          tax_amount?: number | null
          total?: number | null
          updated_at?: string
        }
        Relationships: []
      }
      maintenance_records: {
        Row: {
          asset_id: string | null
          asset_name: string | null
          completed_date: string | null
          cost: number | null
          created_at: string
          created_by_id: string | null
          description: string | null
          id: string
          maintenance_type: string
          notes: string | null
          organization_id: string | null
          parts_used: string | null
          priority: string
          scheduled_date: string | null
          status: string
          technician_name: string | null
          title: string
          updated_at: string
          vendor_id: string | null
          vendor_name: string | null
        }
        Insert: {
          asset_id?: string | null
          asset_name?: string | null
          completed_date?: string | null
          cost?: number | null
          created_at?: string
          created_by_id?: string | null
          description?: string | null
          id?: string
          maintenance_type?: string
          notes?: string | null
          organization_id?: string | null
          parts_used?: string | null
          priority?: string
          scheduled_date?: string | null
          status?: string
          technician_name?: string | null
          title: string
          updated_at?: string
          vendor_id?: string | null
          vendor_name?: string | null
        }
        Update: {
          asset_id?: string | null
          asset_name?: string | null
          completed_date?: string | null
          cost?: number | null
          created_at?: string
          created_by_id?: string | null
          description?: string | null
          id?: string
          maintenance_type?: string
          notes?: string | null
          organization_id?: string | null
          parts_used?: string | null
          priority?: string
          scheduled_date?: string | null
          status?: string
          technician_name?: string | null
          title?: string
          updated_at?: string
          vendor_id?: string | null
          vendor_name?: string | null
        }
        Relationships: []
      }
      network_devices: {
        Row: {
          access_point: string | null
          access_point_location: string | null
          antivirus_status: string | null
          building: string | null
          connection_type: string | null
          cpu: string | null
          created_at: string
          created_by_id: string | null
          device_type: string
          discovery_source: string | null
          disk_gb: number | null
          disk_used_pct: number | null
          first_seen: string | null
          floor: string | null
          hostname: string | null
          id: string
          installed_software: string | null
          ip_address: string | null
          last_seen: string | null
          linked_asset_id: string | null
          logged_in_user: string | null
          mac_address: string | null
          manufacturer: string | null
          network_name: string | null
          online_status: string | null
          organization_id: string | null
          os: string | null
          ping_time_ms: number | null
          ram_gb: number | null
          room: string | null
          signal_strength: number | null
          ssid: string | null
          status: string
          switch_port: string | null
          updated_at: string
          vlan: string | null
        }
        Insert: {
          access_point?: string | null
          access_point_location?: string | null
          antivirus_status?: string | null
          building?: string | null
          connection_type?: string | null
          cpu?: string | null
          created_at?: string
          created_by_id?: string | null
          device_type?: string
          discovery_source?: string | null
          disk_gb?: number | null
          disk_used_pct?: number | null
          first_seen?: string | null
          floor?: string | null
          hostname?: string | null
          id?: string
          installed_software?: string | null
          ip_address?: string | null
          last_seen?: string | null
          linked_asset_id?: string | null
          logged_in_user?: string | null
          mac_address?: string | null
          manufacturer?: string | null
          network_name?: string | null
          online_status?: string | null
          organization_id?: string | null
          os?: string | null
          ping_time_ms?: number | null
          ram_gb?: number | null
          room?: string | null
          signal_strength?: number | null
          ssid?: string | null
          status?: string
          switch_port?: string | null
          updated_at?: string
          vlan?: string | null
        }
        Update: {
          access_point?: string | null
          access_point_location?: string | null
          antivirus_status?: string | null
          building?: string | null
          connection_type?: string | null
          cpu?: string | null
          created_at?: string
          created_by_id?: string | null
          device_type?: string
          discovery_source?: string | null
          disk_gb?: number | null
          disk_used_pct?: number | null
          first_seen?: string | null
          floor?: string | null
          hostname?: string | null
          id?: string
          installed_software?: string | null
          ip_address?: string | null
          last_seen?: string | null
          linked_asset_id?: string | null
          logged_in_user?: string | null
          mac_address?: string | null
          manufacturer?: string | null
          network_name?: string | null
          online_status?: string | null
          organization_id?: string | null
          os?: string | null
          ping_time_ms?: number | null
          ram_gb?: number | null
          room?: string | null
          signal_strength?: number | null
          ssid?: string | null
          status?: string
          switch_port?: string | null
          updated_at?: string
          vlan?: string | null
        }
        Relationships: []
      }
      organizations: {
        Row: {
          address: string | null
          billing_cycle: string
          business_email: string | null
          business_phone: string | null
          city: string | null
          company_size: string | null
          country: string | null
          created_at: string
          created_by_id: string | null
          gst_hst_number: string | null
          id: string
          industry: string | null
          logo_url: string | null
          max_assets: number | null
          max_users: number | null
          name: string
          number_of_employees: number | null
          phone: string | null
          primary_color: string | null
          province_state: string | null
          slug: string | null
          status: string
          storage_limit_mb: number | null
          storage_used_mb: number | null
          stripe_customer_id: string | null
          subscription_plan: string
          subscription_status: string
          trial_end_date: string | null
          trial_start_date: string | null
          updated_at: string
          website: string | null
        }
        Insert: {
          address?: string | null
          billing_cycle?: string
          business_email?: string | null
          business_phone?: string | null
          city?: string | null
          company_size?: string | null
          country?: string | null
          created_at?: string
          created_by_id?: string | null
          gst_hst_number?: string | null
          id?: string
          industry?: string | null
          logo_url?: string | null
          max_assets?: number | null
          max_users?: number | null
          name: string
          number_of_employees?: number | null
          phone?: string | null
          primary_color?: string | null
          province_state?: string | null
          slug?: string | null
          status?: string
          storage_limit_mb?: number | null
          storage_used_mb?: number | null
          stripe_customer_id?: string | null
          subscription_plan?: string
          subscription_status?: string
          trial_end_date?: string | null
          trial_start_date?: string | null
          updated_at?: string
          website?: string | null
        }
        Update: {
          address?: string | null
          billing_cycle?: string
          business_email?: string | null
          business_phone?: string | null
          city?: string | null
          company_size?: string | null
          country?: string | null
          created_at?: string
          created_by_id?: string | null
          gst_hst_number?: string | null
          id?: string
          industry?: string | null
          logo_url?: string | null
          max_assets?: number | null
          max_users?: number | null
          name?: string
          number_of_employees?: number | null
          phone?: string | null
          primary_color?: string | null
          province_state?: string | null
          slug?: string | null
          status?: string
          storage_limit_mb?: number | null
          storage_used_mb?: number | null
          stripe_customer_id?: string | null
          subscription_plan?: string
          subscription_status?: string
          trial_end_date?: string | null
          trial_start_date?: string | null
          updated_at?: string
          website?: string | null
        }
        Relationships: []
      }
      profiles: {
        Row: {
          avatar_url: string | null
          created_at: string
          department: string | null
          email: string | null
          full_name: string | null
          id: string
          job_title: string | null
          organization_id: string | null
          organization_name: string | null
          page_permissions: Json
          status: string
          updated_at: string
        }
        Insert: {
          avatar_url?: string | null
          created_at?: string
          department?: string | null
          email?: string | null
          full_name?: string | null
          id: string
          job_title?: string | null
          organization_id?: string | null
          organization_name?: string | null
          page_permissions?: Json
          status?: string
          updated_at?: string
        }
        Update: {
          avatar_url?: string | null
          created_at?: string
          department?: string | null
          email?: string | null
          full_name?: string | null
          id?: string
          job_title?: string | null
          organization_id?: string | null
          organization_name?: string | null
          page_permissions?: Json
          status?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "profiles_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
        ]
      }
      rfid_alerts: {
        Row: {
          acknowledged: boolean
          acknowledged_at: string | null
          acknowledged_by: string | null
          alert_type: string
          asset_id: string | null
          asset_name: string | null
          building_name: string | null
          created_at: string
          created_by_id: string | null
          detected_at: string | null
          id: string
          message: string
          notification_channels: string[] | null
          organization_id: string | null
          reader_id: string | null
          reader_name: string | null
          severity: string
          status: string
          tag_id: string | null
          updated_at: string
          zone_name: string | null
        }
        Insert: {
          acknowledged?: boolean
          acknowledged_at?: string | null
          acknowledged_by?: string | null
          alert_type: string
          asset_id?: string | null
          asset_name?: string | null
          building_name?: string | null
          created_at?: string
          created_by_id?: string | null
          detected_at?: string | null
          id?: string
          message: string
          notification_channels?: string[] | null
          organization_id?: string | null
          reader_id?: string | null
          reader_name?: string | null
          severity?: string
          status?: string
          tag_id?: string | null
          updated_at?: string
          zone_name?: string | null
        }
        Update: {
          acknowledged?: boolean
          acknowledged_at?: string | null
          acknowledged_by?: string | null
          alert_type?: string
          asset_id?: string | null
          asset_name?: string | null
          building_name?: string | null
          created_at?: string
          created_by_id?: string | null
          detected_at?: string | null
          id?: string
          message?: string
          notification_channels?: string[] | null
          organization_id?: string | null
          reader_id?: string | null
          reader_name?: string | null
          severity?: string
          status?: string
          tag_id?: string | null
          updated_at?: string
          zone_name?: string | null
        }
        Relationships: []
      }
      rfid_deployment_requests: {
        Row: {
          additional_notes: string | null
          assigned_deployment_manager: string | null
          company_name: string
          contact_person: string
          created_at: string
          created_by_id: string | null
          email: string
          estimated_assets: number | null
          id: string
          industry: string | null
          internal_notes: string | null
          number_of_buildings: number | null
          organization_id: string | null
          phone: string | null
          preferred_installation_date: string | null
          request_status: string
          updated_at: string
        }
        Insert: {
          additional_notes?: string | null
          assigned_deployment_manager?: string | null
          company_name: string
          contact_person: string
          created_at?: string
          created_by_id?: string | null
          email: string
          estimated_assets?: number | null
          id?: string
          industry?: string | null
          internal_notes?: string | null
          number_of_buildings?: number | null
          organization_id?: string | null
          phone?: string | null
          preferred_installation_date?: string | null
          request_status?: string
          updated_at?: string
        }
        Update: {
          additional_notes?: string | null
          assigned_deployment_manager?: string | null
          company_name?: string
          contact_person?: string
          created_at?: string
          created_by_id?: string | null
          email?: string
          estimated_assets?: number | null
          id?: string
          industry?: string | null
          internal_notes?: string | null
          number_of_buildings?: number | null
          organization_id?: string | null
          phone?: string | null
          preferred_installation_date?: string | null
          request_status?: string
          updated_at?: string
        }
        Relationships: []
      }
      rfid_detections: {
        Row: {
          asset_id: string | null
          asset_name: string | null
          assigned_user: string | null
          building_name: string | null
          created_at: string
          created_by_id: string | null
          detection_time: string | null
          direction: string
          floor: string | null
          id: string
          movement_status: string
          organization_id: string | null
          previous_reader: string | null
          previous_zone: string | null
          reader_id: string | null
          reader_name: string | null
          signal_strength: number | null
          tag_id: string
          technician: string | null
          zone_id: string | null
          zone_name: string | null
        }
        Insert: {
          asset_id?: string | null
          asset_name?: string | null
          assigned_user?: string | null
          building_name?: string | null
          created_at?: string
          created_by_id?: string | null
          detection_time?: string | null
          direction?: string
          floor?: string | null
          id?: string
          movement_status?: string
          organization_id?: string | null
          previous_reader?: string | null
          previous_zone?: string | null
          reader_id?: string | null
          reader_name?: string | null
          signal_strength?: number | null
          tag_id: string
          technician?: string | null
          zone_id?: string | null
          zone_name?: string | null
        }
        Update: {
          asset_id?: string | null
          asset_name?: string | null
          assigned_user?: string | null
          building_name?: string | null
          created_at?: string
          created_by_id?: string | null
          detection_time?: string | null
          direction?: string
          floor?: string | null
          id?: string
          movement_status?: string
          organization_id?: string | null
          previous_reader?: string | null
          previous_zone?: string | null
          reader_id?: string | null
          reader_name?: string | null
          signal_strength?: number | null
          tag_id?: string
          technician?: string | null
          zone_id?: string | null
          zone_name?: string | null
        }
        Relationships: []
      }
      rfid_gateways: {
        Row: {
          building_name: string | null
          connected_reader_count: number
          created_at: string
          created_by_id: string | null
          firmware_version: string | null
          floor: string | null
          gateway_id: string | null
          gateway_status: string
          id: string
          ip_address: string | null
          last_heartbeat: string | null
          mac_address: string | null
          manufacturer: string | null
          model: string | null
          name: string
          notes: string | null
          organization_id: string | null
          provider_type: string | null
          status: string
          updated_at: string
        }
        Insert: {
          building_name?: string | null
          connected_reader_count?: number
          created_at?: string
          created_by_id?: string | null
          firmware_version?: string | null
          floor?: string | null
          gateway_id?: string | null
          gateway_status?: string
          id?: string
          ip_address?: string | null
          last_heartbeat?: string | null
          mac_address?: string | null
          manufacturer?: string | null
          model?: string | null
          name: string
          notes?: string | null
          organization_id?: string | null
          provider_type?: string | null
          status?: string
          updated_at?: string
        }
        Update: {
          building_name?: string | null
          connected_reader_count?: number
          created_at?: string
          created_by_id?: string | null
          firmware_version?: string | null
          floor?: string | null
          gateway_id?: string | null
          gateway_status?: string
          id?: string
          ip_address?: string | null
          last_heartbeat?: string | null
          mac_address?: string | null
          manufacturer?: string | null
          model?: string | null
          name?: string
          notes?: string | null
          organization_id?: string | null
          provider_type?: string | null
          status?: string
          updated_at?: string
        }
        Relationships: []
      }
      rfid_readers: {
        Row: {
          antenna_count: number | null
          building_id: string | null
          building_name: string | null
          created_at: string
          created_by_id: string | null
          firmware_version: string | null
          floor: string | null
          gateway_id: string | null
          gateway_name: string | null
          id: string
          ip_address: string | null
          last_heartbeat: string | null
          mac_address: string | null
          manufacturer: string | null
          model: string | null
          name: string
          notes: string | null
          organization_id: string | null
          provider_type: string | null
          read_range_meters: number | null
          reader_health: string
          reader_id: string | null
          reader_status: string
          room: string | null
          status: string
          updated_at: string
          zone_id: string | null
          zone_name: string | null
        }
        Insert: {
          antenna_count?: number | null
          building_id?: string | null
          building_name?: string | null
          created_at?: string
          created_by_id?: string | null
          firmware_version?: string | null
          floor?: string | null
          gateway_id?: string | null
          gateway_name?: string | null
          id?: string
          ip_address?: string | null
          last_heartbeat?: string | null
          mac_address?: string | null
          manufacturer?: string | null
          model?: string | null
          name: string
          notes?: string | null
          organization_id?: string | null
          provider_type?: string | null
          read_range_meters?: number | null
          reader_health?: string
          reader_id?: string | null
          reader_status?: string
          room?: string | null
          status?: string
          updated_at?: string
          zone_id?: string | null
          zone_name?: string | null
        }
        Update: {
          antenna_count?: number | null
          building_id?: string | null
          building_name?: string | null
          created_at?: string
          created_by_id?: string | null
          firmware_version?: string | null
          floor?: string | null
          gateway_id?: string | null
          gateway_name?: string | null
          id?: string
          ip_address?: string | null
          last_heartbeat?: string | null
          mac_address?: string | null
          manufacturer?: string | null
          model?: string | null
          name?: string
          notes?: string | null
          organization_id?: string | null
          provider_type?: string | null
          read_range_meters?: number | null
          reader_health?: string
          reader_id?: string | null
          reader_status?: string
          room?: string | null
          status?: string
          updated_at?: string
          zone_id?: string | null
          zone_name?: string | null
        }
        Relationships: []
      }
      rfid_tags: {
        Row: {
          asset_id: string | null
          asset_name: string | null
          battery_level_pct: number | null
          battery_status: string | null
          created_at: string
          created_by_id: string | null
          id: string
          installation_date: string | null
          last_detected_reader: string | null
          last_detected_zone: string | null
          last_detection_time: string | null
          manufacturer: string | null
          notes: string | null
          organization_id: string | null
          rfid_type: string
          status: string
          tag_id: string
          tag_status: string
          updated_at: string
        }
        Insert: {
          asset_id?: string | null
          asset_name?: string | null
          battery_level_pct?: number | null
          battery_status?: string | null
          created_at?: string
          created_by_id?: string | null
          id?: string
          installation_date?: string | null
          last_detected_reader?: string | null
          last_detected_zone?: string | null
          last_detection_time?: string | null
          manufacturer?: string | null
          notes?: string | null
          organization_id?: string | null
          rfid_type?: string
          status?: string
          tag_id: string
          tag_status?: string
          updated_at?: string
        }
        Update: {
          asset_id?: string | null
          asset_name?: string | null
          battery_level_pct?: number | null
          battery_status?: string | null
          created_at?: string
          created_by_id?: string | null
          id?: string
          installation_date?: string | null
          last_detected_reader?: string | null
          last_detected_zone?: string | null
          last_detection_time?: string | null
          manufacturer?: string | null
          notes?: string | null
          organization_id?: string | null
          rfid_type?: string
          status?: string
          tag_id?: string
          tag_status?: string
          updated_at?: string
        }
        Relationships: []
      }
      rfid_zones: {
        Row: {
          authorized_only: boolean
          building_id: string | null
          building_name: string | null
          color: string | null
          created_at: string
          created_by_id: string | null
          description: string | null
          floor: string | null
          id: string
          name: string
          notes: string | null
          organization_id: string | null
          reader_ids: string[] | null
          restricted: boolean
          room: string | null
          status: string
          updated_at: string
          zone_type: string
        }
        Insert: {
          authorized_only?: boolean
          building_id?: string | null
          building_name?: string | null
          color?: string | null
          created_at?: string
          created_by_id?: string | null
          description?: string | null
          floor?: string | null
          id?: string
          name: string
          notes?: string | null
          organization_id?: string | null
          reader_ids?: string[] | null
          restricted?: boolean
          room?: string | null
          status?: string
          updated_at?: string
          zone_type?: string
        }
        Update: {
          authorized_only?: boolean
          building_id?: string | null
          building_name?: string | null
          color?: string | null
          created_at?: string
          created_by_id?: string | null
          description?: string | null
          floor?: string | null
          id?: string
          name?: string
          notes?: string | null
          organization_id?: string | null
          reader_ids?: string[] | null
          restricted?: boolean
          room?: string | null
          status?: string
          updated_at?: string
          zone_type?: string
        }
        Relationships: []
      }
      rooms: {
        Row: {
          building_id: string | null
          created_at: string
          created_by_id: string | null
          floor: string | null
          id: string
          name: string
          organization_id: string | null
          room_number: string | null
          room_type: string | null
          status: string
          updated_at: string
        }
        Insert: {
          building_id?: string | null
          created_at?: string
          created_by_id?: string | null
          floor?: string | null
          id?: string
          name: string
          organization_id?: string | null
          room_number?: string | null
          room_type?: string | null
          status?: string
          updated_at?: string
        }
        Update: {
          building_id?: string | null
          created_at?: string
          created_by_id?: string | null
          floor?: string | null
          id?: string
          name?: string
          organization_id?: string | null
          room_number?: string | null
          room_type?: string | null
          status?: string
          updated_at?: string
        }
        Relationships: []
      }
      software_licenses: {
        Row: {
          compliance_status: string
          cost_per_seat: number | null
          created_at: string
          created_by_id: string | null
          expiration_date: string | null
          id: string
          license_key: string | null
          license_type: string
          notes: string | null
          organization_id: string | null
          publisher: string | null
          purchase_date: string | null
          software_name: string
          status: string
          total_cost: number | null
          total_seats: number | null
          updated_at: string
          used_seats: number | null
          vendor_id: string | null
          vendor_name: string | null
          version: string | null
        }
        Insert: {
          compliance_status?: string
          cost_per_seat?: number | null
          created_at?: string
          created_by_id?: string | null
          expiration_date?: string | null
          id?: string
          license_key?: string | null
          license_type?: string
          notes?: string | null
          organization_id?: string | null
          publisher?: string | null
          purchase_date?: string | null
          software_name: string
          status?: string
          total_cost?: number | null
          total_seats?: number | null
          updated_at?: string
          used_seats?: number | null
          vendor_id?: string | null
          vendor_name?: string | null
          version?: string | null
        }
        Update: {
          compliance_status?: string
          cost_per_seat?: number | null
          created_at?: string
          created_by_id?: string | null
          expiration_date?: string | null
          id?: string
          license_key?: string | null
          license_type?: string
          notes?: string | null
          organization_id?: string | null
          publisher?: string | null
          purchase_date?: string | null
          software_name?: string
          status?: string
          total_cost?: number | null
          total_seats?: number | null
          updated_at?: string
          used_seats?: number | null
          vendor_id?: string | null
          vendor_name?: string | null
          version?: string | null
        }
        Relationships: []
      }
      user_roles: {
        Row: {
          created_at: string
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id?: string
        }
        Relationships: []
      }
      vehicle_service_records: {
        Row: {
          completed_date: string | null
          cost: number | null
          created_at: string
          created_by_id: string | null
          description: string | null
          id: string
          notes: string | null
          odometer_km: number | null
          organization_id: string | null
          parts_used: string | null
          scheduled_date: string | null
          service_type: string
          status: string
          technician_name: string | null
          tire_season: string | null
          title: string
          updated_at: string
          vehicle_id: string
          vehicle_name: string | null
        }
        Insert: {
          completed_date?: string | null
          cost?: number | null
          created_at?: string
          created_by_id?: string | null
          description?: string | null
          id?: string
          notes?: string | null
          odometer_km?: number | null
          organization_id?: string | null
          parts_used?: string | null
          scheduled_date?: string | null
          service_type?: string
          status?: string
          technician_name?: string | null
          tire_season?: string | null
          title: string
          updated_at?: string
          vehicle_id: string
          vehicle_name?: string | null
        }
        Update: {
          completed_date?: string | null
          cost?: number | null
          created_at?: string
          created_by_id?: string | null
          description?: string | null
          id?: string
          notes?: string | null
          odometer_km?: number | null
          organization_id?: string | null
          parts_used?: string | null
          scheduled_date?: string | null
          service_type?: string
          status?: string
          technician_name?: string | null
          tire_season?: string | null
          title?: string
          updated_at?: string
          vehicle_id?: string
          vehicle_name?: string | null
        }
        Relationships: []
      }
      vehicles: {
        Row: {
          color: string | null
          created_at: string
          created_by_id: string | null
          current_speed_kmh: number | null
          daily_mileage_km: number | null
          driver_email: string | null
          driver_name: string | null
          driver_phone: string | null
          fuel_level_pct: number | null
          geofence_breach: boolean
          geofence_id: string | null
          geofence_name: string | null
          gps_lat: number | null
          gps_lng: number | null
          heading: number | null
          id: string
          insurance_expiry: string | null
          last_gps_update: string | null
          last_service_date: string | null
          license_plate: string | null
          make: string | null
          model: string | null
          name: string
          next_service_date: string | null
          notes: string | null
          organization_id: string | null
          photo_url: string | null
          purchase_date: string | null
          purchase_price: number | null
          registration_expiry: string | null
          status: string
          summer_tires_installed: boolean
          tire_rotation_date: string | null
          total_mileage_km: number | null
          updated_at: string
          vehicle_type: string
          vin: string | null
          winter_tires_installed: boolean
          year: number | null
        }
        Insert: {
          color?: string | null
          created_at?: string
          created_by_id?: string | null
          current_speed_kmh?: number | null
          daily_mileage_km?: number | null
          driver_email?: string | null
          driver_name?: string | null
          driver_phone?: string | null
          fuel_level_pct?: number | null
          geofence_breach?: boolean
          geofence_id?: string | null
          geofence_name?: string | null
          gps_lat?: number | null
          gps_lng?: number | null
          heading?: number | null
          id?: string
          insurance_expiry?: string | null
          last_gps_update?: string | null
          last_service_date?: string | null
          license_plate?: string | null
          make?: string | null
          model?: string | null
          name: string
          next_service_date?: string | null
          notes?: string | null
          organization_id?: string | null
          photo_url?: string | null
          purchase_date?: string | null
          purchase_price?: number | null
          registration_expiry?: string | null
          status?: string
          summer_tires_installed?: boolean
          tire_rotation_date?: string | null
          total_mileage_km?: number | null
          updated_at?: string
          vehicle_type?: string
          vin?: string | null
          winter_tires_installed?: boolean
          year?: number | null
        }
        Update: {
          color?: string | null
          created_at?: string
          created_by_id?: string | null
          current_speed_kmh?: number | null
          daily_mileage_km?: number | null
          driver_email?: string | null
          driver_name?: string | null
          driver_phone?: string | null
          fuel_level_pct?: number | null
          geofence_breach?: boolean
          geofence_id?: string | null
          geofence_name?: string | null
          gps_lat?: number | null
          gps_lng?: number | null
          heading?: number | null
          id?: string
          insurance_expiry?: string | null
          last_gps_update?: string | null
          last_service_date?: string | null
          license_plate?: string | null
          make?: string | null
          model?: string | null
          name?: string
          next_service_date?: string | null
          notes?: string | null
          organization_id?: string | null
          photo_url?: string | null
          purchase_date?: string | null
          purchase_price?: number | null
          registration_expiry?: string | null
          status?: string
          summer_tires_installed?: boolean
          tire_rotation_date?: string | null
          total_mileage_km?: number | null
          updated_at?: string
          vehicle_type?: string
          vin?: string | null
          winter_tires_installed?: boolean
          year?: number | null
        }
        Relationships: []
      }
      vendors: {
        Row: {
          address: string | null
          contact_name: string | null
          contract_end: string | null
          contract_number: string | null
          contract_start: string | null
          created_at: string
          created_by_id: string | null
          email: string | null
          id: string
          name: string
          notes: string | null
          organization_id: string | null
          phone: string | null
          status: string
          updated_at: string
          vendor_type: string | null
          website: string | null
        }
        Insert: {
          address?: string | null
          contact_name?: string | null
          contract_end?: string | null
          contract_number?: string | null
          contract_start?: string | null
          created_at?: string
          created_by_id?: string | null
          email?: string | null
          id?: string
          name: string
          notes?: string | null
          organization_id?: string | null
          phone?: string | null
          status?: string
          updated_at?: string
          vendor_type?: string | null
          website?: string | null
        }
        Update: {
          address?: string | null
          contact_name?: string | null
          contract_end?: string | null
          contract_number?: string | null
          contract_start?: string | null
          created_at?: string
          created_by_id?: string | null
          email?: string | null
          id?: string
          name?: string
          notes?: string | null
          organization_id?: string | null
          phone?: string | null
          status?: string
          updated_at?: string
          vendor_type?: string | null
          website?: string | null
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      current_org_id: { Args: never; Returns: string }
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
      is_operator: { Args: never; Returns: boolean }
      is_org_admin: { Args: never; Returns: boolean }
      is_super_admin: { Args: never; Returns: boolean }
      list_organizations: {
        Args: never
        Returns: {
          id: string
          name: string
        }[]
      }
    }
    Enums: {
      app_role: "super_admin" | "admin" | "technician" | "user"
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
    Enums: {
      app_role: ["super_admin", "admin", "technician", "user"],
    },
  },
} as const
