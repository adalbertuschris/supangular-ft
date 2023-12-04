import { Injectable } from '@angular/core';
import { SupabaseClient } from '@supabase/supabase-js';
import { Observable } from 'rxjs';
import { ProfileUpsertRequest } from './models/profile-upsert-request';
import { ProfileResponse } from './models/profile-response';
import {
  SupabaseResponse,
  fromSupabase,
  mapSupabaseResponseToApiResult,
  supabasePayload,
  supabaseFragment
} from '../core/providers/remote/supabase';
import { ApiResult } from '../core/models/api-result';

type ProfileSupabaseResponse = {
  id: string;
  first_name: string;
  last_name: string;
};

type ProfileUpsertSupabasePayload = Omit<ProfileSupabaseResponse, 'id'> & {
  updated_at: string;
};

export const getProfileApi$ = supabaseFragment<string, Promise<ApiResult<ProfileResponse>>>(
  async ({ _client, _input: userId }) => {
    const response = await _client.from('profiles').select(`*`).eq('id', userId).single<ProfileSupabaseResponse>();

    return mapSupabaseResponseToApiResult(response);
  }
);

export const updateProfileApi$ = supabaseFragment<
  { id: string; model: ProfileUpsertRequest },
  Promise<ApiResult<ProfileResponse>>
>(async ({ _client, _input: { id, model } }) => {
  const payload: ProfileUpsertSupabasePayload = supabasePayload({
    ...model,
    updatedAt: new Date().toISOString()
  });

  const response = await _client
    .from('profiles')
    .update(payload)
    .eq('id', id)
    .select()
    .single<ProfileSupabaseResponse>();

  return mapSupabaseResponseToApiResult(response);
});

@Injectable({
  providedIn: 'root'
})
export class ProfileDataService {
  constructor(private readonly supabaseClient: SupabaseClient) {}

  getProfile(userId: string): Observable<ProfileResponse> {
    return fromSupabase<SupabaseResponse<ProfileSupabaseResponse>, ProfileResponse>(
      this.supabaseClient.from('profiles').select(`*`).eq('id', userId).single()
    );
  }

  updateProfile(id: string, model: ProfileUpsertRequest): Observable<ProfileResponse> {
    const payload: ProfileUpsertSupabasePayload = supabasePayload({
      ...model,
      updatedAt: new Date().toISOString()
    });

    return fromSupabase<SupabaseResponse<ProfileSupabaseResponse>, ProfileResponse>(
      this.supabaseClient.from('profiles').update(payload).eq('id', id).select().single()
    );
  }
}
