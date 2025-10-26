export {};

declare global {
  interface Window {
    google?: {
      accounts?: {
        id?: {
          initialize: (config: {
            client_id: string;
            callback: (response: any) => void;
            auto_select?: boolean;
            cancel_on_tap_outside?: boolean;
            context?: 'signin' | 'signup' | 'use';
            itp_support?: boolean;
            login_uri?: string;
            native_callback?: (response: any) => void;
            nonce?: string;
            state_cookie_domain?: string;
            ux_mode?: 'popup' | 'redirect';
            allowed_parent_origin?: string | string[];
          }) => void;
          renderButton: (element: HTMLElement, options: {
            type?: 'standard' | 'icon';
            theme?: 'outline' | 'filled_blue' | 'filled_black';
            size?: 'large' | 'medium' | 'small';
            text?: 'signin_with' | 'signup_with' | 'continue_with' | 'signin';
            shape?: 'rectangular' | 'pill' | 'circle' | 'square';
            logo_alignment?: 'left' | 'center';
            width?: string | number;
            locale?: string;
          }) => void;
          prompt: () => void;
        };
      };
    };
    handleCredentialResponse?: (response: any) => void;
  }
}
