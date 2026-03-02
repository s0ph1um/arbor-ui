import * as yup from 'yup';
import { NodeType } from "../types/tree.types";

export const createNodeSchema = yup.object({
  parentId: yup
    .number()
    .nullable()
    .optional(),

  title: yup
    .string()
    .required('Title is required')
    .min(1, 'Title cannot be empty')
    .max(255, 'Title must be at most 255 characters'),

  description: yup
    .string()
    .max(1000, 'Description must be at most 1000 characters')
    .optional()
    .nullable(),

  nodeType: yup
    .mixed<NodeType>()
    .oneOf(Object.values(NodeType), 'Invalid node type')
    .default(NodeType.DEFAULT),

  flagValue: yup
    .boolean()
    .optional()
    .nullable()
    .when('nodeType', {
      is: NodeType.FLAG,
      then: (schema) => schema.required('Flag value is required for flag nodes'),
      otherwise: (schema) => schema.nullable(),
    }),

  linkValue: yup
    .string()
    .optional()
    .nullable()
    .when('nodeType', {
      is: NodeType.LINK,
      then: (schema) => schema
        .required('Link is required for link nodes')
        .url('Must be a valid URL'),
      otherwise: (schema) => schema.nullable(),
    }),
});

export const updateNodeSchema = yup.object({
  title: yup
    .string()
    .min(1, 'Title cannot be empty')
    .max(255, 'Title must be at most 255 characters')
    .optional(),

  description: yup
    .string()
    .max(1000, 'Description must be at most 1000 characters')
    .optional()
    .nullable(),

  nodeType: yup
    .mixed<NodeType>()
    .oneOf(Object.values(NodeType), 'Invalid node type')
    .optional(),

  flagValue: yup
    .boolean()
    .optional()
    .nullable(),

  linkValue: yup
    .string()
    .url('Must be a valid URL')
    .optional()
    .nullable(),
});
