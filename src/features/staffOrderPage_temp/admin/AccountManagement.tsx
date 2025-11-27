// React 相關
import { useMemo, useState } from 'react';

// 第三方庫
import { Button, Alert, CircularProgress, ButtonGroup } from '@mui/material';
import axios from 'axios';
import type { AnyObjectSchema } from 'yup';

// Hooks
import {
  useUsersQuery,
  useCreateStaffMutation,
  useUpdateStaffMutation,
  useDeleteStaffMutation,
  useUnlockStaffMutation,
  useChangeAdminPasswordMutation,
} from '../../../hooks/useUserOperations';

// Components
import ResultDialog, {
  ResultDialogProps,
} from '../../../components/ResultDialog';
import ConfirmDialog from '../../../components/ConfirmDialog';
import UserInfoEditDialog, {
  FieldConfig,
} from '../components/UserInfoEditDialog';

// Schemas
import {
  adminPasswordSchema,
  createStaffSchema,
  updateStaffSchema,
} from './accountSchema';

// Types
import { UserAccount } from '../../../types/userType';

// Icons
import { HiOutlinePlusSm, HiOutlineLockOpen } from 'react-icons/hi';
import { FaUserGear } from 'react-icons/fa6';
import { FaUserGroup } from 'react-icons/fa6';
import { FaRegTrashCan } from 'react-icons/fa6';
import { MdEdit } from 'react-icons/md';

// ===== Types =====
type DialogMode = 'admin-password' | 'create-staff' | 'update-staff';
type ResultDialogInfo = Omit<ResultDialogProps, 'onClose'>;

interface EditDialogConfig {
  title: string;
  description?: string;
  submitLabel: string;
  fields: FieldConfig[];
  defaultValues: Record<string, string>;
  validationSchema: AnyObjectSchema;
}

// ===== Utilities =====
const getErrorMessage = (error: unknown): string => {
  if (axios.isAxiosError(error)) {
    return error.response?.data?.message || '操作失敗,請稍後再試';
  }
  if (error instanceof Error) {
    return error.message;
  }
  return '操作失敗,請稍後再試';
};

