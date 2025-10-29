import { useAuth } from '@/context/AuthContext';
import { Button, Tooltip } from '@heroui/react';
import { BsTrash3 } from 'react-icons/bs';
import { RxUpdate } from 'react-icons/rx';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { LuLogOut } from 'react-icons/lu';
import { cn } from '@/lib/utils';

export default function AccountSwitcher() {
  const { accounts, activeAccount, switchAccount, logout } = useAuth();
  const navigate = useNavigate();
  const { t } = useTranslation();

  const handleSwitchAccount = (userId: number) => {
    switchAccount(userId);
    navigate("/system/dashboard");
  };

  const handleLogout = (userId: number) => {
    logout(userId);
  };

  const active = (userId: number, operator: string = "===") => {
    return eval(activeAccount?.user.user_id + operator + userId);
  };

  return (
    <div className='mt-2 mb-0.5'>
      <ul className='space-y-1'>
        {accounts.map(acc => (
          <li 
            key={acc.user.user_id} 
            className={cn(
              'flex justify-between items-center gap-4 px-2.5 py-0.5 rounded-lg hover:bg-zinc-200 dark:hover:bg-zinc-700 transition-colors cursor-pointer text-zinc-500 dark:text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-300', active(acc.user.user_id, "===") && "bg-zinc-100 dark:bg-zinc-700",
              active(acc.user.user_id, "===") && "bg-zinc-200 dark:bg-zinc-700"
            )}
          >
              <div className='flex items-center gap-2'>
                {active(acc.user.user_id, "===") && (
                  <span className='w-2 h-2 rounded-full bg-success flex items-center justify-center'/>
                )}
                <span className='text-sm '>{acc.user.username}</span>
              </div>
              <div className='flex'>
                {active(acc.user.user_id, "!==") && (
                  <Tooltip showArrow content="Switch Account" placement="right" color="primary" size='sm' closeDelay={0}>
                    <Button
                      variant="light"
                      radius="full"
                      size='sm'
                      color="primary"
                      isIconOnly
                      startContent={<RxUpdate />}
                      onPress={() => handleSwitchAccount(acc.user.user_id)}
                    />
                  </Tooltip>
                )}
                <Tooltip showArrow content={t(active(acc.user.user_id, "===") ? "remove" : "logout")} placement="right" color="danger" size='sm' closeDelay={0}>
                  <Button
                    variant="light"
                    radius="full"
                    size='sm'
                    color="danger"
                    isIconOnly
                    startContent={active(acc.user.user_id, "===") ? <BsTrash3 /> : <LuLogOut />  }
                    onPress={() => handleLogout(acc.user.user_id)}
                  />
                </Tooltip>
              </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
