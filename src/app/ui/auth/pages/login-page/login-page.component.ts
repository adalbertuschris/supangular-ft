import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, Validators } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import {
  ExecutionContext,
  FragmentResultType,
  FragmentType,
  build,
  contextBuilder,
  formFragment,
  fragment,
  fragments,
  methods
} from '@web-fragments/ng-fragments';
import { AuthContext } from '@auth';
import { ButtonComponent } from '@ui/shared';

export type LoginInternalContext = {
  form$: FragmentType<typeof form$>;
} & ExecutionContext;

const form$ = formFragment(({ _formBuilder }) =>
  _formBuilder.group({
    email: ['', [Validators.required, Validators.email]]
  })
);

const login$ = fragment(async ({ _exec, _inject, form$ }: LoginInternalContext) => {
  const form = _exec(form$);
  const email = form.value.email as string;
  const authContext = _inject(AuthContext);
  await authContext.signIn(email);

  if (authContext.getStore().state().loginLinkSent) {
    alert('Check your email for the login link!');
    form.reset();
  }
});

class LoginContext extends build(
  contextBuilder(),
  fragments({
    form$
  }),
  methods(({ _exec, form$ }) => ({
    getForm: (): FragmentResultType<typeof form$> => _exec(form$),
    login: (): Promise<void> => _exec(login$)
  }))
) {}

@Component({
  selector: 'vt-login-page',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, TranslateModule, ButtonComponent],
  providers: [LoginContext],
  templateUrl: './login-page.component.html',
  styleUrls: ['./login-page.component.scss']
})
export class LoginPageComponent {
  authContext = inject(AuthContext);
  loginContext = inject(LoginContext);
  isLoading = this.authContext.getStore().isSigningIn;
  signInForm = this.loginContext.getForm();

  onSubmit(): void {
    this.loginContext.login();
  }
}