// ===== Component =====
function AccountManagement() {
  // ===== API Queries & Mutations =====
  const {
    data: users,
    isPending: isUsersPending,
    error: usersError,
  } = useUsersQuery();

  const { mutateAsync: createStaff, isPending: isCreatingStaff } =
    useCreateStaffMutation();
  const { mutateAsync: updateStaff, isPending: isUpdatingStaff } =
    useUpdateStaffMutation();
  const { mutateAsync: deleteStaff, isPending: isDeletingStaff } =
    useDeleteStaffMutation();
  const { mutateAsync: unlockStaff, isPending: isUnlockingStaff } =
    useUnlockStaffMutation();
  const {
    mutateAsync: changeAdminPassword,
    isPending: isChangingAdminPassword,
  } = useChangeAdminPasswordMutation();

  // ===== State =====
  const [editDialogState, setEditDialogState] = useState<{
    isOpen: boolean;
    mode: DialogMode;
    targetUser: UserAccount | null;
  }>({
    isOpen: false,
    mode: 'create-staff',
    targetUser: null,
  });

  const [confirmState, setConfirmState] = useState<{
    isOpen: boolean;
    targetUser: UserAccount | null;
  }>({
    isOpen: false,
    targetUser: null,
  });

  const [resultInfo, setResultInfo] = useState<ResultDialogInfo>({
    isOpen: false,
    resultType: 'success',
    title: '',
    message: '',
    btnText: '關 閉',
  });

  // ===== Computed Values =====
  const adminUsers = useMemo(
    () => (users || []).filter((user: UserAccount) => user.role === 'admin'),
    [users],
  );

  const staffUsers = useMemo(
    () => (users || []).filter((user: UserAccount) => user.role === 'staff'),
    [users],
  );

  const lockedStaffCount = useMemo(
    () => staffUsers.filter((user: UserAccount) => user.isLocked).length,
    [staffUsers],
  );

  // ===== Dialog Configuration =====
  const editDialogConfig = useMemo<EditDialogConfig>(() => {
    switch (editDialogState.mode) {
      case 'admin-password':
        return {
          title: '修改管理員密碼',
          description: '請輸入舊密碼與新密碼。',
          submitLabel: '更新密碼',
          fields: [
            {
              name: 'currentPassword',
              label: '目前密碼',
              type: 'password' as const,
              autoComplete: 'current-password',
            },
            {
              name: 'newPassword',
              label: '新密碼',
              type: 'password' as const,
              autoComplete: 'new-password',
            },
            {
              name: 'confirmPassword',
              label: '確認新密碼',
              type: 'password' as const,
              autoComplete: 'new-password',
            },
          ],
          defaultValues: {
            currentPassword: '',
            newPassword: '',
            confirmPassword: '',
          } as Record<string, string>,
          validationSchema: adminPasswordSchema,
        };
      case 'update-staff':
        return {
          title: '修改員工帳號',
          description: '可調整帳號或重設密碼,若不更動請留空。',
          submitLabel: '儲存變更',
          fields: [
            {
              name: 'account',
              label: '員工帳號',
            },
            {
              name: 'password',
              label: '新密碼 (可留空)',
              type: 'password' as const,
              autoComplete: 'new-password',
              description: '若僅調整帳號,可將此欄位留空。',
            },
          ],
          defaultValues: {
            account: editDialogState.targetUser?.account || '',
            password: '',
          } as Record<string, string>,
          validationSchema: updateStaffSchema,
        };
      case 'create-staff':
      default:
        return {
          title: '新增員工帳號',
          description: '請輸入店員帳號與密碼,新增後可立即登入使用。',
          submitLabel: '建立帳號',
          fields: [
            {
              name: 'account',
              label: '員工帳號',
              placeholder: '例如:staff01',
            },
            {
              name: 'password',
              label: '登入密碼',
              type: 'password' as const,
              autoComplete: 'new-password',
            },
          ],
          defaultValues: {
            account: '',
            password: '',
          } as Record<string, string>,
          validationSchema: createStaffSchema,
        };
    }
  }, [editDialogState.mode, editDialogState.targetUser]);

  // ===== Event Handlers =====
  const openResultDialog = (info: Omit<ResultDialogInfo, 'isOpen'>) => {
    setResultInfo({ ...info, isOpen: true });
  };

  const handleResultDialogClose = () => {
    setResultInfo((prev) => ({ ...prev, isOpen: false }));
  };

  const handleOpenAdminPasswordDialog = () => {
    setEditDialogState({
      isOpen: true,
      mode: 'admin-password',
      targetUser: null,
    });
  };

  const handleOpenCreateStaffDialog = () => {
    setEditDialogState({
      isOpen: true,
      mode: 'create-staff',
      targetUser: null,
    });
  };

  const handleOpenUpdateStaffDialog = (user: UserAccount) => {
    setEditDialogState({
      isOpen: true,
      mode: 'update-staff',
      targetUser: user,
    });
  };

  const handleCloseEditDialog = () => {
    if (isChangingAdminPassword || isCreatingStaff || isUpdatingStaff) {
      return;
    }
    setEditDialogState((prev) => ({
      ...prev,
      isOpen: false,
      targetUser: null,
    }));
  };

  const handleEditDialogSubmit = async (values: Record<string, string>) => {
    try {
      // 管理員密碼修改
      if (editDialogState.mode === 'admin-password') {
        await changeAdminPassword({
          currentPassword: values.currentPassword.trim(),
          newPassword: values.newPassword.trim(),
        });
        setEditDialogState((prev) => ({ ...prev, isOpen: false }));
        openResultDialog({
          resultType: 'success',
          title: '密碼更新成功',
          message: '管理員密碼已更新,下次登入請使用新密碼。',
          btnText: '關 閉',
        });
        return;
      }

      // 新增員工帳號
      if (editDialogState.mode === 'create-staff') {
        const account = values.account.trim();
        const password = values.password.trim();
        await createStaff({ account, password });
        setEditDialogState((prev) => ({ ...prev, isOpen: false }));
        openResultDialog({
          resultType: 'success',
          title: '新增成功',
          message: `已新增 ${account},請提醒員工妥善保存密碼。`,
        });
        return;
      }

      // 更新員工帳號
      if (
        editDialogState.mode === 'update-staff' &&
        editDialogState.targetUser
      ) {
        const target = editDialogState.targetUser;
        const trimmedAccount = values.account.trim();
        const trimmedPassword = values.password?.trim();
        const updateInfo: { account?: string; password?: string } = {};

        if (trimmedAccount && trimmedAccount !== target.account) {
          updateInfo.account = trimmedAccount;
        }
        if (trimmedPassword) {
          updateInfo.password = trimmedPassword;
        }

        if (!updateInfo.account && !updateInfo.password) {
          openResultDialog({
            resultType: 'info',
            title: '尚未修改資料',
            message: '請修改帳號或輸入新密碼後再送出。',
          });
          return;
        }

        await updateStaff({ userId: target._id, updateInfo });
        setEditDialogState((prev) => ({
          ...prev,
          isOpen: false,
          targetUser: null,
        }));
        openResultDialog({
          resultType: 'success',
          title: '更新成功',
          message: `${target.account} 的帳號資料已更新。`,
        });
      }
    } catch (error) {
      openResultDialog({
        resultType: 'error',
        title: '操作失敗',
        message: getErrorMessage(error),
      });
    }
  };

  const handleOpenDeleteConfirm = (user: UserAccount) => {
    setConfirmState({ isOpen: true, targetUser: user });
  };

  const handleDeleteStaff = async () => {
    if (!confirmState.targetUser) return;
    const target = confirmState.targetUser;
    try {
      await deleteStaff(target._id);
      openResultDialog({
        resultType: 'success',
        title: '刪除成功',
        message: `${target.account} 已被刪除。`,
      });
    } catch (error) {
      openResultDialog({
        resultType: 'error',
        title: '刪除失敗',
        message: getErrorMessage(error),
      });
    } finally {
      setConfirmState({ isOpen: false, targetUser: null });
    }
  };

  const handleUnlockStaff = async (user: UserAccount) => {
    try {
      await unlockStaff(user._id);
      openResultDialog({
        resultType: 'success',
        title: '帳號已解鎖',
        message: `${user.account} 現在可以重新嘗試登入。`,
      });
    } catch (error) {
      openResultDialog({
        resultType: 'error',
        title: '解鎖失敗',
        message: getErrorMessage(error),
      });
    }
  };

  // ===== Render Helper =====
  const dialogSubmitting =
    editDialogState.mode === 'admin-password'
      ? isChangingAdminPassword
      : editDialogState.mode === 'create-staff'
        ? isCreatingStaff
        : isUpdatingStaff;

  // ===== Render =====
  return (
    <div className="space-y-4 2xl:space-y-6">
      {/* Page Header */}
      <div className="flex flex-col space-y-2 2xl:space-y-2">
        <h1 className="text-xl font-bold text-gray-900 2xl:text-3xl">
          帳號管理
        </h1>
      </div>

      {/* Error Alert */}
      {usersError && (
        <Alert severity="error" variant="outlined">
          無法取得帳號資料:{usersError.message}
        </Alert>
      )}

      {/* Statistics Cards */}
      <div className="rounded-xl bg-white p-4 shadow-custom 2xl:p-6">
        <div className="grid max-w-[1200px] gap-4 sm:grid-cols-3">
          <div className="rounded-xl border border-grey-light bg-grey-light/60 p-4">
            <p className="text-sm text-grey">帳號總數</p>
            <p className="text-2xl font-semibold text-grey-dark">
              {users?.length || 0}
            </p>
          </div>
          <div className="rounded-xl border border-grey-light bg-grey-light/60 p-4">
            <p className="text-sm text-grey">店員人數</p>
            <p className="text-2xl font-semibold text-grey-dark">
              {staffUsers.length}
            </p>
          </div>
          <div className="rounded-xl border border-grey-light bg-grey-light/60 p-4">
            <p className="text-sm text-grey">鎖定帳號</p>
            <p className="text-2xl font-semibold text-error">
              {lockedStaffCount}
            </p>
          </div>
        </div>
      </div>

      {/* Admin Accounts Section */}
      <div className="rounded-xl bg-white p-4 shadow-custom 2xl:p-6">
        <div className="max-w-[1200px]">
          <h2 className="flex items-center gap-2 text-lg font-semibold text-primary">
            <FaUserGear />
            Admin
          </h2>
          <ul className="mt-4 space-y-3">
            {adminUsers.map((admin: UserAccount) => (
              <li
                key={admin._id}
                className="flex flex-col rounded-xl border border-grey-light p-4 lg:flex-row lg:items-center lg:justify-between"
              >
                <div>
                  <p className="text-base font-semibold text-grey-dark">
                    {admin.account}
                  </p>
                </div>
                <Button
                  variant="outlined"
                  color="secondary"
                  onClick={handleOpenAdminPasswordDialog}
                  sx={{ borderRadius: 2 }}
                  disabled={isChangingAdminPassword}
                >
                  修改管理員密碼
                </Button>
              </li>
            ))}
            {adminUsers.length === 0 && (
              <li className="rounded-xl border border-dashed border-grey-light px-4 py-6 text-center text-sm text-grey">
                尚未設定管理員帳號
              </li>
            )}
          </ul>
        </div>
      </div>

      {/* Staff Accounts Section */}
      <div className="rounded-xl bg-white p-4 shadow-custom 2xl:p-6">
        <div className="max-w-[1200px]">
          <div className="flex justify-between pr-4">
            <h2 className="flex items-center gap-2 text-lg font-semibold text-grey">
              <FaUserGroup />
              Staff
            </h2>
            <Button
              variant="outlined"
              color="secondary"
              startIcon={<HiOutlinePlusSm />}
              onClick={handleOpenCreateStaffDialog}
              sx={{ borderRadius: 2 }}
              disabled={isCreatingStaff}
            >
              新增員工帳號
            </Button>
          </div>
          {isUsersPending ? (
            <div className="flex justify-center py-12">
              <CircularProgress size="32px" />
            </div>
          ) : staffUsers.length === 0 ? (
            <div className="py-12 text-center text-sm text-grey">
              目前尚無店員帳號,請點擊右上角按鈕新增。
            </div>
          ) : (
            <ul className="mt-4 space-y-3">
              {staffUsers.map((user: UserAccount) => {
                const isLocked = user.isLocked;
                return (
                  <li
                    key={user._id}
                    className={`flex flex-col gap-4 rounded-xl border border-grey-light p-4 lg:flex-row lg:items-center lg:justify-between ${isLocked ? 'border-error-light' : ''}`}
                  >
                    <div>
                      <p className="text-base font-semibold text-grey-dark">
                        {user.account}
                      </p>
                      <div className="mt-1 flex flex-wrap items-center gap-3 text-sm text-grey">
                        <span>登入失敗：{user.loginFailCount} 次</span>
                        <span>狀態：{user.isLocked ? '已鎖定' : '正常'}</span>
                      </div>
                    </div>
                    <div className="flex flex-wrap items-center gap-5">
                      {user.isLocked && (
                        <Button
                          variant="outlined"
                          color="primary"
                          startIcon={<HiOutlineLockOpen />}
                          onClick={() => handleUnlockStaff(user)}
                          sx={{ borderRadius: 2 }}
                          disabled={isUnlockingStaff}
                        >
                          解鎖
                        </Button>
                      )}

                      {/* 編輯/刪除按鈕 */}
                      <ButtonGroup variant="outlined" color="info">
                        <Button
                          sx={{ paddingX: 2, paddingY: 1 }}
                          onClick={() => handleOpenUpdateStaffDialog(user)}
                          disabled={isUpdatingStaff}
                        >
                          <MdEdit className="text-lg" />
                        </Button>
                        <Button
                          sx={{ paddingX: 2, paddingY: 1 }}
                          onClick={() => handleOpenDeleteConfirm(user)}
                          disabled={isDeletingStaff}
                        >
                          <FaRegTrashCan className="text-lg" />
                        </Button>
                      </ButtonGroup>
                    </div>
                  </li>
                );
              })}
            </ul>
          )}
        </div>
      </div>

      {/* Edit Dialog */}
      <UserInfoEditDialog
        open={editDialogState.isOpen}
        title={editDialogConfig.title}
        description={editDialogConfig.description}
        submitLabel={editDialogConfig.submitLabel}
        fields={editDialogConfig.fields}
        defaultValues={editDialogConfig.defaultValues}
        validationSchema={editDialogConfig.validationSchema}
        isSubmitting={dialogSubmitting}
        onClose={handleCloseEditDialog}
        onSubmit={handleEditDialogSubmit}
      />

      {/* Delete Confirmation Dialog */}
      <ConfirmDialog
        isOpen={confirmState.isOpen}
        resultType="error"
        title="刪除員工帳號"
        message={`確定要刪除 ${confirmState.targetUser?.account || ''} 嗎?此動作無法復原。`}
        btnText="確定刪除"
        onClose={() =>
          setConfirmState((prev) => ({
            ...prev,
            isOpen: false,
          }))
        }
        onConfirm={handleDeleteStaff}
        isPending={isDeletingStaff}
      />

      {/* Result Dialog */}
      <ResultDialog
        isOpen={resultInfo.isOpen}
        resultType={resultInfo.resultType}
        title={resultInfo.title}
        message={resultInfo.message}
        btnText={resultInfo.btnText}
        onClose={handleResultDialogClose}
      />
    </div>
  );
}

export default AccountManagement;
