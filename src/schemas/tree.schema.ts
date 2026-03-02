import * as yup from 'yup';

export const createTreeSchema = yup.object({
  title: yup
    .string()
    .required('Title is required')
    .max(255, 'Title must be at most 255 characters'),
  description: yup
    .string()
    .max(1000, 'Description must be at most 1000 characters')
    .optional(),
  labels: yup
    .object()
    .test('max-labels', 'Maximum 5 labels allowed', (value) => {
      return !value || Object.keys(value).length <= 5;
    })
    .test('label-length', 'Label keys and values must be at most 15 characters', (value) => {
      if (!value) return true;
      return Object.entries(value).every(
        ([key, val]) => key.length <= 15 && String(val).length <= 15
      );
    })
    .optional(),
});

export const updateTreeSchema = yup.object({
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
  labels: yup
    .object()
    .test('max-labels', 'Maximum 5 labels allowed', (value) => {
      return !value || Object.keys(value).length <= 5;
    })
    .test('label-length', 'Label keys and values must be at most 15 characters', (value) => {
      if (!value) return true;
      return Object.entries(value).every(
        ([key, val]) => key.length <= 15 && String(val).length <= 15
      );
    })
    .optional(),
});
