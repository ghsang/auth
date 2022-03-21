import Script from 'next/script';
import React from 'react';
import styles from './Login.module.css'

type Props = {
};

export default function LogIn({}: Props) {
  return (
    <>
      <Script src="https://accounts.google.com/gsi/client" />
      <div id="g_id_onload"
         data-client_id={process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID}
         data-login_uri="http://localhost:3000/api/auth/google"
         data-auto_prompt="false">
      </div>
      <div className={styles.googleLogin}>
        <div className="g_id_signin"
           data-type="standard"
           data-size="large"
           data-theme="outline"
           data-text="sign_in_with"
           data-shape="rectangular"
           data-logo_alignment="left">
        </div>
      </div>
    </>
  )
};
