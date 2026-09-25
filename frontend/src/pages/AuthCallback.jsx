import { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { supabase } from '../lib/supabase';

export default function AuthCallback() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [message, setMessage] = useState('Confirming your account…');

  useEffect(() => {
    let active = true;

    const completeAuth = async () => {
      const code = searchParams.get('code');
      const errorDescription = searchParams.get('error_description');

      if (errorDescription) {
        if (active) setMessage(errorDescription);
        return;
      }

      if (code) {
        const { error } = await supabase.auth.exchangeCodeForSession(code);
        if (error) {
          if (active) setMessage('This confirmation link is invalid or has expired.');
          return;
        }
      }

      if (active) navigate('/dashboard', { replace: true });
    };

    completeAuth();
    return () => { active = false; };
  }, [navigate, searchParams]);

  return (
    <section className="min-h-[60vh] flex items-center justify-center px-6">
      <div className="crystal-card max-w-md w-full p-8 text-center">
        <h1 className="text-2xl font-bold text-text mb-3">Account confirmation</h1>
        <p className="text-text-muted">{message}</p>
      </div>
    </section>
  );
}
