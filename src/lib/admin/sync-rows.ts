import type { SupabaseClient } from "@supabase/supabase-js";
import { friendlySaveError } from "@/lib/friendly-error";

type AnyClient = Pick<SupabaseClient, "from">;

export function withoutCreatedAt<T extends { created_at?: string }>(row: T) {
  const { created_at: _createdAt, ...rest } = row;
  void _createdAt;
  return rest;
}

export async function upsertAndPrune(
  supabase: AnyClient,
  table: string,
  rows: Record<string, unknown>[],
  options?: { scopeColumn?: string; scopeValue?: string },
) {
  if (rows.length > 0) {
    const { error } = await supabase.from(table).upsert(rows);
    if (error) throw new Error(friendlySaveError(error.message));
  }

  const keepIds = rows.map((row) => String(row.id));
  let query = supabase.from(table).select("id");
  if (options?.scopeColumn && options.scopeValue) {
    query = query.eq(options.scopeColumn, options.scopeValue);
  }
  const { data: existing, error: readError } = await query;
  if (readError) throw new Error(friendlySaveError(readError.message));

  const extra = (existing ?? [])
    .map((row) => String((row as { id: string }).id))
    .filter((id) => !keepIds.includes(id));

  if (extra.length === 0) return;
  const { error: deleteError } = await supabase.from(table).delete().in("id", extra);
  if (deleteError) throw new Error(friendlySaveError(deleteError.message));
}
