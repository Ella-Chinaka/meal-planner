import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { updatePlan } from "../services/db";
import { swapMeal } from "../utils/planner";

// Swap meals and tick shopping items on a plan. Changes are written to Firestore
// when the plan has been saved (planId set); otherwise they stay local.
export function usePlanActions(plan, setPlan, planId) {
  const { user, profile } = useAuth();
  const [error, setError] = useState("");
  const [swapping, setSwapping] = useState(false);

  const persist = async (changes) => {
    if (!planId) return;
    try {
      await updatePlan(user.uid, planId, changes);
    } catch (err) {
      setError("Couldn't save your change. " + err.message);
    }
  };

  const swap = async (dayIndex, slot) => {
    setError("");
    try {
      const next = swapMeal(plan, dayIndex, slot, profile);
      setPlan(next);
      setSwapping(true);
      await persist({ days: next.days });
    } catch (err) {
      setError(err.message);
    }
    setSwapping(false);
  };

  const toggleItem = async (item) => {
    const checked = plan.checked || [];
    const next = checked.includes(item) ? checked.filter((i) => i !== item) : [...checked, item];
    setPlan({ ...plan, checked: next });
    await persist({ checked: next });
  };

  return { swap, toggleItem, swapping, error };
}
