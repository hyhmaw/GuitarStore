
export type SavedCard = {
  id: string;
  holder: string;
  last4: string;
  expiry: string;
  brand: string;
};

export type User = {
  id: string;
  name: string;
  email: string;
  phone?: string;
  avatar?: string;
  cards?: SavedCard[];
};

const AUTH_KEY = "yoju_user";
const USERS_KEY = "yoju_users";

export function getCurrentUser(): User | null {
  const user = localStorage.getItem(AUTH_KEY);

  if (!user) return null;

  try {
    return JSON.parse(user) as User;
  } catch {
    localStorage.removeItem(AUTH_KEY);
    return null;
  }
}

export function isAuthenticated(): boolean {
  return getCurrentUser() !== null;
}

export function registerUser(user: User, password: string): boolean {
  const users: Array<User & { password: string }> = JSON.parse(
    localStorage.getItem(USERS_KEY) || "[]",
  );

  const exists = users.some(
    (existing) => existing.email.toLowerCase() === user.email.toLowerCase(),
  );

  if (exists) return false;

  const newUser = { ...user, cards: [] };

  users.push({ ...newUser, password });

  localStorage.setItem(USERS_KEY, JSON.stringify(users));
  localStorage.setItem(AUTH_KEY, JSON.stringify(newUser));

  return true;
}

export function loginUser(email: string, password: string): boolean {
  const users: Array<User & { password: string }> = JSON.parse(
    localStorage.getItem(USERS_KEY) || "[]",
  );

  const user = users.find(
    (existing) =>
      existing.email.toLowerCase() === email.toLowerCase() &&
      existing.password === password,
  );

  if (!user) return false;

  const { password: _, ...userData } = user;

  localStorage.setItem(AUTH_KEY, JSON.stringify(userData));

  return true;
}

export function updateCurrentUser(updatedData: Partial<User>): User | null {
  const currentUser = getCurrentUser();

  if (!currentUser) return null;

  const updatedUser: User = {
    ...currentUser,
    ...updatedData,
    id: currentUser.id,
    email: currentUser.email,
  };

  const users: Array<User & { password: string }> = JSON.parse(
    localStorage.getItem(USERS_KEY) || "[]",
  );

  const updatedUsers = users.map((user) =>
    user.id === currentUser.id
      ? {
          ...user,
          ...updatedData,
          id: currentUser.id,
          email: currentUser.email,
        }
      : user,
  );

  localStorage.setItem(USERS_KEY, JSON.stringify(updatedUsers));
  localStorage.setItem(AUTH_KEY, JSON.stringify(updatedUser));

  return updatedUser;
}

export function addPaymentCard(
  card: Omit<SavedCard, "id">,
): User | null {
  const currentUser = getCurrentUser();

  if (!currentUser) return null;

  const newCard: SavedCard = {
    ...card,
    id: crypto.randomUUID(),
  };

  return updateCurrentUser({
    cards: [...(currentUser.cards || []), newCard],
  });
}

export function removePaymentCard(cardId: string): User | null {
  const currentUser = getCurrentUser();

  if (!currentUser) return null;

  return updateCurrentUser({
    cards: (currentUser.cards || []).filter(
      (card) => card.id !== cardId,
    ),
  });
}

export function logoutUser(): void {
  localStorage.removeItem(AUTH_KEY);
}
