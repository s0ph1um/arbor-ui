import type { Tree } from "../types/tree.types.ts";

export const canEditTreeStructure = (userId?: number, tree?: Tree): boolean => {
  if (!userId || !tree) return false;
  return tree.ownerId === userId || (tree.editorIds ?? []).includes(userId);
};

export const canManageTree = (userId?: number, tree?: Tree): boolean => {
  if (!userId || !tree) return false;
  return tree.ownerId === userId;
};
