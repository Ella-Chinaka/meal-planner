import {
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  orderBy,
  query,
  setDoc,
  updateDoc,
  addDoc,
} from "firebase/firestore";
import { db } from "../firebase";

// Data layout (all private to the signed-in user, see firestore.rules):
//   users/{uid}                  profile, favourites[]
//   users/{uid}/plans/{planId}   saved meal plans
//   users/{uid}/weights/{date}   one weight entry per day
//   users/{uid}/mealLogs/{date}  meals ticked off as eaten that day

const userDoc = (uid) => doc(db, "users", uid);
const userCollection = (uid, name) => collection(db, "users", uid, name);

// ---- Profile ----
export async function getProfile(uid) {
  const snap = await getDoc(userDoc(uid));
  return snap.exists() ? snap.data() : null;
}

export function saveProfile(uid, data) {
  return setDoc(userDoc(uid), { ...data, updatedAt: Date.now() }, { merge: true });
}

// ---- Plans ----
export async function savePlan(uid, plan) {
  const ref = await addDoc(userCollection(uid, "plans"), { ...plan, createdAt: Date.now() });
  return ref.id;
}

export function updatePlan(uid, planId, changes) {
  return updateDoc(doc(db, "users", uid, "plans", planId), changes);
}

export function deletePlan(uid, planId) {
  return deleteDoc(doc(db, "users", uid, "plans", planId));
}

export async function getPlan(uid, planId) {
  const snap = await getDoc(doc(db, "users", uid, "plans", planId));
  return snap.exists() ? { id: snap.id, ...snap.data() } : null;
}

export async function listPlans(uid) {
  const snap = await getDocs(query(userCollection(uid, "plans"), orderBy("createdAt", "desc")));
  return snap.docs.map((d) => ({ id: d.id, ...d.data() }));
}

// ---- Weight log ----
export function logWeight(uid, date, weight) {
  return setDoc(doc(db, "users", uid, "weights", date), { date, weight, createdAt: Date.now() });
}

export function deleteWeight(uid, date) {
  return deleteDoc(doc(db, "users", uid, "weights", date));
}

export async function listWeights(uid) {
  const snap = await getDocs(query(userCollection(uid, "weights"), orderBy("date")));
  return snap.docs.map((d) => d.data());
}

// ---- Meal log (eaten meals, used for streaks) ----
export async function getMealLog(uid, date) {
  const snap = await getDoc(doc(db, "users", uid, "mealLogs", date));
  return snap.exists() ? snap.data() : { date, eaten: [] };
}

export function setMealLog(uid, date, eaten) {
  return setDoc(doc(db, "users", uid, "mealLogs", date), { date, eaten });
}

// Dates (YYYY-MM-DD) with at least one meal ticked off.
export async function listLoggedDates(uid) {
  const snap = await getDocs(userCollection(uid, "mealLogs"));
  return snap.docs.map((d) => d.data()).filter((l) => l.eaten?.length).map((l) => l.date);
}
