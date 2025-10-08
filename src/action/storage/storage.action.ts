// generate get all buckets fuction for supabase storage
import { createClient } from "@/lib/client";

const supabase = createClient();

export async function getAllBuckets() {
  const { data, error } = await supabase.storage.listBuckets();
  if (error) throw error;
  return data;
}
