import { createClient } from '@supabase/supabase-js';
import { v4 as uuidv4 } from 'uuid';

const supabaseUrl = process.env.SUPABASE_URL!;
const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;
const bucket = 'marketplace';

const supabase = createClient(supabaseUrl, supabaseServiceRoleKey);

export async function uploadToSupabaseStorage(file: Express.Multer.File): Promise<string> {
  const ext = file.originalname.split('.').pop();
  const filename = `${uuidv4()}.${ext}`;
  const { data, error } = await supabase.storage
    .from(bucket)
    .upload(filename, file.buffer, {
      contentType: file.mimetype,
      upsert: false
    });
  if (error) throw error;
  // Générer l'URL publique
  const { publicUrl } = supabase.storage.from(bucket).getPublicUrl(filename).data;
  if (!publicUrl) throw new Error('Impossible de générer l’URL publique');
  return publicUrl;
} 