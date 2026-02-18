import { createClient } from "@supabase/supabase-js";

export const supabase = createClient(
  "https://hhftrulnujzjagkrtkvo.supabase.co",
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImhoZnRydWxudWp6amFna3J0a3ZvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzEzNTU3MDksImV4cCI6MjA4NjkzMTcwOX0.HzlVDWd7y6s6EjqNzrdapNRvgMfjDGOKj8oZgw2lY14"
);
