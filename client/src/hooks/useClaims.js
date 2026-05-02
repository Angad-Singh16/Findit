import { useState, useCallback } from 'react';
import { getMyClaimsApi, withdrawClaimApi } from '../api/claim.api.js';
import toast from 'react-hot-toast';

export const useClaims = () => {
  const [claims,  setClaims]  = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchClaims = useCallback(async () => {
    setLoading(true);
    try {
      const data = await getMyClaimsApi();
      setClaims(data.claims || []);
    } catch {
      toast.error('Failed to load claims.');
    } finally {
      setLoading(false);
    }
  }, []);

  const withdraw = useCallback(async (id) => {
    await withdrawClaimApi(id);
    setClaims((p) => p.filter((c) => c._id !== id));
  }, []);

  return { claims, loading, fetchClaims, withdraw };
};

export default useClaims;