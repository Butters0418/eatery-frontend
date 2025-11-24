// React 相關
import { useEffect } from 'react';

// 第三方庫
import {
  Dialog,
  Button,
  TextField,
  CircularProgress,
  Box,
} from '@mui/material';
import { Controller, useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { AnyObjectSchema } from 'yup';

// Icons
import { RxCross2 } from 'react-icons/rx';

// ===== Types =====
export interface FieldConfig {
  name: string;
  label: string;
  type?: 'text' | 'password';
  placeholder?: string;
  autoComplete?: string;
  description?: string;
}

interface UserInfoEditDialogProps {
  open: boolean;
  title: string;
  description?: string;
  submitLabel: string;
  fields: FieldConfig[];
  defaultValues: Record<string, string>;
  validationSchema: AnyObjectSchema;
  isSubmitting: boolean;
  onClose: () => void;
  onSubmit: (values: Record<string, string>) => void;
}

// ===== Component =====
function UserInfoEditDialog({
  open,
  title,
  description,
  submitLabel,
  fields,
  defaultValues,
  validationSchema,
  isSubmitting,
  onClose,
  onSubmit,
}: UserInfoEditDialogProps) {
  // ===== Form Handling =====
  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<Record<string, string>>({
    defaultValues,
    resolver: yupResolver(validationSchema),
  });

  // ===== Effects =====
  useEffect(() => {
    reset(defaultValues);
  }, [defaultValues, reset, open]);

  // ===== Event Handlers =====
  const handleDialogClose = () => {
    if (isSubmitting) {
      return;
    }
    onClose();
  };

  const handleFormSubmit = (values: Record<string, string>) => {
    onSubmit(values);
  };

  // ===== Render =====
  return (
    <Dialog open={open} onClose={handleDialogClose} maxWidth="xs" fullWidth>
      <form onSubmit={handleSubmit(handleFormSubmit)} noValidate>
        <div className="relative space-y-5 p-6">
          {/* Close Button */}
          <button
            type="button"
            onClick={handleDialogClose}
            className="absolute right-4 top-4 rounded-full bg-grey-light p-2 text-grey-dark transition hover:bg-grey-light/70"
            disabled={isSubmitting}
          >
            <RxCross2 className="text-lg" />
          </button>

          {/* Dialog Header */}
          <div className="space-y-1 pr-8">
            <h3 className="text-xl font-semibold text-grey-dark">{title}</h3>
            {description && <p className="text-sm text-grey">{description}</p>}
          </div>

          {/* Form Fields */}
          <div className="space-y-4">
            {fields.map((field) => (
              <Controller
                key={field.name}
                name={field.name}
                control={control}
                render={({ field: controllerField }) => (
                  <TextField
                    {...controllerField}
                    label={field.label}
                    type={field.type || 'text'}
                    placeholder={field.placeholder}
                    autoComplete={field.autoComplete}
                    fullWidth
                    size="small"
                    color="primary"
                    error={!!errors[field.name]}
                    helperText={
                      errors[field.name]?.message?.toString() ||
                      field.description ||
                      ' '
                    }
                    disabled={isSubmitting}
                  />
                )}
              />
            ))}
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3 pt-2">
            <Button
              type="button"
              onClick={handleDialogClose}
              fullWidth
              sx={{
                px: 3,
                py: 1.5,
                fontSize: '1rem',
                fontWeight: 600,
                color: 'grey.600',
                bgcolor: 'grey.100',
                borderRadius: 2,
              }}
              disabled={isSubmitting}
            >
              取 消
            </Button>
            <Button
              type="submit"
              variant="contained"
              color="primary"
              fullWidth
              sx={{ borderRadius: 2 }}
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <Box sx={{ display: 'flex', justifyContent: 'center' }}>
                  <CircularProgress size="24px" color="inherit" />
                </Box>
              ) : (
                <span className="text-lg">{submitLabel}</span>
              )}
            </Button>
          </div>
        </div>
      </form>
    </Dialog>
  );
}

export default UserInfoEditDialog;
