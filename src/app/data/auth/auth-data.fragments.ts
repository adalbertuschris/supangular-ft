import { AuthSession } from '@supabase/supabase-js';
import { ApiError, ApiResult } from '@web-fragments/ng-fragments';
import { UserContextResponse } from './models/user-context-response';
import { SignInResponse } from './models/sign-in-response';
import { mapSupabaseResponseToApiResult, supabaseFragment } from '../core/providers/remote/supabase';

type UserContextSupabaseResponse = {
  id: string;
  first_name: string;
  last_name: string;
};

export const getSessionApi$ = supabaseFragment<unknown, Promise<ApiResult<{ session: AuthSession }>>>(({ _client }) =>
  _client.auth.getSession()
);

// TODO Change emailRedirectTo
export const signInViaLoginLinkApi$ = supabaseFragment<string, Promise<ApiResult<SignInResponse>>>(
  ({ _client, _input: email }) =>
    _client.auth.signInWithOtp({
      email,
      options: {
        emailRedirectTo: 'http://localhost:4200/'
      }
    })
);

export const signOutApi$ = supabaseFragment<unknown, Promise<{ error: ApiError }>>(({ _client }) =>
  _client.auth.signOut()
);

export const getUserContextApi$ = supabaseFragment<string, Promise<ApiResult<UserContextResponse>>>(
  async ({ _client, _input: userId }) => {
    const response = await _client
      .from('profiles')
      .select('id,last_name,first_name')
      .eq('id', userId)
      .single<UserContextSupabaseResponse>();

    return mapSupabaseResponseToApiResult(response);
  }
);
