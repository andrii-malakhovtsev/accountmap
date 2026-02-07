export const transformUsersToEntities = (users) => {
  return users.map((user) => ({
    id: user.id,
    value: user.value,
    type: user.type,
    notes: user.notes || "",
    accounts: (user.connections || []).map((conn, index) => ({
      id: conn.id,
      name: conn.name,
      username: conn.username,
      notes: conn.notes,
    })),
  }));
};
