import { useEffect } from 'react';
import useAuthStore from '../stores/useAuthStore';

export default function useClearErrorMessage() {
  const { setErrorMessage } = useAuthStore();
  useEffect(() => {
    setErrorMessage('');
  }, [setErrorMessage]);
}
