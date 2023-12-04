import { SupabaseClient } from '@supabase/supabase-js';
import {
  props,
  FragmentFactory,
  FragmentFn,
  FragmentFunctionContext,
  FragmentOptions,
  FragmentTemplate,
  build,
  fragmentTemplateBuilder,
  fragmentFactory
} from '@web-fragments/ng-fragments';

export interface SupabaseContext<TFragmentIn> extends FragmentFunctionContext<TFragmentIn> {
  _client: SupabaseClient;
}

const templateId = Symbol('supabase');

function supabaseFragmentTemplate<TFragmentIn, TFragmentOut>(): FragmentTemplate<TFragmentIn, TFragmentOut> {
  return build(
    fragmentTemplateBuilder<TFragmentIn, TFragmentOut>({
      static: 'context',
      templateId,
      name: 'supabase'
    }),
    props(({ _inject }) => ({
      _client: _inject(SupabaseClient)
    }))
  );
}

export function supabaseFragment<TFragmentIn, TFragmentOut>(
  fragmentFn: FragmentFn<TFragmentIn, TFragmentOut, SupabaseContext<TFragmentIn>>,
  options?: FragmentOptions
): FragmentFactory<TFragmentIn, TFragmentOut> {
  return fragmentFactory(supabaseFragmentTemplate<TFragmentIn, TFragmentOut>(), fragmentFn, options);
}
