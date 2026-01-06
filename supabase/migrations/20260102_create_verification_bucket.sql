-- Create the storage bucket for verification documents
insert into storage.buckets (id, name, public)
values ('verification-docs', 'verification-docs', true)
on conflict (id) do nothing;

-- Set up security policies for the bucket
create policy "Authenticated users can upload verification docs"
  on storage.objects for insert
  to authenticated
  with check ( bucket_id = 'verification-docs' and auth.uid()::text = (storage.foldername(name))[1] );

create policy "Users can view their own verification docs"
  on storage.objects for select
  to authenticated
  using ( bucket_id = 'verification-docs' and auth.uid()::text = (storage.foldername(name))[1] );

create policy "Users can update their own verification docs"
  on storage.objects for update
  to authenticated
  using ( bucket_id = 'verification-docs' and auth.uid()::text = (storage.foldername(name))[1] );
